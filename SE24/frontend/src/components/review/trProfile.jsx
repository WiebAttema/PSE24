import React from "react";
import ProfileSideBar from "../templates/ProfileTemplate";
import TrProfileContent from "./trProfileContent";

const TrProfile = () => {

    return (
        <ProfileSideBar ProfileContent={TrProfileContent}/>
    );
  };

export default TrProfile;