import { useState } from 'react'
import socketIO from 'socket.io-client';
import './css/Base.css';
import './css/auth.css';
const socket=socketIO.connect('http://localhost:4000');


function App() {
  return(
    <>
    <div class="login auth_box">
      <input type="text" name="user" placeholder="Username/NickName/email"/>
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
