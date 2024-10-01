// const express = require('express')
// const bodyParser = require('body-parser');
const { Server } = require('socket.io')

const io = new Server(3000, {
    cors: true
});
// const app = express()

// app.use(bodyParser.json())

const emailToSokectIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
    // console.log('Socket Connected', socket.id);
    socket.on("room:join", data => {
        // console.log(data)
        const { email, room } = data
        emailToSokectIdMap.set(email, socket.id)
        socketIdToEmailMap.set(socket.id, email)
        io.to(room).emit('user:joined', { email, id: socket.id })
        socket.join(room)
        io.to(socket.id).emit('room:join', data)
    })


    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer });
    });
    
    socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
        console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
        console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });


    socket.on('codeUpdate', (code) => {
        // Broadcast the code to all clients except the sender
        socket.broadcast.emit('codeUpdate', code);
    });
    socket.on('codeSelector', ({ languages, codeSnipp }) => {
        // Broadcast the code to all clients except the sender
        socket.broadcast.emit('codeSelector', { languages, codeSnipp });
    });
    socket.on('outputUpdate', ({ hasError, outputLines }) => {
        // Broadcast the code to all clients except the sender
        console.log('Broadcasting outputUpdate:', { hasError, outputLines });
        socket.broadcast.emit('outputUpdate', { hasError, outputLines });
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})

// io.on('connection',(socket) => {})

// app.listen(8000, () => {
//     console.log('Server started');
// })
// io.listen(8001);