import httpx
from telegram import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    ReplyKeyboardRemove,
    Update,
)
from telegram.ext import (
    ContextTypes,
    ConversationHandler,
    CommandHandler,
    CallbackQueryHandler,
)

from constants import BACKEND_SERVICE_API_URL
from logging_helper import logger
from utils.subscriberHelper import is_subscriber_approved


DECK_TEMPLATE_INPUT = 1


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = str(update.effective_user.id)

    keyboard = []

    GET_SUBSCRIBER_URL = f"{BACKEND_SERVICE_API_URL}/api/v1/subscribers/{user_id}"
    GET_DECK_TEMPLATES_URL = f"{BACKEND_SERVICE_API_URL}/api/v1/deck-templates"
    GET_DECKS_URL = f"{BACKEND_SERVICE_API_URL}/api/v1/subscribers/{user_id}/decks"

    async with httpx.AsyncClient() as client:
        try:
            get_subscriber_response = await client.get(GET_SUBSCRIBER_URL)
            get_subscriber_response.raise_for_status()
            get_subscriber_response_json: dict = get_subscriber_response.json()
            subscriber: dict = get_subscriber_response_json.get("data", None)

            # subscriber not approved, do not send reply
            if not is_subscriber_approved(subscriber):
                return

            # check for how many decks the subscriber has currently. Set to 5 maximum
            decks_response = await client.get(GET_DECKS_URL)
            decks_response.raise_for_status()
            decks_response_json: dict = decks_response.json()
            decks: list[dict] = decks_response_json.get("data", None)

            if len(decks) > 4:
                await update.message.reply_text(
                    "Sorry, you have reached the maximum deck limit.",
                    reply_markup=ReplyKeyboardRemove(),
                )
                context.user_data.clear()
                return ConversationHandler.END

            # get only active deck templates
            deck_templates_response = await client.get(
                GET_DECK_TEMPLATES_URL, params={"isDeleted": "0"}
            )
            deck_templates_response.raise_for_status()
            deck_templates_response_json: dict = deck_templates_response.json()
            deck_templates: list[dict] = deck_templates_response_json.get("data", None)

            deck_template_filter_ids = []
            for deck in decks:
                deck_template_id = deck.get("deckTemplateId")
                if deck_template_id is not None:
                    deck_template_filter_ids.append(deck_template_id)

            # filter out deck templates that are already in active decks
            filtered_deck_templates = [
                item
                for item in deck_templates
                if item["id"] not in deck_template_filter_ids
            ]

            if len(filtered_deck_templates) == 0:
                await update.message.reply_text(
                    "Sorry, there are no available decks to add",
                    reply_markup=ReplyKeyboardRemove(),
                )
                context.user_data.clear()
                return ConversationHandler.END

            for index, deck_template in enumerate(filtered_deck_templates):
                keyboard.append(
                    [
                        InlineKeyboardButton(
                            deck_template.get("title", f"Untitled deck {index}"),
                            callback_data=deck_template.get("id"),
                        )
                    ]
                )
            reply_markup = InlineKeyboardMarkup(keyboard)

            await update.message.reply_text(
                "Please select a new deck:",
                reply_markup=reply_markup,
            )

            return DECK_TEMPLATE_INPUT
        except httpx.HTTPStatusError as http_error:
            logger.error(f"http error: {http_error}")
        except Exception as error:
            logger.error(error)


async def deck_template_input(
    update: Update, context: ContextTypes.DEFAULT_TYPE
) -> int:
    query = update.callback_query
    user_id = str(update.effective_user.id)
    await query.answer()
    selected_deck_template_id = query.data

    async with httpx.AsyncClient() as client:
        try:
            GET_DECK_TEMPLATE_URL = f"{BACKEND_SERVICE_API_URL}/api/v1/deck-templates/{selected_deck_template_id}"
            deck_template_response = await client.get(GET_DECK_TEMPLATE_URL)
            deck_template_response.raise_for_status()
            deck_template_response_json: dict = deck_template_response.json()
            deck_template: dict = deck_template_response_json.get("data", None)

            CREATE_DECK_URL = f"{BACKEND_SERVICE_API_URL}/api/v1/decks"
            request_body = {
                "chatIds": deck_template.get("chatIds", []),
                # new decks will inherit the deck template id for
                # future channel ID sync
                "deckTemplateId": deck_template.get("id"),
                "isActive": True,
                "keywords": [],
                "subscriberId": user_id,
                "title": deck_template.get("title", "Untitled Deck"),
            }
            response = await client.post(CREATE_DECK_URL, json=dict(request_body))
            response.raise_for_status()
            await query.edit_message_text(
                "Deck created successfully! Use /modifykeywords command to set keywords for your new deck"
            )
        except httpx.HTTPStatusError as http_error:
            logger.error(f"http error: {http_error}")
        except Exception as error:
            logger.error(error)

    context.user_data.clear()
    return ConversationHandler.END


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.message.reply_text(
        "Operation cancelled. No decks created", reply_markup=ReplyKeyboardRemove()
    )
    context.user_data.clear()
    return ConversationHandler.END


new_deck_conv_handler = ConversationHandler(
    entry_points=[CommandHandler("newdeck", start)],
    states={DECK_TEMPLATE_INPUT: [CallbackQueryHandler(deck_template_input)]},
    fallbacks=[CommandHandler("cancel", cancel)],
)
