import os

from dotenv import find_dotenv, load_dotenv
from flask import Flask
from flask_cors import CORS


os.environ.setdefault("FLASK_ENV", "production")
if os.getenv("FLASK_ENV") == "development":
    load_dotenv(find_dotenv())

from auth import auth_bp
from chat import chat_bp
from clients import clients_bp
from common import is_development
from health import health_bp
from search import search_bp


def create_app(test_config=None):
    app = Flask(__name__)
    app.config["JSON_SORT_KEYS"] = False
    if test_config:
        app.config.update(test_config)

    CORS(app, origins=os.getenv("CORS_ORIGINS", "*"))

    app.register_blueprint(health_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(clients_bp)

    return app


app = create_app()


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    debug = is_development()

    app.logger.info("Starting Flask server on port %s", port)
    app.run(host="0.0.0.0", port=port, debug=debug)
