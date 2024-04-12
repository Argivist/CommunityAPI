import { useState } from "react";
import PropTypes from 'prop-types';
//images
import icon from './../img/profile_pics/defaultprofile.jpg';

//css
import './../css/home.css';

///Components///
import MessageForm from './msg/MessageForm.jsx';
import Message_Section from './msg/Message_Section.jsx';
function Msg_Page() {
    return (
        <>
            <div className="home">
                {/* chat list */}
                <div className="chatlist">

                </div>
                <div className="messageArea">
                    <header />
                    <div className="messageSpace">
                        <Message_Section />
                        <MessageForm />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Msg_Page
