import { useState } from 'react';
import SaContent from '../components/student_assignment/saContent';
import SaProfile from '../components/student_assignment/saProfile';



function Dashboard() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  return (
    <div style={{ display: 'flex' }}>
      <SaContent currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex}/>
      <SaProfile currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex}/>
    </div>
  );
}

export default Dashboard;
