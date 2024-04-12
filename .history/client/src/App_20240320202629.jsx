import { useState } from 'react'
import socketIO from 'socket.io-client';
const socket=socketIO.connect('http://localhost:5173');
import './App.css'

function App() {
  return(
    <>
    <h1>hello world</h1>
    </>
  );
}queueMicrotask

export default App
