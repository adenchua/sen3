from typing import List, Optional, Self

from telethon import TelegramClient, functions
from telethon.tl.types import Message, MessageService, messages

from models.Models import Channel
from models.Models import Message as _Message


class ChannelService:
    """
    Telegram wrapper class that provides telegram channel related methods
    """

    def __init__(self: Self, api_id: int, api_hash: str):
        self.telegram_client: TelegramClient = TelegramClient("anon", api_id, api_hash)

    async def get_channel(self: Self, channel_id: str) -> Channel:
        """
        Returns a telegram Channel object
        """
        try:
            client: TelegramClient
            async with self.telegram_client as client:
                response: messages.ChatFull = await client(
                    functions.channels.GetFullChannelRequest(channel=channel_id)
                )
                channel = response.chats[0]
                channel_full = response.full_chat

                result: Channel = {
                    "id": channel_full.id,
                    "about": channel_full.about,
                    "participants_count": channel_full.participants_count,
                    "username": channel.username,
                    "is_verified": channel.verified,
                    "title": channel.title,
                    "created_date": channel.date,
                }

                return result
        except Exception as error:
            print(f"Error: {error}")

    async def get_channel_messages(
        self: Self,
        channel_id: str,
        offset_id: Optional[int] = 0,
        reverse: Optional[bool] = True,
        limit: Optional[int] = 100,
    ) -> List[_Message]:
        """
        Fetches messages from a channel.

        If an offset_id is provided, messages will be fetched from that offset id.
        e.g. if offset_id of 0 is provided with a limit of 3, messages of id 1,2,3 will be returned

        To obtain the latest messages from a channel, set the reverse parameter to False.
        """
        try:
            client: TelegramClient
            async with self.telegram_client as client:
                response: List[Message | MessageService] = await client.get_messages(
                    entity=channel_id,
                    limit=limit,
                    offset_id=offset_id,
                    reverse=reverse,
                )

                result: List[_Message] = []

                # process the response
                # filter non Messages such as announcements/channel edit
                # parse message
                for message in response:
                    # MessageService is returned by the client in the array, need to filter out
                    if isinstance(message, Message):
                        temp: _Message = {
                            "channel_id": channel_id,
                            "id": message.id,
                            "date": message.date,
                            "message": message.message,
                            "view_count": message.views,
                            "forward_count": message.forwards,
                            "reply_count": message.replies,
                            "edit_date": message.edit_date,
                        }
                        result.append(temp)

                return result
        except Exception as error:
            print(f"Error: {error}")

    async def channel_exists(self: Self, channel_id: str) -> bool:
        """
        Returns True if a telegram channel is valid
        """
        try:
            client: TelegramClient
            async with self.telegram_client as client:
                # throws ValueError if the channel id is invalid
                await client.get_entity(channel_id)
                return True
        except ValueError:
            # Telethon throws ValueError if the channel id is invalid
            return False
        except Exception as error:
            print(f"Error: {error}")

    async def get_recommended_channels(self: Self, channel_id: str) -> List[str]:
        """
        Returns a list of recommended channel ids for a given channel

        Recommendations are given by telegram and usually 10 channels will be recommended
        """
        try:
            client: TelegramClient
            async with self.telegram_client as client:
                response: messages.Chats = await client(
                    functions.channels.GetChannelRecommendationsRequest(
                        channel=channel_id
                    )
                )

                result: List[str] = []

                for channel in response.chats:
                    result.append(channel.username)

                return result
        except Exception as error:
            print(f"Error: {error}")
