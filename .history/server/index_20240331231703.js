const express = require('express');
const app = express();
const PORT = 4000;
const http = require('http');//.Server(app);
const cors = require('cors');
const { Server } = require('socket.io');
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log('⚡:' + socket.id + ' user just connected!');

    socket.on("join_room",(data)=>{
        socket.join(data);
        console.log(socket.id+" joined room "+data)
    })

    socket.on("send_message",(data)=>{
        // console.log(data)
        socket.to(data.room).emit("receive_message",data);
    });


    socket.on('disconnect', () => {
        console.log("🔌:A user disconnected" + socket.id);
    });
});//check if someone is connected tothe server

server.listen(PORT, () => {
    console.log('Server listening on ' + PORT);
});
