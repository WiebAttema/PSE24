"""
Dit bestand bevat alles om een vraag te kunnen bekijken en antwoorden.

Op het moment enkel geschikt voor multiple choice.
"""
from flask import (
    Blueprint,
    jsonify,
    request,
)
from flask_login import current_user, login_required

from backend.db_models import (
    Course,
    MC_Option,
    User,
    db,
    MC_Question,
    user_courses,
    user_assignments,
    Assignment,
    user_mc_answer_selection,
    OpenQuestion
)
from sqlalchemy import select, join


bp = Blueprint("question_view", __name__)


@bp.get("/api/get_mc_questions/<string:assignment_name>")
@login_required
def get_student_MC_Questions(assignment_name):
    """
    This is a get for the mp questions meant to only get te question, no
    answers and such should be send to avoid cheating.user
    """
    print("get_student_MC_Questions called!")
    stmt = (
        select(MC_Question)
        .select_from(
            join(Course, user_courses, Course.id == user_courses.c.course_id)
            .join(Assignment, Assignment.course_id == Course.id)
            .join(MC_Question, MC_Question.assignment_id == Assignment.id)
        )
        .where(user_courses.c.user_id == current_user.id),
        Assignment.title == assignment_name
    )
    print("selected!")

    questions = db.session.execute(stmt).scalars().all()
    print(questions)
    print(f"len questions: {len(questions)}")
    questions_json = [question.to_json() for question in questions]
    print(f"len questions: {len(questions_json)}")
    return jsonify(questions_json)


@bp.get("/api/get_mc_questions_from_assignment/<string:assignment_name>")
@login_required
def get_student_MC_Questions_from_assignment(assignment_name):
    """
    This is a get for the MC questions meant to only get the questions, no
    answers and such should be sent to avoid cheating.
    """
    print("get_student_MC_Questions_from_assignment called!")

    try:
        stmt = (
            select(MC_Question)
            .select_from(
                join(Course, user_courses, Course.id == user_courses.c.course_id)
                .join(Assignment, Assignment.course_id == Course.id)
                .join(MC_Question, MC_Question.assignment_id == Assignment.id)
            )
            .where(
                user_courses.c.user_id == current_user.id,
                Assignment.title == assignment_name
            )
        )
        print("selected!")

        questions = db.session.execute(stmt).scalars().all()
        print(questions)
        print(f"len questions: {len(questions)}")
        questions_json = [question.to_json() for question in questions]
        print(f"len questions: {len(questions_json)}")
        return jsonify(questions_json)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@bp.get("/api/get_open_questions")
@login_required
def get_student_open_Questions():
    """
    This is a get for the mp questions meant to only get te question, no
    answers and such should be send to avoid cheating.
    """
    print("get_student_MC_Questions called!")
    stmt = (
        select(OpenQuestion)
        .select_from(
            join(Course, user_courses, Course.id == user_courses.c.course_id)
            .join(Assignment, Assignment.course_id == Course.id)
            .join(OpenQuestion, OpenQuestion.assignment_id == Assignment.id)
        )
        .where(user_courses.c.user_id == current_user.id)
    )
    print("selected!")

    open_questions = db.session.execute(stmt).scalars().all()
    print(open_questions)
    print(f"len questions: {len(open_questions)}")
    questions_json = [question.to_json() for question in open_questions]
    print(f"len questions: {len(questions_json)}")
    return jsonify(questions_json)


@bp.get("/api/get_mc_answers")
@login_required
def get_MC_Answers():
    """
    This is a get for the mp answers.
    """
    print("get_student_MC_Answers called!")
    stmt = (
        select(MC_Option).where(MC_Option.is_correct == 1)
        .select_from(
            join(Course, user_courses, Course.id == user_courses.c.course_id)
            .join(Assignment, Assignment.course_id == Course.id)
            .join(MC_Question, MC_Question.assignment_id == Assignment.id)
            .join(MC_Option, MC_Question.id == MC_Option.question_id)
        )
        .where(user_courses.c.user_id == current_user.id)
    )

    print("selected!")

    answers = db.session.execute(stmt).scalars().all()
    print(f"len answers: {len(answers)}")
    print(answers)
    answers_json = [answer.to_json() for answer in answers]
    print(f"len answers: {len(answers_json)}")
    return jsonify(answers_json)

