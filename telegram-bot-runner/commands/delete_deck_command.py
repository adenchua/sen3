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


DECK_INPUT = 1


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = str(update.effective_user.id)

    keyboard = []

    GET_SUBSCRIBER_URL = f"{BACKEND_SERVICE_API_URL}/api/v1/subscribers/{user_id}"
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

            decks_response = await client.get(GET_DECKS_URL)
            decks_response.raise_for_status()
            decks_response_json: dict = decks_response.json()
            decks: list[dict] = decks_response_json.get("data", None)

            if len(decks) == 0:
                await update.message.reply_text(
                    "There are no available decks", reply_markup=ReplyKeyboardRemove()
                )
                context.user_data.clear()
                return ConversationHandler.END

            for index, deck in enumerate(decks):
                keyboard.append(
                    [
                        InlineKeyboardButton(
                            deck.get("title", f"Untitled deck {index}"),
                            callback_data=deck.get("id"),
                        )
                    ]
                )
            reply_markup = InlineKeyboardMarkup(keyboard)

            await update.message.reply_text(
                "Please select a deck to delete:", reply_markup=reply_markup
            )

            return DECK_INPUT
        except httpx.HTTPStatusError as http_error:
            logger.error(f"http error: {http_error}")
        except Exception as error:
            logger.error(error)


async def deck_input(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    selected_deck_id = query.data

    async with httpx.AsyncClient() as client:
        try:
            URL = f"{BACKEND_SERVICE_API_URL}/api/v1/decks/{selected_deck_id}"
            response = await client.delete(URL)
            response.raise_for_status()
            await query.edit_message_text("Deck deleted successfully")
        except httpx.HTTPStatusError as http_error:
            logger.error(f"http error: {http_error}")
        except Exception as error:
            logger.error(error)

    context.user_data.clear()
    return ConversationHandler.END


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.message.reply_text(
        "Operation cancelled. No decks deleted", reply_markup=ReplyKeyboardRemove()
    )
    context.user_data.clear()
    return ConversationHandler.END


delete_deck_conv_handler = ConversationHandler(
    entry_points=[CommandHandler("deletedeck", start)],
    states={DECK_INPUT: [CallbackQueryHandler(deck_input)]},
    fallbacks=[CommandHandler("cancel", cancel)],
)
