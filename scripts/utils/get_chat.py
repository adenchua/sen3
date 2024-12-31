import requests
import asyncio

from constants import TELEGRAM_SERVICE_API_URL, BACKEND_SERVICE_API_URL


def update_chat_participant(chat_username: str) -> None:
    """
    Retrieves a valid chat by the chat username,
    updates the chat's participant count in the database
    """
    if chat_username == "":
        raise Exception("Chat username must not be empty")

    fetch_chat_url = f"{TELEGRAM_SERVICE_API_URL}/api/v1/chats/{chat_username}"
    response = requests.get(fetch_chat_url)
    response_json: dict = response.json()
    chat: dict = response_json.get("data", None)

    if chat is None:
        raise Exception(f"Unable to obtain chat by chat username: {chat_username}")

    print(f"Retrieved information on {chat_username}...")
    participant_count = chat.get("participants_count", 0)

    print(chat_username, participant_count)


async def run_background_job(interval_in_days: int = 30) -> None:
    """
    Retrieves all chats in the database and updates the participant count
    for each chat. Sleeps for a specified interval before executing again
    """
    while True:
        try:
            print(f"Running background job to update chat participant count...")

            fetch_chats_url = f"{BACKEND_SERVICE_API_URL}/api/v1/chats"
            response = requests.get(fetch_chats_url)
            response_json: dict = response.json()
            chats: list[dict] = response_json.get("data", None)

            for chat in chats:
                chat_username = chat.get("username", "")
                update_chat_participant(chat_username)

            print(f"Background job completed! Sleeping for {interval_in_days} days...")
            await asyncio.sleep(3600 * interval_in_days)
        except Exception as error:
            print(error)
            break
