import { Server } from "socket.io";
import { GroupChats } from "../DATA/data";

export function SetupSocket(io: Server) {
    // add middleware to verify authentication


    io.on('connection', (socket) => {
        console.log('user connected', socket.id)
        console.log('net count', io.engine.clientsCount)

        socket.emit('message', 'hello world')

        // EVENTS 
        socket.on('joingroup', (GroupData) => {
            console.log('join group event ')
            socket.join(GroupData.GroupName)
            socket.emit('chatgrouplistupdated', " update chat list")

            // io.to(groupname).emit('message', 'new member has joined us')

        })
        // create group

        socket.on('creategroup', (GroupData) => {

            socket.join(GroupData.GroupName)
            socket.emit('chatgrouplistupdated', " update chat list")

        })
        // JOIN GROUP
        // LEAVE GROUP

        socket.on('leavegroup', () => {

        })
        // DELETE GROUP
        socket.on('deletegroup', () => {

        })
        // Unread Update  : trigger even for active members to update latest msg
        //NEW MESSAGE

        //

        socket.on('chat_message', (groupname) => {

            //  when a user sends new messgae to grp
            // 1. send it to all other group members
            // 2. update unread notifications
            // 3. also update latest message

            io.to(groupname).emit('chat_message', "message +name of sender")

        })

        socket.on('update_unread_message', () => {
            // update unread message count
        })



        socket.on('message', (msg) => {
            console.log('message sent by ', socket.id, " : ", msg)
        })
        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id)
        })
    })
}


export function EndallConnections(io: Server) {

    io.sockets.sockets.forEach((socket) => {
        console.log('killing socket', socket.id)
        socket.disconnect()
    });
}