import httpx
from telegram import Update
from telegram.ext import ContextTypes

from logging_helper import logger
from constants import BACKEND_SERVICE_API_URL


async def unsubscribe(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = str(update.effective_user.id)

    reply_message = "Unsubscribed from all notifications!"

    URL = f"{BACKEND_SERVICE_API_URL}/api/v1/subscribers/{user_id}"
    request_body = {"allowNotifications": False}

    async with httpx.AsyncClient() as client:
        try:
            get_subscriber_response = await client.get(URL)
            get_subscriber_response.raise_for_status()
            get_subscriber_response_json: dict = get_subscriber_response.json()
            subscriber: dict = get_subscriber_response_json.get("data", None)

            # subscriber not approved, do not send reply
            if subscriber.get("isApproved", False) == False:
                return

            # if subscriber notifications turned on, turn it off
            # save a call to the API if its already False
            if subscriber.get("allowNotifications") == True:
                response = await client.patch(URL, json=dict(request_body))
                response.raise_for_status()

            await update.message.reply_text(reply_message)
        except httpx.HTTPStatusError as http_error:
            logger.error(f"http error: {http_error}")
        except Exception as error:
            logger.error(error)
