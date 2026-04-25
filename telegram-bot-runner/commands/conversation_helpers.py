from telegram import InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardRemove, Update
from telegram.ext import ContextTypes, ConversationHandler

from api_client import api_get
from api_routes import subscriber_url, subscriber_decks_url
from utils.subscriberHelper import is_subscriber_approved


def build_deck_keyboard(decks: list[dict]) -> InlineKeyboardMarkup:
    """Build an InlineKeyboardMarkup with one button per deck."""
    keyboard = [
        [
            InlineKeyboardButton(
                deck.get("title", f"Untitled deck {index}"),
                callback_data=deck.get("id"),
            )
        ]
        for index, deck in enumerate(decks)
    ]
    return InlineKeyboardMarkup(keyboard)


async def fetch_approved_subscriber_decks(
    user_id: str,
    update: Update,
    context: ContextTypes.DEFAULT_TYPE,
    deck_params: dict | None = None,
    empty_message: str = "You have no available decks.",
) -> list[dict] | None:
    """
    Fetch a subscriber, verify they are approved, then fetch their decks.

    Returns the list of decks on success.
    Returns None and sends the appropriate reply if the subscriber is unapproved,
    the API fails, or the deck list is empty.

    deck_params is forwarded as query params to the decks endpoint,
    e.g. {"isActive": "1"} to filter only active decks.
    """
    subscriber_data = await api_get(subscriber_url(user_id))
    if subscriber_data is None:
        return None

    subscriber: dict = subscriber_data.get("data")
    if not is_subscriber_approved(subscriber):
        return None

    decks_data = await api_get(subscriber_decks_url(user_id), params=deck_params)
    if decks_data is None:
        return None

    decks: list[dict] = decks_data.get("data", [])

    if len(decks) == 0:
        await update.message.reply_text(empty_message, reply_markup=ReplyKeyboardRemove())
        context.user_data.clear()
        return None

    return decks


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """End the conversation and inform the user the operation was cancelled."""
    await update.message.reply_text(
        "Operation cancelled.", reply_markup=ReplyKeyboardRemove()
    )
    context.user_data.clear()
    return ConversationHandler.END


def make_cancel(message: str):
    """
    Return a cancel handler that replies with a command-specific message.

    Usage:
        fallbacks=[CommandHandler("cancel", make_cancel("No decks deleted."))]
    """

    async def _cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
        """End the conversation and reply with the configured cancel message."""
        await update.message.reply_text(message, reply_markup=ReplyKeyboardRemove())
        context.user_data.clear()
        return ConversationHandler.END

    return _cancel
