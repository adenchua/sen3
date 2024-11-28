from datetime import datetime

from pydantic import BaseModel


class Channel(BaseModel):
    """Parsed Telegram channel object"""

    id: int
    about: str
    created_date: datetime
    participants_count: int
    is_verified: bool
    title: str
    username: str


class Message(BaseModel):
    """Parsed Telegram message object"""

    id: int
    channel_id: str
    date: datetime
    edit_date: datetime | None
    forward_count: int
    message: str
    reply_count: int
    view_count: int
