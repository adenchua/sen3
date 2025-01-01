import requests
import asyncio
from requests.exceptions import HTTPError
import logging

from constants import TELEGRAM_SERVICE_API_URL, BACKEND_SERVICE_API_URL
from .date_helper import get_current_datetime_iso

logging.basicConfig(
    format="{asctime} - {levelname} - {message}",
    style="{",
    datefmt="%Y-%m-%d %H:%M",
    level=logging.INFO,
)


def update_chat_participant(chat_username: str) -> None:
    """
    Retrieves a valid chat by the chat username,
    updates the chat's participant count in the database
    """
    if chat_username == "":
        raise Exception("Chat username must not be empty")

    URL = f"{TELEGRAM_SERVICE_API_URL}/api/v1/chats/{chat_username}"
    response = requests.get(URL)
    response.raise_for_status()
    response_json: dict = response.json()
    chat: dict = response_json.get("data", None)

    if chat is None:
        raise Exception(f"Unable to obtain chat by chat username: {chat_username}")

    participant_count = chat.get("participants_count", 0)
    chat_id = chat.get("id", None)

    UPDATE_CHAT_URL = f"{BACKEND_SERVICE_API_URL}/api/v1/chats/{chat_id}"
    request_body = {
        "participantStat": {
            "count": participant_count,
            "date": get_current_datetime_iso(),
        }
    }
    response = requests.patch(UPDATE_CHAT_URL, json=dict(request_body))
    response.raise_for_status()
    logging.info(f"Updated chat participant stats for {chat_username}...")


async def run_background_job(interval_in_days: int = 30) -> None:
    """
    Retrieves all chats in the database and updates the participant count
    for each chat. Sleeps for a specified interval before executing again
    """
    while True:
        try:
            logging.info(f"Running background job to update chat participant count...")

            URL = f"{BACKEND_SERVICE_API_URL}/api/v1/chats"
            response = requests.get(URL)
            response.raise_for_status()
            response_json: dict = response.json()
            chats: list[dict] = response_json.get("data", None)

            for chat in chats:
                chat_username = chat.get("username", "")
                update_chat_participant(chat_username)

        except HTTPError as http_error:
            logging.exception(http_error)
        except Exception as error:
            logging.exception(error)
        finally:
            logging.info(
                f"Background job completed! Sleeping for {interval_in_days} days..."
            )
            await asyncio.sleep(3600 * interval_in_days)
