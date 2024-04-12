const express = require('express');
const app = express();
const PORT = 4000;
const http = require('http');//.Server(app);
const cors = require('cors');
const { Server } = require('socket.io');
app.use(cors());
//// Load SSL/TLS certificate and private key
// const options = {
//     key: fs.readFileSync('path/to/privatekey.pem'),
//     cert: fs.readFileSync('path/to/certificate.pem')
//   };
// MySQL
const mysql=require('mysql');
const db_conf={
    host:'localhost:3306',
    user:'root',
    password:'root',
    database:'Community'
};
const db=mysql.createConnection(db_conf);



const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log('⚡:' + socket.id + ' user just connected!');

    //Login
    socket.on("login", (data) => {
        // authenticate
        console.log("🔑:A user " + data.uname + "logged in" + socket.id);
        socket.emit("auth", { value: "token123" });
    });
    // register
    socket.on("register", (data) => {
        // authenticate
        console.log("🔑:A user " + data.uname + "registered" + socket.id);
        mysql.query('Insert into users (fname,lname,nickname,email,pwd) values(?,?,?,?,?)',[data.fname,data.lname,data.nname,data.email,data.pwd],(err,result)=>{
            if(err){
                socket.emit("rstatus", { value: "error" });
            }
            else{
                socket.emit("rstatus", { value: "success" });
            }
        });

    });
    //Getting user chat rooms
    socket.on("get_rooms", (data) => {
        //getts all the users rooms
        rooms = { rooms: ["room1", "room2", "room3"], recents: ["Hello", "Hi", "Hey"] ,names:["user1","user2","user3"]};
        socket.emit("rooms", rooms);
    });

    //Create room for individual or room
    socket.on("create_room", (data) => {
        //adds user to room
        socket.join(data);
        console.log("🏠"+socket.id + " created room " + data)
    });
    //
    //Join room
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log("➕"+socket.id + " joined room " + data)
    })

    //Leave room
    socket.on("leave_room", (data) => {
        socket.leave(data);
        console.log("🌂"+socket.id + " left room " + data)
    });

    //getting all messages
    socket.on("get_messages", (data) => {
        //getts all the users rooms
        messages = { messages: ["Hello", "Hi", "Hey"] };
        socket.emit("messages", messages);
    });

    //Send message
    socket.on("send_message", (data) => {
        // console.log(data)
        socket.to(data.room).emit("receive_message", data);
    });
    //Disconnect
    socket.on('disconnect', () => {
        console.log("🔌:A user disconnected" + socket.id);
    });
});//check if someone is connected tothe server

server.listen(PORT, () => {
    console.log('Server listening on ' + PORT);
});
