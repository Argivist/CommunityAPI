import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import icon from './../img/profile_pics/defaultprofile.jpg';
//css
import './../css/msgform.css';
import './../css/home.css';
import './../css/header.css';
import './../css/chatlist.css';
// import MessageForm from './msg/MessageForm.jsx';
import Message_Section from './msg/Message_Section.jsx';
import Overlap from './Overlap.jsx';

import io from 'socket.io-client';
const socket = io.connect('http://localhost:4000');
// Context for managing room state
const MsgRoomContext = createContext();

// Custom hook to use room context
const useMsgRoom = () => useContext(MsgRoomContext);

// Provider component for room context
const MsgRoomProvider = ({ children }) => {
    const [Room, setRoom] = useState("");
    // const socket=socket;
    const joinRoom = (Room) => {
        if (localStorage.getItem("token") !== "" && Room !== "") {
            socket.emit("join_room", Room);
        }
    };

    return (
        <MsgRoomContext.Provider value={{ Room, setRoom, joinRoom }}>
            {children}
        </MsgRoomContext.Provider>
    );
};

MsgRoomProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

function Msg_Page() {
    return (
        <MsgRoomProvider>
            <div className="home">
                <ChatList />
                <div id="MessageArea" className="messageArea chatselected">
                    <Header />
                    <Message_Room />
                </div>
            </div>
            <Overlap title="test" content={
                <Overlap title="worked" content="stupid" />
            } />
        </MsgRoomProvider>
    );
}

export default Msg_Page;

function Header() {
    return (
        <div className="messageheader">
            <img src="" alt="back" onClick={() => {
                document.getElementById('ChatList').className = "chatlist nochat";
                document.getElementById('MessageArea').className = "messageArea chatselected";
            }} />
            <img src={icon} />
            <h3>Name</h3>
        </div>
    );
}

function Message_Room() {
    return (
        <div className="messageSpace">
            <div className="empty"></div>
            <Message_Section />
            <MessageForm />
        </div>
    );
}

function ChatList() {
    return (
        <div id="ChatList" className="chatlist nochat">
            <div className="content">
                <Chate id={"SamHut"} pic={icon} name={"Sam"} recent={
                    "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                } />
            </div>
            <Toolbox />
        </div>
    );
}

function Chate({ id, pic, name, recent }) {
    const { setRoom, joinRoom } = useMsgRoom();

    return (
        <div className="item" onClick={() => {
            setRoom(id);
            joinRoom(id);
            document.getElementById('ChatList').className = "chatlist chatselected";
            document.getElementById('MessageArea').className = "messageArea nochat";
        }}>
            <img src={pic} />
            <div className="textasp">
                <h3>{name}</h3>
                <p>{recent}</p>
            </div>
        </div>
    );
}

Chate.propTypes = {
    id: PropTypes.string.isRequired,
    pic: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    recent: PropTypes.string.isRequired
};

function Toolbox() {
    return (
        <div className="toolbox">
            <div id="tools_" className="hidden">
                <button className="tools">b</button>
                <button className="tools">b</button>
                <button className="tools">c</button>
                <button className="tools">d</button>
                <button className="tools" onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = "";
                }}>
                    <img src="https://www.icon8.com/close" />
                </button>
            </div>
            <button className="close" onClick={() => {
                let tools = document.getElementById("tools_");
                let toolButtons = document.querySelectorAll(".tools");

                if (tools.className == "hidden") {
                    tools.className = "shown";
                    toolButtons.forEach(button => button.classList.remove('hidden'));
                    // Trigger animation
                    toolButtons.forEach(button => button.style.animation = "appear_top 0.5s ease forwards");
                } else {
                    tools.className = "hidden";
                    // Reset animation
                    toolButtons.forEach(button => button.style.animation = "");
                }
            }}>X</button>
        </div>
    );
}




// message section



///Components///
function MessageForm(){
    return (
        <>
        <div className="messageForm">
            <input className="message"type="text"/>
            <button className="send">&#10919;</button>
        </div>
        </>
    );
}