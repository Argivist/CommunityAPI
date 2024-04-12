/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import icon from './../img/profile_pics/defaultprofile.jpg';
import io from 'socket.io-client';
import './../css/msgform.css';
import './../css/home.css';
import './../css/header.css';
import './../css/chatlist.css';
import './../css/Messages.css';
import './../css/overlap.css';

const socket = io.connect('http://localhost:4000');
//registering the socket id with the server
socket.emit("reconnect", socket.id);
socket.on("reconnected", (data) => {
    localStorage.setItem("token", data.value);
});


// Context for managing room state
const MsgRoomContext = createContext();

const useMsgRoom = () => useContext(MsgRoomContext);

const MsgRoomProvider = ({ children }) => {
    const [rooms, setRooms] = useState([]);
    const [Room, setRoom] = useState("");
    const [RoomName, setRoomName] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [overlap, setOverlap] = useState(false);
    const [overlapcontent, setOverlapContent] = useState("");


    const joinRoom = (Room) => {
        if (localStorage.getItem("token") !== "" && Room !== "") {
            socket.emit("join_room", Room);
        }
    };
    const leaveRoom = (Room) => {
        if (localStorage.getItem("token") !== "" && Room !== "") {
            socket.emit("leave_room", Room);
        }
    }

    return (
        <MsgRoomContext.Provider value={{ Room, setRoom, RoomName, setRoomName, joinRoom, leaveRoom, messageList, setMessageList, overlap, setOverlap, overlapcontent, setOverlapContent }}>
            {children}
        </MsgRoomContext.Provider>
    );
};

MsgRoomProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

const Msg_Page = () => {
    //const { overlap, overlapcontent } = useMsgRoom();
    //const [overlap, setOverlap] = useState(true);
    //const [overlapcontent, setOverlapContent] = useState("");
    return (
        <MsgRoomProvider>

            <div className="home">

                <ChatList />
                <div id="MessageArea" className="messageArea chatselected">
                    <Header />
                    <Message_Room />

                </div>
                {/*Overlaps */}



            </div>

        </MsgRoomProvider>
    );
};

const Header = () => {
    const { RoomName } = useMsgRoom();
    return (
        <div className="messageheader">
            <img src="" alt="back" onClick={() => {
                document.getElementById('ChatList').className = "chatlist nochat";
                document.getElementById('MessageArea').className = "messageArea chatselected";
            }} />
            <img src={icon} />
            <h3>{RoomName}</h3>
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
    const [rooms, setRooms] = useState([]);
    const [recents, setRecents] = useState([]);
    const [Name, setName] = useState("");
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(token);
        socket.emit("get_rooms", token );
        socket.on("rooms", (data) => {
            setRooms(data.rooms);
            setName(data.names);
            setRecents(data.recents);
        });
        // Clean up the socket listener when component unmounts
        return () => {
            socket.off("rooms");
        };
    }, [socket]); // Include socket in the dependencies array

    return (
        <div id="ChatList" className="chatlist nochat">
            <div className="content">
                {
                    rooms.map((room, index) => (
                        <Chate key={index} id={room} pic={icon} name={Name[index]} recent={recents[index]} />
                    ))
                }
            </div>
            <Toolbox />
        </div>
    );
};


const Chate = ({ id, pic, name, recent }) => {
    const { Room, setRoom, setRoomName, joinRoom, leaveRoom, setMessageList } = useMsgRoom();

    return (
        <div className="item" onClick={() => {
            setMessageList([]);
            // get room chat list and set the message list to that
            leaveRoom(Room);
            setRoom(id);
            setRoomName(name);
            joinRoom(id);
            socket.emit("get_messages", id);
            socket.on("messages", (data) => {
                console.log(data);
                setMessageList(data);
            });
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
    const { setOverlap, setOverlapContent } = useMsgRoom();
    return (
        <div className="toolbox">
            <div id="tools_" className="hidden">
                <button className="tools" onClick={
                    () => {

                        setOverlapContent(
                            <FindFriend list={["Friend1", "Friend2", "Friend3"]} />
                        )
                        setOverlap(true);
                    }
                }
                >➕</button>

                <button className="tools"
                onClick={
                    ()=>{
                        setOverlapContent(
                            <CreateGroup />
                        )
                        setOverlap(true);
                    }
                }
                >
                    🫂
                </button>
                <button className="tools">c</button>
                <button className="tools">d</button>
                <button className="tools" onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = "";
                }}>
                    ⬅️
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
                username: localStorage.getItem("token"),
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
    const { messageList, setMessageList, overlap, overlapcontent } = useMsgRoom();
    const targRef = useRef();
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
            targRef.current?.scrollIntoView({ behavior: "smooth" });
        });
        return () => {
            socket.off("receive_message");
        };
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
                    us_them={mdata.username === localStorage.getItem("token")}
                    message={mdata.message}
                    time={mdata.time}
                    nickname={mdata.username}
                />
            ))}
            <div ref={targRef}></div>
            {
                overlap ? <Overlap title={
                    () => { return "This feature is not available yet" }
                } content={overlapcontent} /> : null

            }
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



