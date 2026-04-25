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

from constants import BACKEND_SERVICE_API_URL, TELEGRAM_BOT_ADMIN_TOKEN
from logging_helper import logger


TOKEN_INPUT, SUBSCRIBER_INPUT, CONFIRMATION = range(3)


def _build_subscriber_keyboard(subscribers: list[dict]) -> InlineKeyboardMarkup:
    keyboard = []
    for sub in subscribers:
        first = sub.get("firstName", "") or ""
        last = sub.get("lastName", "") or ""
        display = f"{first} {last}".strip() or sub.get("username") or str(sub.get("id"))
        keyboard.append([InlineKeyboardButton(display, callback_data=str(sub.get("id")))])
    return InlineKeyboardMarkup(keyboard)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.message.reply_text("Please enter the admin token:")
    return TOKEN_INPUT


async def token_input(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    entered_token = update.message.text.strip()

    if not TELEGRAM_BOT_ADMIN_TOKEN or entered_token != TELEGRAM_BOT_ADMIN_TOKEN:
        await update.message.reply_text("Invalid token. Access denied.")
        context.user_data.clear()
        return ConversationHandler.END

    GET_SUBSCRIBERS_URL = f"{BACKEND_SERVICE_API_URL}/api/v1/subscribers"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                GET_SUBSCRIBERS_URL, params={"isApproved": 0, "size": 10}
            )
            response.raise_for_status()
            subscribers: list[dict] = response.json().get("data", [])

            if not subscribers:
                await update.message.reply_text(
                    "No pending subscribers found.", reply_markup=ReplyKeyboardRemove()
                )
                context.user_data.clear()
                return ConversationHandler.END

            context.user_data["subscribers"] = subscribers

            await update.message.reply_text(
                "Select a subscriber to approve:",
                reply_markup=_build_subscriber_keyboard(subscribers),
            )
            return SUBSCRIBER_INPUT
        except httpx.HTTPStatusError as http_error:
            logger.error(f"http error: {http_error}")
        except Exception as error:
            logger.error(error)

    context.user_data.clear()
    return ConversationHandler.END


async def subscriber_input(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    selected_id = query.data

    context.user_data["selected_subscriber_id"] = selected_id

    subscribers: list[dict] = context.user_data.get("subscribers", [])
    match = next((s for s in subscribers if str(s.get("id")) == selected_id), None)
    if match:
        first = match.get("firstName", "") or ""
        last = match.get("lastName", "") or ""
        display_name = f"{first} {last}".strip() or match.get("username") or selected_id
    else:
        display_name = selected_id

    yes_no_keyboard = InlineKeyboardMarkup(
        [
            [
                InlineKeyboardButton("Yes", callback_data="YES"),
                InlineKeyboardButton("No", callback_data="NO"),
            ]
        ]
    )

    await query.edit_message_text(
        f"Approve {display_name}? This cannot be undone.",
        reply_markup=yes_no_keyboard,
    )
    return CONFIRMATION


async def confirmation(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    answer = query.data

    if answer == "YES":
        selected_id = context.user_data.get("selected_subscriber_id")
        PATCH_URL = f"{BACKEND_SERVICE_API_URL}/api/v1/subscribers/{selected_id}"

        async with httpx.AsyncClient() as client:
            try:
                response = await client.patch(PATCH_URL, json={"isApproved": True})
                response.raise_for_status()
                await query.edit_message_text("Subscriber approved successfully!")
            except httpx.HTTPStatusError as http_error:
                logger.error(f"http error: {http_error}")
                await query.edit_message_text(
                    "An error occurred while approving the subscriber. Please try again."
                )
            except Exception as error:
                logger.error(error)

        context.user_data.clear()
        return ConversationHandler.END

    subscribers: list[dict] = context.user_data.get("subscribers", [])
    await query.edit_message_text(
        "Select a subscriber to approve:",
        reply_markup=_build_subscriber_keyboard(subscribers),
    )
    return SUBSCRIBER_INPUT


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.message.reply_text(
        "Operation cancelled.", reply_markup=ReplyKeyboardRemove()
    )
    context.user_data.clear()
    return ConversationHandler.END


approve_user_conv_handler = ConversationHandler(
    entry_points=[CommandHandler("approve_user", start)],
    states={
        TOKEN_INPUT: [MessageHandler(filters.TEXT & ~filters.COMMAND, token_input)],
        SUBSCRIBER_INPUT: [CallbackQueryHandler(subscriber_input)],
        CONFIRMATION: [CallbackQueryHandler(confirmation)],
    },
    fallbacks=[CommandHandler("cancel", cancel)],
)
