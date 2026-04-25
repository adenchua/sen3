from telegram import ReplyKeyboardRemove, Update
from telegram.ext import (
    ContextTypes,
    ConversationHandler,
    CommandHandler,
    CallbackQueryHandler,
)

from api_client import api_get, api_post
from api_routes import (
    subscriber_url,
    subscriber_decks_url,
    deck_templates_url,
    deck_template_url,
    decks_url,
)
from commands.conversation_helpers import build_deck_keyboard, make_cancel
from utils.subscriberHelper import is_subscriber_approved


DECK_TEMPLATE_INPUT = 1


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """
    Show available deck templates to the subscriber.

    Checks subscriber approval, enforces the 5-deck limit,
    and filters out templates the subscriber already has active.
    """
    user_id = str(update.effective_user.id)

    subscriber_data = await api_get(subscriber_url(user_id))
    if subscriber_data is None or not is_subscriber_approved(subscriber_data.get("data")):
        return ConversationHandler.END

    decks_data = await api_get(subscriber_decks_url(user_id))
    if decks_data is None:
        return ConversationHandler.END
    decks: list[dict] = decks_data.get("data", [])

    if len(decks) > 4:
        await update.message.reply_text(
            "Sorry, you have reached the maximum deck limit.",
            reply_markup=ReplyKeyboardRemove(),
        )
        context.user_data.clear()
        return ConversationHandler.END

    templates_data = await api_get(deck_templates_url(), params={"isDeleted": "0"})
    if templates_data is None:
        return ConversationHandler.END
    all_templates: list[dict] = templates_data.get("data", [])

    used_template_ids = {
        deck.get("deckTemplateId")
        for deck in decks
        if deck.get("deckTemplateId") is not None
    }
    available_templates = [
        template for template in all_templates if template["id"] not in used_template_ids
    ]

    if len(available_templates) == 0:
        await update.message.reply_text(
            "Sorry, there are no available decks to add",
            reply_markup=ReplyKeyboardRemove(),
        )
        context.user_data.clear()
        return ConversationHandler.END

    await update.message.reply_text(
        "Please select a new deck:",
        reply_markup=build_deck_keyboard(available_templates),
    )
    return DECK_TEMPLATE_INPUT


async def deck_template_input(
    update: Update, context: ContextTypes.DEFAULT_TYPE
) -> int:
    """Create a new deck from the selected template and notify the subscriber."""
    query = update.callback_query
    user_id = str(update.effective_user.id)
    await query.answer()
    selected_deck_template_id = query.data

    template_data = await api_get(deck_template_url(selected_deck_template_id))
    if template_data is not None:
        deck_template: dict = template_data.get("data", {})
        request_body = {
            "chatIds": deck_template.get("chatIds", []),
            "deckTemplateId": deck_template.get("id"),
            "isActive": True,
            "keywords": [],
            "subscriberId": user_id,
            "title": deck_template.get("title", "Untitled Deck"),
        }
        result = await api_post(decks_url(), request_body)
        if result is not None:
            await query.edit_message_text(
                "Deck created successfully! Use /modifykeywords command to set keywords for your new deck"
            )

    context.user_data.clear()
    return ConversationHandler.END


new_deck_conv_handler = ConversationHandler(
    entry_points=[CommandHandler("newdeck", start)],
    states={DECK_TEMPLATE_INPUT: [CallbackQueryHandler(deck_template_input)]},
    fallbacks=[CommandHandler("cancel", make_cancel("Operation cancelled. No decks created."))],
)
