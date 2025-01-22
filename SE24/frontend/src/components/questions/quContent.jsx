import React, { useState, useEffect } from 'react';
//import QuContentHeader from './quContentHeader.jsx';
import './quContent.css';
import { IoSend } from 'react-icons/io5';
import { IoMdArrowDropdown } from 'react-icons/io';
import { FaArrowUp } from "react-icons/fa";
import CodeBlackBox from '../templates/CodeBlackBox.jsx';
import AIOutput from './AIOutput.jsx';
import { useParams, Link } from 'react-router-dom';


const QuContent = () => {
    // Generation fields
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('Level');
    const [selectedQuestionType, setSelectedQuestionType] = useState('Question type');
    const [selectedPoints, setSelectedPoints] = useState(null);
    const [isOpenLanguage, setIsOpenLanguage] = useState(false);
    const [isOpenLevel, setIsOpenLevel] = useState(false);
    const [isOpenQuestionType, setIsOpenQuestionType] = useState(false);
    const [isOpenPoints, setIsOpenPoints] = useState(false);
    const [questionDescription, setQuestionDescription] = useState('');
    const [codeBoxLanguage, setCodeBoxLanguage] = useState("No question")

    // Output fields of the AI.
    // const [aiOutput, setAiOutput] = useState('');
    // For conditional rendering of the output
    const [aiOutput, setAiOutput] = useState(false)
    // The field that will be displayed
    const [questionTitle, setQuestionTitle] = useState("");
    // The actual question
    const [questionText, setQuestionText] = useState("");
    const [questionExplanation, setQuestionExplanation] = useState("");
    // For multiplechoice or true/false
    const [questionChoices, setQuestionChoices] = useState(null)
    // For multiplechoice, which is correct
    const [questionCorrectChoice, setCorrectChoice] = useState(null)
    // For open questions, to be automatically displayed after deadline, a
    // model answer so to speak.
    const [questionAnswer, setAnswer] = useState('')
    // The example code
    const [questionCode, setCode] = useState('')


    // Dropdown options
    const optionsLevel = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const optionsQuestionType = ['Multiple choice', 'Open', 'True/false'];
    const optionsPoints = [5, 10, 15, 20];

    const { questionId, questionType, courseName, assignmentName } = useParams();
    const [question, setQuestion] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (questionId) {
            // Fetch course data from the API
            const fetchCourseData = async () => {
                try {
                    const response = await fetch(`/api/question/${questionId}/${questionType}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch course data');
                    }
                    const data = await response.json();
                    setSelectedLanguage(data.language);
                    setSelectedLevel(data.level);
                    setSelectedQuestionType(questionType);
                    setSelectedPoints(data.points);
                    setQuestionDescription(data.description);
                    setCodeBoxLanguage(data.language);
                    setAiOutput(true);
                    setQuestionTitle(data.title);
                    setQuestionText(data.question);
                    setQuestionExplanation(data.explanation);
                    setQuestionChoices(data.options);
                    setCorrectChoice(data.correct);
                    setAnswer(data.answer);
                    setCode(data.code);
                    console.log(data.correct)
                } catch (error) {
                    setError(error.message);
                }
            };

            fetchCourseData();
        }
    }, [questionId, questionType]);

    if (error) {
        return <div>Error: {error}</div>;
    }


    const toggleDropdown = (param) => {
        switch (param) {
            case 'language':
                setIsOpenLanguage(!isOpenLanguage);
                setIsOpenLevel(false);
                setIsOpenQuestionType(false);
                setIsOpenPoints(false);
                break;
            case 'level':
                setIsOpenLanguage(false);
                setIsOpenLevel(!isOpenLevel);
                setIsOpenQuestionType(false);
                setIsOpenPoints(false);
                break;
            case 'questionType':
                setIsOpenLanguage(false);
                setIsOpenLevel(false);
                setIsOpenQuestionType(!isOpenQuestionType);
                setIsOpenPoints(false);
                break;
            case 'points':
                setIsOpenLanguage(false);
                setIsOpenLevel(false);
                setIsOpenQuestionType(false);
                setIsOpenPoints(!isOpenPoints);
                break;
            default:
                break;
        }
    };

    const handleOptionClick = (option, param) => {
        switch (param) {
            case 'language':
                setSelectedLanguage(option);
                setIsOpenLanguage(false);
                break;
            case 'level':
                setSelectedLevel(option);
                setIsOpenLevel(false);
                break;
            case 'questionType':
                setSelectedQuestionType(option);
                setIsOpenQuestionType(false);
                break;
            case 'points':
                setSelectedPoints(option);
                setIsOpenPoints(false);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            language: selectedLanguage,
            level: selectedLevel,
            questionType: selectedQuestionType,
            points: selectedPoints,
            question: questionText,
            description: questionDescription,
            level: selectedLevel,
        };

        try {
            const response = await fetch('/api/question_generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            setAiOutput(true);
            setQuestionText(result.Question)
            setQuestionExplanation(result.Explanation)
            setQuestionChoices(result.Choices)
            setCorrectChoice(result.Correct_choice)
            setCodeBoxLanguage(result.Language)
            setAnswer(result.Answer)
            setCode(result.Code)
            console.log(result.Correct_choice)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // TODO scheidt mp en open
    const handleVraagUpload = async (e) => {
        e.preventDefault();
        const data = {
            title: questionTitle,
            language: selectedLanguage,
            level: selectedLevel,
            questionType: selectedQuestionType,
            points: selectedPoints,
            description: questionDescription,
            question: questionText,
            choices: questionChoices,
            explanation: questionExplanation,
            correct_choice: questionCorrectChoice,
            answer: questionAnswer,
            code: questionCode,
            course: courseName,
            assignment: assignmentName
        };

        try {
            const response = await fetch('/api/question_post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleNameChange = (e) => {
        setQuestionTitle(e.target.value)
        console.log('Updated questionTitle:', e.target.value);
    }

    const updateOutput = (field, value) => {
        switch (field) {
            case 'title':
                setQuestionTitle(value);
                break;
            case 'text':
                setQuestionText(value);
                break;
            case 'explanation':
                setQuestionExplanation(value);
                break;
            case 'choices':
                setQuestionChoices(value);
                break;
            case 'correctChoice':
                setCorrectChoice(value);
                break;
            case 'answer':
                setAnswer(value);
                break;
            case 'code':
                setCode(value);
                break;
            default:
                break;
        }
    };
    ///* <CreateContentHeader name={questionTitle} /> */

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value)
    }

    return (
        <div className="ca_content">
            <div className="ca_content-container">
                <div className="question_title">Question Title</div>
               <input
                type="text"
                value={questionTitle}
                onChange={handleNameChange}
                placeholder="Enter your question title"
                className="question_title_input"
                />

                <div className="ca_content_box2">
                    <div className='ca_question_param_box'>
                        <div className="ca_question_param1">Language</div>
                        <input
                            type="text"
                            className="ca_question_input"
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                            placeholder="Enter language"
                        />
                    </div>

                    <div className='ca_question_param_box'>
                        <div className="ca_question_param1">Level</div>

                        <button className="ca_question_input" onClick={() => toggleDropdown('level')}>
                            {selectedLevel} <IoMdArrowDropdown className='ca_dropdown' />
                        </button>
                        {isOpenLevel && (
                            <div id="myDropdown" className="ca_dropdown-content1">
                                {optionsLevel.map((option, index) => (
                                    <button key={index} onClick={() => handleOptionClick(option, 'level')}>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='ca_question_param_box'>
                        <div className="ca_question_param1">Question Type</div>

                        <button className="ca_question_input" onClick={() => toggleDropdown('questionType')}>
                            {selectedQuestionType} <IoMdArrowDropdown className='ca_dropdown' />
                        </button>
                        {isOpenQuestionType && (
                            <div id="myDropdown" className="ca_dropdown-content1">
                                {optionsQuestionType.map((option, index) => (
                                    <button key={index} onClick={() => handleOptionClick(option, 'questionType')}>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}

                    </div>

                    <div className='ca_question_param_box'>
                        <div className="ca_question_param1">Points</div>
                        <button className="ca_question_input" onClick={() => toggleDropdown('points')}>
                            {selectedPoints ? `${selectedPoints} points` : 'Points'} <IoMdArrowDropdown className='ca_dropdown' />
                        </button>
                        {isOpenPoints && (
                            <div id="ca_myDropdown" className="ca_dropdown-content1">
                                {optionsPoints.map((option, index) => (
                                    <button key={index} onClick={() => handleOptionClick(option, 'points')}>
                                        {`${option} points`}
                                    </button>
                                ))}
                            </div>
                        )}

                    </div>
                </div>


                {aiOutput && <AIOutput
                    output={{
                        questionTitle,
                        questionText,
                        questionExplanation,
                        questionChoices,
                        questionCorrectChoice,
                        questionAnswer,
                        questionCode
                    }}
                    updateOutput={updateOutput}

                    language={codeBoxLanguage} />}


                <div className="ca_input-button">
                    <div className="ca_input-container">
                        <input
                            type="text"
                            className="ca_modern-input"
                            placeholder="Beschrijf de vraag hier..."
                            value={questionDescription}
                            onChange={(e) => setQuestionDescription(e.target.value)}
                        />
                        <button className="ca_send-button" onClick={handleSubmit}>
                            <FaArrowUp className="ca_send-icon" />
                        </button>
                    </div>

                    <div className="ca_navigation-buttons">
                        <button onClick={handleVraagUpload} className="ca_upload-button">upload vraag</button>
                        <button className="ca_nav-button">Vorige</button>
                        <button className="ca_nav-button">Volgend</button>
                        <button className="ca_nav-button">Overzicht</button>
                    </div>
                </div>

            </div>


            <div className="ca_ai-output"></div>


        </div>
    );
};

export default QuContent;
