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

//Promisify mysql
function queryAsync(sql, args) {
    return new Promise((resolve, reject) => {
      pool.query(sql, args, (err, rows) => {
        if (err)
          return reject(err);
        resolve(rows);
      });
    });
  }

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
                        console.log("📜: The uid " + users[socket.id] + " has been recorded to " + socket.id);
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
    socket.on("get_rooms", async (data) => {
        console.log("🏠:Getting rooms for " + users[data] + data);
    
        try {
            const userRoomQuery = 'SELECT * FROM userroom WHERE uid=?';
            const userRoomResult = await queryAsync(userRoomQuery, [users[data]]);
    
            let rooms = { rooms: [], recents: [], names: [] };
    
            for (const room of userRoomResult) {
                rooms.rooms.push(room.rid);
                rooms.recents.push("private");
    
                if (room.name !== null) {
                    rooms.names.push(room.name);
                } else {
                    const usersInRoomQuery = 'SELECT * FROM userroom WHERE rid=?';
                    const usersInRoomResult = await queryAsync(usersInRoomQuery, [room.rid]);
    
                    for (const user of usersInRoomResult) {
                        if (user.uid !== users[data]) {
                            const userQuery = 'SELECT * FROM user WHERE uid=?';
                            const userResult = await queryAsync(userQuery, [user.uid]);
                            const name = userResult[0].nickname;
                            rooms.names.push(name);
                        }
                    }
                }
            }
    
            console.log(rooms);
            socket.emit("rooms", rooms);
            console.log("🏠:Rooms sent to " + users[data] + data);
        } catch (error) {
            console.error(error);
        }
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
                    console.log(data);
                    socket.emit("found", data);
                } else {
                    socket.emit("found", { users: ['failed'], uid: ['none found'] });
                }

            }
        }
        );
    });
    //create room with friend
    socket.on("create_room_with", (d) => {
        id = d.t
        data = d.f
        console.log(users[id] + " " + data)
        db.query('SELECT COUNT(*) AS num_rows FROM userroom WHERE uid IN (?,?) GROUP BY rid HAVING COUNT(DISTINCT uid) = 2;', [users[id], data], (err, userRoomResult) => {
            if (!err) {
                if (userRoomResult.length > 0) {
                    socket.emit("room_status", { status: "exists", value: userRoomResult[0].rid });
                } else {
                    db.query('INSERT INTO room (`rname`,`rdescription`) VALUES (?,?)', [data, "Friends"], (err, insertRoomResult) => {
                        let roomId = insertRoomResult.insertId;
                        if (!err) {
                            
                                
                                db.query('INSERT INTO userroom (`uid`,`rid`) VALUES (?,?)', [users[id], roomId], (err, insertUserRoomResult) => {
                                    if (!err) {
                                        console.log(socket.id + " created room " + roomId)
                                        db.query('INSERT INTO userroom (`uid`,`rid`) VALUES (?,?)', [data, roomId], (err, insertSecondUserRoomResult) => {
                                            if (!err) {
                                                socket.emit("room_status", { status: "created", value: roomId });
                                                console.log("🏠" + socket.id + users[socket.id] + " created room " + roomId);
                                            } else {
                                                console.log(err);
                                            }
                                        });
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
        messages = [];
        console.log("📬:Getting messages for " + data);
        db.query('Select * from message where rid=?', [data], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                result.forEach((message) => {
                    messages.push({ username: Object.keys(users).find(key => users[key] === message.uid), room: message.rid, message: message.mcontent, time: message.mdate });
                });
                socket.emit("messages", messages);

            }
        })


    });

    //Send message
    socket.on("send_message", (data) => {
        console.log("📩" + data.username + " sent message to " + data.room + " in room " + data.room);
        db.query('Insert into message (`uid`,`rid`,`mcontent`,`mdate`) values (?,?,?,?)', [users[data.username], data.room, data.message, new Date()], (err, result) => {
            if (err) {
                console.log('⚠️' + "error in sending message");
                console.log(err);
                console.log(data);
            }
            else {
                console.log("📩" + users[data.username] + " sent message to " + data.room + " in room " + data.room);
            }
        });
        socket.to(data.room).emit("receive_message", data);
    });

    //Create Group
    socket.on("create_group", (data) => {
        db.query('Select * from room where rname=?', [data.name], (err, result) => {
            if (!err) {
                if (result.length > 0) {
                    socket.emit("group_status", { status: "exists", value: result[0].rid });
                } else {

                    db.query('Insert into room (`rname`,`rdescription`) values (?,?)', [data.name, data.description], (err, result) => {
                        if (!err) {
                            db.query('Insert into Group_(`rid`,`gname`,`gdescription`) values (?,?,?)', [result.insertId, data.name, data.description], (err, result) => {
                                if (!err) {
                                    let room = result.insertId;
                                    let roomname = data.name;

                                    db.query('Insert into userroom (`uid`,`rid`,`name`) values (?,?,?)', [users[data.token], room, roomname], (err, result) => {
                                        console.log(room);
                                        if (!err) {
                                            data.members.forEach((member) => {
                                                db.query('Insert into userroom (`uid`,`rid`,`name`) values (?,?,?)', [member, room, roomname], (err, result) => {
                                                    console.log(room);
                                                    if (!err) {
                                                        socket.emit("group_status", { status: "created", value: room });
                                                    }
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    });
    //find group
    socket.on("find_group", (data) => {
        let groups = [];
        let gid = [];
        db.query('Select * from group_ where gname like ?', ['%' + data + '%'], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                if (result.length > 0) {
                    result.forEach((group) => {
                        groups.push(group.gname);
                        gid.push(group.rid);

                    });
                    let data = { groups: groups, gid: gid };
                    socket.emit("found_group", data);
                    console.log(data);
                } else {
                    socket.emit("found_group", { groups: ['failed'], gid: ['none found'] });
                }

            }
        }
        );
    });
    //Join group
    socket.on("join_group", (data) => {
        db.query('Insert into userroom (`uid`,`rid`) values (?,?)', [users[data.token], data.rid], (err, result) => {
            if (!err) {
                socket.emit("group_status", { status: "joined", value: data.rid });
            }
        });
    });

    //Random friend maker
    socket.on("random_friend", (data) => {
        console.log("🗺️:Finding friend for " + users[data]);
        db.query('Select * from user where uid!=? ORDER BY RAND() LIMIT 1', [users[data]], (err, result) => {
            if (!err) {
                let hobby = result[0].hobby;
                let interest = result[0].interest;
                let genre = result[0].genre;

                db.query('Select * from user where hobby=? and interest=? and genre=?', [hobby, interest, genre], (err, result) => {
                    if (!err) {
                        if (result.length > 0) {
                            let user = result[Math.floor(Math.random() * result.length)];
                            let data = { user: user.nickname, uid: user.uid, hobby: user.hobby, interest: user.interest, genre: user.genre, remark: "Both of you have similar interests, hobbies and genres" };
                            socket.emit("found_friendn", data);
                            console.log("📌 Found a friend\n " + data.user);
                        } else {
                            db.query('Select * from user where hobby=? and interest=? or hobby=? and genre=? or interest=? and genre=?', [hobby, interest, hobby, genre, interest, genre], (err, result) => {
                                if (!err) {
                                    if (result.length > 0) {
                                        let user = result[Math.floor(Math.random() * result.length)];
                                        let data = { user: user.nickname, uid: user.uid, hobby: user.hobby, interest: user.interest, genre: user.genre, remark: "Both of you have similar interests, hobbies or genres" };
                                        socket.emit("found_friendn", data);
                                        console.log("📌 Found a friend\n " + data.user);
                                    } else {
                                        db.query('Select * from user where hobby=? or interest=? or genre=?', [hobby, interest, genre], (err, result) => {
                                            if (!err) {
                                                if (result.length > 1) {
                                                    //while the person is not in the same room which is not a group as the requester or the person is not the requester
                                                    user = result[Math.floor(Math.random() * result.length)];
                                                    while (result[0].uid == users[data]) {
                                                        user = result[Math.floor(Math.random() * result.length)];
                                                    }
                                                    let data = { user: user.nickname, uid: user.uid, hobby: user.hobby, interest: user.interest, genre: user.genre, remark: "Both of you have similar interests, hobbies or genres" };
                                                    socket.emit("found_friendn", data);
                                                    console.log("📌 Found a friend\n " + data.user);
                                                } else {
                                                    if (result.length = 1) {
                                                        if (result[0].uid != users[data]) {
                                                            let user = result[0];
                                                            let data = { user: user.nickname, uid: user.uid, hobby: user.hobby, interest: user.interest, genre: user.genre, remark: "Both of you have similar interests, hobbies or genres" };
                                                            socket.emit("found_friendn", data);
                                                            console.log("📌 Found a friend\n " + data.user);
                                                        } else {
                                                            socket.emit("found_friendn", { user: 'failed', uid: 'none found' });
                                                            console.log("💔 No Friend Found");
                                                        }
                                                    }
                                                    socket.emit("found_friendn", { user: 'failed', uid: 'none found' });
                                                    console.log("💔 No Friend Found");
                                                }
                                            }
                                        });
                                    }
                                }

                            });
                        }
                    }
                });
            }
        });
    });


    //Disconnect
    socket.on('disconnect', () => {
        console.log("🔌:A user disconnected" + socket.id);
    });
});//check if someone is connected to the server

server.listen(PORT, () => {
    console.log('Server listening on ' + PORT);
});
