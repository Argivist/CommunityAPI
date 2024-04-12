



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
                <Message us_them="false"/>

                <div className="submessages date"></div>
                <div className="submessages status"></div>
            </div>
        </>
    );
}
export default Message_Section


function Message({ us_them }) {
    return (
        <>

            {us_them ? <div className="messages me">fcdd</div> : <div className="messages them">not</div>}
        </>
        

    );
}

Message.propTypes = {
    us_them: PropTypes.func.isRequired
};
