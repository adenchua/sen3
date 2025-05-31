from telegram import Update
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    ContextTypes,
    CallbackQueryHandler,
)

from constants import TELEGRAM_BOT_API_TOKEN
from commands.start_command import start
from commands.subscribe_command import subscribe
from commands.unsubscribe_command import unsubscribe
from commands.modify_deck_keywords_command import modify_keywords_conv_handler


app = ApplicationBuilder().token(TELEGRAM_BOT_API_TOKEN).build()


# all available bot commands
app.add_handler(CommandHandler("start", start))
app.add_handler(CommandHandler("subscribe", subscribe))
app.add_handler(CommandHandler("unsubscribe", unsubscribe))
app.add_handler(modify_keywords_conv_handler)

app.run_polling()
