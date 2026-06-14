from flask import Flask
from dotenv import load_dotenv
import os
import logging

from flaskr import chat
from flaskr.responsewrapper import wrap_error

# load environment keys
load_dotenv()
PORT_NUMBER: int = int(os.getenv("TELEGRAM_SERVICE_PORT", 5099))
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")


def create_app():
    # create and configure the app
    app = Flask(__name__)

    # route logging through gunicorn's handlers when running under gunicorn,
    # falling back to a basic config (with an explicit level) otherwise so
    # INFO/WARNING records are not silently dropped
    gunicorn_logger = logging.getLogger("gunicorn.error")
    if gunicorn_logger.handlers:
        logging.basicConfig(
            handlers=gunicorn_logger.handlers, level=gunicorn_logger.level
        )
    else:
        logging.basicConfig(level=LOG_LEVEL)

    @app.errorhandler(400)
    def bad_request(error):
        """Returns a standardized 400 envelope for invalid requests."""
        return wrap_error(error.description, 400), 400

    @app.errorhandler(404)
    def resource_not_found(error):
        """Returns a standardized 404 envelope for missing resources."""
        return wrap_error(error.description, 404), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        """Returns a standardized 500 envelope for unexpected failures."""
        return wrap_error("internal server error", 500), 500

    @app.get("/healthcheck")
    def health_check():
        return {"status": "OK"}

    # chats route
    app.register_blueprint(chat.blueprint, url_prefix="/api/v1/chats")
    return app


if __name__ == "__main__":
    create_app().run(host="0.0.0.0", port=PORT_NUMBER, debug=True)
