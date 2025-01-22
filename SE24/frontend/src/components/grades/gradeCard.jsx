import PropTypes from "prop-types"
import React, { useState } from 'react';
import { FaAngleDown } from "react-icons/fa6";
import './gradeCard.css';

function calculateAverageGrade(assignments) {
    if (assignments.length === 0) {
        return 0;
    }
    const sumGrades = assignments.reduce((total, assignment) => total + assignment.grade, 0);
    const averageGrade = sumGrades / assignments.length;
    return parseFloat(averageGrade.toFixed(2));
}

const GradeCard = ({ title, courseColor, assignments }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    // A function that creates a box where a grade sits in
    const GradeBox = ({ grade, isFirst }) => {
        return (
            <div className={`gradeContainer ${isFirst ? 'first' : ''}`}>
                <h3 className='gradeNumber'>{grade}</h3>
            </div>
        );
    }

    return (
        <div className={`gradeCard ${expanded ? 'expanded' : ''}`} style={{ '--course-color': courseColor }} onClick={toggleExpand}>
            <div className="gradeColorStrip"></div>
            <div className="gradeCardTitle">
                {title}
                <div className="expandIcon">
                    <FaAngleDown className={`gradeIcon ${expanded ? 'rotated' : ''}`} />
                </div>
            </div>

            {/* Display the average grade */}
            <div className="grades">
                {!expanded && (
                    <GradeBox grade={calculateAverageGrade(assignments)} isFirst={true} />
                )}
            </div>

            {/* Expanded grade Card section */}
            {expanded && (
                <div className="additionalInfo">

                    {/* Generate the headers */}
                    <div className="assignmentDetailsHeader">
                        <div>Assignment</div>
                        <div>Submitted</div>
                        <div>Reviewed</div>
                        <div>Grade</div>
                    </div>

                    {/* Map the data onto the expaneded card */}
                    {assignments.map((assignment, index) => (
                        <div key={index} className="assignmentDetails">
                            <div className="assignemtText">{assignment.name}</div>
                            <div className="assignemtText">{assignment.submitDate}</div>
                            <div className="assignemtText">{assignment.reviewDate}</div>
                            <div className="assignemtText">
                                <GradeBox key={index} grade={assignment.grade} isActive={index === 0} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Tests if the passed props are correct
GradeCard.protoType = {
    title: PropTypes.string,
    courseColor: PropTypes.string,
    assignments: PropTypes.array,
}
// Set default values
GradeCard.defaultProps = {
    title: "Default title",
    courseColor: "#3E59B8",
    assignments: []
}

export default GradeCard;