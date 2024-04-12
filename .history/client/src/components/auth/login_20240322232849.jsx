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
//handles submit
const handleSubmit = async e => {
  e.preventDefault();
  const token = await loginUser({
    user,
    password

    // valudate
  });
  setToken(token);
}

//login tab
function Login({ handleDivChange }) {
  const [isVisible, setVisible] = useState(false);
  const [uname, setUname] = useState('');
  const [pwd, setPwd] = useState('');

  useEffect(() => {
    setVisible(true);
  }, []);
  const change = () => {
    handleDivChange(2);
  }

  return (
    <div className={isVisible ? 'slide-in active form' : 'slide-in form'} id="login">
      <form onSubmit={handleSubmit}>
        </form><input type="text" name="user" placeholder="Username/NickName/email" onChange={u => { setUname(u.target.value) }} />
      <input type="password" name="password" placeholder="Password" onChange={p => { setPwd(p.target.value) }} />
      <div className="login_btn">
        <button  type='Submit'>
          Log In
        </button>
        <button onClick={change}>
          Sign Up
        </button>
        </form>
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