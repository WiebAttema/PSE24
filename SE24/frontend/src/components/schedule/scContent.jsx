import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ScContentHeader from './scContentHeader';
import './sc.css';
import { BiDotsVerticalRounded } from "react-icons/bi";
import { NavLink } from 'react-router-dom';

const ScheduleContent = () => {
    const { courseName } = useParams(); // Get courseName from the URL
    const [assignments, setAssignments] = useState([]);
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [error, setError] = useState(null);

    const fetchAssignments = async () => {
      try {
        let endpoint = '/api/assignments';  // Default endpoint for no courseName
        if (courseName) {
          endpoint = `/api/course/${courseName}`;
        }

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch assignments');
        }
        const data = await response.json();
        setAssignments(data.assignments);
        setFilteredAssignments(data.assignments)
      } catch (error) {
        setError(error.message);
      }
    };

    useEffect(() => {
      fetchAssignments();
    }, [courseName]);

    const handleSearch = (searchTerm) => {
      if (searchTerm.trim() === '') {
        setFilteredAssignments(assignments); // Reset to original assignments if search term is empty
      } else {
        const filtered = assignments.filter(assignment =>
          assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAssignments(filtered);
      }
    };

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className="content">
        <ScContentHeader onSearch={handleSearch}/>
        <div className="scroll-bar">
        <div className="sc_user-courses">
          <div className="sc_grade-container">
            <span className="sc_grade_title">To Do:</span>
          </div>
          {filteredAssignments.map((assignment, index) => {
            if (!assignment.published) {
              if (assignment.user_authority != 0) {
              return (
                <NavLink to={`/${assignment.course_name}/${assignment.title}/create`} className="sc_courses" key={index}>
                  <div className="sc_course-detail">
                    <div className="sc_course-cover_u"></div>
                    <div className="sc_course-name">
                      <h5 className='sc_title'>{assignment.title}</h5>
                      <span className="sc_time">{assignment.deadline}</span>
                    </div>
                  </div>
                  <div className="sc_dots"><BiDotsVerticalRounded /></div>
                </NavLink>
              );}
            } else {
              if (assignment.user_authority == 0) {
                return (
                  <NavLink to={`/${assignment.course_name}/${assignment.title}/answer`} className="sc_courses" key={index}>
                    <div className="sc_course-detail">
                      <div className="sc_course-cover_p"></div>
                      <div className="sc_course-name">
                        <h5 className='sc_title'>{assignment.title}</h5>
                        <span className="sc_time">{assignment.deadline}</span>
                      </div>
                    </div>
                    <div className="sc_dots"><BiDotsVerticalRounded /></div>
                  </NavLink>
                );
            } else {
              return (
                <div className="sc_courses" key={index}>
                  <div className="sc_course-detail">
                    <div className="sc_course-cover_p"></div>
                    <div className="sc_course-name">
                      <h5 className='sc_title'>{assignment.title}</h5>
                      <span className="sc_time">{assignment.deadline}</span>
                    </div>
                  </div>
                  <div className="sc_dots"><BiDotsVerticalRounded /></div>
                </div>
              );
            }
            }
          })}


        </div>
        </div>
      </div>
    );
  };

  export default ScheduleContent;