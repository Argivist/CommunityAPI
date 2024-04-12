import { useState } from 'react'
import socketIO from 'socket.io-client';
// CSS Imports

import './css/auth.css';
import './css/Base.css';
// image imports
import logo from './img/logo/logo.png';
const socket = socketIO.connect('http://localhost:4000');


function App() {
  //div State num, div change function
  const [selectDiv, setSelectDiv] = useState(1);
  //changes the selectDiv value
  const handeDivChange = (DivNum) => {
    setSelectDiv(DivNum);
  }



  return (
    <>
      <div className="auth_box">
        <img src={logo} width="40%" alt="logo" />
        {/* Login box */}
        {selectDiv === 1 && (
          <div className="hidden form" id="login">
            <input type="text" name="user" placeholder="Username/NickName/email" /><br />
            <input type="password" name="password" placeholder="Password" />
            <div className="login_btn">
              <button>
                Log In
              </button>
              <button onClick={()=>handeDivChange(2)}}>
                Sign Up
              </button>
            </div>
          </div>
)}
      
      </div>
    </>
  );
} queueMicrotask

export default App
