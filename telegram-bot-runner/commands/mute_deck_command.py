from telegram import Update
from telegram.ext import (
    ContextTypes,
    ConversationHandler,
    CommandHandler,
    CallbackQueryHandler,
)

from api_client import api_patch
from api_routes import deck_url
from commands.conversation_helpers import (
    build_deck_keyboard,
    fetch_approved_subscriber_decks,
    make_cancel,
)


DECK_INPUT = 1


def _make_start(*, muting: bool):
    """
    Return a start handler for mute (muting=True) or unmute (muting=False).

    Fetches only decks eligible for the operation: active decks when muting,
    muted decks when unmuting.
    """
    is_active_filter = "1" if muting else "0"
    empty_message = "No decks are unmuted." if muting else "There are no muted decks."
    prompt = "Please select a deck to mute:" if muting else "Please select a deck to unmute:"

    async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
        """Show eligible decks for mute or unmute selection."""
        user_id = str(update.effective_user.id)
        decks = await fetch_approved_subscriber_decks(
            user_id,
            update,
            context,
            deck_params={"isActive": is_active_filter},
            empty_message=empty_message,
        )
        if decks is None:
            return ConversationHandler.END

        await update.message.reply_text(prompt, reply_markup=build_deck_keyboard(decks))
        return DECK_INPUT

    return start


def _make_deck_input(*, muting: bool):
    """
    Return a deck_input handler for mute (muting=True) or unmute (muting=False).

    Sets isActive to the opposite of muting: False when muting, True when unmuting.
    """
    new_active_state = not muting
    success_message = (
        "Deck muted! You will no longer receive notifications from this deck."
        if muting
        else "Deck unmuted! You will now receive notifications from this deck."
    )

    async def deck_input(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
        """Apply the mute or unmute change to the selected deck."""
        query = update.callback_query
        await query.answer()
        selected_deck_id = query.data

        result = await api_patch(deck_url(selected_deck_id), {"isActive": new_active_state})
        if result is not None:
            await query.edit_message_text(success_message)

        context.user_data.clear()
        return ConversationHandler.END

    return deck_input


mute_deck_conv_handler = ConversationHandler(
    entry_points=[CommandHandler("mutedeck", _make_start(muting=True))],
    states={DECK_INPUT: [CallbackQueryHandler(_make_deck_input(muting=True))]},
    fallbacks=[CommandHandler("cancel", make_cancel("Operation cancelled. No decks muted."))],
)

unmute_deck_conv_handler = ConversationHandler(
    entry_points=[CommandHandler("unmutedeck", _make_start(muting=False))],
    states={DECK_INPUT: [CallbackQueryHandler(_make_deck_input(muting=False))]},
    fallbacks=[CommandHandler("cancel", make_cancel("Operation cancelled. No decks unmuted."))],
)
