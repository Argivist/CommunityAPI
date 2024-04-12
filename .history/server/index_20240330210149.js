const express = require('express');
const app = express();
const PORT = 4000;
const http = require('http').Server(app);
const cors = require('cors');
const {Server} = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:5173"
    }
});
app.use(cors());
//
socketIO.on('connection', (socket) => {
    console.log('⚡:' + socket.id + ' user just connected!');
    socket.on('disconnect', () => {
        console.log("🔌:A user disconnected");
    });
    socket.emit('message',"Welcome To the Community");
});

//////////////////LOGIN////////////////
// app.use(express.json());
app.use('/login',(req,res)=>{
    res.send({
        token:'test123',        
    });
})
// app.post('/login', loginModule.handleLogin);

/////////////////
app.get('/api', (req, res) => {
    res.json({
        message: 'hello world',
    });
});

http.listen(PORT, () => {
    console.log('Server listening on ' + PORT);
});
