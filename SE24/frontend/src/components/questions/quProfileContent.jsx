import React from 'react';
import './quProfileContent.css'

const assignments = [
    {
        title: 'Een opdracht om call by value en call by reference duidelijk te maken in C++'
    },
    {
        title: 'Een API bouwen met Express.js en Node.js'
    },
    {
        title: 'Een eenvoudige web scraper maken met BeautifulSoup'
    },
    {
        title: 'Implementatie van verschillende sorteeralgoritmen in Java'
    },
    {
        title: 'Een simpele React-applicatie bouwen'
    }
];
const QuProfileContent = () => {
    return (
        <div className="ca_profile"> 
            <div className="ca_title_container">
                    <span className="ca_title">History</span>
                </div>
            <div className="ca_user-courses">

                {assignments.map((assignments, index) => (
                    <div className="ca_courses" key={index}> 
 
                    <div className="ca_past_assignment">
                        <h5 className='ca_assignment'>{assignments.title}</h5>
                </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuProfileContent;