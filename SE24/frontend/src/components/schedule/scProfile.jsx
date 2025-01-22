import React from "react";
import ProfileSideBar from "../templates/ProfileTemplate";
import ScProfileContent from "./scProfileContent";

const ScProfile = () => {

    return (
        <ProfileSideBar ProfileContent={ScProfileContent}/>
    );
  };

export default ScProfile;