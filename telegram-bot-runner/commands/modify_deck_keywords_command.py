import inspect

from telegram import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    Update,
)
from telegram.ext import (
    ContextTypes,
    ConversationHandler,
    CommandHandler,
    MessageHandler,
    filters,
    CallbackQueryHandler,
)

from api_client import api_get, api_patch
from api_routes import deck_url
from commands.conversation_helpers import (
    build_deck_keyboard,
    fetch_approved_subscriber_decks,
    make_cancel,
)
from utils.validationHelper import (
    is_safe_opensearch_query_string,
    format_keywords,
    clean_and_join,
)


KEYWORD_INPUT, CONFIRMATION, END = range(3)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Show the subscriber's decks so they can select one to modify keywords for."""
    user_id = str(update.effective_user.id)
    decks = await fetch_approved_subscriber_decks(
        user_id,
        update,
        context,
        empty_message="There are no decks to modify.",
    )
    if decks is None:
        return ConversationHandler.END

    await update.message.reply_text(
        "Please select a deck:", reply_markup=build_deck_keyboard(decks)
    )
    return KEYWORD_INPUT


async def keyword_input(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Display the selected deck's current keywords and prompt for new ones."""
    query = update.callback_query
    await query.answer()
    selected_deck_id = query.data
    context.user_data["deck_id"] = selected_deck_id

    deck_data = await api_get(deck_url(selected_deck_id))
    if deck_data is None:
        return ConversationHandler.END

    deck: dict = deck_data.get("data", {})
    deck_keywords: list[str] = deck.get("keywords", [])
    deck_title = deck.get("title", "Untitled")

    stringified_keywords = ", ".join(deck_keywords)
    keyword_display_text = (
        f"Current keywords: \n{format_keywords(stringified_keywords)}"
        if len(deck_keywords) > 0
        else "There are currently no keywords set for this deck"
    )

    reply_message = inspect.cleandoc(
        f"Deck selected: {deck_title}\n\n"
        f"{keyword_display_text}\n\n"
        f"Please type in the new keywords, each keyword separated with a comma\n\n"
        f"Allowed characters:\n- Letters (a-z, A-Z)\n- Numbers (0-9)\n- Spaces\n- Basic punctuation: comma (,), period (.), hyphen (-), underscore (_)\n\n"
        f"To cancel anytime, use the /cancel command!\n\n"
    )

    if len(deck_keywords) > 0:
        await update.callback_query.message.reply_text(
            "For convenience, these are the previous keywords for you to copy and modify:"
        )
        await update.callback_query.message.reply_text(stringified_keywords)

    await query.edit_message_text(text=reply_message)
    return CONFIRMATION


async def confirmation(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Validate the keyword input and ask the subscriber to confirm the changes."""
    user_input = update.message.text.strip()

    if not is_safe_opensearch_query_string(user_input):
        reply_message = inspect.cleandoc(
            f"Invalid keywords detected!\n\n"
            f"Please type in the new keywords, each keyword separated with a comma\n\n"
            f"Allowed characters:\n- Letters (a-z, A-Z)\n- Numbers (0-9)\n- Spaces\n- Basic punctuation: comma (,), period (.), hyphen (-), underscore (_)\n\n"
        )
        await update.message.reply_text(reply_message)
        return CONFIRMATION

    context.user_data["keywords"] = clean_and_join(user_input)

    confirm_keyboard = InlineKeyboardMarkup(
        [
            [
                InlineKeyboardButton("Yes", callback_data="Y"),
                InlineKeyboardButton("No", callback_data="N"),
            ]
        ]
    )
    reply_message = (
        f"Your input keywords: \n{format_keywords(user_input)}\n\n Confirm changes?"
    )
    await update.message.reply_text(reply_message, reply_markup=confirm_keyboard)
    return END


async def end(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Apply the confirmed keyword changes to the deck, or cancel if the subscriber declined."""
    query = update.callback_query
    await query.answer()
    user_confirmation = query.data
    selected_deck_id = context.user_data["deck_id"]
    updated_keywords = context.user_data["keywords"]

    if user_confirmation.upper() == "Y":
        result = await api_patch(
            deck_url(selected_deck_id),
            {
                "keywords": updated_keywords.split(","),
                "isActive": True,
            },
        )
        if result is not None:
            await query.edit_message_text("Deck updated with the new keywords!")
    else:
        await query.edit_message_text("Operation cancelled. No decks modified")

    context.user_data.clear()
    return ConversationHandler.END


modify_keywords_conv_handler = ConversationHandler(
    entry_points=[CommandHandler("modifykeywords", start)],
    states={
        KEYWORD_INPUT: [CallbackQueryHandler(keyword_input)],
        CONFIRMATION: [MessageHandler(filters.TEXT & ~filters.COMMAND, confirmation)],
        END: [CallbackQueryHandler(end)],
    },
    fallbacks=[CommandHandler("cancel", make_cancel("Operation cancelled. No decks modified."))],
)
