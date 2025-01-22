import React, { useState } from 'react';
import '../grades/gradeHeader.css';
import { MdArrowBack } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import { BiSearch } from 'react-icons/bi';

const ToBeGradedHeader = ({ setSearchQuery }) => {
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
                    To be graded
                </div>
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

export default ToBeGradedHeader;
