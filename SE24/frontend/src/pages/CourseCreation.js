import React from 'react';
import CcContent1 from '../components/course_creation/ccContent1.jsx';
import ScProfile from '../components/schedule/scProfile.jsx';
import '../components/course_creation/courseCreation.css'

function CourseCreation() {
  return (
    <div className="cc-page-container">
        <CcContent1/>
        <ScProfile/>
    </div>
  );
}

export default CourseCreation;