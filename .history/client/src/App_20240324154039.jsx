import { useState } from 'react'
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:4000');
// CSS Imports


import './css/Base.css';
// image imports
import logo from './img/logo/logo.png';


//component imports
// From Auth
import Login_Page from './components/Login_Page.jsx';
function App() {



  //div State num, div change function




  return (
    <>
    if(!token){
      <Login_Page />
    }
      </>
      );
} queueMicrotask

      export default App
