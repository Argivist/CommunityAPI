import { useState } from "react";
import PropTypes from 'prop-types';
//images
import logo from './../img/logo/logo.png';

//css
import './../css/home.css';

///Components///
import MessageForm from './msg/MessageForm.jsx';
function Msg_Page() {
    return (
        <>
            <div className="home">
                {/* chat list */}
                <div className="chatlist">

                </div>
                <div className="messageArea">
                    <div className="header">
                        <img src={logo} alt="logo" />
                        <h1>Chat</h1>
                    </div>
                    <div className="messageSpace">
                        <div className="messageSpace">

                        </div>
                        <MessageForm />

                    </div>
                </div>
            </div>
        </>
    );
}

export default Msg_Page
