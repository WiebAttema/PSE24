import React, { useState, useEffect } from "react";

const StatusQuestion = ({questionName, questionId, currentQuestionIndex, setCurrentQuestionIndex, questionIndex}) => {

    const [classLabel, setClassLabel] = useState("sa_question-notdone");
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({quest_id: questionId})
    }
    const fetchUserData = async () => {
        try {
            const response = await fetch("/api/mc_spec_answer", requestOptions); // Replace with your actual endpoint
            const result = await response.json();
            console.log("useEffect" + currentQuestionIndex)
            if (currentQuestionIndex != undefined && result.done != "") {
                setClassLabel("sa_question-done");
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    useEffect(() => {
        fetchUserData();
    }, []);

    // Switching question causes question buttons to update
    if (currentQuestionIndex !=-1) {
        console.log("Userdata changed!");
        fetchUserData();
    }
    const changeQuestionIndex = () => {
        setCurrentQuestionIndex(questionIndex)
    }

    let containerLabel;

    if (currentQuestionIndex == questionIndex) {
        containerLabel = "sa_single-container-current"
    } else {
        containerLabel = "sa_single-container"
    }

    return (
    <div className={containerLabel} onClick={changeQuestionIndex}><div className="sa_question-block">
        <div className={classLabel}></div>
    </div>
    <div className="sa_question-block-name">{questionName}</div></div>
    );
};

export default StatusQuestion;
