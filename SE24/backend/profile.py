"""
Dit bestand bevat de blueprint voor authenticatie, al het toestemming
gerelateerd.
"""

from flask import (
    Blueprint,
    flash,
    g,
    redirect,
    request,
    url_for,
    session,
)

from backend.db_models import db, User, MC_Question, OpenQuestion, Course, Assignment, MC_Option
from backend.auth import login_required
from flask import jsonify
from flask_login import current_user

bp = Blueprint("profile", __name__)


@bp.post("/api/profile")
@login_required
def get_questions():
    print("func call: get_questions()")
    mc_questions = MC_Question.query.all()
    open_questions = OpenQuestion.query.all()
    questions = mc_questions + open_questions
    questions_list = [
        {
            "question": q.question,
            "punten": q.points,
            "id": q.id,
            "soortVraag": "Multiple Choice" if q.mp else "Open",
        }
        for q in questions
    ]
    return jsonify(questions_list)


@bp.route("/api/course/<int:question_id>/<string:question_type>/delete_question", methods=["DELETE"])
def delete_question(question_id, question_type):
    if question_type == "Multiple Choice":
        question = MC_Question.query.get(question_id)
        question_mc_options = MC_Option.query.filter_by(question_id=question_id).all()
        for mc_option in question_mc_options:
            db.session.delete(mc_option)
    elif question_type == "Open":
        question = OpenQuestion.query.get(question_id)

    #delete question
    db.session.delete(question)
    db.session.commit()
    return jsonify({"message": "Question deleted successfully"}), 200


@bp.route("/api/user/profile", methods=["GET"])
@login_required
def get_user_profile():
    # Assuming you have some way to identify the current user, e.g., through authentication
    # For demonstration purposes, let's fetch a user with a specific ID (you'll adapt this based on your authentication mechanism)
    user_id = current_user.id  # Replace with actual user identification logic

    user = User.query.get(user_id)

    user_dict = {"name": user.name, "email": user.email}

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user_dict), 200


@bp.route("/api/user/profile", methods=["PUT"])
@login_required
def update_user_profile():
    user_id = current_user.id
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json

    if "name" in data:
        user.name = data["name"]
    if "email" in data:
        user.email = data["email"]

    db.session.commit()

    return jsonify({"message": "User profile updated successfully"}), 200


@bp.get("/api/promotion")
@login_required
def promotion_get():
    print("func call: promotion_get()")
    g.user.authority = (g.user.authority + 1) % 3
    db.session.commit()
    return redirect(url_for("profile.profile_get"))


@bp.get('/api/course/<string:course_name>/<string:assignment_name>/stats')
@login_required
def get_course_stats(course_name, assignment_name):
    course = Course.query.filter_by(name=course_name).first()
    if not course:
        return jsonify({"error": "Course not found"}), 404
    course_id = course.id
    assignment = Assignment.query.filter_by(course_id=course_id, title=assignment_name).first()
    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404
    mc_questions = MC_Question.query.filter_by(assignment_id=assignment.id).all()
    four_options_questions = []
    true_false_questions = []
    for question in mc_questions:
        options = MC_Option.query.filter_by(question_id=question.id).all()
        if len(options) == 4:
            four_options_questions.append(question)
        elif len(options) == 2:
            true_false_questions.append(question)
    open_questions = OpenQuestion.query.filter_by(assignment_id=assignment.id).all()
    total_points = 0
    for question in mc_questions:
        total_points += question.points
    for question in open_questions:
        total_points += question.points
    return jsonify({"open_questions": len(open_questions), "four_options_questions": len(four_options_questions), "true_false_questions": len(true_false_questions), "total_points": total_points})


@bp.get('/api/course/<string:course_name>/<string:assignment_name>/questions')
@login_required
def get_course_questions(course_name, assignment_name):
    course = Course.query.filter_by(name=course_name).first()
    if not course:
        return jsonify({"error": "Course not found"}), 404
    course_id = course.id
    assignment = Assignment.query.filter_by(course_id=course_id, title=assignment_name).first()
    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404
    mc_questions = MC_Question.query.filter_by(assignment_id=assignment.id).all()
    open_questions = OpenQuestion.query.filter_by(assignment_id=assignment.id).all()
    mc_questions_list = [
        {
            "question": q.question,
            "punten": q.points,
            "id": q.id, 
            "soortVraag": "Multiple Choice"
            }
        for q in mc_questions
    ]
    open_questions_list = [
        {
            "question": q.question,
            "punten": q.points,
            "id": q.id,  
            "soortVraag": "Open"
            }
        for q in open_questions
    ]
    questions = mc_questions_list + open_questions_list
    return jsonify({"questions": questions})