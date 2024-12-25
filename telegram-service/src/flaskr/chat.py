import logging
import os

from dotenv import load_dotenv
from flask import Blueprint, abort, request

from telegram.ChatService import ChatService

from .responsewrapper import wrap_response

blueprint = Blueprint("chat", __name__)

# load environment keys
load_dotenv()
API_ID: int = os.getenv("TELEGRAM_API_ID", -1)
API_HASH: str = os.getenv("TELEGRAM_API_HASH", "")

def is_true(value):
  return value.lower() == 'true'


@blueprint.route("/<chat_id>", methods=["GET"])
async def get_chat(chat_id):
    try:
        chat_service = ChatService(API_ID, API_HASH)
        result = await chat_service.get_chat(chat_id)
        return wrap_response(result)
    except Exception:
        logging.exception("Error occurred for get_chat")
        abort(500)


@blueprint.route("/<chat_id>/messages", methods=["GET"])
async def get_chat_messages(chat_id):
    try:
        limit = request.args.get("limit", default=None)
        reverse = request.args.get("reverse", default=None, type=is_true)
        offset_id = request.args.get("offset_id", default=None)

        limit = 10 if limit is None else int(limit)
        offset_id = 0 if offset_id is None else int(offset_id)
        reverse = True if reverse is None else bool(reverse)

        chat_service = ChatService(API_ID, API_HASH)
        result = await chat_service.get_chat_messages(
            chat_id=chat_id,
            limit=limit,
            reverse=reverse,
            offset_id=offset_id
        )
        return wrap_response(result)
    except Exception:
        logging.exception("Error occurred for get_chat_messages")
        abort(500)


@blueprint.route("/<chat_id>/recommendations", methods=["GET"])
async def get_chat_recommendations(chat_id):
    try:
        chat_service = ChatService(API_ID, API_HASH)
        result = await chat_service.get_recommended_chats(chat_id)
        return wrap_response(result)
    except Exception:
        logging.exception("Error occurred for get_chat_recommendations")
        abort(500)
