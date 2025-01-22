import DaProfile from '../components/dashboard/daProfile';
import DaContent from '../components/dashboard/daContent';
import React, { useState, useEffect } from 'react';
import ScProfile from '../components/schedule/scProfile'

function Dashboard() {
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

  if(isTeacher) {
      return (
          <div style={{ display: 'flex' }}>
              <DaContent isTeacher={isTeacher}/>
              <ScProfile/>
          </div>
      );
  }
  else {
      return (
          <div style={{ display: 'flex' }}>
              <DaContent isTeacher={isTeacher}/>
              <DaProfile/>
          </div>
      );
  }
}

export default Dashboard;