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
                <div className="chatlist chatselected">
                    <Chate pic={icon} name={"Sam"} recent={"Emergency"}/> 
                </div>
                <div className="messageArea nochat">
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

function Chate({pic,name,recent}){
    return(
        <>
            <div className="item">
                <img src={pic}/>
                <h3>{name}</h3>
                <p>{recent}</p>
            </div>
        </>
    );
}

Chate.propTypes = {
    pic: PropTypes.func.isRequired,
    name: PropTypes.func.isRequired,
    recent: PropTypes.func.isRequired
    

};