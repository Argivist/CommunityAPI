import { useState } from 'react'
import socketIO from 'socket.io-client';
import './css/Base.css'
const socket=socketIO.connect('http://localhost:4000');


function App() {
  return(
    <>
    <div>

    </div>
    </>
  );
}queueMicrotask

export default App
