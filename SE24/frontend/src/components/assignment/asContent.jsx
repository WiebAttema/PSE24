import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MdArrowBack } from "react-icons/md";
import './asContent.css';
import CodeBlackBox from '../templates/CodeBlackBox'

const AsContent = () => {
    const location = useLocation();
    const course = location.state?.course;
    const [answer, setAnswer] = useState('');

    const handleInputChange = (e) => {
        setAnswer(e.target.value);
    };

    return (
        <div className="content">
            <div className="trcontent--header">
                <div className="trheader--title">
                    Assignment - {course.title}
                </div>
                <h1 className="trheader_board">
                    <MdArrowBack className='arrow' />
                    Algorithms & Complexity
                </h1>
            </div>

            <div className="content_box2">
                <h1 className='question_number'>Question 1</h1>
                <h2 className='question'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    Lorem Ipsum has been the industry's standard dummy text.
                    Lorem Ipsum is simply dummy text of the printing and typesetting. 1
                </h2>
                <CodeBlackBox />
            </div>

            <div className='as_answer-box'>
            <div className='type-answer'>
                <input
                    type="text"
                    value={answer}
                    onChange={handleInputChange}
                    placeholder="Type your answer here"
                    className="answer-input"
                />
            </div>

            <div className="navigation-buttons">
                <button className="nav-button">Vorige</button>
                <button className="nav-button">Volgend</button>
            </div>
            </div>
        </div>
    );
};

export default AsContent;
