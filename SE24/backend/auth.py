"""
Dit bestand bevat de blueprint voor authenticatie, al het toestemming
gerelateerd.
"""

from flask import Blueprint, g, request, jsonify, redirect, url_for

from flask_login import (
    LoginManager,
    login_user,
    logout_user,
    login_required,
    current_user,
)
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_caching import Cache
from backend.db_models import db, User
import re


# De andere code gebruikte een andere library hiervoor, maar dit vereist geen
# extra installaties. Geen idee wat beter is.
# from werkzeug.security import check_password_hash, generate_password_hash

bp = Blueprint("auth", __name__)
login_manager = LoginManager()
cache = Cache()

# Set the login view to redirect to the login page
login_manager.login_view = "auth.login_post"


@login_manager.unauthorized_handler
def unauthorized_callback():
    print("func call: unauthorized_callback")
    return redirect(url_for("auth.login_post"))


def check_email(email):
    print("func call: check_email")
    # Define a regular expression for validating an email
    email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return jsonify({"email_valid": (re.match(email_regex, email) is not None)})


@bp.post("/api/register")
def register_post():
    """
    Deze functie handelt registraties af.
    """
    print("func call: register_post")
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "Missing fields."}), 401

    # Een todo dus. Mijn eigen html template handelt emails al af, maar wat
    # doen we met whitespaces? Hoe wordt het afgehandeld als de wachtwoorden
    # niet overeen komen?
    if not check_email(email):
        return jsonify({"message": "Invalid email."}), 401

    # Check for duplicate email
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered."}), 401

    try:
        # Create new user
        new_user = User(
            name=name, email=email, password=generate_password_hash(password)
        )
        db.session.add(new_user)
        db.session.commit()

        print(new_user.id)
        login_user(new_user)

        # Cache the user
        cache.set(f"user{new_user.id}", new_user, timeout=300)

        return jsonify({"message": "Registered!"}), 200

    except Exception:
        db.session.rollback()
        return jsonify({"message": "Registration failed."}), 500


@login_manager.user_loader
def user_loader(user_id):
    print("func call: user_loader")
    user = cache.get(f"user{user_id}")
    if user is None:
        user = User.query.get(int(user_id))
        if user.is_authenticated:
            cache.set(f"user{user_id}", user, timeout=300)
    return user


@bp.route("/api/print_db")
def print_db():
    print("func call: print_db")
    from .db import School, MC_Option

    data = {}
    print(db)

    # Query and print School data
    schools = School.query.all()
    data["schools"] = [
        {"id": s.id, "name": s.name, "country": s.country} for s in schools
    ]

    # Query and print User data
    users = User.query.all()
    data["users"] = [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "authority": u.authority,
            "school_id": u.school_id,
        }
        for u in users
    ]

    # Query and print MC_Question data
    questions = Question.query.all()
    data["questions"] = [
        {
            "id": que.id,
            "title": que.title,
            "q": que.q,
            "code": que.code,
            "deadline": que.deadline,
        }
        for que in questions
    ]

    # Query and print MC_Option data
    options = MC_Option.query.all()
    data["options"] = [
        {
            "id": o.id,
            "option_text": o.option_text,
            "explanation": o.explanation,
            "is_correct": o.is_correct,
            "question_id": o.question_id,
        }
        for o in options
    ]

    # Print to console (optional)
    print(data)

    # Return as JSON response for easier reading in a browser
    return jsonify(data)


@bp.route("/api/login", methods=["POST", "GET"])
def login_post():
    """
    Deze functie handelt het inloggen af.
    """
    print("func call: login_post")
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    # Ook weer de vraag wat er met errors word gedaan.
    if user is None:
        print("no user")
        return jsonify({"message": "that user was not found."}), 401
    elif not check_password_hash(user.password, password):
        print("bad password")
        return jsonify({"message": "incorrect password."}), 401
    else:
        print("success!")
        login_user(user)
        cache.set(f"user{user.id}", user, timeout=300)
        return jsonify({"message": "Logged in!"}), 200


@bp.post("/api/logout")
def logout_post():
    print("func call: logout_post")
    if current_user.is_authenticated:
        cache.delete(f"user{current_user.id}")
        logout_user()
    return jsonify({"logged_out": True}), 200


@bp.get("/api/name")
@login_required
def user_name():
    print("func call: user_name")
    return jsonify(f"{current_user.name}")


@bp.get("/api/authenticate")
def check_auth():
    print("func call: check_auth")
    if current_user.is_authenticated:
        print("Flask: authenticated!")
        return jsonify({"logged_in": True})
    else:
        print("Flask: not authenticated!")
        return jsonify({"logged_in": False})

@bp.get("/api/is_teacher")
def is_teacher():
    if current_user.is_anonymous:
        return jsonify({"isTeacher": False}), 401
    user = db.session.query(User).get(current_user.id)  # Get the user from the database
    if user is None:
        return jsonify({"isTeacher": False}), 404
    print(f"is teacher: {user.authority > 0}")
    return jsonify({"isTeacher": user.authority > 0})


# before_app_request zorgt ervoor dat het in alle gevallen word uitgevoerd.
@bp.before_app_request
def load_logged_in_user():
    print("func call: load_logged_in_user")
    g.user = current_user if current_user.is_authenticated else None


# Create an endpoint to fetch the current user's data
@bp.route("/api/user", methods=["GET"])
@login_required
def get_user():
    user = {"id": current_user.id, "name": current_user.name}
    return jsonify(user)
