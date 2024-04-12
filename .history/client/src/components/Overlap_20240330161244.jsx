import { useState } from "react";
import PropTypes from 'prop-types';

function Overlap({title,content}){
    return(
        <>
        <div id="overlap" className="overlap">
            <div className="popup_window">
                <div className="titlebar">
                    <h3>{title}</h3>
                    <button className="close" onClick={()=>{
                        document.getElementById('overlap').style.display='none';
                    }}>x</button>
                </div>
                <div className="content">{content}</div>
testing
            </div>
            </div>
        </>
    );
}
export default Overlap;
Overlap.propTypes={
    title:PropTypes.func.isRequired,
    content:PropTypes.func.isRequired

}