import { useState } from "react";
import PropTypes from 'prop-types';
//images
import logo from './../img/logo/logo.png';

//css
import './../css/home.css';

///Components///

function Msg_Page(){
    return (
        <>
        <div class="home">
            {/* chat list */}
            <div className="chatlist">

            </div>
            <div className="messageA">

            </div>
            <div className="messageForm">
                
            </div>
        </div>
        </>
    );
}

export default Msg_Page