@bp.get("/api/get_sub_answers")
@login_required
def get_sub_answers(assignment_title, student_id):
    """
    This is a get for the submission answer.
    """
    print("get_sub_answers called!")
    stmt = (
        select(user_mc_answer_selection.c.option_id)
        .select_from(
            join(user_mc_answer_selection, MC_Option, user_mc_answer_selection.c.option_id == MC_Option.id)
            .join(MC_Question, MC_Option.question_id == MC_Question.id)
            .join(Assignment, MC_Question.assignment_id == Assignment.id)
            .join(Course, Assignment.course_id == Course.id)
            .join(user_courses, Course.id == user_courses.c.course_id)
        )
        .where(
            user_courses.c.user_id == student_id,
            Assignment.title == assignment_title
        )
        .order_by(user_mc_answer_selection.c.question_id)
    )

    print("selected!")

    answers = db.session.execute(stmt).scalars().all()
    print(f"len answers: {len(answers)}")
    print(answers)
    return jsonify([answer for answer in answers])


@bp.get("/api/get_submissions")
@login_required
def get_submissions():
    """
    This is a get for the mp answers.
    """
    print("get_submissions called!")
    stmt = (
        select(User, Assignment, Course).distinct()
        .join(user_assignments, User.id == user_assignments.c.user_id)
        .join(Assignment, Assignment.id == user_assignments.c.assignment_id)
        .join(Course, Course.id == Assignment.course_id)
        .where(user_assignments.c.grade == None).limit(100)
    )
    results = db.session.execute(stmt).unique().all()
    users = []
    assignments = []
    courses = []

    for user, assignment, course in results:
        users.append(user.to_json())
        assignments.append(assignment.to_json())
        courses.append(course.to_json())

    response_data = {
        'users': users,
        'assignments': assignments,
        'courses': courses
    }

    return jsonify(response_data)


@bp.post("/api/submit_mc_answer")
@login_required
def submit_mc_answer():
    data = request.get_json()
    if "selectedOption" not in data or "questionId" not in data:
        return jsonify("No optionid or questionid was send, or not in the expected form"), 400
    selection = data.get("selectedOption")
    question = data.get("questionId")
    previous_answer = get_previous_mc_answer(question, current_user.id)
    if previous_answer:
        print(f"the student is trying to resubmit… previous selection was{previous_answer}")
        return jsonify("You have already answered this question…"), 400
    try:
        selected_option = (
            db.session.execute(select(MC_Option).where(MC_Option.id == selection))
            .scalars()
            .first()
        )
        if not selected_option:
            return jsonify("Option not found in database!"), 500
        # Without this you need an additional query to recieve the current user
        # from the database
        user = db.session.merge(current_user)
        new_answer = user_mc_answer_selection.insert().values(
            question_id=question,
            user_id=user.id,
            option_id=selected_option.id,
            is_correct=selected_option.is_correct
        )
        db.session.execute(new_answer)
        db.session.commit()

        # Check
        assignment_id = db.session.query(MC_Question.assignment_id).filter_by(
            id=question
        ).scalar().first()
        questions = db.session.query(MC_Question.id).filter_by(
            assignment_id=assignment_id, user_id=user.id
        ).scalar().all()
        for q in questions:
            check = db.session.query(user_mc_answer_selection).filter_by(
                question_id=q, user_id=user.id
            ).first()
            if not check:
                break
        else:
            finished = user_assignments.insert().values(
                user_id=user.id,
                assignment_id=assignment_id,
                grade=None
            )
            db.session.execute(finished)
            db.session.commit()

        # user.mc_answers.append(selected_option)
        # db.session.commit()
        return jsonify("Answer submitted!")
    except Exception as e:
        return jsonify(f"An error occurred while submitting the answer:\n{e}"), 500
    

