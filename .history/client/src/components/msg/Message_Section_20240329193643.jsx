



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
                            <Message />
                            <div className="messages them"></div>
                            <div className="submessages date"></div>
                            <div className="submessages status"></div>
                        </div>
        </>
    );
}
export default Message_Section


function Message({us_them}){
    return(
        <>
        <div className="messages me">fcdd</div>
        </>

    );
}


