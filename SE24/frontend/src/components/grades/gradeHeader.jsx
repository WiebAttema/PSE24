import React, { useState } from 'react';
import './gradeHeader.css';
import { MdArrowBack } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import { BiSearch } from 'react-icons/bi';

const ScheduleHeader = ({ setSearchQuery }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setSearchQuery(term);
    };

    return (
        <div className="schedule-container">
            <div className="trcontent--header">
                <div className="trheader--title">
                    Grades
                </div>
                <h1 className="trheader_board">
                    <NavLink to="/" className={({ isActive }) => `back-dashboard ${isActive ? 'nav-active' : ''}`}>
                        <MdArrowBack className='arrow' />
                    </NavLink>
                    Dashboard
                </h1>
            </div>
            <div className="search-box">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search course..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <BiSearch className="icon" />
            </div>
        </div>
    );
};

export default ScheduleHeader;
