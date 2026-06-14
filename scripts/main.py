import asyncio
import logging
import time

import httpx

from constants import (
    CHAT_INTERVAL_DAYS,
    CHAT_MESSAGES_INTERVAL_MINUTES,
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


async def crawl_and_notify_loop(interval_minutes: int) -> None:
    """
    Runs the chained crawl -> notify cycle forever. Each cycle crawls the latest
    chat messages and then immediately dispatches notifications for any matched
    messages, sharing a single HTTP client across both phases. Sleeps for
    interval_minutes between cycles. Returns nothing.
    """
    chat_messages_background_job = ChatMessagesBackgroundJob()
    subscriber_notification_background_job = SubscriberNotificationBackgroundJob()

    async with httpx.AsyncClient() as client:
        while True:
            await chat_messages_background_job.run_once(client)
            await subscriber_notification_background_job.run_once(client)
            logging.info(
                f"Crawl and notify cycle completed! Sleeping for {interval_minutes} minutes..."
            )
            await asyncio.sleep(60 * interval_minutes)


async def run():
    """
    Starts the following jobs in the background:
    - A combined cycle that crawls chat messages every CHAT_MESSAGES_INTERVAL_MINUTES
    minutes and immediately dispatches subscriber notifications for matched messages
    - Periodically updates all chats every CHAT_INTERVAL_DAYS days and updates the participant count
    """
    chat_update_background_job = ChatUpdateBackgroundJob(int(CHAT_INTERVAL_DAYS))

    crawl_and_notify_task = asyncio.create_task(
        crawl_and_notify_loop(int(CHAT_MESSAGES_INTERVAL_MINUTES))
    )
    chat_update_task = asyncio.create_task(chat_update_background_job.run())

    await asyncio.wait({crawl_and_notify_task, chat_update_task})


if __name__ == "__main__":
    logging.info("Starting up scripts... Sleeping for 60 seconds...")
    # sleep for 1 minute first on restart to prevent script spam upon startup
    time.sleep(60 * 1)
    logging.info("Running all background jobs...")
    asyncio.run(run())
