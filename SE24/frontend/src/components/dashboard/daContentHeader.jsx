import React, { useState } from 'react';
import { BiSearch, BiNotification } from 'react-icons/bi';


const DaContentHeader = ({ setSearchQuery }) => {

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchQuery(term);
    };

    return (
        <div className="content--header">
            <h1  className="trheader--title"> Courses</h1>
            <div className="header--activity">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search course..."
                        onChange={handleSearch} />
                    <BiSearch className="icon" />
                </div>
            </div>
        </div>
    );
};

export default DaContentHeader;
