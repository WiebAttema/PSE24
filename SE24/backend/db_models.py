"""
Dit bestand bevat alles voor de database, de klasse en de functie om het te
initializen en met de applicatie te verbinden.
"""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from flask_login import UserMixin
import random


db = SQLAlchemy()

user_courses = db.Table(
    "user_courses",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("course_id", db.Integer, db.ForeignKey("course.id"), primary_key=True),
    db.Column("grade", db.Float, nullable=True),
)

user_assignments = db.Table(
    "user_assignments",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("assignment_id", db.Integer, db.ForeignKey("assignment.id"), primary_key=True),
    db.Column("grade", db.Float, nullable=True)
)

user_mcquestions = db.Table(
    "user_mcquestions",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("mcquestion_id", db.Integer, db.ForeignKey("mc_question.id"), primary_key=True),
    db.Column("grade", db.Boolean, nullable=True)
)

user_openquestions = db.Table(
    "user_openquestions",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("openquestion_id", db.Integer, db.ForeignKey("open_question.id"), primary_key=True),
    db.Column("grade", db.Boolean, nullable=True)
)

user_open_answer = db.Table(
    "user_open_answer",
    # Makes checking for previous answers way easier.
    db.Column("question_id", db.Integer, db.ForeignKey("open_question.id"), primary_key=True),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("is_correct", db.Boolean, nullable=True),
    db.Column("feedback", db.String(10000), nullable=True)
)

# If a user answered a multiple-choice question, the selection is documented here.
user_mc_answer_selection = db.Table(
    "user_mc_answer_selection",
    db.Column("option_id", db.Integer, db.ForeignKey("mc_option.id"), primary_key=True),
    # Makes checking for previous answers way easier.
    db.Column("question_id", db.Integer),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("is_correct", db.Boolean, nullable=True),
    db.Column("feedback", db.String(10000), nullable=True)
)

# Class voor gebruiker in database. Iedereen die de site gebruikt is een gebruiker.
class User(db.Model, UserMixin):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(60), nullable=False)
    # 0 for student, 1 for teacher, 2 for admin.
    authority = db.Column(db.Integer, nullable=False, default=0)
    # Every user has only one school.
    school_id = db.Column(db.Integer, db.ForeignKey("school.id"))
    # A user can have multiple courses. And a course multiple users.
    courses = db.relationship(
        "Course", secondary="user_courses", backref=db.backref("users", lazy=True)
    )
    assignments = db.relationship(
        "Assignment", secondary="user_assignments", backref=db.backref("users", lazy=True)
    )
    mcquestions = db.relationship(
        "MC_Question", secondary="user_mcquestions", backref=db.backref("users", lazy=True)
    )
    openquestions = db.relationship(
        "OpenQuestion", secondary="user_openquestions", backref=db.backref("users", lazy=True)
    )
    # mc_answers = db.relationship(
    #     "MC_Option",
    #     secondary="user_mc_answer_selection",
    #     backref="selected_by_users",
    #     overlaps="selected_answers",
    # )

    # Convenient for sending to the frontend.
    def __init__(self, name, email, password, authority=0):
        self.name = name
        self.email = email
        self.password = password
        self.authority = authority

    # Convenient for sending to the frontend.
    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "timestamp": self.timestamp,
            "email": self.email,
            # "password": self.password,
            "authority": self.authority,
            "school": self.school_id,
            # "mc_answers": self.mc_answers,
        }


class Course(db.Model):
    __tablename__ = "course"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    color = db.Column(db.String(20), nullable=False)
    # Every course has only one school.
    school_id = db.Column(db.Integer, db.ForeignKey("school.id"), nullable=False)

    assignments = db.relationship("Assignment", back_populates="course", lazy=True)

    def __init__(self, name):
        self.name = name

    def to_json(self):
        return {"id": self.id, "title": self.name, "color": self.color}


