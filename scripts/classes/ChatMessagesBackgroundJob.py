import httpx
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
    async def update_chat_offsets(
        self, client: httpx.AsyncClient, offset_updates: list[dict]
    ) -> None:
        """
        Bulk update message offset ids and last crawl dates for multiple chats
        in a single database call. Does nothing when there are no updates.
        """
        if len(offset_updates) == 0:
            return
        URL = f"{BACKEND_SERVICE_API_URL}/api/v1/chats/bulk"
        request_body = {"chats": offset_updates}
        response = await client.patch(URL, json=dict(request_body))
        response.raise_for_status()
        logging.info(f"Updated offsets for {len(offset_updates)} chats!")

    async def ingest_messages(
        self, client: httpx.AsyncClient, messages: list[dict]
    ) -> None:
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
        response = await client.post(URL, json=dict(request_body))
        response.raise_for_status()
        logging.info(f"Ingested {len(messages)} messages!")

    async def fetch_chat_messages(
        self, client: httpx.AsyncClient, chat: dict, latest_max_limit=10
    ) -> tuple[list[dict], dict | None]:
        """
        Retrieves chat messages from the telegram service.

        If the offset_id is specified, retrieves the latest messages from the
        offset_id. Otherwise, retrieves the latest latest_max_limit messages.

        Returns a tuple of the retrieved messages and an offset-update
        descriptor (chat id, message offset id, last crawl date) for the chat,
        or None when no messages were retrieved.
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
        response = await client.get(url=URL, params=request_params)
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

        # build the offset-update descriptor when there are messages to advance past
        offset_update: dict | None = None
        if max_offset_id != -1:
            offset_update = {
                "id": chat_id,
                "messageOffsetId": max_offset_id,
                "lastCrawlDate": get_current_datetime_iso(),
            }

        return messages, offset_update

    async def run_once(self, client: httpx.AsyncClient) -> None:
        """
        Runs a single crawl cycle: retrieves all active chats, fetches the latest
        messages from each, and ingests them into the database. Catches and logs
        errors so the caller's loop continues. Returns nothing.
        """
        try:
            logging.info(f"Running background job to fetch chat messages...")

            fetch_chats_url = f"{BACKEND_SERVICE_API_URL}/api/v1/chats"
            # obtain crawl active chats only
            response = await client.get(
                fetch_chats_url,
                params={"crawlActive": "1", "size": "10000"},
            )
            response.raise_for_status()
            response_json: dict = response.json()
            chats: list[dict] = response_json.get("data", None)

            # fetch messages from every chat first, accumulating the
            # messages and offset updates to flush in as few calls as possible
            all_messages: list[dict] = []
            offset_updates: list[dict] = []
            for chat in chats:
                try:
                    messages, offset_update = await self.fetch_chat_messages(
                        client, chat, 10
                    )
                except Exception as error:
                    # a single chat's failure (e.g. timeout) must not abort the
                    # whole cycle and discard messages already collected
                    logging.exception(error)
                    continue
                all_messages.extend(messages)
                if offset_update is not None:
                    offset_updates.append(offset_update)

            # bulk ingest all accumulated messages
            # need to chunk the array, if not will throw payload entity too large error
            if len(all_messages) > 0:
                logging.info(
                    f"Retrieved {len(all_messages)} messages from all chats, performing ingestion..."
                )
                CHUNK_SIZE = 50
                for index in range(0, len(all_messages), CHUNK_SIZE):
                    await self.ingest_messages(
                        client, all_messages[index : index + CHUNK_SIZE]
                    )
                logging.info(f"Ingested {len(all_messages)} messages successfully!")

            # update all chat offset_ids and last crawl dates in one bulk call
            await self.update_chat_offsets(client, offset_updates)

        except httpx.HTTPStatusError as http_error:
            logging.exception(http_error)
        except Exception as error:
            logging.exception(error)
