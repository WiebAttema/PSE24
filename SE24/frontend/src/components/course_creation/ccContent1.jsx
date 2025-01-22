// src/components/ccContent.jsx
import { FaPlus, FaTrash } from "react-icons/fa";
import React, { useState } from "react";
import CcHeader from './ccHeader.jsx';
import CcFooter from './ccFooter.jsx';
import './courseCreation.css'
import ColorPickerBox from '../templates/ColorBox.jsx';

const CcContent = () => {
    const [courseTitle, setTitle] = useState("");
    const [courseColor, setColor] = useState("");
    const [assignment, setAssignment] = useState("");

    return (
        <div className="cc-container">
            <div className="cc-header-container">
                <CcHeader title="Course creation" />
            </div>
            <div className="cc-content-container">
                {/* Course name input */}
                <input
                    type="text"
                    className="form-control"
                    id="course title"
                    placeholder="Course title"
                    value={courseTitle}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* Course color input */}
                <input
                    type="text"
                    className="form-control"
                    id="courseColor"
                    placeholder="Course color"
                    value={courseColor}
                    onChange={(e) => setColor(e.target.value)}
                />
                <ColorPickerBox setColor={setColor} /> {/* Pass setColor function */}
            </div>
            <div className="cc-footer-container">
                <CcFooter />
            </div>
        </div>
    );
};

export default CcContent;
