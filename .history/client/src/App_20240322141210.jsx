import { useState } from 'react'
import socketIO from 'socket.io-client';
// CSS Imports
import './css/Base.css';
import './css/auth.css';

// image imports
import logo from './img/logo/logo.png';
const socket=socketIO.connect('http://localhost:4000');


function App() {
  return(
    <>
    <div className="login auth_box">
      <img src={logo} width="40%"alt="logo"/>
      <input type="text" name="user" placeholder="Username/NickName/email"/><br/>

      <input type="password" name="password" placeholder="Password"/>
      <div className="login_btn">
        <button>
          Log In
        </button>
        <button>
          Sign Up
        </button>
      </div>
    </div>
    </>
  );
}queueMicrotask

export default App
