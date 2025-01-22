import React from 'react';
import ProfileContent from '../components/profile/ProfileContent.jsx';
import ScProfile from '../components/schedule/scProfile.jsx';
import '../App.css';


function Profile() {
  return (
    <div style={{ display: 'flex' }}>
        <ProfileContent />
        <ScProfile />
    </div>
  );
}

export default Profile;