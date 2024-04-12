const express = require('express');
const app = express();
const PORT = 4000;
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
app.use(cors());
//User dictionary
const users = {};
// MySQL
const mysql = require('mysql');
const db_conf = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Community',
    port: 3307
};
const db = mysql.createConnection(db_conf);
db.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Connected to MySQL');
    }
});


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
        db.query('Select * from user where email=? or nickname=? ', [data.uname, data.uname], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                if (result.length > 0) {
                    if (result[0].pwd == data.pwd) {
                        console.log("🔑:A user " + data.uname + "logged in" + socket.id);
                        //Assigning session in dictionary
                        
                        users[socket.id] = result[0].uid;
                        console.log("📜: The uid "+users[socket.id]+" has been recorded to "+socket.id);
                        socket.emit("auth", { success: true, value: socket.id });
                    }
                    else {
                        socket.emit("auth", { success: false, value: "Invalid Password" });
                    }
                }
                else {
                    socket.emit("auth", { success: false, value: "Invalid Username" });
                }
            }
        }
        );
    });


    // register
    socket.on("register", (data) => {
        // authenticate
        console.log("🔑:A user " + data.uname + "registered" + socket.id);
        console.log(data);
        db.query('Insert into user (`fname`,`lname`,`nickname`,`email`,`pwd`,`hobby`,`interest`,`genre`) values (?,?,?,?,?,?,?,?)', [data.fname, data.lname, data.nname, data.email, data.pwd, data.hobby, data.interest, data.genre], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                socket.emit("rstatus", { value: "success" });
            }
        });
        
    });
    //Getting user chat rooms
    socket.on("get_rooms", (data) => {
        console.log("🏠:Getting rooms for " + users[data.value]+data);
        db.query('Select * from userroom where uid=?', [users[data]], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                let rooms = { rooms: [], recents: [], names: [] };
                result.forEach((room) => {
                    rooms.rooms.push(room.rid);
                    rooms.recents.push(room.recent);
                    rooms.names.push(room.name);
                });
                socket.emit("rooms", rooms);
                console.log("🏠:Rooms sent to " + users[data]+data);
                console.log(rooms);
            }
        }
        );
    });
    //find someone
    socket.on("find", (data) => {
        let users = [];
        let uid = [];
        db.query('Select * from user where nickname like ? or email like ? or fname like ? or lname like ?', ['%' + data + '%', '%' + data + '%', '%' + data + '%', '%' + data + '%'], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                if (result.length > 0) {
                    result.forEach((user) => {
                        users.push(user.nickname);
                        uid.push(user.uid);
                    
                    });
                    let data = { users: users, uid: uid };
                    socket.emit("found", data);
                }else{
                    socket.emit("found", {users:['failed'],uid:['none found']});
                }
                
            }
        }
        );
    });
    //create room with friend
    socket.on("create_room_with", (data) => {
        db.query('SELECT COUNT(*) AS num_rows FROM userroom WHERE uid IN (?,?) GROUP BY rid HAVING COUNT(DISTINCT uid) = 2;', [users[socket.id], data], (err, userRoomResult) => {
            if (!err) {
                if (userRoomResult.length > 0) {
                    socket.emit("room_status", { status: "exists", value: userRoomResult[0].rid });
                } else {
                    db.query('INSERT INTO room (`rname`,`rdescription`) VALUES (?,?)', [data, "Friends"], (err, insertRoomResult) => {
                        if (!err) {
                            db.query('SELECT * FROM room WHERE rname=?', [data], (err, selectRoomResult) => {
                                if (!err) {
                                    if (selectRoomResult.length > 0) { // Check if result is not empty
                                        const roomId = selectRoomResult[0].rid;
                                        db.query('INSERT INTO userroom (`uid`,`rid`) VALUES (?,?)', [users[socket.id], roomId], (err, insertUserRoomResult) => {
                                            if (!err) {
                                                console.log(socket.id + " created room " + roomId)
                                                db.query('INSERT INTO userroom (`uid`,`rid`) VALUES (?,?)', [data, roomId], (err, insertSecondUserRoomResult) => {
                                                    if (!err) {
                                                        socket.emit("room_status", { status: "created", value: roomId });
                                                        console.log("🏠" + socket.id+ users[socket.id] + " created room " + roomId);
                                                    } else {
                                                        console.log(err);
                                                    }
                                                });
                                            } else {
                                                console.log(err);
                                            }
                                        });
                                    } else {
                                        console.log("No room found with name:", data);
                                    }
                                } else {
                                    console.log(err);
                                }
                            });
                        } else {
                            console.log(err);
                        }
                    });
                }
            } else {
                console.log(err);
            }
        });
    });
    
    //Create room for individual 
    socket.on("create_room", (data) => {
        
        //adds user to room
        socket.join(data);
        console.log("🏠" + socket.id + " created room " + data)
    });
    //
    //Join room
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log("➕" + socket.id + " joined room " + data)
    })

    //Leave room
    socket.on("leave_room", (data) => {
        socket.leave(data);
        console.log("🌂" + socket.id + " left room " + data)
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
