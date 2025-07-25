from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

from constants import TELEGRAM_BOT_API_TOKEN
from commands.start_command import start
from commands.subscribe_command import subscribe
from commands.unsubscribe_command import unsubscribe
from commands.modify_deck_keywords_command import modify_keywords_conv_handler
from commands.mute_deck_command import mute_deck_conv_handler
from commands.unmute_deck_command import unmute_deck_conv_handler
from commands.new_deck_command import new_deck_conv_handler
from commands.delete_deck_command import delete_deck_conv_handler


app = ApplicationBuilder().token(TELEGRAM_BOT_API_TOKEN).build()


async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE) -> None:
    # Log the error before doing anything else
    print(f"Exception while handling an update: {context.error}")

    # Optionally notify the user or admin
    if update and hasattr(update, "message") and update.message:
        await update.message.reply_text(
            "An unexpected error occurred. Please try again later."
        )


# all available bot commands
app.add_handler(CommandHandler("start", start))
app.add_handler(CommandHandler("subscribe", subscribe))
app.add_handler(CommandHandler("unsubscribe", unsubscribe))
app.add_handler(modify_keywords_conv_handler)
app.add_handler(mute_deck_conv_handler)
app.add_handler(unmute_deck_conv_handler)
app.add_handler(new_deck_conv_handler)
app.add_handler(delete_deck_conv_handler)

# Register the error handler
app.add_error_handler(error_handler)

app.run_polling()
