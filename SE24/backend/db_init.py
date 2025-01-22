from db_models import (
    MC_Option,
    MC_Question,
    OpenQuestion,
    db,
    School,
    User,
    Course,
    Assignment,
    user_courses,
    user_assignments
)
from flask_bcrypt import generate_password_hash
import random


# Calculate average grade for assignments in a course
def update_average_grade(course_id):
    # Query all assignments for the given course_id
    assignments = Assignment.query.filter_by(course_id=course_id).all()

    # Calculate average grade for assignments in this course
    total_grade = 0.0
    count = 0
    for assignment in assignments:
        # Query all grades for this assignment
        assignment_grades = db.session.execute(
            db.select(user_assignments.c.grade).filter_by(assignment_id=assignment.id)
        ).all()

        # Calculate average grade for this assignment
        assignment_average = 0.0
        if assignment_grades:
            total_assignment_grade = sum([grade[0] or 0.0 for grade in assignment_grades])
            assignment_average = total_assignment_grade / len(assignment_grades)

        # Add assignment average to total grade
        total_grade += assignment_average
        count += 1

    # Calculate average grade for the course
    course_average_grade = total_grade / count if count > 0 else 0.0

    return course_average_grade


# Update user_courses with the calculated average grade for the course
def update_user_courses(user_id, course_id):
    # Calculate average grade for the course
    average_grade = update_average_grade(course_id)

    # Update user_courses table with the average grade
    db.session.execute(
        user_courses.update()
        .where(user_courses.c.user_id == user_id)
        .where(user_courses.c.course_id == course_id)
        .values(grade=average_grade)
    )

    db.session.commit()


# https://1000randomnames.com/
names = [
    "Erin Flores", "Lincoln Ochoa", "Luciana Walker", "Luke Zhang",
    "Sarai Sampson", "Cain Cunningham", "Marley Alvarado", "Andres Norris",
    "Arielle Webb", "Lorenzo Odom", "Laylani Caldwell", "Rylan Barr",
    "Noemi Pruitt", "Gatlin Williams", "Ava Parker", "Caleb Schroeder",
    "Cameron Pennington", "Bobby Allen", "Riley Wallace", "Chase Porter",
    "Ryleigh Truong", "Ayan Day", "Hayden Washington", "Juan Velez",
    "Megan Sheppard", "Trent Hughes", "Samantha Wolfe", "Donovan Moreno",
    "Mary Burgess", "Kolton Miller", "Isabella Vu", "Kamdyn Frederick",
    "Sariyah Macias", "Moshe Koch", "Milana Mejia", "Atticus Rush",
    "Maleah Cruz", "Ryan Kirby", "Skyla Anthony", "Shiloh Barnes",
    "Liliana Collier", "Edison Mann", "Paislee Rosas", "Remi Shannon",
    "Harlee Lane", "Matias Moody", "Elaine Harding", "Brodie Poole",
    "Bonnie Calhoun", "Gary Joseph", "Gracelynn Cervantes", "Kamari Small",
    "Zaria Calderon", "Oakley Phelps", "Laney Mayer", "Yahir Callahan",
    "Kimber Becker", "Lawson Ray", "Ruth Daugherty", "Turner Escobar",
    "Erin Dominguez", "Kaden Portillo", "Nathalie Blanchard", "Adler O’Connor",
    "Charli Cochran", "Danny Garrett", "Tessa Horton", "Garrett Fuller",
    "Oakley Webb", "Lorenzo George", "Adelyn Pope", "Gunnar Snow",
    "Alexia Ahmed", "Harry Morrow", "Reyna Nelson", "Dylan Ventura",
    "Zora Carr", "Kash Roy", "Savanna Villa", "Clay Enriquez", "Nellie Fields",
    "Clayton Robertson", "Harmony Sweeney", "Nixon Schmidt", "Kimberly Sawyer",
    "Jefferson Fletcher", "Anaya McDonald", "Calvin Hogan", "Kathryn Dickson",
    "Maxton Dorsey", "Addyson Brady", "Reed Miranda", "Amina Morse",
    "Bode Marshall", "Adalyn Schmitt", "Murphy Hutchinson", "Jamie Moyer",
    "Ahmir Wyatt", "Liberty Richards", "Holden Hart"]

# https://1000randomnames.com/
names2 = [
    "James Chung", "Rivka Hamilton", "Jason Quintero", "Keyla Stanley",
    "Manuel Davenport", "Adrianna Campos", "Gideon English",
    "Kelly Montgomery", "Maximiliano Tanner", "Harmoni Whitaker"]

course_names = [
    "Introduction to Computer Science", "Data Structures and Algorithms",
    "Discrete Mathematics", "Linear Algebra", "Calculus I", "Calculus II",
    "Quantum Mechanics", "Classical Mechanics", "Electromagnetism",
    "Statistical Physics", "Theory of Computation", "Machine Learning",
    "Artificial Intelligence", "Database Systems", "Operating Systems",
    "Computer Networks", "Numerical Methods", "Differential Equations",
    "Complex Analysis", "Statistical Inference"]


