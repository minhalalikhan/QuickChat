"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupSocket = SetupSocket;
function SetupSocket(io) {
    io.on('connection', (socket) => {
        console.log('user connected', socket.id);
        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
        });
    });
}
