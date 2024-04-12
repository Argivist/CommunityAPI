import { useState } from 'react'
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:4000');
// CSS Imports


import './css/Base.css';
// image imports
import logo from './img/logo/logo.png';


//component imports
// From Auth
import Login from './components/Login.jsx';
function App() {



  //div State num, div change function
  const [token, setToken] = useState();//Session Token




  return (
    <>
    if(!token){
      <Login />
    }
      </>
      );
} queueMicrotask

      export default App
