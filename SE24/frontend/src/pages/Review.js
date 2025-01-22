import React from 'react';

import TrContent from '../components/review/trContent';
import TrProfile from '../components/review/trProfile';
import '../App.css';


function Review() {
  return (
    <div style={{ display: 'flex' }}>
        <TrContent />
        <TrProfile />
    </div>
  );
}

export default Review;
