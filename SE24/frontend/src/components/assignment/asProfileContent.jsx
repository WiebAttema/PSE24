import React, { useState } from 'react';
import '../templates/profile.css';
import './asPC.css';
import { FaCheck, FaTimes } from 'react-icons/fa';

const AsProfileContent = () => {

    const totq = 15; // Voorbeeld: aantal vragen

    // Voorbeeld: array om bij te houden welke vragen al zijn gedaan
    const completedQuestions = [1, 3];

    return (

        
        <div className="profile">

            <div className='mid-content'>


                {/* Samenvatting sectie */}
                <div className="time-left">
                    <h2 className='tijd'>Time</h2>

                    <div className="time-box">
                        <div className="time-part">02</div>
                        <div className="time-label">h</div>
                        <div className="time-part">02</div>
                        <div className="time-label">m</div>
                    </div>
                </div>

             <div className="question-boxs">
                <h2 className='tijd'>Questions</h2>
                <div className="question-indicators">
                    {Array.from({ length: totq }, (_, index) => (
                        <div
                            key={index}
                            className={`question-indicator ${completedQuestions.includes(index + 1) ? 'completed' : ''}`}
                        ></div>
                    ))}
                </div>
            </div>

            </div>
        </div>
    );
};

export default AsProfileContent;