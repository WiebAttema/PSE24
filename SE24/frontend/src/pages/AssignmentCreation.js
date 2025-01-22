import NtContent from '../components/assignment_creation/ntContent.jsx';
import NtProfile from '../components/assignment_creation/ntProfile.jsx';
import React, { useState, useEffect } from 'react';


function AsCreation() {
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
    <div style={{ display: 'flex' }}>
        <NtContent isTeacher={isTeacher}/>
        <NtProfile />
    </div>
  );
}

export default AsCreation;
