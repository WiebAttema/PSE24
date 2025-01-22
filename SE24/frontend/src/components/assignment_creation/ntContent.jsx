import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NtContentHeader from './ntContentHeader.jsx';
import './ntContent.css';
import { FaPlus, FaTrash } from "react-icons/fa";

const NtContent = ( {isTeacher} ) => {
    const { courseName, assignmentName } = useParams(); // Get courseName and assignmentName from the URL
    const [vragen, setVragen] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch course data from the API
        const fetchCourseData = async () => {
            try {
                const response = await fetch(`/api/course/${courseName}/${assignmentName}/questions`);
                if (!response.ok) {
                    throw new Error('Failed to fetch course data');
                }
                const data = await response.json();
                setVragen(data.questions);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchCourseData();
    }, [courseName, assignmentName]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const deleteQuestion = async (questionId) => {
        try {
            const response = await fetch('/api/questions/${questionId}', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                // Filter out the deleted question from state
                const updatedQuestions = vragen.filter((vraag) => vraag.id !== questionId);
                setVragen(updatedQuestions);
                console.log(`Question with ID ${questionId} deleted successfully.`);
            } else {
                console.error(`Failed to delete question with ID ${questionId}.`);
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const updatedQuestions = [...vragen];
        updatedQuestions[index][name] = value;
        setVragen(updatedQuestions);
    };

    // Teacher view
    if (isTeacher) {
        return (
            <div className="content">
                <NtContentHeader />

                <div className="content_box2_nt">
                    {vragen.map((vraag, index) => (
                        <div key={index} className='test_q'>
                            <Link
                                to={`/Questions/edit/${vraag.id}/${vraag.soortVraag}`}
                                className='edit-question-link'
                            >
                                Edit Question
                            </Link>
                            <div className='question'>
                                <h2>{vraag.question} {' - '} {vraag.points} {' punten'}</h2>
                                <button onClick={() => deleteQuestion(vraag.id)}><FaTrash /></button> {/* Delete button */}
                            </div>
                            <p className='qtype'>{vraag.soortVraag}</p>
                        </div>
                    ))}

                <Link to={`/${courseName}/${assignmentName}/create_question`} className='newq'>
                    <FaPlus />
                    <p>New question</p>
                </Link>
                </div>
                <button className='publiceer-button'>
                    Post
                </button>
            </div>
        );
    }

    // Student view
    else {
        return (
            <div className="content">
                <NtContentHeader />

                <div className="content_box2_nt">
                    {vragen.map((vraag, index) => (
                        <div key={index} className='test_q'>
                            <div className='question'>
                                <h2>{vraag.question} {' - '} {vraag.points} {' punten'}</h2>
                            </div>
                            <p className='qtype'>{vraag.soortVraag}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }


};

export default NtContent;
