import requests
import asyncio
from requests.exceptions import HTTPError
import logging

from constants import TELEGRAM_SERVICE_API_URL, BACKEND_SERVICE_API_URL
from utils.date_helper import convert_to_iso, get_current_datetime_iso

logging.basicConfig(
    format="{asctime} - {levelname} - {message}",
    style="{",
    datefmt="%Y-%m-%d %H:%M",
    level=logging.INFO,
)


class ChatMessagesBackgroundJob:
    def __init__(self, interval_minutes: int):
        self.interval_minutes = interval_minutes

    def update_chat_offset(self, chat_id: str, max_offset_id: int) -> None:
        """
        Update a chat's message offset id and the last crawl date
        """
        URL = f"{BACKEND_SERVICE_API_URL}/api/v1/chats/{chat_id}"
        request_body = {
            "messageOffsetId": max_offset_id,
            "lastCrawlDate": get_current_datetime_iso(),
        }
        response = requests.patch(URL, json=dict(request_body))
        response.raise_for_status()
        logging.info(f"Updated {chat_id} offset_id...")

    def ingest_messages(self, messages: list[dict]) -> None:
        """
        Ingest messages to the databse
        """
        URL = f"{BACKEND_SERVICE_API_URL}/api/v1/messages/bulk"
        transformed_messages = []
        for message in messages:
            transformed_message = {
                "chatId": str(message.get("chat_id", None)),
                "createdDate": convert_to_iso(message.get("created_date", None)),
                "editedDate": convert_to_iso(message.get("edited_date", None)),
                "chatUsername": message.get("chat_username", None),
                "forwardCount": message.get("forward_count", None),
                "messageId": str(message.get("id", None)),
                "text": message.get("text", None),
                "viewCount": message.get("view_count", None),
            }
            transformed_messages.append(transformed_message)

        request_body = {"messages": transformed_messages}
        response = requests.post(URL, json=dict(request_body))
        response.raise_for_status()
        logging.info(f"Ingested {len(messages)} messages...")

    def fetch_chat_messages(self, chat: dict, latest_max_limit=10) -> None:
        """
        Retrieves chat messages and ingests in the database.

        If the offset_id is specified, retrieves the latest messages from the
        offset_id. Otherwise, retrieves the latest latest_max_limit messages.
        """

        chat_id: str = chat.get("id", None)
        chat_username: str = chat.get("username", "")
        chat_offset_id: int = chat.get("messageOffsetId", None)

        messages: list[dict] = []
        request_params: dict | None = None
        URL = f"{TELEGRAM_SERVICE_API_URL}/api/v1/chats/{chat_username}/messages"

        # if offset ID is not provided, get the latest_max_limit messages
        # otherwise, retrieve messages from that offset_id (1000 max limit to prevent timeout)
        if chat_offset_id is None:
            request_params = {"limit": str(latest_max_limit), "reverse": "false"}
        else:
            request_params = {
                "limit": "1000",
                "offset_id": str(chat_offset_id),
                "reverse": "true",
            }

        response = requests.get(url=URL, params=request_params)
        response.raise_for_status()
        response_json: dict = response.json()
        messages = response_json.get("data", None)

        logging.info(f"Retrieved {len(messages)} messages from {chat_username}...")
        max_offset_id = -1
        # loop to update max offset id to update in chat
        for message in messages:
            curr_offset_id = int(message.get("id"))
            if curr_offset_id > max_offset_id:
                max_offset_id = curr_offset_id

        if len(messages) > 0:
            # bulk ingests all messages
            # need to chunk the array, if not will throw payload entity too large error
            CHUNK_SIZE = 50
            message_chunks = [messages[i:i + CHUNK_SIZE] for i in range(0, len(messages), CHUNK_SIZE)]
            for message_chunk in message_chunks:
                self.ingest_messages(message_chunk)

        # update chat offset_id and last crawl date
        if max_offset_id != -1:
            self.update_chat_offset(chat_id, max_offset_id)

    async def run(self) -> None:
        """
        Retrieves all active chats and fetches the latest messages and ingests them in the database.
        Sleeps for a specified interval in minutes
        """
        while True:
            try:
                logging.info(f"Running background job to fetch chat messages...")

                fetch_chats_url = f"{BACKEND_SERVICE_API_URL}/api/v1/chats"
                # obtain crawl active chats only
                response = requests.get(
                    fetch_chats_url, {"crawlActive": "1", "size": "10000"}
                )
                response.raise_for_status()
                response_json: dict = response.json()
                chats: list[dict] = response_json.get("data", None)

                # for each chat, fetch and ingest messages
                for chat in chats:
                    self.fetch_chat_messages(chat, 10)

            except HTTPError as http_error:
                logging.exception(http_error)
            except Exception as error:
                logging.exception(error)
            finally:
                logging.info(
                    f"Background job completed! Sleeping for {self.interval_minutes} minutes..."
                )
                await asyncio.sleep(60 * self.interval_minutes)
