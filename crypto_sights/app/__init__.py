from flask import Flask
from flask_cors import CORS
from .routes.main_routes import main_bp
from app.scripts.model import CryptoInsightEngine, COINS
from app.scripts.logger import log_query
import os

base_dir = os.path.dirname(os.path.abspath(__file__))
pickle_path = os.path.join(base_dir, "data", "extracted_text.pickle")
engine = CryptoInsightEngine(pickle_path)

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Attach globals to app config
    app.config["ENGINE"] = engine
    app.config["COINS"] = COINS
    app.config["LOG_QUERY_FUNC"] = log_query

    # Register routes
    from app.routes.main_routes import main_bp
    app.register_blueprint(main_bp)
    return app
