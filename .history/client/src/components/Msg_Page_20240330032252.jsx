import { useState } from "react";
import PropTypes from 'prop-types';
//images
import icon from './../img/profile_pics/defaultprofile.jpg';

//css
import './../css/home.css';
import './../css/header.css';
import './../css/chatlist.css';
///Components///
import MessageForm from './msg/MessageForm.jsx';
import Message_Section from './msg/Message_Section.jsx';



function Msg_Page() {
    return (
        <>
            <div className="home">
                {/* chat list */}
                <div className="chatlist nochat ">
                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />
                </div>
                <div className="messageArea chatselected">
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


function Header() {
    return (
        <>
            <div className="messageheader">
                <img src={icon} />
                <h3>Name</h3>
            </div>
        </>
    );
}

function Chate({ pic, name, recent }) {
    return (
        <>
            <div className="item">
                <img src={pic} />
                <div className="textasp">
                    <h3>{name}</h3>
                    <p>{recent}</p>
                </div>
            </div>
        </>
    );
}

Chate.propTypes = {
    pic: PropTypes.func.isRequired,
    name: PropTypes.func.isRequired,
    recent: PropTypes.func.isRequired


};