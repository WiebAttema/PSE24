import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MdOutlineRateReview, MdDashboard, MdPerson, MdSchedule, MdQuestionAnswer, MdStar, MdLogout } from 'react-icons/md';
import './NavBar.css';
import { FaRegNoteSticky } from "react-icons/fa6";

function NavBar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTeacher, setIsTeacher] = useState(null);

    const toggleNavBar = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        async function checkTeacher() {
            try {
                // Not sure what this should be set to on an actual server, but this
                // works for testing.
                const response = await fetch('/api/is_teacher')
                const data = await response.json()
                if (response.ok) {
                    setIsTeacher(data.isTeacher);
                } else {
                    console.error(data.message)
                    setIsTeacher(false);
                }
            } catch (error) {
                console.error('Fetch error:', error)
                setIsTeacher(false);
            }
        }
        checkTeacher()
    }, [])

    const navigate = useNavigate()

    const logout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (response.ok) {
                const data = await response.json()
                if (data.logged_out) {
                    console.log("Logging out!")
                    navigate('/login')
                } else {
                    console.error('logging out failed. Should never happen')
                }
            } else {
                console.error('logging out error response. Should never happen')
            }
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    // TEacher navbar
    if (isTeacher) {
        return (
            <div className={`navbar ${isExpanded ? 'expanded' : 'collapsed'}`}>
                <div className='navbar-top-half'>
                    <div className="logo-section">
                        <span className="logo">CI_</span>
                    </div>

                    <ul className="nav-section">
                        <li className="nav-item">
                            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>
                                <MdDashboard className="icon" />
                                <span className="nav-text">Dashboard</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`} to="/profile">
                                <MdPerson className="icon" />
                                <span className="nav-text">Profile</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`} to="/courseCreation">
                                <FaRegNoteSticky className="icon" />
                                <span className="nav-text">Course creation</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`} to="/schedule">
                                < MdSchedule className="icon" />
                                <span className="nav-text">Schedule</span>
                            </NavLink>
                        </li>
                        {/* <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`} to="/Review">
                                <MdOutlineRateReview className="icon" />
                                <span className="nav-text">Review</span>
                            </NavLink>
                        </li> */}
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`} to="/questions">
                                <MdQuestionAnswer className="icon" />
                                <span className="nav-text">Questions</span>
                            </NavLink>
                        </li>
                        {/* <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`} to="/studentassign">
                                <MdQuestionAnswer className="icon" />
                                <span className="nav-text">Student Assign</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`} to="/grades">
                                <MdStar className="icon" />
                                <span className="nav-text">Grades</span>
                            </NavLink>
                        </li> */}
                    </ul>
                </div>
                <div className="logout-section">
                    <div className="nav-item logout-item" onClick={logout}>
                        <MdLogout className="icon logout-icon" />
                    </div>
                </div>

            </div>
        );
    };


    //student navbar
    if (!isTeacher) {
        return (
            <div className={`navbar ${isExpanded ? 'expanded' : 'collapsed'}`}>
                <div className='navbar-top-half'>
                    <div className="logo-section">
                        <span className="logo">CI_</span>
                    </div>

                    <ul className="nav-section">
                        <li className="nav-item">
                            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>
                                <MdDashboard className="icon" />
                                <span className="nav-text">Dashboard</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`} to="/profile">
                                <MdPerson className="icon" />
                                <span className="nav-text">Profile</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`} to="/schedule">
                                < MdSchedule className="icon" />
                                <span className="nav-text">Schedule</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`} to="/grades">
                                <MdStar className="icon" />
                                <span className="nav-text">Grades</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className="logout-section">
                    <div className="nav-item" onClick={logout}>
                        <MdLogout className="icon logout-icon" />
                    </div>
                </div>

            </div>
        );
    }
}



export default NavBar;
