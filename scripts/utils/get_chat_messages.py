import requests
import asyncio

from constants import TELEGRAM_SERVICE_API_URL, BACKEND_SERVICE_API_URL
from .date_helper import convert_to_iso, get_current_datetime_iso


def update_chat_offset(chat_id: str, max_offset_id: int) -> None:
    print("updating chat offset_id...")
    URL = f"{BACKEND_SERVICE_API_URL}/api/v1/chats/{chat_id}"
    request_body = {
        "messageOffsetId": max_offset_id,
        "lastCrawlDate": get_current_datetime_iso(),
    }
    requests.patch(URL, json=dict(request_body))


def ingest_message(message: dict) -> None:
    try:
        message_id = str(message.get("id", None))
        print(f"ingesting message {message_id}...")
        URL = f"{BACKEND_SERVICE_API_URL}/api/v1/messages"
        request_body = {
            "chatId": str(message.get("chat_id", None)),
            "createdDate": convert_to_iso(message.get("created_date", None)),
            "editedDate": convert_to_iso(message.get("edited_date", None)),
            "chatUsername": message.get("chat_username", None),
            "forwardCount": message.get("forward_count", None),
            "messageId": message_id,
            "text": message.get("text", None),
            "viewCount": message.get("view_count", None),
        }
        requests.post(URL, json=dict(request_body))
    except Exception as error:
        print(error)


def update_chat_messages(
    chat_username: str,
    chat_id: str,
    offset_id: int | None = None,
):
    """
    Retrieves chat messages and ingests in the database.

    If the offset_id is specified, retrieves the latest messages from the
    offset_id. Otherwise, retrieves the latest 10 messages.
    """
    if chat_username == "":
        raise Exception("Chat username must not be empty")

    messages: list[dict] = []
    URL = f"{TELEGRAM_SERVICE_API_URL}/api/v1/chats/{chat_username}/messages"

    if offset_id is None:
        response = requests.get(url=URL, params={"limit": "10", "reverse": "false"})
        response_json: dict = response.json()
        messages = response_json.get("data", None)
    else:
        response = requests.get(
            url=URL,
            params={"limit": "1000", "offset_id": str(offset_id), "reverse": "true"},
        )
        response_json: dict = response.json()
        messages = response_json.get("data", None)

    print(f"Retrieved {len(messages)} messages from {chat_username}...")
    max_offset_id = -1
    for message in messages:
        offset_id = int(message.get("id"))
        if offset_id > max_offset_id:
            max_offset_id = offset_id
        ingest_message(message)

    # update chat offset_id and last crawl date
    if max_offset_id != -1:
        update_chat_offset(chat_id, max_offset_id)


async def run_background_job(interval_in_minutes: int = 30) -> None:
    """
    Retrieves all active chats and fetches the latest messages and ingests them in the database.
    Sleeps for a specified interval in minutes
    """
    while True:
        try:
            print(f"Running background job to update chat messages...")

            fetch_chats_url = f"{BACKEND_SERVICE_API_URL}/api/v1/chats"
            # obtain crawl active chats only
            response = requests.get(fetch_chats_url, {"crawlActive": "1"})
            response_json: dict = response.json()
            chats: list[dict] = response_json.get("data", None)

            for chat in chats:
                chat_id: str = chat.get("id", None)
                chat_username: str = chat.get("username", "")
                chat_offset_id: int = chat.get("messageOffsetId", None)
                print(
                    f"Retrieving messages from {chat_username} with offset_id of {chat_offset_id}..."
                )
                update_chat_messages(chat_username, chat_id, chat_offset_id)

            print(
                f"Background job completed! Sleeping for {interval_in_minutes} minutes..."
            )
            await asyncio.sleep(60 * interval_in_minutes)
        except Exception as error:
            print(error)
            break
