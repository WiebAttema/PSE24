import React from 'react';
import{BiBell} from 'react-icons/bi'
import UserImage from '../images/pf.jpg'

const trProfileHeader = () => {
  return( 
  <div className="profile--header"> 
   <div className="profile-pic-name"> 
    <img src={UserImage} alt="" />
      <h2 className="header--title">John Doe</h2>
      </div>
    <div className="edit">  
        <BiBell className='icons'/> 
    </div>
  </div>
  );
};

export default trProfileHeader;