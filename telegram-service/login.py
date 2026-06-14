"""
One-time interactive login that produces a portable Telegram StringSession.

Run this once on any machine (a dev laptop, or a throwaway Docker container),
complete the phone + OTP prompt, then copy the printed string into the
TELEGRAM_SESSION_STRING environment variable on the server. A StringSession is
not bound to the machine that created it, so the production server never needs
Python or an interactive login.

Example (inside Docker, no host Python required):
    docker compose -f docker-compose.local.yml run --rm -it telegram-service \\
        python login.py
"""

import os

from dotenv import load_dotenv
from telethon import TelegramClient
from telethon.sessions import StringSession


def main() -> None:
    """
    Logs in interactively and prints a StringSession for TELEGRAM_SESSION_STRING.

    Reads TELEGRAM_API_ID / TELEGRAM_API_HASH from the environment, prompts for
    the phone number and OTP via Telethon's start() flow, then prints the saved
    session string. Returns nothing.
    """
    load_dotenv()
    api_id = int(os.getenv("TELEGRAM_API_ID", -1))
    api_hash = os.getenv("TELEGRAM_API_HASH", "")

    if api_id == -1 or not api_hash:
        raise SystemExit(
            "TELEGRAM_API_ID/TELEGRAM_API_HASH must be set before running login.py"
        )

    with TelegramClient(StringSession(), api_id, api_hash) as client:
        session_string = StringSession.save(client.session)
        print("\nLogin successful. Copy the line below into your environment:\n")
        print(f"TELEGRAM_SESSION_STRING={session_string}\n")


if __name__ == "__main__":
    main()
