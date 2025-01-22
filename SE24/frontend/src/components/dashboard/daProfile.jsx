import React from "react";
import ProfileSideBar from "../templates/ProfileTemplate";
import DaProfileContent from "./daProfileContent";

const DaProfile = () => {

    return (
        <ProfileSideBar ProfileContent={DaProfileContent}/>
    );
  };

export default DaProfile;