import asyncio
import logging
import os
import threading
from typing import Awaitable, TypeVar

from telethon import TelegramClient
from telethon.sessions import StringSession

logger = logging.getLogger(__name__)

ReturnType = TypeVar("ReturnType")

# Module-level singletons. A single Telethon client is created once per worker
# process and kept connected for the lifetime of the process, instead of being
# rebuilt on every request. Telethon binds a client to the asyncio event loop it
# connected on, so the client lives on a dedicated background loop running in its
# own daemon thread; request handlers schedule coroutines onto that loop.
_background_loop: asyncio.AbstractEventLoop | None = None
_client: TelegramClient | None = None
_init_lock = threading.Lock()


def _start_background_loop() -> asyncio.AbstractEventLoop:
    """
    Starts a dedicated asyncio event loop in a daemon thread and returns it.

    The loop runs forever in the background so the long-lived Telegram client can
    stay connected on a single, stable event loop across many requests.
    """
    background_loop = asyncio.new_event_loop()

    def run_loop() -> None:
        """Runs the background event loop until the process exits."""
        asyncio.set_event_loop(background_loop)
        background_loop.run_forever()

    loop_thread = threading.Thread(
        target=run_loop, name="telegram-client-loop", daemon=True
    )
    loop_thread.start()
    return background_loop


async def _create_connected_client() -> TelegramClient:
    """
    Builds a Telegram client from the StringSession env var and connects it.

    Reads TELEGRAM_API_ID / TELEGRAM_API_HASH / TELEGRAM_SESSION_STRING, connects
    the client (without any interactive prompt) and verifies the session is
    authorized. Returns the connected client. Raises RuntimeError when the
    credentials or session string are missing or the session is not authorized,
    so the failure surfaces clearly at startup instead of mid-request.
    """
    api_id = int(os.getenv("TELEGRAM_API_ID", -1))
    api_hash = os.getenv("TELEGRAM_API_HASH", "")
    session_string = os.getenv("TELEGRAM_SESSION_STRING", "")

    if api_id == -1 or not api_hash:
        raise RuntimeError(
            "TELEGRAM_API_ID/TELEGRAM_API_HASH are not set; "
            "cannot create the Telegram client"
        )
    if not session_string:
        raise RuntimeError(
            "TELEGRAM_SESSION_STRING is not set; generate one with login.py "
            "and place it in the environment"
        )

    client = TelegramClient(StringSession(session_string), api_id, api_hash)
    await client.connect()
    if not await client.is_user_authorized():
        raise RuntimeError(
            "TELEGRAM_SESSION_STRING is invalid or expired; "
            "regenerate it with login.py"
        )
    logger.info("Telegram client connected and authorized")
    return client


def get_client() -> TelegramClient:
    """
    Returns the shared, connected Telegram client, creating it on first use.

    Initialization is guarded by a lock so concurrent first requests create only
    one client and one background loop. Returns a connected, authorized client.
    """
    global _background_loop, _client

    if _client is not None:
        return _client

    with _init_lock:
        if _client is None:
            _background_loop = _start_background_loop()
            future = asyncio.run_coroutine_threadsafe(
                _create_connected_client(), _background_loop
            )
            _client = future.result()
    return _client


def run_on_loop(coroutine: Awaitable[ReturnType]) -> ReturnType:
    """
    Runs a coroutine on the client's background loop and returns its result.

    Ensures the shared client (and its loop) are initialized, schedules the
    coroutine on that loop, and blocks until it completes so synchronous Flask
    views can drive the async Telegram client. Returns the coroutine's result.
    """
    get_client()
    assert _background_loop is not None
    future = asyncio.run_coroutine_threadsafe(coroutine, _background_loop)
    return future.result()
