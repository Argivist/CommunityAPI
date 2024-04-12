import { useState } from "react";
import PropTypes from 'prop-types';
//images
import icon from './../img/profile_pics/defaultprofile.jpg';

//css
import './../css/home.css';
import './../css/header.css';

///Components///
import MessageForm from './msg/MessageForm.jsx';
import Message_Section from './msg/Message_Section.jsx';
function Msg_Page() {
    return (
        <>
            <div className="home">
                {/* chat list */}
                <div className="chatlist">
                    <Chate pic={"./../img/profile_pics/defaultprofile.jpg"} name={"Sam"} recent={"Emergency"}/> 
                </div>
                <div className="messageArea">
                    <Header />
                    <div className="messageSpace">
                    <div className="empty"></div>
                        <Message_Section />
                        <MessageForm />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Msg_Page


function Header(){
    return(
        <>
        <div className="messageheader">
<img src={icon}/>
<h3>Name</h3>            
</div>
        </>
    );
}

function Chate(){
    
}