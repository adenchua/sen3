import logging
import os

from dotenv import load_dotenv
from flask import Blueprint, abort, make_response, request

from telegram.ChatService import ChatService, RateLimitedError
from .responsewrapper import wrap_error, wrap_response

logger = logging.getLogger(__name__)

blueprint = Blueprint("chat", __name__)

# load environment keys
load_dotenv()
API_ID: int = int(os.getenv("TELEGRAM_API_ID", -1))
API_HASH: str = os.getenv("TELEGRAM_API_HASH", "")

if API_ID == -1 or not API_HASH:
    logger.warning(
        "TELEGRAM_API_ID/TELEGRAM_API_HASH are not set; "
        "Telegram requests will fail until credentials are provided"
    )


def is_true(value):
    """Parses a query-string boolean, returning True only for the string 'true'."""
    return value.lower() == "true"


def parse_int_param(name, default):
    """
    Reads an integer query parameter, returning default when it is absent.

    Aborts with HTTP 400 when the parameter is present but not a valid integer,
    so malformed input is not misreported as a missing chat (404).
    """
    raw_value = request.args.get(name, default=None)
    if raw_value is None:
        return default
    try:
        return int(raw_value)
    except ValueError:
        abort(400, f'query parameter "{name}" must be an integer')


def rate_limited_response(error):
    """Builds a 429 response with a Retry-After header from a RateLimitedError."""
    response = make_response(
        wrap_error("rate limited by Telegram, try again later", 429), 429
    )
    response.headers["Retry-After"] = str(error.retry_after_seconds)
    return response


@blueprint.route("/<chat_username>", methods=["GET"])
async def get_chat(chat_username):
    try:
        chat_service = ChatService(API_ID, API_HASH)
        result = await chat_service.get_chat(chat_username)
        return wrap_response(result)
    except RateLimitedError as error:
        return rate_limited_response(error)
    except ValueError:
        # invalid username or link
        logger.info('chat "%s" does not exist', chat_username)
        abort(404, f'chat with "{chat_username}" does not exist')
    except Exception as error:
        logger.exception('failed to fetch chat "%s": %s', chat_username, error)
        abort(500)


@blueprint.route("/<chat_username>/messages", methods=["GET"])
async def get_chat_messages(chat_username):
    limit = parse_int_param("limit", 10)
    offset_id = parse_int_param("offset_id", 0)
    reverse = request.args.get("reverse", default=True, type=is_true)

    try:
        chat_service = ChatService(API_ID, API_HASH)
        result = await chat_service.get_chat_messages(
            chat_username=chat_username,
            limit=limit,
            reverse=reverse,
            offset_id=offset_id,
        )
        return wrap_response(result)
    except RateLimitedError as error:
        return rate_limited_response(error)
    except ValueError:
        # invalid username or link
        logger.info('chat "%s" does not exist', chat_username)
        abort(404, f'chat with "{chat_username}" does not exist')
    except Exception as error:
        logger.exception('failed to fetch messages for "%s": %s', chat_username, error)
        abort(500)


@blueprint.route("/<chat_username>/recommendations", methods=["GET"])
async def get_chat_recommendations(chat_username):
    try:
        chat_service = ChatService(API_ID, API_HASH)
        result = await chat_service.get_recommended_chats(chat_username)
        return wrap_response(result)
    except RateLimitedError as error:
        return rate_limited_response(error)
    except ValueError:
        # invalid username or link
        logger.info('chat "%s" does not exist', chat_username)
        abort(404, f'chat with "{chat_username}" does not exist')
    except Exception as error:
        logger.exception(
            'failed to fetch recommendations for "%s": %s', chat_username, error
        )
        abort(500)
