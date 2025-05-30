import requests
from requests.exceptions import HTTPError
from telegram import Update
from telegram.ext import ContextTypes

from logging_helper import logger
from constants import BACKEND_SERVICE_API_URL


async def subscribe(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = str(update.effective_user.id)

    reply_message = "Subscribed to notifications!"

    URL = f"{BACKEND_SERVICE_API_URL}/api/v1/subscribers/{user_id}"
    request_body = {"allowNotifications": True}

    try:
        get_subscriber_response = requests.get(URL)
        get_subscriber_response.raise_for_status()
        get_subscriber_response_json: dict = get_subscriber_response.json()
        subscriber: dict = get_subscriber_response_json.get("data", None)

        # subscriber not approved, do not send reply
        if subscriber.get("isApproved", False) == False:
            return

        # if subscriber notifications turned off, turn it on
        # save a call to the API if its already True
        if subscriber.get("allowNotifications") == False:
            response = requests.patch(URL, json=dict(request_body))
            response.raise_for_status()

        await update.message.reply_text(reply_message)
    except HTTPError as http_error:
        logger.error(f"http error: {http_error}")
    except Exception as error:
        logger.error(error)
