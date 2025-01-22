import React, { useState } from 'react';
import '../templates/profile.css';
import './trProfileContent.css';
import { FaCheck, FaTimes } from 'react-icons/fa';


const TrProfileContent = () => {
    const [isGoodClicked, setIsGoodClicked] = useState(false);
    const [isBadClicked, setIsBadClicked] = useState(false);
    const [feedback, setFeedback] = useState('');
    const question_id = 0;
    const option_id = 0;

    const submitFeedback = async () => {
        if (!isGoodClicked && !isBadClicked) {
            return;
        }
        try {
            const response = await fetch('/api/submit_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isGoodClicked, feedback, question_id, option_id}),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network issue when trying to send the answer');
            }
            const result = await response.json();
            console.log('Success:', result);

        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleGoodClick = () => {
        setIsGoodClicked(!isGoodClicked);
        setIsBadClicked(false);
    };

    const handleBadClick = () => {
        setIsBadClicked(!isBadClicked);
        setIsGoodClicked(false);
    };

    const handleFeedbackChange = (event) => {
        setFeedback(event.target.value);
    };

    return (
        <div className="trprofile">
            <div className='mid-content'>

            <div className="title_container">
                <span className="Feedback">Feedback</span>
            </div>
            <div className='review'>
                <h7>Answer:</h7>
                <button
                className={`simple-button ${isGoodClicked ? 'clicked' : ''}`}
                onClick={handleGoodClick}
            >
                <FaCheck className="icon2" />
            </button>

            <button
                className={`simple-button ${isBadClicked ? 'clicked' : ''}`}
                onClick={handleBadClick}
            >
                <FaTimes className="icon2" />
            </button>
            </div>

            <div>
                <h7>Extra feedback:</h7>
                <textarea rows="4" cols="50" placeholder="feedback here..." onChange={handleFeedbackChange}/>
                <button onClick={submitFeedback} className='feedback-button'>
                    Submit Feedback
                </button>
            </div>
            </div>
        </div>
    );
};

export default TrProfileContent;