class Assignment(db.Model):
    __tablename__ = "assignment"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(1000), nullable=False)
    published = db.Column(db.Boolean, nullable=False)
    mc_questions = db.relationship(
        "MC_Question", back_populates="assignment", lazy=False
    )
    open_questions = db.relationship(
        "OpenQuestion", back_populates="assignment", lazy=False
    )
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    course = db.relationship("Course", back_populates="assignments")
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    deadline = db.Column(
        db.DateTime,
        default=lambda: datetime.utcnow() + timedelta(days=random.randint(1, 7)),
    )

    def __init__(self, title, course_id, deadline=None):
        self.published = False
        self.title = title
        self.course_id = course_id
        if deadline is None:
            self.deadline = datetime.utcnow() + timedelta(days=random.randint(1, 7))
        else:
            self.deadline = deadline

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "timestamp": self.timestamp,
            "deadline": self.deadline,
            "course": self.course.id if self.course else None,
            "published": self.published
        }


class OpenQuestion(db.Model):
    __tablename__ = "open_question"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(10000), nullable=False)
    question = db.Column(db.String(1000), nullable=False)
    language = db.Column(db.String(100), nullable=False)
    a_template = db.Column(db.String(1000), nullable=True)
    level = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(10000), nullable=False)
    code = db.Column(db.String(10000), nullable=False)
    points = db.Column(db.Integer, nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignment.id"))
    assignment = db.relationship("Assignment", back_populates="open_questions")

    def __init__(self, title, question, language, code, points, a_template, level, description, assignment_id):
        self.title = title
        self.question = question
        self.language = language
        self.code = code
        self.points = points
        self.a_template = a_template
        self.level = level
        self.description = description
        self.assignment_id = assignment_id  

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "question": self.question,
            "code": self.code,
            "points": self.points,
            "timestamp": self.timestamp,
            "a_template": self.a_template,
            "assignment": self.assignment_id if self.assignment else None
        }


# Class voor multiple choice vraag.
class MC_Question(db.Model):
    __tablename__ = "mc_question"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(10000), nullable=False)
    question = db.Column(db.String(1000), nullable=False)
    language = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(10000), nullable=False)
    level = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(10000), nullable=False)
    points = db.Column(db.Integer, nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    options = db.relationship("MC_Option", backref="question", lazy=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignment.id"))
    assignment = db.relationship("Assignment", back_populates="mc_questions")

    def __init__(self, title, question, language, code, points, level,
                 description, assignment_id):
        self.title = title
        self.question = question
        self.language = language
        self.code = code
        self.points = points
        self.level = level
        self.description = description
        self.assignment_id = assignment_id

    def to_json(self):
        options_json = [option.to_json() for option in self.options]
        return {
            "id": self.id,
            "title": self.title,
            "question": self.question,
            "code": self.code,
            "points": self.points,
            "timestamp": self.timestamp,
            "options": options_json,
            "assignment": self.assignment_id if self.assignment else None,
            "level": self.level,
            "description": self.description,
            "language": self.language,
            "correct": [o.to_json() for o in self.options if o.is_correct][0],
            "answer": None,
            "explanation": None
        }





class MC_Option(db.Model):
    __tablename__ = "mc_option"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    option_text = db.Column(db.String(1000), nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("mc_question.id"), nullable=False)
    selected_by = db.relationship(
        "User",
        secondary=user_mc_answer_selection,
        lazy="subquery",
        backref=db.backref("selected_answers", lazy=True),
        overlaps="mc_answers,selected_by_users",
    )

    def __init__(self, option_text, is_correct):
        self.option_text = option_text
        self.is_correct = is_correct

    def to_json(self):
        return {
            "id": self.id,
            "option_text": self.option_text,
            "question_id": self.question_id,
        }


# Class voor School in database.
class School(db.Model):
    __tablename__ = "school"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    users = db.relationship("User", backref="school", lazy=True)

    def __init__(self, name):
        self.name = name

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
        }
