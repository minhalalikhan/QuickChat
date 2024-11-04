import { env } from "process";
import { io, Socket } from "socket.io-client";


let socket: Socket

export function getSocket(): Socket {

    if (!socket) {
        socket = io(env.SOCKET_URL, { autoConnect: false })
        return socket
    }

    return socket

}