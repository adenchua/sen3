import asyncio
import os
from dotenv import load_dotenv

from telegram.ChannelService import ChannelService

# load environment keys
load_dotenv()
API_ID: int = os.getenv("TELEGRAM_API_ID", -1)
API_HASH: str = os.getenv("TELEGRAM_API_HASH", "")


async def run():
    telegram_service = ChannelService(API_ID, API_HASH)
    # channel = await telegram_service.get_channel("")
    # channel_exists = await telegram_service.channel_exists("")


if __name__ == "__main__":
    asyncio.run(run())
