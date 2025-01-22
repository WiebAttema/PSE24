import React from 'react';
import { useLocation } from 'react-router-dom';
import AsContent from '../components/assignment/asContent'
import AsProfile from '../components/assignment/asProfile';

const Assignment = () => {
    const location = useLocation();
    const course = location.state?.course;

    return (
        <div style={{ display: 'flex' }}>
        <AsContent />
        <AsProfile />
      </div>
    );
};

export default Assignment;
