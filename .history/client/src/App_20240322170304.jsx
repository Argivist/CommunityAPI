import { useState } from 'react'
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:4000');
// CSS Imports

import './css/auth.css';
import './css/Base.css';
// image imports
import logo from './img/logo/logo.png';


//component imports
// From Auth
import Login from './components/auth/Login.jsx';
import RegName from './components/auth/RegName.jsx';
import Detail from './components/auth/Detail.jsx';


function App() {
  //div State num, div change function
  const [selectDiv, setSelectDiv] = useState(1);
  //changes the selectDiv value
  const handleDivChange = (DivNum) => {
    setSelectDiv(DivNum);
  }



  return (
    <>
      <div className="auth_box">
        <img src={logo} width="40%" alt="logo" />
        {/* Login box */}
        {selectDiv === 1 && (
        <Login handleDivChange={handleDivChange} />
        )}

        {/* Profile Info box */}
        {selectDiv === 2 && (
          <RegName handleDivChange={handleDivChange} />
        )}

        {/* Profile Info box */}
        {selectDiv === 3 && (
          <Detail handleDivChange={handleDivChange} />
        )}



        {/* Password box */}
        {selectDiv === 4 && (
          <div className="form" id="login">
            <input type="password" name="pwd" placeholder="Enter Password" />
            <input type="password" name="pwd" placeholder="Re-enter Password" />
            <div className="login_btn">
                <button onClick={() => handeDivChange(3)}>
                  <img src="https://img.icons8.com/15/back" alt="back" />
                </button>
                <button>
                Register
                </button>
              </div>
          </div>
        )}



        </div>
      </>
      );
} queueMicrotask

      export default App
