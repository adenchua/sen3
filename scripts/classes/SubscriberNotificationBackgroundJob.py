import requests
import asyncio
from requests.exceptions import HTTPError
import logging

from constants import BACKEND_SERVICE_API_URL
from utils.date_helper import adjust_to_24_hours_ago, get_current_datetime_iso
from .NotificationService import NotificationService

logging.basicConfig(
    format="{asctime} - {levelname} - {message}",
    style="{",
    datefmt="%Y-%m-%d %H:%M",
    level=logging.INFO,
)


class SubscriberNotificationBackgroundJob:
    def __init__(self, interval_minutes: int):
        self.interval_minutes = interval_minutes

    async def run(self):
        """
        - retrieves all active subscribers that allow notitications
        - retrieves all active decks from each subscriber
        - get any matched messages and send it to subscriber
        - update deck notified timestamp
        """
        while True:
            logging.info(f"Running background job to notify subscribers...")
            try:
                notification_service = NotificationService()
                subscribers = await self.get_active_subscribers()
                # for each active subscriber, retrieve their active decks
                for subscriber in subscribers:
                    subscriber_id = subscriber["id"]
                    active_decks = await self.get_active_decks(subscriber_id)
                    # for each active deck, check if any messages matched
                    for deck in active_decks:
                        deck_id = deck["id"]
                        matched_messages = await self.get_matched_messages(
                            deck["chatIds"],
                            deck["keywords"],
                            deck["lastNotificationDate"],
                        )
                        # for each matched text, send to subscriber
                        for matched_message in matched_messages:
                            matched_message_id = matched_message["messageId"]
                            message_content = matched_message["text"]
                            await notification_service.send_message(
                                message_content, subscriber_id
                            )
                            # create a notification stat for the notification sent
                            await self.create_notification_stat(
                                keywords=deck["keywords"],
                                chat_id=matched_message["chatId"],
                                message=message_content,
                                subscriber_id=subscriber_id,
                            )
                            logging.info(
                                f"Sent message {matched_message_id} to subscriber {subscriber_id}"
                            )

                        # only update last notified date of deck if there are matched messages
                        if len(matched_messages) > 0:
                            await self.update_deck(subscriber_id, deck_id)
            except HTTPError as http_error:
                logging.exception(http_error)
            except Exception as error:
                logging.exception(error)
            finally:
                logging.info(
                    f"Background job completed! Sleeping for {self.interval_minutes} minutes..."
                )
                # sleep program for pre-determined interval before the next run
                await asyncio.sleep(60 * self.interval_minutes)

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

    async def update_deck(self, subscriber_id: str, deck_id: str):
        """
        Updates a subscriber deck lastNotificationDate with the current timestamp
        """
        api_url = f"{BACKEND_SERVICE_API_URL}/api/v1/subscribers/{subscriber_id}/decks/{deck_id}"
        response = requests.patch(
            api_url, {"lastNotificationDate": get_current_datetime_iso()}
        )
        response.raise_for_status()

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
        adjusted_timestamp = adjust_to_24_hours_ago(last_notified_timestamp)
        api_url = f"{BACKEND_SERVICE_API_URL}/api/v1/messages"
        response = requests.get(
            api_url,
            {
                "chatIds": ",".join(chat_ids),
                "keywords": ",".join(keywords),
                "createdDateFrom": adjusted_timestamp,
                "size": "100",
            },
        )
        response.raise_for_status()
        response_json: dict = response.json()
        return response_json["data"]

    async def create_notification_stat(
        self, keywords: list[str], message: str, subscriber_id: str, chat_id: str
    ):
        """
        Creates a notification stat object in the database for analytical purposes
        """
        api_url = f"{BACKEND_SERVICE_API_URL}/api/v1/notifications"
        response = requests.post(
            api_url,
            {
                "keywords": keywords,
                "message": message,
                "subscriberId": subscriber_id,
                "chatId": chat_id,
            },
        )
        response.raise_for_status()
