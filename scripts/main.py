import asyncio

from utils import get_chat
from utils import get_chat_messages
from constants import CHAT_INTERVAL_DAYS, CHAT_MESSAGES_INTERVAL_MINUTES


async def run():
    """
    Starts a background job where it periodically crawls chat messages every CHAT_MESSAGES_INTERVAL_MINUTES
    minutes and ingests it in the database. Separately, it gets an update of the chat every CHAT_INTERVAL_DAYS
    days and updates the participant count
    """
    task1 = asyncio.create_task(get_chat.run_background_job(int(CHAT_INTERVAL_DAYS)))
    task2 = asyncio.create_task(
        get_chat_messages.run_background_job(int(CHAT_MESSAGES_INTERVAL_MINUTES))
    )
    await asyncio.wait([task1, task2])


if __name__ == "__main__":
    print("Running all background jobs...")
    asyncio.run(run())
