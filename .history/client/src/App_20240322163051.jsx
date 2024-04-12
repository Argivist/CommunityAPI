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
          <div className="form" id="login">
            <input type="text" name="user" placeholder="Username/NickName/email" />
            <input type="password" name="password" placeholder="Password" />
            <div className="login_btn">
              <button>
                Log In
              </button>
              <button onClick={() => handeDivChange(2)}>
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* Profile Info box */}
        {selectDiv === 2 && (
          <div className=" form" id="login">
            <div>
              <input type="text" name="fname" placeholder="First Name" />
              <input type="text" name="lname" placeholder="Last Name" />   </div>
            <input type="text" name="nname" placeholder="Nickame" />
            <div className="login_btn">
              <button onClick={() => handeDivChange(1)}>
                <img src="https://img.icons8.com/15/back" alt="back" />
              </button>
              <button onClick={() => handeDivChange(3)}>
                <img src="https://img.icons8.com/15/play" alt="next" />
              </button>
            </div>
          </div>
        )}

        {/* Profile Info box */}
        {selectDiv === 3 && (
          <div className=" form" id="login">
            <div>
              <label htmlFor="hobby">Hobby</label>
              <ul className="hobby-list">
                <li><input type="checkbox" name="hobby" /> Reading</li>
                <li><input type="checkbox" name="hobby" /> Painting</li>
                <li><input type="checkbox" name="hobby" /> Photography</li>
              </ul>
              <div className="login_btn">
                <button onClick={() => handeDivChange(2)}>
                  <img src="https://img.icons8.com/15/back" alt="back" />
                </button>
                <button onClick={() => handeDivChange(4)}>
                  <img src="https://img.icons8.com/15/play" alt="next" />
                </button>
              </div>
            </div>

          </div>
        )}



        {/* Password box */}
        {selectDiv === 4 && (
          <div className="form" id="login">
            <input type="text" name="user" placeholder="Username/NickName/email" />
            <input type="password" name="password" placeholder="Password" />
            <div className="login_btn">
                <button onClick={() => handeDivChange(3)}>
                  <img src="https://img.icons8.com/15/back" alt="back" />
                </button>
                <button onClick={() => handeDivChange(4)}>
                  <img src="https://img.icons8.com/15/play" alt="next" />
                </button>
              </div>
          </div>
        )}



        </div>
      </>
      );
} queueMicrotask

      export default App
