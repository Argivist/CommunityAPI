import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

//css
import './../../css/auth/animation.css';
//login tab
function Security({handleDivChange}){
  const [isVisible,setVisible]=useState(false);

  useEffect(() => {
    setVisible(true);
  },[]);
// navigation
    const change = () => {
        handleDivChange(3);
    }


return(
    <div className={isVisible ? 'slide-in active form' : 'slide-in form'} id="login">
    <input type="password" name="pwd" placeholder="Enter Password" />
    <input type="password" name="pwd" placeholder="Re-enter Password" />
    <div className="login_btn">
        <button onClick={change}>
        &#8804;
        </button>
        <button>
        Register
        </button>
      </div>
  </div>
)
}


//Props validation
// Prop validation
Security.propTypes = {
    handleDivChange: PropTypes.func.isRequired
  };

//export login
export default Security;