import React, { useState, useEffect } from 'react';
import CodeBlackBox from './CodeBlackBox';

function MpQuestion({ question }) {
    const [selectedOption, setSelectedOption] = useState(null)
    // Handler to update state when an option is selected
    useEffect(() => console.log(selectedOption), [selectedOption])
    const [previousAnswer, setPreviousAnswer] = useState(null)
    const [fetchedPreviousAnswer, setFetchedPreviousAnswer] = useState(false)

    const getLabelClass = (value) => {
        return selectedOption === value ? 'selected' : '';
    };

    // Handler to update state when an option is selected
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const submitMCAnswer = async () => {
        try {
            const response = await fetch('/api/submit_mc_answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedOption, questionId: question.id }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network issue when trying to send the answer');
            }
            const result = await response.json();
            setPreviousAnswer(selectedOption)
            console.log('Success:', result);

        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const getPreviousAnswer = async () => {
        try {
            const response = await fetch('/api/mc_previous_answer', {
                // post omdat je de question id stuurt
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "question_id": question.id })
            });
            if (response.ok) {
                const data = await response.json();
                setPreviousAnswer(data.previousAnswer);
                console.log(data.previousAnswer)
                setFetchedPreviousAnswer(true)
            } else {
                console.error('Failed to fetch previous answer');
            }
        } catch (err) {
            console.error('Error fetching previous answer.');
        }
    };

    useEffect(() => { getPreviousAnswer() }, [question])

    const renderQuestions = () => {
        if (!fetchedPreviousAnswer) {
            return <p>Fetching previous answers</p>
        } else if (!previousAnswer) {
            return <>{
                question.options.map((option, index) => (
                    <label key={option.id} className={getLabelClass(option.id)}>
                        <input
                            type="radio"
                            value={option.id}
                            checked={selectedOption === option.id}
                            onChange={handleOptionChange}
                        />
                        {option.option_text}
                    </label>
                ))
            }
                <p>Selected: {(selectedOption - 1) % question.options.length + 1}</p>

                <button onClick={submitMCAnswer} className="sa_submit-button">Submit</button>

            </>
        } else {
            return <p>Answered: {JSON.stringify(previousAnswer.option_text)}</p>
        }
    }

    return (
        <>
            <p className="sa_question-header">{question.title}</p>
            <div className="sa_question-description">{question.question}</div>
            <div className="sa_ai-code-container">
                <CodeBlackBox code={question.code} />
            </div>
            <p className="sa_answer-tag">Options</p>
            <div className="sa_multip">
                {renderQuestions()}
            </div>

        </>
    )
}

export default MpQuestion;
