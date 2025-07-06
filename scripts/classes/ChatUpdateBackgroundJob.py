import httpx
import asyncio
import logging

from constants import TELEGRAM_SERVICE_API_URL, BACKEND_SERVICE_API_URL
from utils.date_helper import get_current_datetime_iso

logging.basicConfig(
    format="{asctime} - {levelname} - {message}",
    style="{",
    datefmt="%Y-%m-%d %H:%M",
    level=logging.INFO,
)


class ChatUpdateBackgroundJob:
    def __init__(self, interval_days: int):
        self.interval_days = interval_days

    async def update_chat_participant(
        self, client: httpx.AsyncClient, chat_username: str
    ) -> None:
        """
        Retrieves a valid chat by the chat username,
        updates the chat's participant count in the database
        """
        if chat_username == "":
            raise Exception("Chat username must not be empty")

        URL = f"{TELEGRAM_SERVICE_API_URL}/api/v1/chats/{chat_username}"
        response = await client.get(URL)
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
        response = await client.patch(UPDATE_CHAT_URL, json=dict(request_body))
        response.raise_for_status()
        logging.info(f"Updated chat participant stats for {chat_username}...")

    async def run(self) -> None:
        """
        Retrieves all chats in the database and updates the participant count
        for each chat. Sleeps for a specified interval before executing again
        """
        async with httpx.AsyncClient() as client:
            while True:
                try:
                    logging.info(
                        f"Running background job to update chat participant count..."
                    )

                    URL = f"{BACKEND_SERVICE_API_URL}/api/v1/chats"
                    response = await client.get(URL)
                    response.raise_for_status()
                    response_json: dict = response.json()
                    chats: list[dict] = response_json.get("data", [])

                    for chat in chats:
                        chat_username = chat.get("username", "")
                        await self.update_chat_participant(client, chat_username)

                except httpx.HTTPStatusError as http_error:
                    logging.exception(http_error)
                except Exception as error:
                    logging.exception(error)
                finally:
                    logging.info(
                        f"Background job completed! Sleeping for {self.interval_days} days..."
                    )
                    await asyncio.sleep(86400 * self.interval_days)
