import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image25 from '../../images/Image25.png'
import Image26 from '../../images/Image26.png'
import Image27 from '../../images/Image27.png'
import Image7 from '../../images/Images7.jpeg'
const course = [

    {
        title: 'Nodejs',
        pic: Image26,
    },

    {
        title: 'C++',
        duration: '2 hours',
        pic: Image7,
    },

    {
        title: 'Reactjs',
        duration: '2 hours',
        pic: Image25
    },
    {
        title: 'Reactjs',
        duration: '2 hours',
        pic: Image25
    }
    , {
        title: 'Nodejs',
        pic: Image26,
    },

    {
        title: 'C++',
        duration: '2 hours',
        pic: Image7,
    },

    {
        title: 'Nodejs',
        pic: Image26,
    },

    {
        title: 'Python',
        duration: '2 hours',
        pic: Image27,
    }, {
        title: 'C++',
        duration: '2 hours',
        pic: Image7,
    },

    {
        title: 'Nodejs',
        pic: Image26,
    },

    {
        title: 'Python',
        duration: '2 hours',
        pic: Image27,
    },

]



const Card = ({ courses }) => {
    // zet dit naar "courses" als je de api wilt testen, en naar "course"
    // als je de GUI wilt testten
    return (
        <div className='card--container'>
            {courses.map((item, index) => (
                <div className="card" key={index} style={{ backgroundColor: item.color }}>
                    <Link to={`/courseOverview/${item.title}`} className="card-link">
                        {/* <img src={item.pic} alt="Card Cover" /> */}
                        <div className="card-colored"></div>
                        <div className="card--title">
                            <h2>{item.title}</h2>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Card;
