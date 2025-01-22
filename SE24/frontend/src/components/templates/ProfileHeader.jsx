// The Profile header with a picture and name

import React, { useState, useEffect } from 'react';
import UserImage from "../../images/pf.jpg"
import "./ProfileHeader.css"

// New version Async

const ProfileHeader = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
      const fetchUserData = async () => {
          try {
              const response = await fetch('/api/user'); // Replace with your actual endpoint
              const result = await response.json();
              setUserName(result.name); // Adjust the field name based on your API response
          } catch (error) {
              console.error('Error fetching user data:', error);
          }
      };

      fetchUserData();
  }, []);

  return (
      <div className="profile--header">
          <div className="profile-pic-name">
              <img src={UserImage} alt="User Profile" />
              <h2 className="header--title">{userName}</h2>
          </div>
      </div>
  );
};

export default ProfileHeader;