if __name__ == "__main__":
    from flask import Flask

    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)
    with app.app_context():
        db.drop_all()
        db.create_all()
        db.session.commit()

        school1 = School(name="uva")
        school2 = School(name="vu")
        db.session.add(school1)
        db.session.add(school2)
        db.session.commit()
        students = [
            User(
                name=names[i],
                email=f"student{i}@{school1.name if i % 2 == 0 else school2.name}.nl",
                password=generate_password_hash("1234"),
            )
            for i in range(100)
        ]
        for i, student in enumerate(students):
            student.school_id = school1.id if i % 2 == 0 else school2.id
            db.session.add(student)
        db.session.commit()

        teachers = [
            User(
                name=names2[i],
                email=f"teacher{i}@{school1.name if i % 2 == 0 else school2.name}.nl",
                password=generate_password_hash("1234"),
                authority=1,
            )
            for i in range(10)
        ]
        for i, teacher in enumerate(teachers):
            teacher.school_id = school1.id if i % 2 == 0 else school2.id
            db.session.add(teacher)
        db.session.commit()

        admin = User(
            name="admin",
            email="admin@admin.com",
            password=generate_password_hash("1234"),
            authority=2,
        )
        db.session.add(admin)
        db.session.commit()

        courses = [
            Course(
                name=course_names[i]
            )
            for i in range(20)
        ]
        course_colors = ["pink", "coral", "lightgreen", "skyblue", "lightseagreen", "plum", "lightsalmon", "khaki"]
        for i, course in enumerate(courses):
            course.school_id = school1.id if i % 2 == 0 else school2.id
            course.color = random.choice(course_colors)
            db.session.add(course)
        db.session.commit()

        # Add assignments with grade
        assignments = [
            Assignment(
                title=f"Assignment {i}",
                course_id=courses[i // 5].id
            )
            for i in range(100)
        ]
        for i, assignment in enumerate(assignments):
            assignment.published = random.choice([True, False])
            db.session.add(assignment)
        db.session.commit()

        mc_questions = [
            MC_Question(
                title=f"question {i}",
                question="Wat doet de code?",
                language="Python",
                code=f"print({i})",
                points=random.choice([5, 10, 15, 20]),
                level='Test',
                description=f"Test description {i}",
                assignment_id=1
            )
            for i in range(400)
        ]
        for i, mc_question in enumerate(mc_questions):
            mc_question.assignment_id = assignments[i % len(assignments)].id
            db.session.add(mc_question)
        db.session.commit()

        for i, mc_question in enumerate(mc_questions):
            options = [
                MC_Option(option_text=f"It prints {i-1}", is_correct=False),
                MC_Option(option_text=f"It prints {i}", is_correct=True),
                MC_Option(option_text=f"It prints {i+1}", is_correct=False),
                MC_Option(option_text=f"It prints {i+2}", is_correct=False),
            ]
            for option in options:
                option.question_id = mc_question.id
                db.session.add(option)
            db.session.commit()
            mc_question.options.extend(options)
        db.session.commit()

        open_questions = [
            OpenQuestion(
                title=f"describe why the meaning of life is {i+30}",
                question="describe why the meaning of life is {i+30}",
                language="Python",
                code=f"print({i+30})",
                points=random.choice([5, 10, 15, 20]),
                a_template="Temp",
                level="Test level",
                description="Lab42",
                assignment_id=1
            )
            for i in range(400)
        ]
        for i, open_question in enumerate(open_questions):
            open_question.assignment_id = assignments[i % len(assignments)].id
            db.session.add(open_question)
        db.session.commit()

        schools = [school1, school2]
        for school in schools:
            users = (
                db.session.execute(db.select(User).filter_by(school_id=school.id))
                .scalars()
                .all()
            )
            courses = (
                db.session.execute(db.select(Course).filter_by(school_id=school.id))
                .scalars()
                .all()
            )
            assignments = (
                db.session.query(Assignment).join(Course).filter(Course.school_id == school.id)
                .all()
            )
            for user in users:
                for course in courses:
                    existing_mapping = db.session.execute(
                        db.select(user_courses).filter_by(
                            user_id=user.id, course_id=course.id
                        )
                    ).first()
                    if not existing_mapping:
                        db.session.execute(
                            user_courses.insert().values(
                                user_id=user.id, course_id=course.id
                            )
                        )
                for assignment in assignments:
                    existing_mapping = db.session.execute(
                        db.select(user_assignments).filter_by(
                            user_id=user.id, assignment_id=assignment.id
                        )
                    ).first()
                    if not existing_mapping:
                        grade = random.choice([random.uniform(6, 10), None])
                        db.session.execute(
                            user_assignments.insert().values(
                                user_id=user.id,
                                assignment_id=assignment.id,
                                grade=grade,
                            )
                        )
                    update_user_courses(user.id, course.id)
        db.session.commit()

    print("Database reinitialized.")
