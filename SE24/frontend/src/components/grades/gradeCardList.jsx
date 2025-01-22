import React, { useState, useEffect } from 'react';
import GradeCard from './gradeCard.jsx';
import './gradeCardList.css';

const GradeCardList = ({ searchQuery }) => {
    const [courses, setCourses] = useState([]);

    const fetchCoursesWithAssignments = async () => {
        try {
            const response = await fetch("api/get_courses_with_assignments");
            if (!response.ok) {
                console.error("Error fetching courses with assignments");
            } else {
                const data = await response.json();
                setCourses(data.courses);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchCoursesWithAssignments();
    }, []);

    // Filter courses based on search query
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="gradeCardList">
            {filteredCourses.map((course, index) => (
                <GradeCard
                    key={index}
                    title={course.title}
                    courseColor={course.courseColor}
                    assignments={course.assignments}
                />
            ))}
        </div>
    );
}

export default GradeCardList;
