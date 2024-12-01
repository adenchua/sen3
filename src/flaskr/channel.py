import os

from dotenv import load_dotenv
from flask import Blueprint, request

from telegram.ChannelService import ChannelService

from .responsewrapper import wrap_response

blueprint = Blueprint("channel", __name__)

# load environment keys
load_dotenv()
API_ID: int = os.getenv("TELEGRAM_API_ID", -1)
API_HASH: str = os.getenv("TELEGRAM_API_HASH", "")


@blueprint.route("/<channel_id>", methods=["GET"])
async def get_channel(channel_id):
    channel_service = ChannelService(API_ID, API_HASH)
    result = await channel_service.get_channel(channel_id)
    return wrap_response(result)


@blueprint.route("/<channel_id>/messages", methods=["GET"])
async def get_channel_messages(channel_id):
    limit = request.args.get("limit", None)
    reverse = request.args.get("reverse", None)

    limit = limit if limit is None else int(limit)

    channel_service = ChannelService(API_ID, API_HASH)
    result = await channel_service.get_channel_messages(
        channel_id=channel_id,
        limit=limit,
        reverse=reverse,
    )
    return wrap_response(result)


@blueprint.route("/<channel_id>/recommended", methods=["GET"])
async def get_channel_recommendations(channel_id):
    channel_service = ChannelService(API_ID, API_HASH)
    result = await channel_service.get_recommended_channels(channel_id)
    return wrap_response(result)
