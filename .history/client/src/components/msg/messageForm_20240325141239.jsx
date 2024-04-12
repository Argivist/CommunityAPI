import { useState } from "react";
import PropTypes from 'prop-types';
//images

//css
// import './../css/home.css';

///Components///
function MessageForm(){
    return (
        <>
        <div className="messageForm">
            <input type="text"/>
            <button>&#10919;</button>
        </div>
        </>
    );
}

export default MessageForm
