import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import icon from './../img/profile_pics/defaultprofile.jpg';
//css
import './../css/msgform.css';
import './../css/home.css';
import './../css/header.css';
import './../css/chatlist.css';
import './../css/Messages.css';
// import MessageForm from './msg/MessageForm.jsx';
// import Message_Section from './msg/Message_Section.jsx';
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
            {/* <Overlap title="test" content={
                // <Overlap title="worked" content="stupid" />
            } /> */}
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
function MessageForm() {
    const [currentMessage, setCurrentMessage] = useState("");
    const { Room } = useMsgRoom();
    const sendMessage = async () => {

        if (currentMessage !== "") {
            const messageData = {
                room: Room,
                username: socket.id,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };
            await socket.emit("send_message", messageData);
        }
    };
    return (
        <>
            <div className="messageForm">
                <input className="message" type="text" onChange={(event) => {
                    setCurrentMessage(event.target.value);
                }} />
                <button className="send" onClick={sendMessage}>&#10919;</button>
            </div>
        </>
    );
}

// MessageForm.propTypes={
//     room:PropTypes.string.isRequired
// }



function Message_Section() {
    const [messageList, setMessageList] = useState([]);
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list)=>[...list,data]);
        });
    }, [socket]);
    return (
        
            <div className="messageSection">
                <h1>hello</h1>
                {messageList.map((mdata,index) => {
                    
                        <h1>{mdata}</h1>
                        // <Message
                        //     us_them={mdata.username==socket.id  ? true : false}  // Provide a defaultValue if methem is undefined
                        //     message={mdata.message}
                        //     time={mdata.time}
                        //     nickname={mdata.username}
                        // />
                    
                })}
            </div>
        
    );
}


// message
function Message({ us_them, message, time, nickname }) {
    return (
        <>

            {us_them ?
                <div className="messages me">
                    <div className="mgname">{nickname}</div>
                    <div className="msg">{message}</div>
                    <div className="time">{time}</div>
                </div>
                :
                <div className="messages them">
                    <div className="mgname">{nickname}</div>
                    <div className="msg">{message}</div>
                    <div className="time">{time}</div>
                </div>}
        </>


    );
}
//status
function Status({ statmessage }) {
    return (
        <div className="submessages status">{statmessage}</div>
    );
}


Status.propTypes = {
    statmessage: PropTypes.func.isRequired
}
Date.propTypes = {
    date: PropTypes.func.isRequired
}
Message.propTypes = {
    us_them: PropTypes.func.isRequired,
    message: PropTypes.func.isRequired,
    time: PropTypes.func.isRequired,
    nickname: PropTypes.func.isRequired

};
