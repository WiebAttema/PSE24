import React, { useState } from 'react';
import CodeBlackBox from '../templates/CodeBlackBox';

const AiOutput = ({ output, updateOutput, language }) => {
    // if (!output) return null

    const [editCode, setEditCode] = useState(false)

    const handleChange = (field, value) => {
        updateOutput(field, value);
    };

    const updateChoice = (key, value) => {
        const newChoices = { ...output.questionChoices, [key]: value };
        updateOutput('choices', newChoices);
    };

    const toggleEditCode = (() => setEditCode(!editCode))

    return (
        <div className="Ca_question-container">
            <h1 className="Ca_question-header">Question</h1>
            <div className="Ca_question-content">
                <input
                    className='Ca_question'
                    type="text"
                    value={output.questionText}
                    onChange={(e) => handleChange('text', e.target.value)}
                />

                {editCode ? <textarea value={output.questionCode} onChange={(e) => handleChange('code', e.target.value)} /> : <CodeBlackBox code={output.questionCode} updateOutput={updateOutput} language={language} />}


                <button onClick={toggleEditCode} >
                    {editCode ? "Exit Edit Mode" : "Toggle Edit Mode"}
                </button>
            </div>

            <div className="ca_answer-container">
                <h1 className="answer-header">{output.questionAnswer}</h1>
                <div className="answer-options">
                    {Object.entries(output.questionChoices).map(([key, value]) => (
                        <div key={key} className="answer-option">
                            {`${key}: `}
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => updateChoice(key, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default AiOutput;