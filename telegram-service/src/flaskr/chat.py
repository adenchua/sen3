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
        limit = request.args.get("limit", None)
        reverse = request.args.get("reverse", None)

        limit = limit if limit is None else int(limit)

        chat_service = ChatService(API_ID, API_HASH)
        result = await chat_service.get_chat_messages(
            chat_id=chat_id,
            limit=limit,
            reverse=reverse,
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
