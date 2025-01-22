import React from "react";
import ProfileSideBar from "../templates/ProfileTemplate";
import AsProfileContent from "./asProfileContent";

const AsProfile = () => {

    return (
        <ProfileSideBar ProfileContent={AsProfileContent}/>
    );
  };

export default AsProfile;