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
)


# Class voor gebruiker in database. Iedereen die de site gebruikt is een
# gebruiker.
class User(db.Model, UserMixin):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(60), nullable=False)
    # 0 for student, 1 for teacher, 2 for admin.
    authority = db.Column(db.Integer, nullable=False, default=0)
    # Every user has only one school.
    school_id = db.Column(db.Integer, db.ForeignKey("school.id"))
    # A user can has multiple courses. And a course multiple users
    courses = db.relationship(
        db.Integer, secondary="user_courses", backref=db.backref("users", lazy=True)
    )
    mc_answers = db.relationship(
        "mc_option", secondary="user_mc_option", backref="selected_by_users"
    )
    open_answers = db.relationship(
        "MC_Option", secondary="user_mc_option", backref="selected_by_users"
    )

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
            "password": self.password,
            "authority": self.authority,
            "school": self.school_id,
            "mc_answers": self.mc_answers,
        }


# Class voor School in database.
class School(db.Model):
    __tablename__ = "school"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)

    def __init__(self, name):
        self.name = name

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class Course(db.Model):
    __tablename__ = "course"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    questions = db.relationship("Question", back_populates="course", lazy=True)

    # Niet expliciet nodig als het goed is, maar mijn IDE is boos op me wanneer
    # ik geen constructor defineer.
    def __init__(self, name):
        self.name = name

    # Fijn zodat het naar React kan worden gestuurd.
    # name word title genoemd omdat het zo in Card.js word genoemt.
    def to_json(self):
        return {"id": self.id, "title": self.name}


class Open_question(db.Model):
    __tablename__ = "open_question"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(10000), nullable=False)
    # Question.
    question = db.Column(db.String(1000), nullable=False)
    # De code waar de question over gaat.
    code = db.Column(db.String(10000), nullable=False)
    a_template = db.Column(db.String(1000), nullable=True)
    points = db.Column(db.Integer, nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    deadline = db.Column(
        db.DateTime,
        default=lambda: datetime.utcnow() + timedelta(days=random.randint(1, 7)),
    )


# Class voor multiple choice vraag.
class MC_Question(db.Model):
    __tablename__ = "MC_Question"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(10000), nullable=False)
    # Question.
    question = db.Column(db.String(1000), nullable=False)
    # De code waar de question over gaat.
    code = db.Column(db.String(10000), nullable=False)
    points = db.Column(db.Integer, nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    deadline = db.Column(db.DateTime, nullable=False)
    options = db.relationship("mc_option", backref="question", lazy=True)
    course = db.relationship("Course", back_populates="questions")

    def __init__(
        self,
        title,
        question,
        code,
        points,
        deadline=datetime.utcnow() + timedelta(days=random.randint(1, 7)),
    ):
        self.title = title
        self.question = question
        self.code = code
        self.points = points
        self.deadline = deadline

    def to_json(self):
        options_json = [option.to_json() for option in self.options]
        return {
            "id": self.id,
            "title": self.title,
            "question": self.question,
            "code": self.code,
            "points": self.points,
            "timestamp": self.timestamp,
            "deadline": self.deadline,
            "options": options_json,
            "course": self.course,
        }


# If a user answered a mp question the selection is documented here.
user_mc_answer_selection = db.Table(
    "user_mc_answer_selection",
    db.Column("option_id", db.Integer, db.ForeignKey("mc_option.id"), primary_key=True),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
)


class MC_Option(db.Model):
    __tablename__ = "mc_option"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # The choice
    option_text = db.Column(db.String(1000), nullable=False)
    # For auto grading.
    is_correct = db.Column(db.Boolean, nullable=False)
    # The question this option is a part of.
    question_id = db.Column(db.Integer, db.ForeignKey("MC_Question.id"), nullable=False)
    # Many to many relationship table which maps this option to user which have selected this question.
    selected_by = db.relationship(
        "user",
        secondary=user_mc_answer_selection,
        lazy="subquery",
        backref=db.backref("selected_answers", lazy=True),
    )

    # is correct and selected_by should be handled seperate?
    def to_json(self):
        return {
            "id": self.id,
            "option_text": self.option_text,
            "question_id": self.question_id,
        }
