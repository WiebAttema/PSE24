from flask import (
    Blueprint,
    request,
    jsonify,
)

from flask_login import (
    login_required,
    current_user,
)

from sqlalchemy.sql.functions import random
from backend.db_models import MC_Option, db, User, MC_Question, OpenQuestion, Course, Assignment
import random
from .find_lang import find_match

from .AI import OpenAI_API

bp = Blueprint("question_create", __name__)


# def

@bp.get("/api/question/<int:question_id>/<string:question_type>")
@login_required
def question_edit(question_id, question_type):
    print(f"func call: question_edit({question_id}, {question_type})")
    if question_type == "Open":
        q = OpenQuestion.query.get(question_id)
        print(q)
    else:
        q = MC_Question.query.get(question_id)
        print(q)
    return q.to_json()


@bp.post("/api/question_generate")
@login_required
def question_generate():
    print("func call: generate")
    data = request.get_json()

    question_type = data["questionType"]
    language = find_match(data["language"])
    difficulty = data["level"]
    information = data["description"]
    user_data = {
        "question_type": question_type,
        "language": language,
        "difficulty": difficulty,
        "information": information,
    }
    result = OpenAI_API.main(user_data)
    code = result["Code"]
    lines = code.split("\n")
    cleaned_code = "\n".join(lines[1:-2])
    result["Code"] = cleaned_code
    result["Language"] = language
    print("-------------------------------------------")
    for r in result.items():
        print(r)
    print("-------------------------------------------")
    return jsonify(result)

@login_required
def create_mp_question(data):
    print("func call: create_mp_question")
    course_name = data.get("course")
    course_id = Course.query.filter_by(name=course_name).first().id
    assignment_name = data.get("assignment")
    assignment_id = Assignment.query.filter_by(title=assignment_name, course_id=course_id).first().id
    if not data:
        return False
    new_question = MC_Question(
        title=data.get("title"),
        question=data.get("question"),
        language=data.get("language"),
        code=data.get("code"),
        points=data.get("points"),
        level=data.get("level"),
        description=data.get("description"),
        assignment_id=assignment_id
        # level=
    )
    db.session.add(new_question)
    # Needed so there is an id…
    db.session.commit()
    choices = data.get("choices")
    correct = data.get("correct_choice")[0:1]
    print(correct)
    print(f"\n-------+++\n{data.get('Answer')}")
    exit()
    options = []
    for key, values in choices.items():
        option = MC_Option(option_text=values, is_correct=key == correct)
        option.question_id = new_question.id
        db.session.add(option)
        options.append(option)
    db.session.commit()
    user = User.query.get(current_user.id)
    if user and user.courses:
        # TODO course kunnen selecteren en garanderen dat het deel is van een course
        course = random.choice(user.courses)
        new_question.assignment_id = random.choice(course.assignments).id

    new_question.options.extend(options)
    db.session.commit()
    return True


@login_required
def create_open_question(data):
    course_name = data.get("course")
    course_id = Course.query.filter_by(name=course_name).first().id
    assignment_name = data.get("assignment")
    assignment_id = Assignment.query.filter_by(title=assignment_name, course_id=course_id).first().id
    print("func call: create_open_question")
    if not data:
        return False
    new_question = OpenQuestion(
        title=data.get("title"),
        question=data.get("question"),
        language=data.get("language"),
        code=data.get("code"),
        points=data.get("points"),
        a_template=data.get("explanation"),
        level=data.get("level"),
        description=data.get("description"),
        assignment_id=assignment_id
    )
    db.session.add(new_question)
    db.session.commit()
    user = User.query.get(current_user.id)
    if user and user.courses:
        # TODO course kunnen selecteren en garanderen dat het deel is van een course
        course = random.choice(user.courses)
        new_question.assignment_id = random.choice(course.assignments).id
    return True


@bp.post("/api/question_post")
@login_required
def question_post():
    """
    Basic initial version for testing. Only supports multiplechoice and adds
    to a random course of the user.
    """
    print("func call: question_post")
    data = request.get_json()
    succes = create_open_question(data) if data['questionType'] == 'Open' else \
        create_mp_question(data)
    return jsonify({"message": "question posted!" if succes else "Error"})
