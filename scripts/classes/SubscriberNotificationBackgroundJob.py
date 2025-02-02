import requests
import asyncio
from requests.exceptions import HTTPError
import logging

from constants import BACKEND_SERVICE_API_URL
from utils.date_helper import convert_to_iso, get_current_datetime_iso

logging.basicConfig(
    format="{asctime} - {levelname} - {message}",
    style="{",
    datefmt="%Y-%m-%d %H:%M",
    level=logging.INFO,
)


class SubscriberNotificationBackgroundJob:
    def __init__(self, intervalSeconds: int):
        self.intervalSeconds = intervalSeconds

    async def run_background_job(self):
        """
        - retrieves all active subscribers that allow notitications
        - retrieves all active decks from each subscriber
        - get any matched messages
        - send to subscriber
        - update timestamp
        """
        subscribers = await self.get_active_subscribers()
        for subscriber in subscribers:
            subscriber_id = subscriber["id"]
            active_decks = await self.get_active_decks(subscriber_id)
            for deck in active_decks:
                matched_messages = await self.get_matched_messages(
                    deck["chatIds"], deck["keywords"], deck["lastNotificationDate"]
                )

    async def get_active_subscribers(self):
        """
        Gets all approved subscribers that allow notifications
        """
        api_url = f"{BACKEND_SERVICE_API_URL}/api/v1/subscribers"
        response = requests.get(api_url, {"isApproved": "1", "allowNotifications": "1"})
        response.raise_for_status()
        response_json: dict = response.json()
        return response_json["data"]

    async def get_active_decks(self, subscriber_id: str):
        """
        Retrieves all active decks from a subscriber
        """
        api_url = f"{BACKEND_SERVICE_API_URL}/api/v1/subscribers/{subscriber_id}/decks"
        response = requests.get(api_url, {"isActive": "1"})
        response.raise_for_status()
        response_json: dict = response.json()
        return response_json["data"]

    async def get_matched_messages(
        self,
        chat_ids: list[str],
        keywords: list[str],
        last_notified_timestamp: str | None,
    ):
        """
        Retrieves all messages that match the specified chat_ids, keywords
        and after last notified timestamp. If the last notified timestamp
        is None or <24hrs ago, it is set to match any messages from the last
        24 hrs
        """
        print(chat_ids, keywords, last_notified_timestamp)
