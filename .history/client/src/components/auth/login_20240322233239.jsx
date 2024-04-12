import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import React from 'react';

//css
import './../../css/auth/animation.css';
//Login function
async function loginUser(credentials) {
  return fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}


//login tab
function Login({ handleDivChange,setToken }) {
  const [isVisible, setVisible] = useState(false);
  const [uname, setUname] = useState('');
  const [pwd, setPwd] = useState('');

  useEffect(() => {
    setVisible(true);
  }, []);
  const change = () => {
    handleDivChange(2);
  }
  const setToken_ = (userToken) => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(token);
  }
//handles submit
const handleSubmit = async e => {
  e.preventDefault();
  const token = await loginUser({
    uname,
    pwd

    // valudate
  });
  setToken(token);
}
  return (
    <div className={isVisible ? 'slide-in active form' : 'slide-in form'} id="login">
      <form onSubmit={handleSubmit}>
  <input type="text" name="user" placeholder="Username/NickName/email" onChange={u => { setUname(u.target.value) }} />
      <input type="password" name="password" placeholder="Password" onChange={p => { setPwd(p.target.value) }} />
      <div className="login_btn">
        <button type='Submit'>
          Log In
        </button>
        <button onClick={change}>
          Sign Up
        </button>
      </div>
    </form>
    </div>
  )
}


//Props validation
// Prop validation
Login.propTypes = {
  handleDivChange: PropTypes.func.isRequired
  setToken:PropTypes.func.isRequired
};

//export login
export default Login;