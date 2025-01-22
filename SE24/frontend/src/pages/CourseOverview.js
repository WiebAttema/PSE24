import CcContent2 from '../components/course_creation/ccContent2.jsx';
import ScProfile from '../components/schedule/scProfile.jsx';
import '../components/course_creation/courseCreation.css'
import React, { useState, useEffect } from 'react';


function CourseCreation() {
  const [isTeacher, setIsTeacher] = useState(null);

  useEffect(() => {
      async function checkTeacher() {
          try {
              // Not sure what this should be set to on an actual server, but this
              // works for testing.
              const response = await fetch('/api/is_teacher')
              const data = await response.json()
              if (response.ok) {
                  setIsTeacher(data.isTeacher);
              } else {
                  console.error(data.message)
                  setIsTeacher(false);
              }
          } catch (error) {
              console.error('Fetch error:', error)
              setIsTeacher(false);
          }
      }
      checkTeacher()
  }, [])

  return (
    <div className="cc-page-container">
        <CcContent2 isTeacher={isTeacher}/>
        <ScProfile/>
    </div>
  );
}

export default CourseCreation;
