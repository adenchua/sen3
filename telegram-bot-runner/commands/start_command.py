import inspect

import requests
from requests.exceptions import HTTPError
from telegram import Update
from telegram.ext import ContextTypes

from constants import BACKEND_SERVICE_API_URL
from logging_helper import logger


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
