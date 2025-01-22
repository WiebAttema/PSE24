"""
courses api
"""

from flask import Blueprint, jsonify, request
from flask_login import (
    login_required,
    current_user,
)

from datetime import datetime
from backend.db_models import db, Course, user_courses, user_assignments, Assignment
from sqlalchemy import select, join

# fijn om te hebben wellicht
# from server.auth import cache, login_manager

bp = Blueprint("courses", __name__)


@bp.post("/api/create_course")
def create_course():
    print("func call: create_course():")
    data = request.json
    if data is None:
        return jsonify({"error": "Invalid JSON data"}), 400
    course_name = data.get("courseName")
    if not course_name:
        return jsonify({"Message": "A name should be provided"}), 400
    try:
        new_course = Course(name=course_name)
        db.session.add(new_course)
        db.session.commit()
        return jsonify({"Message": "Course added!"}), 200
    except Exception as e:
        return jsonify({"Message": f"Some database error occured: {e}"}), 500


@bp.delete("/api/delete_course/<int:course_id>")
def delete_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"message": "Course not found"}), 404
    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "User deleted!"}), 200

@bp.delete("/api/delete_assignment/<int:assignment_id>")
def delete_assignment(assignment_id):
    assignment = Assignment.query.get(assignment_id)
    if not assignment:
        return jsonify({"message": "Course not found"}), 404
    db.session.delete(assignment)
    db.session.commit()
    return jsonify({"message": "User deleted!"}), 200


@bp.patch("/api/edit_course/<int:course_id>")
def edit_course(course_id):
    print("func call: edit_course(course_id):")
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"message": "Course not found"}), 404
    data = request.json
    if data is None:
        return jsonify({"error": "Invalid JSON data"}), 400
    course.first_name = data.get("firstName", course.first_name)
    # TODO in try?
    db.session.commit()

    return jsonify({"message": "Course updated."}), 200


@bp.get("/api/get_courses")
@login_required
def get_courses():
    """
    The main use of this function is to load the dashboard cards.

    The documentation states that query is deprecated, therefore I use select
    and exectute here.
    """
    courses = None
    # Admin sees all
    if current_user.authority == 2:
        courses = db.session.execute(select(Course)).scalars().all()
    else:
        stmt = (
            select(Course)
            .select_from(
                join(Course, user_courses, Course.id == user_courses.c.course_id)
            )
            .where(user_courses.c.user_id == current_user.id)
        )
        courses = db.session.execute(stmt).scalars().all()
    json_courses = list(map(lambda x: x.to_json(), courses))
    return jsonify({"courses": json_courses})


@bp.route('/api/get_courses_with_assignments')
@login_required
def get_courses_with_assignments():
    user_id = current_user.id
    courses = Course.query.join(user_courses).filter(user_courses.c.user_id == user_id).all()

    courses_data = []
    for course in courses:
        course_info = {
            'title': course.name,
            'courseColor': course.color,
            'assignments': []
        }

        assignments = Assignment.query.join(user_assignments).filter(
            user_assignments.c.user_id == user_id,
            Assignment.course_id == course.id
        ).all()

        for assignment in assignments:
            grade_record = db.session.query(user_assignments).filter_by(
                user_id=user_id,
                assignment_id=assignment.id
            ).first()

            if grade_record and grade_record.grade:
                assignment_info = {
                    'name': assignment.title,
                    'grade': round(grade_record.grade, 2)
                }

                course_info['assignments'].append(assignment_info)

        if assignments:
            courses_data.append(course_info)

    return jsonify({'courses': courses_data})


@bp.get('/api/get_course_by_assignment_name/<string:assignment_name>')
@login_required
def get_course_by_assignment_name(assignment_name):
    # Query the Course based on the assignment_name
    course = Course.query.join(Assignment).filter(Assignment.title == assignment_name).first()

    if not course:
        return jsonify({"error": "Course not found"}), 404

    # Return only the coursename
    return jsonify({"coursename": course.name}), 200


@bp.get('/api/course/<string:title>')
@login_required
def get_course_by_title(title):
    course = Course.query.filter_by(name=title).first()
    if not course:
        return jsonify({"error": "Course not found"}), 404

    assignments = Assignment.query.filter_by(course_id=course.id).all()
    assignments_sorted = sorted(assignments, key=lambda x: x.deadline)
    assignments_list = [assignment_to_dict(assignment) for assignment in assignments_sorted]

    return jsonify({"assignments": assignments_list}), 200


