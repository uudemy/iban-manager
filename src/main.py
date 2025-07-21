import os
import sys
from dotenv import load_dotenv

# Environment variables yükle
load_dotenv()

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.shared_db import db
from src.routes.user import user_bp
from src.routes.iban import iban_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')

# CORS'u etkinleştir
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(iban_bp, url_prefix='/api')

# Database configuration
database_url = os.getenv('DATABASE_URL')
if database_url:
    # Production: PostgreSQL
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Development: SQLite
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# IBAN modelini import et


db.init_app(app)
with app.app_context():
    from src.models.user import User
    from src.models.iban import IBAN
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

# Health check endpoint
@app.route('/health')
def health_check():
    return {'status': 'healthy', 'message': 'IBAN Manager API is running'}, 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)
