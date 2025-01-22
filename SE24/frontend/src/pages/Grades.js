import React, { useState } from 'react';
import GradeHeader from '../components/grades/gradeHeader.jsx';
import GradeCardList from '../components/grades/gradeCardList.jsx';
import ScProfile from '../components/schedule/scProfile.jsx';
import '../components/grades/grades.css';

function Grades() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="gradesContainer">
            <div className="gradesContent">
                <GradeHeader setSearchQuery={setSearchQuery} />
                <div className="scroll-bar">
                    <GradeCardList searchQuery={searchQuery} />
                </div>
            </div>
            <ScProfile/>
        </div>
    );
}

export default Grades;