import inspect

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
    MessageHandler,
    filters,
    CallbackQueryHandler,
)

from constants import BACKEND_SERVICE_API_URL
from logging_helper import logger
from utils.validationHelper import (
    is_safe_opensearch_query_string,
    format_keywords,
    clean_and_join,
)


KEYWORD_INPUT, CONFIRMATION, END = range(3)


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
            if not subscriber or not subscriber.get("isApproved", False):
                return

            decks_response = await client.get(GET_DECKS_URL)
            decks_response.raise_for_status()
            decks_response_json: dict = decks_response.json()
            decks: list[dict] = decks_response_json.get("data", None)

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
                "Please select a deck:", reply_markup=reply_markup
            )

            return KEYWORD_INPUT
        except httpx.HTTPStatusError as http_error:
            logger.error(f"http error: {http_error}")
        except Exception as error:
            logger.error(error)


async def keyword_input(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    selected_deck_id = query.data
    context.user_data["deck_id"] = selected_deck_id

    async with httpx.AsyncClient() as client:
        try:
            URL = f"{BACKEND_SERVICE_API_URL}/api/v1/decks/{selected_deck_id}"
            response = await client.get(URL)
            response.raise_for_status()
            response_json: dict = response.json()
            deck: dict = response_json.get("data", None)
            deck_keywords: list[str] = deck.get("keywords", [])
            deck_title = deck.get("title", "Untitled")

            stringified_deck_keywords = ",".join(deck_keywords)

            reply_message = inspect.cleandoc(
                f"Deck selected: {deck_title}\n\n"
                f"Current keywords: \n{format_keywords(stringified_deck_keywords)}\n\n"
                f"Please type in the new keywords, each keyword separated with a comma\n\n"
                f"Allowed characters:\n- Letters (a-z, A-Z)\n- Numbers (0-9)\n- Spaces\n- Basic punctuation: comma (,), period (.), hyphen (-), underscore (_)\n\n"
                f"To cancel anytime, use the /cancel command!\n\n"
            )

            if len(deck_keywords) > 0:
                # Additional message for convenience
                await update.callback_query.message.reply_text(
                    "For convenience, these are the previous keywords:"
                )
                await update.callback_query.message.reply_text(
                    stringified_deck_keywords
                )

            await query.edit_message_text(text=reply_message)

            return CONFIRMATION

        except httpx.HTTPStatusError as http_error:
            logger.error(f"http error: {http_error}")
        except Exception as error:
            logger.error(error)


async def confirmation(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_input = update.message.text.strip()

    if is_safe_opensearch_query_string(user_input) == False:
        reply_message = inspect.cleandoc(
            f"Invalid keywords detected!\n\n"
            f"Please type in the new keywords, each keyword separated with a comma\n\n"
            f"Allowed characters:\n- Letters (a-z, A-Z)\n- Numbers (0-9)\n- Spaces\n- Basic punctuation: comma (,), period (.), hyphen (-), underscore (_)\n\n"
        )
        await update.message.reply_text(reply_message)
        return CONFIRMATION  # Stay in the same state until valid input

    context.user_data["keywords"] = clean_and_join(user_input)

    keyboard = [
        [
            InlineKeyboardButton("Yes", callback_data="Y"),
            InlineKeyboardButton("No", callback_data="N"),
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    reply_message = (
        f"Your input keywords: \n{format_keywords(user_input)}\n\n Confirm changes?"
    )
    await update.message.reply_text(reply_message, reply_markup=reply_markup)
    return END


async def end(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    confirmation = query.data
    selected_deck_id = context.user_data["deck_id"]
    updated_keywords = context.user_data["keywords"]

    if confirmation.upper() == "Y":
        async with httpx.AsyncClient() as client:
            try:
                URL = f"{BACKEND_SERVICE_API_URL}/api/v1/decks/{selected_deck_id}"
                # set deck to active upon keyword update
                request_body = {
                    "keywords": updated_keywords.split(","),
                    "isActive": True,
                }
                response = await client.patch(URL, json=dict(request_body))
                response.raise_for_status()
                await query.edit_message_text("Deck updated with the new keywords!")
            except httpx.HTTPStatusError as http_error:
                logger.error(f"http error: {http_error}")
            except Exception as error:
                logger.error(error)
    else:
        await query.edit_message_text("Operation cancelled")

    context.user_data.clear()
    return ConversationHandler.END


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.message.reply_text(
        "Operation cancelled", reply_markup=ReplyKeyboardRemove()
    )
    context.user_data.clear()
    return ConversationHandler.END


modify_keywords_conv_handler = ConversationHandler(
    entry_points=[CommandHandler("modifykeywords", start)],
    states={
        KEYWORD_INPUT: [CallbackQueryHandler(keyword_input)],
        CONFIRMATION: [MessageHandler(filters.TEXT & ~filters.COMMAND, confirmation)],
        END: [CallbackQueryHandler(end)],
    },
    fallbacks=[CommandHandler("cancel", cancel)],
)
