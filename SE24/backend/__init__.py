"""
Dit bestand roept alles aan. De daadwerkelijke implementatie moet elders staan.
"""

import os
from secrets import token_urlsafe


from flask import (
    Flask,
    current_app,
    send_from_directory,
)
from flask_cors import CORS


def create_app(test_config=None):
    """
    Dit wordt online een application factory genoemd. Als het goed is maakt het
    de code meer scalable.
    """
    # Initialize Flask. __name__ is handig zo, de instance_relative_config
    # maakt als het goed is dat hij standaard in de instance folder staat.
    # Uncomment de print hieronder om te kijken waar het precies is.
    app = Flask(
        __name__,
        instance_relative_config=True,
        static_folder="../frontend/build",
        static_url_path="/",
    )
    # Nodig voor communicatie met react?
    CORS(app, supports_credentials=True)


    # Als het goed is is dit mooier in een config.py, maar voorlopig voor het
    # gemak maar hier.
    app.config.from_mapping(
        SECRET_KEY=token_urlsafe(32),
        SQLALCHEMY_DATABASE_URI="sqlite:///database.db",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        CACHE_TYPE="SimpleCache",
    )

    # Maakt cookies encrypted als het goed is.
    app.config["SESSION_COOKIE_SECURE"] = True

    # Ik heb deze if else van de tutorial over genomen. Hij is nu nog niet
    # nodig.
    if test_config is None:
        app.config.from_pyfile("config.py", silent=True)
    else:
        app.config.from_mapping(test_config)

    # Mocht de instance folder niet bestaan dan word hij hier aangemaakt, flask
    # doet dat namelijk niet
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Enkel voor tests. Kan verwijderd worden met production.
    @app.get("/hello")
    def hello():
        return "Hello, World!"

    def serve_index():
        """
        This function serves the static files. Should only be needed during
        testing, outside of that this is an nginx job
        """
        return send_from_directory(current_app.static_folder, "index.html")

    # Needed for testing, will never run during production.
    @app.get("/")
    def index_get():
        print("func call: index_get()")
        return serve_index()

    @app.get("/login")
    def login_get():
        print("func call: login_get()")
        return serve_index()

    # Hier worden de database en de blueprints geimporteerd. Ik weet niet zeker
    # waarom de imports hier staan en niet bovenaan, maar zo was het in de
    # tutorial.

    from backend import db_models
    from backend import auth
    from backend import profile
    from backend import question_view
    from backend import courses
    from backend import question_create
    from .find_lang import init_find_lang

    init_find_lang()
    db_models.db.init_app(app)
    with app.app_context():
        db_models.db.create_all()
        db_models.db.session.commit()
        
    app.register_blueprint(auth.bp)
    app.register_blueprint(profile.bp)
    app.register_blueprint(question_view.bp)
    app.register_blueprint(courses.bp)
    app.register_blueprint(question_create.bp)
    auth.login_manager.init_app(app)
    auth.cache.init_app(app)

    return app
