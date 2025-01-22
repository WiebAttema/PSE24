import React, { useState } from 'react';
import { MdArrowBack } from "react-icons/md";
import { NavLink } from 'react-router-dom';

const ScContentHeader = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        onSearch(term);
    };

    return (
        <div className="schedule-container">
            <div className="trcontent--header">
                <div className="trheader--title">
                    Schedule
                </div>

                <h1 className="trheader_board">
                    <NavLink to="/" className={({ isActive }) => `back-dashboard ${isActive ? 'nav-active' : ''}`}>
                        <MdArrowBack className='arrow' />
                    </NavLink>
                    Dashboard
                </h1>
            </div>
            <input
                type="text"
                className="search-bar"
                placeholder="Search assignment..."
                value={searchTerm}
                onChange={handleSearch}
            />
        </div>
    );
};

export default ScContentHeader;
