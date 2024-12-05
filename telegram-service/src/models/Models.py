from datetime import datetime

from pydantic import BaseModel


class Chat(BaseModel):
    """Parsed Telegram chat object"""

    id: int
    about: str
    created_date: datetime
    participants_count: int
    is_channel: bool
    is_verified: bool
    title: str
    username: str


class Message(BaseModel):
    """Parsed Telegram message object"""

    id: int
    chat_id: str
    date: datetime
    edit_date: datetime | None
    forward_count: int
    message: str
    view_count: int
