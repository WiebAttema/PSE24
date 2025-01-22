
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import Questions from './pages/Questions';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Schedule" element={<Schedule />} />
            <Route path="/Questions" element={<Questions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
  // return (
  //   <div className="App">
  //     <Sidebar />
  //     <div className="content">
  //       <h1>Welcome to My Website</h1>
  //       {/* Your main content goes here */}
  //     </div>
  //   </div>
  // );
}

export default App;