// Overlap

function Overlap({ title, content }) {
    const { setOverlap } = useMsgRoom();
    return (
        <>

            <div id="overlap" className="overlap">
                <div className="popup_window">
                    <div className="titlebar">
                        <h3>{title}</h3>
                        <button className="close" onClick={() => {
                            setOverlap(false);
                        }}>x</button>
                    </div>
                    <div className="content">{content}</div>
                </div>
            </div>
        </>
    );
}
Overlap.propTypes = {
    title: PropTypes.func.isRequired,
    content: PropTypes.func.isRequired

}

//Find a friend window
function FindFriend({ list }) {
    const [searchValue, setSearchValue] = useState('');
    const [foundFriends, setFoundFriends] = useState([]);


    useEffect(() => {
        const handleFoundFriends = (data) => {
            setFoundFriends([]);
            let user = data.users;
            let uid = data.uid;
            for (let i = 0; i < user.length; i++) {
                setFoundFriends((friends) => [...friends, { username: user[i], id: uid[i] }]);
            }
        };

        socket.on('found', handleFoundFriends);

        return () => {
            socket.off('found', handleFoundFriends);
        };
    }, []);
    const handleSearchChange = (event) => {
        const { value } = event.target;
        setSearchValue(value);
        socket.emit('find', value);
    };
    return (
        <>

            <div id="findfriend" >
                <input type="text" placeholder="Search for a friend" onChange={handleSearchChange} />

                <div className="content">
                    <div className="friendlist">

                        {foundFriends.map((friend, index) => {
                            if (friend.username !== 'failed') {
                                return <FriendButton key={index} friend={friend.username} friendid={friend.id}/>
                            } else {
                                return <p key={index}>No user found</p>
                            }
                        })}

                    </div>
                </div>

            </div>

        </>
    );
}
FindFriend.propTypes = {
    list: PropTypes.array.isRequired
}

//Friend button
function FriendButton({ friend,friendid }) {
    const  {Room, setRoom, setRoomName, joinRoom, leaveRoom,setOverlap} = useMsgRoom();
    return (
        <>
            <button className="friendbutton" onClick={
                ()=>{
                    leaveRoom(Room);
                    //creating the room
                    socket.emit("create_room_with", {f:friendid,t:localStorage.getItem("token")});
                    socket.on("room_status", (data) => {
                        if (data.status === "exists") {
                            setRoom(data.value);
                            setRoomName(friend);
                            joinRoom(data.value);
                            document.getElementById('ChatList').className = "chatlist chatselected";
                            document.getElementById('MessageArea').className = "messageArea nochat";
                            setOverlap(false);
                        } else if (data.status === "created") {
                            //adding to the chat list
                            
                            setRoom(data.value);
                            setRoomName(friend);
                            joinRoom(data.value);
                            document.getElementById('ChatList').className = "chatlist chatselected";
                            document.getElementById('MessageArea').className = "messageArea nochat";
                            setOverlap(false);
                        }
                    });
                }
            }>{friend}</button>
        </>
    );
}
FriendButton.propTypes = {
    friend: PropTypes.string.isRequired,
    friendid: PropTypes.string.isRequired
}

//create group
function CreateGroup() {
    const [searchValue, setSearchValue] = useState('');
    const [foundFriends, setFoundFriends] = useState([]);
    const [addedFriends, setAddedFriends] = useState([]);


    useEffect(() => {
        const handleFoundFriends = (data) => {
            setFoundFriends([]);
            let user = data.users;
            let uid = data.uid;
            for (let i = 0; i < user.length; i++) {
                setFoundFriends((friends) => [...friends, { username: user[i], id: uid[i] }]);
            }
        };

        socket.on('found', handleFoundFriends);

        return () => {
            socket.off('found', handleFoundFriends);
        };
    }, []);
    const handleSearchChange = (event) => {
        const { value } = event.target;
        setSearchValue(value);
        socket.emit('find', value);
    };
    return (
        <>
            <div id="creategroup">
                <input type="text" placeholder="Group Name" />
                <input type="text" placeholder="Add members" />
                <input type="text" placeholder="Add members" />
                
                    {
                    foundFriends.map((friend, index) => {
                        if (friend.username !== 'failed') {
                            if (!addedFriends.includes(friend.id)) {
                                return <button key={index} value={friend.username}>Added</button>
                            }else{
                                return <button key={index} value={friend.username}>{friend.username}</button>
                            }
                        } else {
                            return <button key={index} value="No user found">No user found</button>
                        }
                    
                    })
                    }
                
                <button>Create</button>
            </div>
        </>
    );
}
