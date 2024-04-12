import { useState } from "react";
import PropTypes from 'prop-types';
//images

//css
import './../../css/msgform.css';

///Components///
function MessageForm(){
    return (
        <>
        <div className="messageForm">
            <input class="message"type="text"/>
            <button class="send">&#10919;</button>
        </div>
        </>
    );
}

export default MessageForm
