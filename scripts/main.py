import asyncio
import logging
import time

from utils import run_background_chat
from utils import run_background_chat_messages
from constants import CHAT_INTERVAL_DAYS, CHAT_MESSAGES_INTERVAL_MINUTES
from classes.SubscriberNotificationBackgroundJob import (
    SubscriberNotificationBackgroundJob,
)

logging.basicConfig(
    format="{asctime} - {levelname} - {message}",
    style="{",
    datefmt="%Y-%m-%d %H:%M",
    level=logging.INFO,
)


async def run():
    """
    Starts a background job where it periodically crawls chat messages every CHAT_MESSAGES_INTERVAL_MINUTES
    minutes and ingests it in the database. Separately, it gets an update of the chat every CHAT_INTERVAL_DAYS
    days and updates the participant count
    """
    subscriber_notification_background_job = SubscriberNotificationBackgroundJob(15)

    task1 = asyncio.create_task(
        run_background_chat.run_background_job(int(CHAT_INTERVAL_DAYS))
    )
    task2 = asyncio.create_task(
        run_background_chat_messages.run_background_job(
            int(CHAT_MESSAGES_INTERVAL_MINUTES)
        )
    )
    task3 = asyncio.create_task(subscriber_notification_background_job.run())

    await asyncio.wait([task1, task2, task3])


if __name__ == "__main__":
    logging.info("Starting up scripts... Sleeping for 60 seconds...")
    # sleep for 1 minute first on restart to prevent script spam upon startup
    time.sleep(60 * 1)
    logging.info("Running all background jobs...")
    asyncio.run(run())
