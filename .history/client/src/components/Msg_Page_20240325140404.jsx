import { useState } from "react";
import PropTypes from 'prop-types';
//images
import logo from './../img/logo/logo.png';

//css
import './../css/home.css';

///Components///
import MessageForm from './msg/messageForm.jsx';
function Msg_Page(){
    return (
        <>
        <div class="home">
            {/* chat list */}
            <div className="chatlist">

            </div>
            <div className="messageArea">
            <div className="messageSpace">
                
            </div>
            <MessageForm />
        
            </div>
        </div>
        </>
    );
}

export default Msg_Page
