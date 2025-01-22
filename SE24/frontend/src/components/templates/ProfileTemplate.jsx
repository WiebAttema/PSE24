import React from "react";
import ProfileHeader from './ProfileHeader.jsx';

const ProfileSideBar = ( {ProfileContent}) => {

  return (
    <div className="profile">
      <ProfileHeader />
      <ProfileContent/>
    </div>
  );
};

export default ProfileSideBar;
