import requests
import asyncio

from constants import TELEGRAM_SERVICE_API_URL, BACKEND_SERVICE_API_URL


def update_chat_messages(
    chat_username: str,
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
    print(messages)


async def run_background_job(interval_in_minutes: int = 30) -> None:
    """
    Retrieves all active chats and fetches the latest messages and ingests them in the database.
    Sleeps for a specified interval in minutes
    """
    while True:
        try:
            print(f"Running background job to update chat messages...")

            fetch_chats_url = f"{BACKEND_SERVICE_API_URL}/api/v1/chats"
            response = requests.get(fetch_chats_url)
            response_json: dict = response.json()
            chats: list[dict] = response_json.get("data", None)

            for chat in chats:
                chat_username = chat.get("username", "")
                chat_offset_id = chat.get("messageOffsetId", None)
                print(
                    f"Retrieving messages from {chat_username} with offset_id of {chat_offset_id}..."
                )
                update_chat_messages(chat_username, chat_offset_id)

            print(
                f"Background job completed! Sleeping for {interval_in_minutes} minutes..."
            )
            await asyncio.sleep(60 * interval_in_minutes)
        except Exception as error:
            print(error)
            break
