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
import Overlap from './Overlap.jsx';

function Msg_Page() {
    const [Room,setRoom]=useState("");

    const joinRoom=()=>{
        if(localStorage.getItem("token")!=""&&Room!=""){
            socket.emit("join_room",Room);
        }
    };

    return (
        <>
            <div className="home">
                {/* chat list */}
                <ChatList />
                <div id="MessageArea" className="messageArea chatselected">
                    <Header />
                    <Message_Room/>
                </div>
            </div>
            <Overlap title="test" content={
            <Overlap title="worked" content="stupid"/>
            }/>
        </>
    );
}

export default Msg_Page


function Header() {
    return (
        <>
            <div className="messageheader">
                <img src="" alt="back" onClick={
                    () => {
                        document.getElementById('ChatList').className = "chatlist nochat";
                        document.getElementById('MessageArea').className = "messageArea chatselected";
                    }
                } />
                <img src={icon} />
                <h3>Name</h3>
            </div>
        </>
    );
}


function Message_Room({Room}){
    return(
<>
<div className="messageSpace">
                        <div className="empty"></div>
                        <Message_Section />
                        <MessageForm />
                    </div>
</>

    );
}

Message_Room.PropTypes={
    Room:PropTypes.func.isRequired
}

function Chate({ pic, name, recent }) {
    return (
        <>
            <div className="item" onClick={() => {
                // transition based on chat option
                document.getElementById('ChatList').className = "chatlist chatselected";
                document.getElementById('MessageArea').className = "messageArea nochat";
            }}>
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

function ChatList() {
    return (
        <>
            <div id="ChatList" className="chatlist nochat ">
                <div className="content">
                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />
                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />
                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />
                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />

                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />
                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />
                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />
                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />
                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />
                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />
                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />

                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />
                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />
                    <Chate pic={icon} name={"Sam"} recent={
                        "Nam omnis et aut. Qui voluptas repellat qui pariatur voluptatibus asperiores et molestiae. Et consequuntur dicta officiis. Quibusdam ipsa nemo quidem eaque fugit. Id doloribus amet sed harum quia laborum voluptatibus."
                    } />
                </div>
                {/* hover bar */}
                <Toolbox/>
            </div>
        </>
    );
}


function Toolbox(){
    return (
        <>
        <div className="toolbox">
                    <div id="tools_" className="hidden">
                        <button className="tools">b</button>
                        <button className="tools">b</button>
                        <button className="tools">c</button>
                        <button className="tools">d</button>
                        <button className="tools" onClick={()=>{
                            localStorage.removeItem('token');
                            window.location.href="";

                        }

                        }><img src="https://www.icon8.com/close"/></button>
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
        </>
    );
}

