from telegram import Update
from telegram.ext import (
    ContextTypes,
    ConversationHandler,
    CommandHandler,
    CallbackQueryHandler,
)

from api_client import api_delete
from api_routes import deck_url
from commands.conversation_helpers import (
    build_deck_keyboard,
    fetch_approved_subscriber_decks,
    make_cancel,
)


DECK_INPUT = 1


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Show the subscriber's decks so they can select one to delete."""
    user_id = str(update.effective_user.id)
    decks = await fetch_approved_subscriber_decks(
        user_id,
        update,
        context,
        empty_message="There are no available decks.",
    )
    if decks is None:
        return ConversationHandler.END

    await update.message.reply_text(
        "Please select a deck to delete:", reply_markup=build_deck_keyboard(decks)
    )
    return DECK_INPUT


async def deck_input(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Delete the selected deck and confirm to the subscriber."""
    query = update.callback_query
    await query.answer()
    selected_deck_id = query.data

    success = await api_delete(deck_url(selected_deck_id))
    if success:
        await query.edit_message_text("Deck deleted successfully")

    context.user_data.clear()
    return ConversationHandler.END


delete_deck_conv_handler = ConversationHandler(
    entry_points=[CommandHandler("deletedeck", start)],
    states={DECK_INPUT: [CallbackQueryHandler(deck_input)]},
    fallbacks=[CommandHandler("cancel", make_cancel("Operation cancelled. No decks deleted."))],
)
