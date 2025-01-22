import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import './sc.css';

const ScProfileContent = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch courses from the API
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/get_courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data.courses);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCourses();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="sch_profile">
      <div className="sch_courses-container">
        <h1 className="sch_courses-header">Courses</h1>
        <div className="scroll-bar">
          <div className="sch_course-list">
              <Link to={`/Schedule`} className="sch_course-item">
                {"All courses"}
              </Link>
              {courses.map((course, index) => (
                <Link key={index} to={`/Schedule/${course.title}`} className="sch_course-item">
                  {course.title}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScProfileContent;