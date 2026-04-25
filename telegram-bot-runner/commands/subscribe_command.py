from telegram import Update
from telegram.ext import ContextTypes

from api_client import api_get, api_patch
from api_routes import subscriber_url
from utils.subscriberHelper import is_subscriber_approved


async def _set_notifications(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE,
    *,
    enable: bool,
) -> None:
    """
    Toggle the allowNotifications flag on a subscriber's account.

    Skips the PATCH call if the flag is already in the desired state.
    Does nothing if the subscriber is not yet approved.
    """
    user_id = str(update.effective_user.id)
    url = subscriber_url(user_id)

    subscriber_data = await api_get(url)
    if subscriber_data is None:
        return

    subscriber: dict = subscriber_data.get("data")
    if not is_subscriber_approved(subscriber):
        return

    if subscriber.get("allowNotifications") != enable:
        result = await api_patch(url, {"allowNotifications": enable})
        if result is None:
            return

    reply = "Subscribed to notifications!" if enable else "Unsubscribed from all notifications!"
    await update.message.reply_text(reply)


async def subscribe(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Enable notifications for the subscriber."""
    await _set_notifications(update, context, enable=True)


async def unsubscribe(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Disable notifications for the subscriber."""
    await _set_notifications(update, context, enable=False)
