from telethon import TelegramClient, functions
from telethon.tl.types import messages


class ChannelService:
    def __init__(self, api_id: int, api_hash: str):
        self.telegram_client: TelegramClient = TelegramClient("anon", api_id, api_hash)

    async def get_channel(self, channel_id: str):
        """
        Given a channel id (chat username), return a telegram Channel object
        """
        try:
            client: TelegramClient
            async with self.telegram_client as client:
                response: messages.ChatFull = await client(
                    functions.channels.GetFullChannelRequest(channel=channel_id)
                )
                channel = response.chats[0]
                channel_full = response.full_chat

                return {
                    "id": channel_full.id,
                    "about": channel_full.about,
                    "participants_count": channel_full.participants_count,
                    "username": channel.username,
                    "is_verified": channel.verified,
                    "title": channel.title,
                    "created_date": channel.date,
                }
        except Exception as error:
            print(f"Error: {error}")

    async def get_channel_messages(self, channel_id: str):
        pass

    async def channel_exists(self, channel_id: str) -> bool:
        """
        Given a channel id, return True if the channel is valid
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

    async def get_recommended_channels(self, channel_id: str):
        pass
