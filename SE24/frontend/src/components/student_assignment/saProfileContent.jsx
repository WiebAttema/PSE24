import React, { useState, useEffect} from 'react';
import StatusQuestion from './saProfileStatusQuestion';
import { useParams, Link } from 'react-router-dom';


const SaProfileContent = ({currentQuestionIndex, setCurrentQuestionIndex}) => {
    const [questions, setQuestions] = useState([]);
    const { courseName, assignmentName } = useParams();
    // const questions = [{name: "vraag1", done:"False"},
    // {name: "vraag2", done:"True"}];
    console.log("SaProfileContent" + currentQuestionIndex);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/get_mc_questions_from_assignment/${assignmentName}`);
                const result = await response.json();
                setQuestions(result); // Adjust the field name based on your API response
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);
    return (
        <div className="sa_profile">
            <div className="sa_profile-content">
                <h3 className="sa_questions-header">Questions</h3>
                <div className="sa_questions-container">
                {
                questions.map((question, index) => (<StatusQuestion questionName={question.title} questionId = {question.id}
                    currentQuestionIndex = {currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex}
                    questionIndex = {index} />))}
                </div>
            </div>
        </div>
    );
};

export default SaProfileContent;
