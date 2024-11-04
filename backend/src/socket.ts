import { Server } from "socket.io";

export function SetupSocket(io: Server) {
    io.on('connection', (socket) => {
        console.log('user connected', socket.id)

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id)
        })
    })
}