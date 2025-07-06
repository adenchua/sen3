import asyncio
import logging
import time

from constants import (
    CHAT_INTERVAL_DAYS,
    CHAT_MESSAGES_INTERVAL_MINUTES,
    SUB_NOTIFICATIONS_INTERVAL_MINUTES,
)
from classes.SubscriberNotificationBackgroundJob import (
    SubscriberNotificationBackgroundJob,
)
from classes.ChatMessagesBackgroundJob import ChatMessagesBackgroundJob
from classes.ChatUpdateBackgroundJob import ChatUpdateBackgroundJob

logging.basicConfig(
    format="{asctime} - {levelname} - {message}",
    style="{",
    datefmt="%Y-%m-%d %H:%M",
    level=logging.INFO,
)


async def run():
    """
    Starts the following jobs in the background:
    - Periodically crawls chat messages every CHAT_MESSAGES_INTERVAL_MINUTES
    minutes and ingests it in the database
    - Periodically updates all chats every CHAT_INTERVAL_DAYS days and updates the participant count
    - Periodically sends notifications to subscribers for any matched messages
    """
    subscriber_notification_background_job = SubscriberNotificationBackgroundJob(
        int(SUB_NOTIFICATIONS_INTERVAL_MINUTES)
    )
    chat_update_background_job = ChatUpdateBackgroundJob(int(CHAT_INTERVAL_DAYS))
    chat_messages_background_job = ChatMessagesBackgroundJob(
        int(CHAT_MESSAGES_INTERVAL_MINUTES)
    )

    task1 = asyncio.create_task(chat_update_background_job.run())
    task2 = asyncio.create_task(chat_messages_background_job.run())
    task3 = asyncio.create_task(subscriber_notification_background_job.run())

    await asyncio.gather([task1, task2, task3])


if __name__ == "__main__":
    logging.info("Starting up scripts... Sleeping for 60 seconds...")
    # sleep for 1 minute first on restart to prevent script spam upon startup
    time.sleep(60 * 1)
    logging.info("Running all background jobs...")
    asyncio.run(run())
