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

// const socket = io.connect('http://localhost:4001');

const socket = io.connect('https://circleapi.azurewebsites.net/');
//registering the socket id with the server
socket.emit("reconnect", socket.id);
socket.on("reconnected", (data) => {
    localStorage.setItem("token", data.value);
});

socket.on("dejoin", () => {
    localStorage.removeItem("token");
    window.location.href = "";
});

// Context for managing room state
const MsgRoomContext = createContext();

const useMsgRoom = () => useContext(MsgRoomContext);

const MsgRoomProvider = ({ children }) => {
    // const [rooms, setRooms] = useState([]);
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
            <div onClick={() => {
                document.getElementById('ChatList').className = "chatlist nochat";
                document.getElementById('MessageArea').className = "messageArea chatselected";
            }}>
                <h3>⬅️</h3>
            </div>
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
    const { overlap, overlapcontent } = useMsgRoom();
    const [rooms, setRooms] = useState([]);
    const [recents, setRecents] = useState([]);
    const [Name, setName] = useState("");
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(token);
        socket.emit("get_rooms", token);
        socket.on("rooms", (data) => {
            console.log(data);
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
                {
                    overlap ? <Overlap title={
                        () => { return "This feature is not available yet" }
                    } content={overlapcontent} /> : null

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
                            <FindFriend />
                        )
                        setOverlap(true);
                    }
                }
                >➕</button>

                <button className="tools"
                    onClick={
                        () => {
                            setOverlapContent(
                                <CreateGroup />
                            )
                            setOverlap(true);
                        }
                    }
                >
                    🫂
                </button>
                <button className="tools"
                    onClick={
                        () => {
                            setOverlapContent(
                                <JoinGroup />
                            )
                            setOverlap(true);
                        }
                    }
                >🔎</button>
                {/*Updating nickname button*/}
                <button className="tools"
                    onClick={
                        () => {
                            setOverlapContent(
                                <UpdateNickName/>
                            )
                            setOverlap(true);
                        }
                    }
                >📝</button>
                {/*Delete Account Permanently*/}
                <button className="tools"
                    onClick={
                        () => {
                            setOverlapContent(
                                <DeleteAccount />
                            )
                            setOverlap(true);
                        }
                    }
                >🗑️</button>
                <button className="tools"
                    onClick={
                        () => {
                            setOverlapContent(

                                <RandomFriend />

                            )
                            setOverlap(true);

                        }
                    }
                >🗺️</button>

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
    const { messageList, setMessageList } = useMsgRoom();
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
            {messageList.map((mdata,index) => (
                console.log(mdata),
                <Message
                    key={index} // Assuming username is unique
                    us_them={mdata.username === localStorage.getItem("token")}
                    message={mdata.message}
                    time={mdata.time}
                    nickname={mdata.sender}
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
                    <div className="mgname">You</div>
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
function FindFriend() {
    const [ searchValue,setSearchValue] = useState('');
    const [foundFriends, setFoundFriends] = useState([]);


    useEffect(() => {
        const handleFoundFriends = (data) => {
            
            setFoundFriends([]);
            let user = data.users;
            let uid = data.uid;
            
            let updatedFriends = [];

            // Loop through user and uid arrays
            user.forEach((friend, index) => {
                // Add each friend to updatedFriends array
                updatedFriends.push({ username: friend, id: uid[index] });
            });
    
            // Set foundFriends to the updated array
            setFoundFriends(updatedFriends);
        
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
                                console.log(friend);
                                return <FriendButton key={index} friend={friend.username} friendid={friend.id} />

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
function FriendButton({ friend, friendid }) {
    const { Room, setRoom, setRoomName, joinRoom, leaveRoom, setOverlap } = useMsgRoom();
    return (
        <>
            <button className="friendbutton" onClick={
                () => {
                    leaveRoom(Room);
                    //creating the room
                    
                    socket.emit("create_room_with", { f: friendid, t: localStorage.getItem("token") });
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
    const { setOverlap, setOverlapContent } = useMsgRoom();
    const [ searchValue,setSearchValue] = useState('');
    const [groupname, setGroupName] = useState('');
    const [description, setDescription] = useState('');
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
                <input type="text" placeholder="Group Name" onChange={
                    (event) => {
                        setGroupName(event.target.value);
                    }
                } />
                <input type="text" placeholder="Description" onChange={
                    (event) => {
                        setDescription(event.target.value);
                    }

                } />
                <input type="text" placeholder="Add members" onChange={
                    handleSearchChange
                } />

                {
                    foundFriends.map((friend, index) => {
                        if (friend.username !== 'failed') {
                            if (addedFriends.includes(friend.id)) {
                                return <button key={index} value={friend.username}>Added</button>
                            } else {
                                return <button key={index} value={friend.username}
                                    onClick={
                                        () => {
                                            setAddedFriends((friends) => [...friends, friend.id]);
                                        }

                                    }>{friend.username}</button>
                            }
                        } else {
                            return <button key={index} value="No user found">No user found</button>
                        }

                    })
                }

                <button onClick={
                    () => {
                        socket.emit("create_group", { name: groupname, description: description, members: addedFriends, token: localStorage.getItem("token") });
                        socket.on("group_status", (data) => {
                            if (data.status === "exists") {
                                setOverlapContent(
                                    <Status statmessage="Group already exists" />
                                );
                                setOverlap(true);
                            } else if (data.status === "created") {
                                setOverlapContent(
                                    <Status statmessage="Group created" />
                                );
                                setOverlap(true);
                            } else {
                                setOverlapContent(
                                    <Status statmessage="Group creation failed" />
                                );
                                setOverlap(true);
                            }
                        });
                    }
                }>Create</button>
            </div>
        </>
    );
}
// Join Group
function JoinGroup() {
    const { setOverlap, setOverlapContent } = useMsgRoom();
    const [searchValue, setSearchValue] = useState('');
    const [foundGroups, setFoundGroups] = useState([]);
    // const [groupname, setGroupName] = useState([]);
    useEffect(() => {
        const handleFoundGroups = (data) => {

            setFoundGroups([]);
            let gname = data.groups;
            let gid = data.gid;
            gname.forEach((group, index) => {
                setFoundGroups((groups) => [...groups, { groupname: group, id: gid[index] }]);
            });

        };

        socket.on('found_group', handleFoundGroups);
        console.log(foundGroups);

        return () => {
            socket.off('found_group', handleFoundGroups);
        };
    }, []);
    const handleSearchChange = (event) => {
        const { value } = event.target;
        setSearchValue(value);
        socket.emit('find_group', value);
    };
    return (
        <>
            <div id="joingroup">
                <input type="text" placeholder="Search for a group" onChange={handleSearchChange} />

                <div className="content">
                    <div className="grouplist">

                        {foundGroups.map((group, index) => {

                            if (group.groupname !== 'failed') {
                                return <button key={index} value={group.groupname} onClick={
                                    () => {
                                        socket.emit("join_group", { gid: group.id, token: localStorage.getItem("token") });
                                        socket.on("group_status", (data) => {
                                            if (data.status === "joined") {
                                                setOverlapContent(
                                                    <Status statmessage="Group joined" />
                                                );
                                                setOverlap(true);
                                            } else if (data.status === "failed") {
                                                setOverlapContent(
                                                    <Status statmessage="Group join failed" />
                                                );
                                                setOverlap(true);
                                            }
                                        });
                                    }
                                }>{group.groupname}</button>
                            } else {
                                return <p key={index}>No group found</p>
                            }
                        })}

                    </div>
                </div>

            </div>

        </>
    );
}

//Random Friend
function RandomFriend() {
    // const { setOverlap, setOverlapContent } = useMsgRoom();
    // const [searchValue, setSearchValue] = useState('');
    const [foundFriend, setFoundFriend] = useState(null);
    useEffect(() => {
        socket.emit('random_friend', localStorage.getItem("token"));
        const handleFoundFriends = (data) => {
            console.log(data);
            setFoundFriend(data);
        };

        socket.on('found_friendn', handleFoundFriends);

        return () => {
            socket.off('found_friendn', handleFoundFriends);
        };
    }, []);

    return (
        <>
            <div id="randomfriend">


                <div className="content">
                    <div className="friend">

                        {foundFriend && (
                            <>
                                <p>name:</p>
                                <p>{foundFriend.user}</p>
                                <p>similaritie</p>
                                <p>hobby:</p>
                                <p>{foundFriend.hobby}</p>
                                <p>interest</p>
                                <p>{foundFriend.interest}</p>
                                <p>genre</p>
                                <p>{foundFriend.genre}</p>
                                <p>{foundFriend.remark}</p>
                                <FriendButton friend={foundFriend.user} friendid={foundFriend.uid} />
                            </>
                        )}
                    </div>
                </div>

            </div>

        </>
    );
}


//Update Nickname
function UpdateNickName() {
    const [nickname, setNickname] = useState('');
    const { setOverlap, setOverlapContent } = useMsgRoom();
    return (
        <>
            <div id="updatenickname">
                <input type="text" placeholder="Enter new nickname" onChange={
                    (event) => {
                        setNickname(event.target.value);
                    }
                } />
                <button onClick={
                    () => {
                        socket.emit("update_nickname", { token: localStorage.getItem("token"), nickname: nickname });
                        socket.on("nickname_status", (data) => {
                            if (data.status === "updated") {
                                setOverlapContent(
                                    <Status statmessage="Nickname updated" />
                                );
                                setOverlap(true);
                            } else if (data.status === "failed") {
                                setOverlapContent(
                                    <Status statmessage="Nickname update failed" />
                                );
                                setOverlap(true);
                            }
                        });
                    }
                }>Update</button>
            </div>
        </>
    );
}

//Delete Account
function DeleteAccount() {
    const { setOverlap, setOverlapContent } = useMsgRoom();
    return (
        <>
            <div id="deleteaccount">
                <p>Are you sure you want to delete your account?</p>
                <button onClick={
                    () => {
                        socket.emit("delete_account", localStorage.getItem("token"));
                        socket.on("account_status", (data) => {
                            if (data.status === "deleted") {
                                setOverlapContent(
                                    <Status statmessage="Account deleted" />
                                );
                                // wait 5 seconds before redirecting to the login page
                                setTimeout(() => {
                                    localStorage.removeItem('token');
                                    window.location.href = "";
                                }, 5000);
                                setOverlap(true);
                            } else if (data.status === "failed") {
                                setOverlapContent(
                                    <Status statmessage="Account deletion failed" />
                                );
                                setOverlap(true);
                            }
                        });
                    }
                }>Delete</button>
            </div>
        </>
    );
}