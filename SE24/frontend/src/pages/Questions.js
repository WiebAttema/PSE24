//QU things

import React from 'react';
import QuContent from '../components/questions/quContent'
import QuProfile from '../components/questions/quProfile';

function Questions() {
  return (
    <div style={{display: "flex"}}>
      <QuContent />
      <QuProfile />
    </div>
  );

};

export default Questions;