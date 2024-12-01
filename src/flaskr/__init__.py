from flask import Flask


def create_app():
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    from . import channel

    # channels route
    app.register_blueprint(channel.blueprint, url_prefix="/api/v1/channels")

    return app
