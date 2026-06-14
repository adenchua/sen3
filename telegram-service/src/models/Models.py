from datetime import datetime

from pydantic import BaseModel


class Chat(BaseModel):
    """Parsed Telegram chat object"""

    id: int
    about: str | None = None
    created_date: datetime
    participants_count: int | None = None
    is_channel: bool
    is_verified: bool
    title: str
    username: str | None = None


class Message(BaseModel):
    """Parsed Telegram message object"""

    id: int
    chat_id: int
    chat_username: str
    created_date: datetime
    edited_date: datetime | None
    forward_count: int | None
    text: str
    view_count: int | None
