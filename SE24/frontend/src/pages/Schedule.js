
import React from 'react';

import ScContent from '../components/schedule/scContent.jsx';
import ScProfile from '../components/schedule/scProfile.jsx';
import '../App.css';


function Schedule() {
  return (
    <div style={{ display: 'flex' }}>
        <ScContent />
        <ScProfile />
    </div>
  );
}

export default Schedule;