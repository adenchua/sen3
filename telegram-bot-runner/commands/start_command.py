import inspect

from telegram import Update
from telegram.ext import ContextTypes

from api_client import api_post
from api_routes import subscribers_url


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Register the Telegram user as a new subscriber pending admin approval."""
    user = update.effective_user
    first_name = user.first_name
    username = user.username
    last_name = user.last_name
    user_id = str(user.id)

    reply_message = inspect.cleandoc(
        f"Hello {first_name}! Thank you for showing interest in our project!\n\n"
        f"Please note that your access is pending approval from an admin.\n\n"
        f"You'll be notified as soon as you're granted access.\n\n"
        f"Thank you for your understanding!\n\n"
    )

    request_body = {
        "username": username,
        "firstName": first_name,
        "lastName": last_name,
        "userId": user_id,
    }
    result = await api_post(subscribers_url(), request_body)
    if result is not None:
        await update.message.reply_text(reply_message)
