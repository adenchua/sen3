from flask import Flask, jsonify
from dotenv import load_dotenv
import os

from flaskr import chat

# load environment keys
load_dotenv()
PORT_NUMBER: int = os.getenv("TELEGRAM_SERVICE_PORT", 5000)


def create_app():
    # create and configure the app
    app = Flask(__name__)

    @app.errorhandler(404)
    def resource_not_found(e):
        return jsonify(error=str(e)), 404

    app.register_error_handler(404, resource_not_found)

    # chats route
    app.register_blueprint(chat.blueprint, url_prefix="/api/v1/chats")
    return app


if __name__ == "__main__":
    create_app().run(host="0.0.0.0", port=PORT_NUMBER, debug=True)
