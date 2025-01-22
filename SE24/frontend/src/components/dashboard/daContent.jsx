import React, { useState, useEffect } from 'react';
import DaContentHeader from './daContentHeader';
import './daContent.css';
import Card from '../templates/Card';
import ToBeGradedHeader from './toBeGradeHeader';
import { NavLink } from 'react-router-dom';

const DaContent = ({ isTeacher }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                let response;
                if (isTeacher) {
                    response = await fetch("api/get_submissions");
                } else {
                    response = await fetch("api/get_courses");
                }
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const data = await response.json();
                if (isTeacher) {
                    setCourses(data.courses);
                    setAssignments(data.assignments);
                    setStudents(data.users);
                } else {
                    setCourses(data.courses);
                }
            } catch (error) {
                console.error("Fetching error:", error.message);
            }
        };

        fetchCourses();
    }, [isTeacher]);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isTeacher) {
        return (
            <div className="content">
                <div className="da_scroll-bar">
                    <ToBeGradedHeader />
                    {courses.map((course, index) => {
                        const assignment = assignments[index];
                        const student = students[index];
                        return (
                            <NavLink to={`review${assignment ? `/${assignment.title}` : ''}${student ? `/${student.id}` : ''}`} key={index} className="da_course-detail">
                                <div className="da_course-cover_u"></div>
                                <div className="da_course-name">
                                    <h5 className='da_title'>{course.title}</h5>
                                    {assignment && <span className="da_assignment">{assignment.title}</span>}
                                </div>
                                <div className="da_student">{student && <span className="da_student">{student.name}</span>}</div>
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        );
    } else {
        return (
            <div className="content">
                <div className="da_scroll-bar">
                    <DaContentHeader setSearchQuery={setSearchQuery} />
                    <Card courses={filteredCourses} />
                </div>
            </div>
        );
    }
};

export default DaContent;
