import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../templates/profile.css';
import { FaAngleRight } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const DaProfileContent = () => {
    const navigate = useNavigate();
    const [grades, setGrades] = useState([]);
    const [deadlines, setDeadlines] = useState([]);

    useEffect(() => {
        const fetchGradesAndDeadlines = async () => {
            try {
                const gradesResponse = await fetch("/api/latest_grades");
                const deadlinesResponse = await fetch("/api/upcoming_deadlines");

                if (!gradesResponse.ok || !deadlinesResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const gradesData = await gradesResponse.json();
                const deadlinesData = await deadlinesResponse.json();

                setGrades(gradesData);
                setDeadlines(deadlinesData);
            } catch (error) {
                console.error("Fetching error:", error.message);
            }
        };

        fetchGradesAndDeadlines();
    }, []);

    const handleDeadlineClick = (course) => {
        navigate('/assignment', { state: { course } });
    };

    return (
        <div className='profile-content'>
            <div className="user-courses">
                <NavLink className={({ isActive }) => `nav-link2 ${isActive ? 'nav-active' : ''}`} to="/grades">
                    <span className="grade_title">Grades</span>
                    <FaAngleRight className="grade-icon" />
                </NavLink>
                {grades.map((course, index) => (
                    <div className="courses" key={index}>
                        <div className="course-detail">
                            <div className="course-cover"></div>
                            <div className="course-name">
                                <h5 className='title'>{course.title}</h5>
                                <span className="time">{course.time}</span>
                            </div>
                        </div>
                        <div className="grade">{course.grade}</div>
                    </div>
                ))}
            </div>

            <div className="user-deadlines">
                <NavLink className={({ isActive }) => `nav-link2 ${isActive ? 'nav-active' : ''}`} to="/schedule">
                    <span className="deadline_title">Deadlines</span>
                    <FaAngleRight className="grade-icon2" />
                </NavLink>
                <div className="deadline-container-field">
                    {deadlines.map((course, index) => (
                        <div className="deadline" key={index} onClick={() => handleDeadlineClick(course)}>
                            <div className="course-detail">
                                <div className="course-deadline" style={{ backgroundColor: course.color }}>{course.deadline}</div>
                                <div className="course-name">
                                    <h6 className='title_deadline'>{course.title}</h6>
                                    <span className="time">{course.time2}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DaProfileContent;
