



import { useState } from "react";
import PropTypes from 'prop-types';
//images
// import logo from './../img/logo/logo.png';

//css
import './../../css/Messages.css';

///Components///

function Message_Section() {
    return (
        <>
            <div className="messageSection">
                <Message us_them={true} message={"this is a test message"} nickname={"MOI"} time={"23:05"}/>
                <Message us_them={false} message={"Qui incidunt sed sit enim. Ut ut doloremque saepe ipsum. Sed error ipsum sapiente quae nam consequatur."} nickname={"TOI"} time={"23:15"}/>

                <div className="submessages date"></div>
                <div className="submessages status"></div>
            </div>
        </>
    );
}
export default Message_Section


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

Message.propTypes = {
    us_them: PropTypes.func.isRequired,
    message: PropTypes.func.isRequired,
    time: PropTypes.func.isRequired,
    nickname: PropTypes.func.isRequired

};
