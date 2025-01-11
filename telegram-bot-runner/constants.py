from dotenv import load_dotenv
import os

# load environment keys
load_dotenv()
TELEGRAM_BOT_API_TOKEN: str = os.getenv("TELEGRAM_BOT_API_TOKEN", "")
BACKEND_SERVICE_API_URL: str = os.getenv("BACKEND_SERVICE_API_URL", "")