@bp.get('/api/assignments')
@login_required
def get_all_assignments():
    assignments = Assignment.query.all()
    assignments_sorted = sorted(assignments, key=lambda x: x.deadline)
    assignments_list = [assignment_to_dict(assignment) for assignment in assignments_sorted]

    return jsonify({"assignments": assignments_list}), 200


def assignment_to_dict(assignment):
    #get course id and course name
    course = Course.query.filter_by(id=assignment.course_id).first()
    if not course:
        return jsonify({"error": "Course not found"}), 404
    return {
        "title": assignment.title,
        "deadline": assignment.deadline.strftime("%d-%m-%Y %H:%M"),
        "published": assignment.published,
        "course_name": course.name,
        "user_authority": current_user.authority
    }

@bp.get('/api/course/<string:course_name>/assignments')
@login_required  # Ensure this decorator is applied for authentication
def get_course_assignments(course_name):
    course = Course.query.filter_by(name=course_name).first()
    if not course:
        return jsonify({"error": "Course not found"}), 404
    assignments = Assignment.query.filter_by(course_id=course.id).all()
    assignments_sorted = sorted(assignments, key=lambda x: x.deadline)
    assignments_list = [
        {
            "id": a.id,
            "title": a.title,
            "deadline": a.deadline.strftime("%d-%m-%Y %H:%M"),
            "course_name": course_name
        }
        for a in assignments_sorted
    ]
    return jsonify(assignments_list)

@bp.route('/api/course/add_assignment/<string:course_name>', methods=['POST'])
@login_required
def add_assignment(course_name):
    data = request.get_json()
    title = data.get('title')
    deadline = data.get('deadline')

    if title is None or deadline is None:
        return jsonify({'message': 'Title, deadline are required'}), 400

    # Fetch the course ID
    course = Course.query.filter_by(name=course_name).first()
    if not course:
        return jsonify({'message': 'Course not found'}), 404

    new_assignment = Assignment(
        title=title,
        deadline=datetime.fromisoformat(deadline),
        course_id=course.id
    )
    db.session.add(new_assignment)
    db.session.commit()

    return jsonify({
        'id': new_assignment.id,
        'title': new_assignment.title,
        'published': new_assignment.published,
        'deadline': new_assignment.deadline.isoformat(),
        'course_id': new_assignment.course_id,
        'timestamp': new_assignment.timestamp.isoformat()
    }), 201


def calculate_deadline_time(deadline):
    now = datetime.utcnow()
    delta = deadline - now
    if delta.days > 7:
        return f"{delta.days // 7}W"
    elif delta.days > 1:
        return f"{delta.days}D"
    else:
        return f"{delta.seconds // 3600}H"


@bp.get("/api/upcoming_deadlines")
@login_required
def get_upcoming_deadlines():
    upcoming_deadlines = (
        db.session.query(Assignment, Course.color)
        .join(Course, Assignment.course_id == Course.id)
        .join(user_assignments, user_assignments.c.assignment_id == Assignment.id)
        .filter(user_assignments.c.user_id == current_user.id)
        .filter(Assignment.deadline > datetime.utcnow())
        .order_by(Assignment.deadline.asc())
        .limit(4)
        .all()
    )

    response = []
    seen_courses = set()
    for assignment, color in upcoming_deadlines:
        if assignment.course.name not in seen_courses:
            response.append({
                "title": assignment.course.name,
                "time2": assignment.deadline.strftime("%d %b at %H:%M"),
                "deadline": calculate_deadline_time(assignment.deadline),
                "color": color,
            })
            seen_courses.add(assignment.course.name)
    return jsonify(response)


@bp.get("/api/latest_grades")
@login_required
def get_latest_grades():
    latest_grades = (
        db.session.query(Course, user_courses.c.grade)
        .join(user_courses, user_courses.c.course_id == Course.id)
        .filter(user_courses.c.user_id == current_user.id, user_courses.c.grade != None)
        .order_by(user_courses.c.grade.desc())
        .limit(4)
        .all()
    )

    response = []
    for course, grade in latest_grades:
        response.append({
            "title": course.name,
            "grade": round(grade, 2),
        })
    return jsonify(response)
