import React, { useState, useEffect } from 'react';
import '../schedule/sc.css';
import './ProfileContent.css';
import { MdArrowBack } from "react-icons/md";
import { NavLink } from 'react-router-dom';

const ProfileContent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch user profile data');
      }
      const userData = await response.json();
      setName(userData.name);
      setEmail(userData.email);
    } catch (error) {
      console.error('Error fetching user profile data:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      if (!response.ok) {
        throw new Error('Failed to update user profile data');
      }
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error updating user profile data:', error);
    }
  };

  return (


    
    <div className="content">

<div className="trcontent--header">

<div className="trheader--title">
 Profile
</div>

<h1 className="trheader_board">
<NavLink to="/" className={({ isActive }) => `back-dashboard ${isActive ? 'nav-active' : ''}`}>
                <MdArrowBack className='arrow' />
                </NavLink>
  Dashboard
</h1>
</div>

      <div className="profile-container">

        <img 
          src="/static/media/pf.e973e4f254d0530a2936.jpg" 
          alt="Profile" 
          className="profile-picture2" 
        />
      </div>

      <form className='Form' onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="firstName" 
            placeholder="Erica"
            value={name}
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        {/* <div className="form-group">
          <label htmlFor="lastName">Last name</label>
          <input 
            type="text" 
            className="form-control" 
            id="lastName" 
            placeholder="Terpstra"
            value={name}
            onChange={(e) => setName(e.target.value)} 
          />
        </div> */}
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="ericaterpstra@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* <div className="form-group">
          <label htmlFor="phoneNumber">Phone number</label>
          <input 
            type="text" 
            className="form-control" 
            id="phoneNumber" 
            placeholder="+31 6 100 383 56"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div> */}
        <button type="submit" className="save-button">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfileContent;