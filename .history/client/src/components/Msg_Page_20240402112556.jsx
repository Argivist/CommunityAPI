import  { createContext, useState, useContext, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import icon from './../img/profile_pics/defaultprofile.jpg';
import io from 'socket.io-client';
import './../css/msgform.css';
import './../css/home.css';
import './../css/header.css';
import './../css/chatlist.css';
import './../css/Messages.css';

const socket = io.connect('http://localhost:4000');

// Context for managing room state
const MsgRoomContext = createContext();

const useMsgRoom = () => useContext(MsgRoomContext);

const MsgRoomProvider = ({ children }) => {
    const [Room, setRoom] = useState("");
    const [messageList, setMessageList] = useState([]);

    const joinRoom = (Room) => {
        if (localStorage.getItem("token") !== "" && Room !== "") {
            socket.emit("join_room", Room);
        }
    };

    return (
        <MsgRoomContext.Provider value={{ Room, setRoom, joinRoom, messageList, setMessageList }}>
            {children}
        </MsgRoomContext.Provider>
    );
};

MsgRoomProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

const Msg_Page = () => {
    return (
        <MsgRoomProvider>
            <div className="home">
                <ChatList />
                <div id="MessageArea" className="messageArea chatselected">
                    <Header />
                    <Message_Room />
                </div>
            </div>
        </MsgRoomProvider>
    );
};

const Header = () => {
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
};

const Message_Room = () => {
    return (
        <div className="messageSpace">
            <div className="empty"></div>
            <Message_Section />
            <MessageForm />
        </div>
    );
};

const ChatList = () => {
    //getting the user rooms
    const [rooms] = useState([]);

    useEffect(() => {
        socket.emit("get_rooms", {
            token: localStorage.getItem("token")
        });
        socket.on("rooms", (data) => {
            rooms.push(data.rooms);
        });
    });

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
};

const Chate = ({ id, pic, name, recent }) => {
    const { setRoom, joinRoom,setMessageList } = useMsgRoom();
    
    return (
        <div className="item" onClick={() => {
            setMessageList([]);
            // get room chat list and set the message list to that
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
};

Chate.propTypes = {
    id: PropTypes.string.isRequired,
    pic: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    recent: PropTypes.string.isRequired
};

const Toolbox = () => {
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
};

const MessageForm = () => {
    const [currentMessage, setCurrentMessage] = useState("");
    const { Room, setMessageList } = useMsgRoom();
    const sendMessage = async () => {

        if (currentMessage !== "") {
            const messageData = {
                room: Room,
                username: socket.id,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };
    return (
        <>
            <div className="messageForm">
                <input className="message" value={currentMessage} type="text" onChange={(event) => {
                    setCurrentMessage(event.target.value);
                }} />
                <button className="send" onClick={sendMessage}>&#10919;</button>
            </div>
        </>
    );
};

const Message_Section = () => {
    const { messageList, setMessageList } = useMsgRoom();
    const targRef = useRef();
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
            targRef.current?.scrollIntoView({ behavior: "smooth" });
        });
    }, []);
    useEffect(
        () => {
            targRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [messageList]
    );

    return (
        <div className="messageSection">
            {messageList.map((mdata) => (
                <Message
                    key={mdata.username} // Assuming username is unique
                    us_them={mdata.username === socket.id}
                    message={mdata.message}
                    time={mdata.time}
                    nickname={mdata.username}
                />
            ))}
            <div ref={targRef}></div>

        </div>
    );
};

const Message = ({ us_them, message, time, nickname }) => {
    return (
        <>
            {us_them ? (
                <div className="messages me">
                    <div className="mgname">{nickname}</div>
                    <div className="msg">{message}</div>
                    <div className="time">{time}</div>
                </div>
            ) : (
                <div className="messages them">
                    <div className="mgname">{nickname}</div>
                    <div className="msg">{message}</div>
                    <div className="time">{time}</div>
                </div>
            )}
        </>
    );
};

Message.propTypes = {
    us_them: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired
};

const Status = ({ statmessage }) => {
    return (
        <div className="submessages status">{statmessage}</div>
    );
};

Status.propTypes = {
    statmessage: PropTypes.string.isRequired
};

export default Msg_Page;
