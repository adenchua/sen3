import logging
import inspect

import requests
from requests.exceptions import HTTPError
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

from constants import TELEGRAM_BOT_API_TOKEN, BACKEND_SERVICE_API_URL

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
# set higher logging level for httpx to avoid all GET and POST requests being logged
logging.getLogger("httpx").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    username = update.effective_user.username
    first_name = update.effective_user.first_name
    last_name = update.effective_user.last_name
    user_id = str(update.effective_user.id)

    reply_message = inspect.cleandoc(
        f"Hello {first_name}! Thank you for showing interest in our project!\n\n"
        f"Please note that your access is pending approval from an admin.\n\n"
        f"You'll be notified as soon as you're granted access.\n\n"
        f"Thank you for your understanding!\n\n"
    )

    URL = f"{BACKEND_SERVICE_API_URL}/api/v1/subscribers"
    request_body = {
        "username": username,
        "firstName": first_name,
        "lastName": last_name,
        "userId": user_id,
    }

    try:
        response = requests.post(URL, json=dict(request_body))
        response.raise_for_status()
        await update.message.reply_text(reply_message)
    except HTTPError as http_error:
        logger.error(f"http error: {http_error}")
    except Exception as error:
        logger.error(error)


app = ApplicationBuilder().token(TELEGRAM_BOT_API_TOKEN).build()

app.add_handler(CommandHandler("start", start))

app.run_polling()
