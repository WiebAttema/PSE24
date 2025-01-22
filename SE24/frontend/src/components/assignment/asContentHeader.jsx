import React, { useState } from 'react';
import { IoPencil } from "react-icons/io5";

const AsContentHeader = ({ name }) => {

    return (
        <div className="ca_content--header">
            <h1 className="ca_header_exam">
                Nieuw tentamen
            </h1>
            <div className="ca_header--title">
                {name}
                <IoPencil className="ca_pencil" />
            </div>

        </div>


    );
};

export default AsContentHeader;