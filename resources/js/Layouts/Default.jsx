import React from 'react'
import {Outlet} from "react-router-dom";


function Default () {
    return (
        <>
            <Outlet/>
        </>
    );
}

export default Default;