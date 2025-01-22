import React, { useState, useEffect } from 'react';
import CodeBlackBox from '../templates/CodeBlackBox'
import { MdArrowBack } from "react-icons/md";
import StudentMPQuestion from "../templates/MpQuestion"
import './saContent.css'
import { NavLink } from 'react-router-dom';
import { useParams, Link } from 'react-router-dom';

const SaContent = ({currentQuestionIndex, setCurrentQuestionIndex}) => {
    console.log("SaContent"+currentQuestionIndex);
    const { courseName, assignmentName } = useParams();
    const [selectedOption, setSelectedOption] = useState('');

    // Handler to update state when an option is selected
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const getLabelClass = (value) => {
        return selectedOption === value ? 'selected' : '';
    };


    // backend
    const [questions, setQuestions] = useState([])

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

        fetchQuestions();
    }, []);

    // print for testing
    useEffect(() => {
        console.log(questions);
    }, [questions]);

    const handlePrevious = () => {
        setCurrentQuestionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    };

    const handleNext = () => {
        setCurrentQuestionIndex((prevIndex) => (prevIndex < questions.length - 1 ? prevIndex + 1 : questions.length - 1));
    };


    return <div className="sa_content">
        <div className="sa_first-half">
            <h1 className="sa_assignment-title">{assignmentName}</h1>
            <p className="sa_backlink">
                <NavLink to={`/courseOverview/${courseName}`} className={({ isActive }) => `back-dashboard ${isActive ? 'nav-active' : ''}`}>
                    <MdArrowBack className='arrow' />
                </NavLink>
                {courseName}
            </p>
            {questions.length === 0 && (<p>No questions, either the site broke or your teacher wants you to be free</p>)}

            {questions.length > 0 && (
                <StudentMPQuestion
                    question={questions[currentQuestionIndex]}
                    selectedOption={selectedOption}
                    handleOptionChange={handleOptionChange}
                />
            )}
        </div>
        <div className="navigation_buttons sa_nav">
            <button class="nav-button" onClick={handlePrevious}>Previous</button>
            <button class="nav-button" onClick={handleNext}>Next</button>
        </div>
    </div>;
};

export default SaContent;
