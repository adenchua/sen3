from flask import Flask


def create_app():
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    from . import chat

    # chats route
    app.register_blueprint(chat.blueprint, url_prefix="/api/v1/chats")

    return app
