import PropTypes from 'prop-types';
import './../../css/list.css';
import { useState, useEffect } from 'react';

//css
import './../../css/auth/animation.css';
//login tab
function Detail({handleDivChange}){
// navigation
    const change = (opt) => {
      if(opt==1){
        handleDivChange(2);
      }else{
        handleDivChange(4);
      }
    }


return(
<div className=" form" id="login">
            <div>
              <label htmlFor="hobby">Hobby</label>
              <ul className="hobby-list">
                <li><input type="checkbox" name="hobby" /> Reading</li>
                <li><input type="checkbox" name="hobby" /> Painting</li>
                <li><input type="checkbox" name="hobby" /> Photography</li>
              </ul>
              <div className="login_btn">
                <button onClick={()=>change(1)}>
                  <img src="https://img.icons8.com/15/back" alt="back" />
                </button>
                <button onClick={()=>change(2)}>
                  <img src="https://img.icons8.com/15/play" alt="next" />
                </button>
              </div>
            </div>

          </div>
)
}


//Props validation
// Prop validation
Detail.propTypes = {
    handleDivChange: PropTypes.func.isRequired
  };

//export login
export default Detail;