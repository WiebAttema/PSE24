import React from "react";
import ProfileHeader from "../templates/ProfileHeader.jsx";
import SaProfileContent from "./saProfileContent.jsx";

const SaProfile = ( {currentQuestionIndex, setCurrentQuestionIndex}) => {

  return (
    <div className="profile">
      <ProfileHeader />
      <SaProfileContent currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex} />
    </div>
  );
};

export default SaProfile;