
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

import CreateContent from '../components/trContent.jsx';
import TrProfile from '../components/trProfile';
import Profile from '../pages/Profile';
import Questions from '../pages/Questions';
import '../App.css';


function Review() {
  return (
    <div style={{ display: 'flex' }}>
        <CreateContent />
        <TrProfile />
    </div>
  );
}

export default Review;