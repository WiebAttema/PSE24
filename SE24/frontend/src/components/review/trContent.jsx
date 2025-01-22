import React, { useState, useEffect } from 'react';
import TrContentHeader from './trContentHeader.jsx';
import ReviewQuestion from "../templates/ReviewQuestion";
import './trContent.css';
import { FaArrowUp } from "react-icons/fa";
import CodeBlackBox from '../templates/CodeBlackBox.jsx';
import { useParams, Link } from 'react-router-dom';

const TrContent = () => {
    const { assignmentName, studentId } = useParams();
    const [selectedOption, setSelectedOption] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [submission, setSubmission] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [courseName, setCourseName] = useState('');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`/api/get_mc_questions_from_assignment/${assignmentName}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setQuestions(result);
            } catch (error) {
                console.error(error);
            }
        };

		const fetchAnswers = async () => {
            try {
                const response = await fetch(`/api/get_mc_answers`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setAnswers(result);
            } catch (error) {
                console.error(error);
            }
        };
        // Function to fetch coursename based on assignmentName
        const fetchCourseName = async () => {
            try {
                const response = await fetch(`/api/get_course_by_assignment_name/${assignmentName}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setCourseName(result.coursename); // Assuming the API returns { "coursename": "Course Name" }
            } catch (error) {
                console.error('Error fetching course name:', error);
            }
        };

        // Function to fetch questions, answers, and submission data
        const fetchData = async () => {
            try {
                const [questionsRes, answersRes, submissionRes] = await Promise.all([
                    fetch(`/api/get_mc_questions/${assignmentName}`),
                    fetch('/api/get_mc_answers'),
                    fetch('/api/get_sub_answers')
                ]);

                if (!questionsRes.ok || !answersRes.ok || !submissionRes.ok) {
                    throw new Error('Network response was not ok');
                }

                const [questionsData, answersData, submissionData] = await Promise.all([
                    questionsRes.json(),
                    answersRes.json(),
                    submissionRes.json()
                ]);

                setQuestions(questionsData);
                setAnswers(answersData);
                setSubmission(submissionData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // fetchCourseName();
        // fetchData();
		fetchQuestions();
		fetchAnswers();
    }, [assignmentName]);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handlePrevious = () => {
        setCurrentQuestionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    };

    const handleNext = () => {
        setCurrentQuestionIndex((prevIndex) => (prevIndex < questions.length - 1 ? prevIndex + 1 : questions.length - 1));
    };

    return (
        <div className="trcontent">
            <div className="tr_firsthalf">
                <TrContentHeader assignmentName={assignmentName} courseName={courseName} />
                <div className="content_box2">
                    <h1 className='question_number'>Question {currentQuestionIndex + 1}/{questions.length}</h1>

                    {questions.length === 0 && (<p>No questions</p>)}
                    {answers.length === 0 && (<p>No answers</p>)}

                    {questions.length > 0 && answers.length > 0 && (
                        <ReviewQuestion
                            question={questions[currentQuestionIndex]}
                            answer={answers[currentQuestionIndex]}
                        />
                    )}
                </div>
            </div>
            <div className="tr_secondhalf">
                <hr className='line' style={{ borderColor: '#ebebeb' }} />

                <div className="navigation-buttons">
                    <button className="nav-button" onClick={handlePrevious}>Previous</button>
                    <button className="nav-button" onClick={handleNext}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default TrContent;
