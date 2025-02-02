from telethon import TelegramClient, functions
from telethon.tl.types import Message, MessageService, messages, TypeUsername

from models.Models import Chat
from models.Models import Message as _Message


class ChatService:
    """
    Telegram wrapper class that provides telegram chat related methods
    """

    def __init__(self, api_id: int, api_hash: str):
        self.telegram_client: TelegramClient = TelegramClient("anon", api_id, api_hash)

    def get_active_chat_username(self, usernames: list[TypeUsername]):
        # loop through all usernames, get the first active username
        # and set it as the main username
        for chat_username in usernames:
            if chat_username.active:
                return chat_username.username
        return None

    async def get_chat(self, chat_username: str) -> Chat:
        """
        Retrieves a Telegram chat by the username or invite link or short link
        Returns a telegram Chat object
        """
        client: TelegramClient
        async with self.telegram_client as client:
            response: messages.ChatFull = await client(
                functions.channels.GetFullChannelRequest(channel=chat_username)
            )
            chat = response.chats[0]
            chat_full = response.full_chat

            temp_username: str | None = chat.username
            # some channels have > 1 username, resulting in chat.username to be None
            # telegram stores the usernames as an array in chat.usernames
            if temp_username is None and chat.usernames is not None:
                temp_username = self.get_active_chat_username(chat.usernames)

            result = Chat(
                id=chat_full.id,
                about=chat_full.about,
                participants_count=chat_full.participants_count,
                username=temp_username,
                is_channel=chat.broadcast,
                is_verified=chat.verified,
                title=chat.title,
                created_date=chat.date,
            )
            return result.model_dump()

    async def get_chat_messages(
        self,
        chat_username: str,
        offset_id: int | None = 0,
        reverse: bool | None = True,
        limit: int | None = 10,
    ) -> list[_Message]:
        """
        Fetches messages from a chat.

        If an offset_id is provided with reverse set to True,
        messages will be fetched from that offset id.(not including the offset_id)
        e.g. if offset_id of 0 is provided with a limit of 3, messages of id 1,2,3 will be returned

        To obtain the latest messages from a chat, set the reverse parameter to False.
        """
        client: TelegramClient
        async with self.telegram_client as client:
            response: list[Message | MessageService] = await client.get_messages(
                entity=chat_username,
                limit=limit if limit is not None else 10,
                offset_id=offset_id if offset_id is not None else 0,
                reverse=reverse if reverse is not None else True,
            )
            result: list[_Message] = []

            # process the response
            # filter non Messages such as announcements/chat edit
            # parse message
            for message in response:
                # MessageService is returned by the client in the array, need to filter out
                if isinstance(message, Message):
                    temp = _Message(
                        chat_id=message.peer_id.channel_id,
                        chat_username=chat_username,
                        id=message.id,
                        created_date=message.date,
                        text=message.message,
                        view_count=message.views,
                        forward_count=message.forwards,
                        edited_date=message.edit_date,
                    )
                    result.append(temp.model_dump())

            return result

    async def get_recommended_chats(self, chat_username: str) -> list[Chat]:
        """
        Returns a list of recommended chat ids for a given chat

        Recommendations are given by telegram and usually 10 chats will be recommended
        """
        client: TelegramClient
        async with self.telegram_client as client:
            response: messages.Chats = await client(
                functions.channels.GetChannelRecommendationsRequest(
                    channel=chat_username
                )
            )

            result: list[Chat] = []

            for chat in response.chats:
                temp_username: str = chat.username
                # some channels have > 1 username, resulting in chat.username to be None
                # telegram stores the usernames as an array in chat.usernames
                if temp_username is None and chat.usernames is not None:
                    temp_username = self.get_active_chat_username(chat.usernames)

                temp_chat = await self.get_chat(temp_username)
                result.append(temp_chat)

            return result