@bp.post("/api/submit_feedback")
@login_required
def submit_feedback():
    data = request.get_json()
    
    # Check if required data is provided
    if not all(key in data for key in ("isGoodClicked", "feedback", "question_id", "option_id")):
        return jsonify("Required data not provided"), 400

    is_good = data["isGoodClicked"]
    feedback = data["feedback"]
    question_id = data["question_id"]
    option_id = data["option_id"]
    
    # Get the current user
    user = db.session.merge(current_user)
    
    # Check if the user has already submitted an answer for this question
    existing_answer = db.session.query(user_mc_answer_selection).filter_by(
        question_id=question_id, user_id=user.id
    ).first()
    
    # If the answer exists, update it; otherwise, insert a new record
    if existing_answer:
        existing_answer.is_correct = is_good
        existing_answer.feedback = feedback
        existing_answer.option_id = option_id
    else:
        new_answer = user_mc_answer_selection.insert().values(
            question_id=question_id,
            user_id=user.id,
            option_id=option_id,
            is_correct=is_good,
            feedback=feedback
        )
        db.session.execute(new_answer)
    db.session.commit()
    return jsonify("Feedback submitted successfully"), 200


@bp.post("/api/submit_open_answer")
@login_required
def submit_open_answer():
    # should send answer
    data = request.get_json()
    if "questionId" not in data:
        return jsonify("No optionid or questionid was send, or not in the expected form"), 400
    selection = data.get("selectedOption")
    question = data.get("questionId")
    previous_answer = get_previous_mc_answer(question, current_user.id)
    if previous_answer:
        print(f"the student is trying to resubmit… previous selection was{previous_answer}")
        return jsonify("You have already answered this question…"), 400
    try:
        selected_option = (
            db.session.execute(select(MC_Option).where(MC_Option.id == selection))
            .scalars()
            .first()
        )
        if not selected_option:
            return jsonify("Option not found in database!"), 500
        # Without this you need an additional query to recieve the current user
        # from the database
        user = db.session.merge(current_user)
        user.mc_answers.append(selected_option)
        db.session.commit()
        return jsonify("Answer submitted!")
    except Exception as e:
        return jsonify(f"An error occurred while submitting the answer:\n{e}"), 500


@bp.post("/api/mc_previous_answer")
@login_required
def send_prev_mc_answer():
    data = request.json
    question_id = data.get("question_id")
    if not question_id:
        return jsonify("No question_id was sent, or not in the expected form"), 400
    print(f"requested id: {question_id}")
    previous_answer = get_previous_mc_answer(question_id, current_user.id)
    print(f"got this previous answer: {previous_answer}")
    if previous_answer:
        print(f"Sending: {previous_answer.to_json()}")
        return jsonify({"previousAnswer": previous_answer.to_json()})
    return jsonify({"previousAnswer": None})


# Specific case of previous_answer where information is needed
# to know the status of a question
@bp.post("/api/mc_spec_answer")
@login_required
def send_specif_mc_answer():
    print("Initiliazing request")
    data = request.json
    question_id = data.get("quest_id")
    print(f"got this id {question_id}, user-id {current_user.id}")
    if not question_id:
        return jsonify("No question_id was sent, or not in the expected form"), 400
    answer = get_previous_mc_answer(question_id, current_user.id)
    if answer:
        print(f"Sending: {answer.to_json()}")
        return jsonify({"done": "True"})
    return jsonify({"done": ""})


@bp.post("/api/mc_previous_answer")
@login_required
def get_previous_mc_answer(question_id, user_id):
    """
    Used for checking if a question has already been answered, as well as
    displaying for both the teacher as well as the student.
    """
    selected_options = (
        db.session.query(MC_Option)
        .join(user_mc_answer_selection)
        .filter(
            user_mc_answer_selection.c.user_id == user_id,
            MC_Option.question_id == question_id,
        )
        .first()
    )
    return selected_options
