import { env } from "process";
import { io, Socket } from "socket.io-client";


let socket: Socket

export function getSocket(): Socket {

    // console.log('socket url : ', process.env.NEXT_PUBLIC_SOCKET_URL)
    if (!socket) {
        console.log('creating connection')
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, { autoConnect: true, reconnection: true })

        return socket
        // .connect()
    }

    console.log('socket status :', socket.connected)
    return socket.connect()

}