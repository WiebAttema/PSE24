import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../templates/profile.css';
import './ntProfileContent.css';

const NtProfileContent = () => {
  const { courseName, assignmentName } = useParams(); // Get courseName and assignmentName from the URL
  const [summary, setSummary] = useState({
    open_questions: 0,
    four_options_questions: 0,
    true_false_questions: 0,
    total_points: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch course data from the API
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`/api/course/${courseName}/${assignmentName}/stats`);
        if (!response.ok) {
          throw new Error('Failed to fetch course data');
        }
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCourseData();
  }, [courseName, assignmentName]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile-content">
      <div className='mid-content'>
        {/* Samenvatting sectie */}
        <div className="samenvatting">
          <h2>Summary</h2>

          {/* Aantal vragen sectie */}
          <h3>Amount of questions:</h3>
          <p>Multiple choice: {summary.four_options_questions}</p>
          <p>Open: {summary.open_questions}</p>
          <p>True/false: {summary.true_false_questions}</p>

          {/* Totaal aantal vragen */}
          <h3>Total</h3>
          <p>Total questions: {summary.open_questions + summary.four_options_questions + summary.true_false_questions}</p>
          {/* Total points */}
            <p>Total points: {summary.total_points}</p>
        </div>
      </div>
    </div>
  );
};

export default NtProfileContent;
