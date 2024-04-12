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

// Context for managing room state
const MsgRoomContext = createContext();

const useMsgRoom = () => useContext(MsgRoomContext);

const MsgRoomProvider = ({ children }) => {
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
        <MsgRoomContext.Provider value={{ Room, setRoom, RoomName, setRoomName, joinRoom, leaveRoom, messageList, setMessageList ,overlap, setOverlap, overlapcontent, setOverlapContent}}>
            {children}
        </MsgRoomContext.Provider>
    );
};

MsgRoomProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

const Msg_Page = () => {
    const  {overlap, overlapcontent } = useMsgRoom();
    return (
        <MsgRoomProvider>

            <div className="home">

                <ChatList />
                <div id="MessageArea" className="messageArea chatselected">
                    <Header />
                    <Message_Room />

                </div>
                {/*Overlaps */}

                {
                //overlap? <Overlap title={
            //        ()=>{return "This feature is not available yet"}
            //    } content={overlapcontent} /> : null 
                    
                }

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
        socket.emit("get_rooms", { token });
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
                <button className="tools" //</div>onClick={
                //    () => {
                    //    setOverlapContent("This feature is not available yet");
                //        setOverlap(true);
                //    }
                //}
                >find new friend</button>

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



// Overlap


// function Overlap({ title, content }) {
//     const {setOverlap} = useMsgRoom();
//     return (
//         <>
//             <div id="overlap" className="overlap">
//                 <div className="popup_window">
//                     <div className="titlebar">
//                         <h3>{title}</h3>
//                         <button className="close" onClick={() => {
//                             setOverlap(false);
//                         }}>x</button>
//                     </div>
//                     <div className="content">{content}</div>

//                 </div>
//             </div>
//         </>
//     );
// }

// Overlap.propTypes = {
//     title: PropTypes.func.isRequired,
//     content: PropTypes.func.isRequired

// }

//Find a friend window
//function FindFriend({ list }) {
  //  return (
    //    <>
      //      <div id="findfriend" className="overlap">
        //        <div className="popup_window">
          //          <div className="titlebar">
            ///            <h3>Find a friend</h3>
               //         <button className="close" onClick={() => {
                 //           document.getElementById('findfriend').style.display = 'none';
                   //     }}>x</button>
                    //</div>
                    //<div className="content">
                    //    <div className="friendlist">
//                            <ul>
  ///                              {list.map((friend, index) => (
     //                               <li key={index}>{friend}</li>
       //                         ))}
         //                   </ul>
           //             </div>
             //       </div>
//
  //              </div>
    //        </div>
      //  </>
//    /);
//}

//FindFriend.propTypes = {
  //  list: PropTypes.array.isRequired
//}