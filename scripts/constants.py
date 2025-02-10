from dotenv import load_dotenv
import os

# load environment keys
load_dotenv()
BACKEND_SERVICE_API_URL: str = os.getenv("BACKEND_SERVICE_API_URL", "")
TELEGRAM_SERVICE_API_URL: str = os.getenv("TELEGRAM_SERVICE_API_URL", "")

CHAT_MESSAGES_INTERVAL_MINUTES: int = os.getenv("CHAT_MESSAGES_INTERVAL_MINUTES", 0)
CHAT_INTERVAL_DAYS: int = os.getenv("CHAT_INTERVAL_DAYS", 0)
SUB_NOTIFICATIONS_INTERVAL_MINUTES: int = os.getenv(
    "SUB_NOTIFICATIONS_INTERVAL_MINUTES", 0
)

TELEGRAM_BOT_API_TOKEN: str = os.getenv("TELEGRAM_BOT_API_TOKEN", "")
