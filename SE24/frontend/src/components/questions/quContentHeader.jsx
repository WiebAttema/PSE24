import React, { useState } from 'react';
import { MdArrowBack } from "react-icons/md";
import { NavLink } from 'react-router-dom';

const QuContentHeader = () => {

  return (
    <div className="trcontent--header">

    <div className="trheader--title">
      Assignment - Intro.c
    </div>
    
    <h1 className="trheader_board">
    <NavLink to="/" className={({ isActive }) => `back-dashboard ${isActive ? 'nav-active' : ''}`}>
                    <MdArrowBack className='arrow' />
                    </NavLink>
      Algorithms & Complexity
    </h1>
    </div>

 
  );
};

export default QuContentHeader;
