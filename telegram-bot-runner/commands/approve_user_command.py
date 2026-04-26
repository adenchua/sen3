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

from api_client import api_get, api_patch
from api_routes import subscribers_url, subscriber_url
from commands.conversation_helpers import make_cancel
from constants import TELEGRAM_BOT_ADMIN_TOKEN
from logging_helper import logger


TOKEN_INPUT, SUBSCRIBER_INPUT, CONFIRMATION = range(3)


def _build_subscriber_keyboard(subscribers: list[dict]) -> InlineKeyboardMarkup:
    """Build an InlineKeyboardMarkup listing each pending subscriber as a selectable button."""
    keyboard = []
    for subscriber in subscribers:
        first = subscriber.get("firstName", "") or ""
        last = subscriber.get("lastName", "") or ""
        display = (
            f"{first} {last}".strip()
            or subscriber.get("username")
            or str(subscriber.get("id"))
        )
        keyboard.append(
            [InlineKeyboardButton(display, callback_data=str(subscriber.get("id")))]
        )
    return InlineKeyboardMarkup(keyboard)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Begin the approval flow by prompting for the admin token."""
    await update.message.reply_text("Please enter the admin token:")
    return TOKEN_INPUT


async def token_input(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Validate the admin token and show the list of pending subscribers."""
    entered_token = update.message.text.strip()

    if not TELEGRAM_BOT_ADMIN_TOKEN or entered_token != TELEGRAM_BOT_ADMIN_TOKEN:
        await update.message.reply_text("Invalid token. Access denied.")
        context.user_data.clear()
        return ConversationHandler.END

    subscribers_data = await api_get(
        subscribers_url(), params={"isApproved": 0, "size": 10}
    )
    if subscribers_data is None:
        context.user_data.clear()
        return ConversationHandler.END

    subscribers: list[dict] = subscribers_data.get("data", [])

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


async def subscriber_input(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Show a yes/no confirmation prompt for the selected subscriber."""
    query = update.callback_query
    await query.answer()
    selected_id = query.data

    context.user_data["selected_subscriber_id"] = selected_id

    subscribers: list[dict] = context.user_data.get("subscribers", [])
    matched_subscriber = next(
        (sub for sub in subscribers if str(sub.get("id")) == selected_id), None
    )
    if matched_subscriber:
        first = matched_subscriber.get("firstName", "") or ""
        last = matched_subscriber.get("lastName", "") or ""
        display_name = (
            f"{first} {last}".strip()
            or matched_subscriber.get("username")
            or selected_id
        )
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
    """Approve the subscriber or return to the list based on the admin's choice."""
    query = update.callback_query
    await query.answer()
    answer = query.data

    if answer == "YES":
        selected_id = context.user_data.get("selected_subscriber_id")
        await api_patch(subscriber_url(selected_id), {"isApproved": True})

        try:
            await context.bot.send_message(
                chat_id=selected_id,
                text=(
                    "Your registration has been approved! You can now:\n"
                    "• Use /modify_keywords to add or update keywords on an existing deck\n"
                    "• Use /new_deck to create a new alert deck"
                ),
            )
        except Exception as notify_error:
            logger.warning(f"Could not notify subscriber {selected_id}: {notify_error}")
        await query.edit_message_text("Subscriber approved successfully!")

        context.user_data.clear()
        return ConversationHandler.END

    subscribers: list[dict] = context.user_data.get("subscribers", [])
    await query.edit_message_text(
        "Select a subscriber to approve:",
        reply_markup=_build_subscriber_keyboard(subscribers),
    )
    return SUBSCRIBER_INPUT


approve_user_conv_handler = ConversationHandler(
    entry_points=[CommandHandler("approve_user", start)],
    states={
        TOKEN_INPUT: [MessageHandler(filters.TEXT & ~filters.COMMAND, token_input)],
        SUBSCRIBER_INPUT: [CallbackQueryHandler(subscriber_input)],
        CONFIRMATION: [CallbackQueryHandler(confirmation)],
    },
    fallbacks=[CommandHandler("cancel", make_cancel("Operation cancelled."))],
)
