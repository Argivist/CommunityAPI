import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import React from 'react';

//css
import './../../css/auth/animation.css';

//login tab
function Login({ handleDivChange }) {
  const [isVisible,setVisible]=useState(false);

  useEffect(() => {
    setVisible(true);
  },[]);
  const change = () => {
    handleDivChange(2);
  }

  return (
    <div className={isVisible ? 'slide-in active form' : 'slide-in form'} id="login">
      <input type="text" name="user" placeholder="Username/NickName/email" />
      <input type="password" name="password" placeholder="Password" />
      <div className="login_btn">
        <button>
          Log In
        </button>
        <button onClick={change}>
          Sign Up
        </button>
      </div>
    </div>
  )
}


//Props validation
// Prop validation
Login.propTypes = {
  handleDivChange: PropTypes.func.isRequired
};

//export login
export default Login;