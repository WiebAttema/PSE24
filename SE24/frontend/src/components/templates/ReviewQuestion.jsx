import React from 'react';
import CodeBlackBox from './CodeBlackBox';

function MpQuestion({question, answer }) {
    const renderQuestions = () => {
        return (
            <>
                {question.options.map((option) => (
                    <label key={option.id}>
                        <input
                            type="radio"
                            value={option.id}
                        />
                        {option.option_text}
                    </label>
                ))}
            </>
        );
    };

    return (
        <>
            <p className="sa_question-header">{question.question}</p>
            <div className="sa_ai-code-container">
                <CodeBlackBox code={question.code} />
            </div>
            <p className="sa_answer-tag">Options</p>
            <div className="sa_multip">
                {renderQuestions()}
            </div>
            <div className='answer-box'>
                <h4 className='answer-title'>Student Answer:</h4>
                <h5 className='answer'>{answer.option_text}</h5>
            </div>
        </>
    );
}

export default MpQuestion;
