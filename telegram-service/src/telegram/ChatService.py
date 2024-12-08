from telethon import TelegramClient, functions
from telethon.tl.types import Message, MessageService, messages

from models.Models import Chat
from models.Models import Message as _Message


class ChatService:
    """
    Telegram wrapper class that provides telegram chat related methods
    """

    def __init__(self, api_id: int, api_hash: str):
        self.telegram_client: TelegramClient = TelegramClient("anon", api_id, api_hash)

    async def get_chat(self, chat_id: str) -> Chat:
        """
        Returns a telegram Chat object
        """
        try:
            client: TelegramClient
            async with self.telegram_client as client:
                response: messages.ChatFull = await client(
                    functions.channels.GetFullChannelRequest(channel=chat_id)
                )
                chat = response.chats[0]
                chat_full = response.full_chat

                result = Chat(
                    id=chat_full.id,
                    about=chat_full.about,
                    participants_count=chat_full.participants_count,
                    username=chat.username,
                    is_channel=chat.broadcast,
                    is_verified=chat.verified,
                    title=chat.title,
                    created_date=chat.date,
                )

                return result.model_dump()
        except Exception as error:
            print(f"Error: {error}")

    async def get_chat_messages(
        self,
        chat_id: str,
        offset_id: int | None = 0,
        reverse: bool | None = True,
        limit: int | None = 100,
    ) -> list[_Message]:
        """
        Fetches messages from a chat.

        If an offset_id is provided, messages will be fetched from that offset id.
        e.g. if offset_id of 0 is provided with a limit of 3, messages of id 1,2,3 will be returned

        To obtain the latest messages from a chat, set the reverse parameter to False.
        """
        client: TelegramClient
        async with self.telegram_client as client:
            response: list[Message | MessageService] = await client.get_messages(
                entity=chat_id,
                limit=limit,
                offset_id=offset_id,
                reverse=reverse,
            )

            result: list[_Message] = []

            # process the response
            # filter non Messages such as announcements/chat edit
            # parse message
            for message in response:
                # MessageService is returned by the client in the array, need to filter out
                if isinstance(message, Message):
                    temp = _Message(
                        chat_id=chat_id,
                        id=message.id,
                        created_date=message.date,
                        text=message.message,
                        view_count=message.views,
                        forward_count=message.forwards,
                        edited_date=message.edit_date,
                    )
                    result.append(temp.model_dump())

            return result

    async def chat_exists(self, chat_id: str) -> bool:
        """
        Returns True if a telegram chat is valid
        """
        try:
            client: TelegramClient
            async with self.telegram_client as client:
                # throws ValueError if the chat id is invalid
                await client.get_entity(chat_id)
                return True
        except ValueError:
            # Telethon throws ValueError if the chat id is invalid
            return False

    async def get_recommended_chats(self, chat_id: str) -> list[str]:
        """
        Returns a list of recommended chat ids for a given chat

        Recommendations are given by telegram and usually 10 chats will be recommended
        """
        client: TelegramClient
        async with self.telegram_client as client:
            response: messages.Chats = await client(
                functions.channels.GetChannelRecommendationsRequest(channel=chat_id)
            )

            result: list[str] = []

            for chat in response.chats:
                result.append(chat.username)

            return result
