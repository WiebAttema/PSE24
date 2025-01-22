import React, { useState } from 'react';
import { MdArrowBack } from "react-icons/md";
import { NavLink } from 'react-router-dom'; // Voeg deze regel toe

const NtContentHeader = () => {

  return (
    <div className="ntcontent--header">

    <div className="ntheader--title"> 
      New test
    </div>

                <h1 className="ntheader_board">

    <NavLink to="/" className={({ isActive }) => `back-dashboard ${isActive ? 'nav-active' : ''}`}>
                    <MdArrowBack className='arrow' />
                    </NavLink>
                    Introduction to programming
                </h1>
            
  </div>

   );
};

export default NtContentHeader;