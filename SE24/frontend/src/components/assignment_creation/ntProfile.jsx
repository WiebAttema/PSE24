import React from "react";
import ProfileSideBar from "../templates/ProfileTemplate";
import NtProfileContent from "./ntProfileContent";

const NtProfile = () => {

    return (
      <ProfileSideBar ProfileContent={NtProfileContent}/>
    );
  };

export default NtProfile;