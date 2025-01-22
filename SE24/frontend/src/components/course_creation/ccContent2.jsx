import { FaPlus, FaTrash } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import CcHeader from './ccHeader.jsx';
import CcFooter from './ccFooter.jsx';
import './courseCreation.css';

const CcContent = ( {isTeacher} ) => {
    const { courseName } = useParams();  // Get courseName from the URL
    const [assignments, setAssignments] = useState([]);
    const [error, setError] = useState(null);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        deadline: ''
    });

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch(`/api/course/${courseName}/assignments`);
                if (!response.ok) {
                    throw new Error('Failed to fetch assignments');
                }
                const data = await response.json();
                setAssignments(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchAssignments();
    }, [courseName]);

    const deleteAssignment = async (assignmentId) => {
        try {
            const response = await fetch(`/api/delete_assignment/${assignmentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                // Filter out the deleted assignment from state
                const updatedAssignments = assignments.filter((assignment) => assignment.id !== assignmentId);
                setAssignments(updatedAssignments);
                console.log(`Assignment with ID ${assignmentId} deleted successfully.`);
            } else {
                console.error(`Failed to delete assignment with ID ${assignmentId}.`);
            }
        } catch (error) {
            console.error('Error deleting assignment:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAssignment((prevAssignment) => ({
            ...prevAssignment,
            [name]: value,
        }));
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    const addAssignment = async () => {
        if (newAssignment.title && newAssignment.deadline) {
            try {
                const response = await fetch(`/api/course/add_assignment/${courseName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newAssignment),
                });
                if (response.ok) {
                    const addedAssignment = await response.json();
                    addedAssignment.deadline = formatDate(addedAssignment.deadline); // Format the deadline
                    setAssignments((prevAssignments) => [...prevAssignments, addedAssignment]);
                    setNewAssignment({ title: '', deadline: '' });
                    console.log('Assignment added successfully.');
                } else {
                    throw new Error('Failed to add assignment');
                }
            } catch (error) {
                console.error('Error adding assignment:', error);
            }
        } else {
            console.error('Both fields are required to add an assignment');
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Teacher view
    if (isTeacher) {
        return (
            <div className="cc-container">
                <div className="cc-header-container">
                    <CcHeader title="Course overview"/>
                </div>
                <div className="cc-content-container">
                    <div className="content_box2">
                        {assignments.map(assignment => (
                            <div key={assignment.id} className="sc_courses">
                                <div className='assignment-link'>
                                    <div className="sc_course-detail">
                                        <div className="sc_course-cover_p"></div>
                                        <div className="sc_course-name">
                                            <h5 className='sc_title'>{assignment.title}</h5>
                                            <span className="sc_time">{assignment.deadline}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="delete-button" onClick={() => deleteAssignment(assignment.id)}><FaTrash /></button>
                            </div>
                        ))}
                        <button className='newq' /*onClick={addAssignment}*/>
                            <div className="inputs_button">
                                <p>New assignment</p>
                                <input
                                type="text"
                                className="assignment-input"
                                placeholder="Assignment Name"
                                />
                                <input
                                type="text"
                                className="assignment-input"
                                placeholder="Deadline"
                                />
                            </div>
                            <FaPlus />
                        </button>
                    </div>
                </div>
                <div className="cc-footer-container">
                    <CcFooter/>
                </div>
            </div>
        );
    }
    // Student View
    else {
        return (
        <div className="cc-container">
            <div className="cc-header-container">
                <CcHeader title="Course overview"/>
            </div>
            <div className="cc-content-container">
                <div className="content_box2">
                    {assignments.map(assignment => (
                        <div key={assignment.id} className="sc_courses">
                            <Link to={`/${assignment.course_name}/${assignment.title}/answer`} className='assignment-link'>
                                <div className="sc_course-detail">
                                    <div className="sc_course-cover_p"></div>
                                    <div className="sc_course-name">
                                        <h5 className='sc_title'>{assignment.title}</h5>
                                        <span className="sc_time">{assignment.deadline}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
          </div>

          <div className="cc-footer-container">
            <CcFooter/>
          </div>
        </div>
        );
    }
};

export default CcContent;