import { Server } from "socket.io";
import { GroupChats, LastMessage, Messages } from "../DATA/data";

export function SetupSocket(io: Server) {
    // add middleware to verify authentication


    io.on('connection', (socket) => {
        console.log('user connected', socket.id)
        // console.log('net count', io.engine.clientsCount)

        socket.emit('message', 'hello world')


        // Function to join rooms 
        socket.on('Login', (GroupChatsData) => {

            console.log('this is wht I got on socket ', GroupChatsData)

            GroupChatsData.groups.forEach((group: any) => {
                socket.join((group.id as number).toString())
                io.to((group.id as number).toString()).emit('random', ' joined a group now')
                const lm = LastMessage.find((grp) => grp.GroupID == group.id && grp.User === GroupChatsData.user)
                console.log("lm in login ", lm)
                socket.emit('take_notification', lm)
            })
        })

        // EVENTS 
        socket.on('joingroup', (GroupData) => {

            socket.join((GroupData.id as number).toString())
            socket.emit('chatgrouplistupdated', " update chat list")

            // io.to(groupname).emit('message', 'new member has joined us')

        })
        // create group

        socket.on('creategroup', (GroupData) => {

            socket.join(GroupData.id)
            socket.emit('chatgrouplistupdated', " update chat list")

        })
        // JOIN GROUP
        // LEAVE GROUP

        socket.on('leavegroup', (GroupID) => {
            socket.leave(GroupID.toString())
            socket.emit('chatgrouplistupdated', " update chat list")
        })
        // DELETE GROUP
        socket.on('deletegroup', (GroupID) => {
            io.to((GroupID as number).toString()).emit('groupdestroyed', GroupID)
            io.to((GroupID as number).toString()).emit('chatgrouplistupdated', " update chat list")
            io.socketsLeave(GroupID.toString())

        })
        // Unread Update  : trigger even for active members to update latest msg
        //NEW MESSAGE

        //


        socket.on('send_message', (msg: any) => {

            const Msg = {
                Message: msg.Message,
                Group: msg.Group,
                Sender: msg.Sender,
                TimeStamp: Date.now().toString()
            }

            const room = io.sockets.adapter.rooms.get((msg.Group as number).toString());
            const Arooms = Array.from(io.sockets.adapter.rooms.keys()); // Get all room names
            console.log(Arooms)
            console.log('users in room', room)
            console.log('this user ID', socket.id)
            console.log('new msg sent', Msg)
            Messages.push(Msg)
            socket.emit('msg_ack', 'msg recieved')
            // update latestMessage for All Group users
            const Group = GroupChats.find((group) => group.id == msg.Group)

            if (Group) {
                Group.members.forEach((member) => {
                    // find latest messgae by GroupID and userID
                    // if not exist, then create one
                    const lmIndex = LastMessage.findIndex((lastm) => lastm.GroupID == Group.id && lastm.User === member)
                    const lm = LastMessage[lmIndex]
                    if (!lm) {
                        // create 
                        const newLM = {
                            id: LastMessage.length + 1,
                            LatestMessage: msg.Message,
                            User: member,
                            GroupID: Group.id,
                            UnreadCount: 1,
                            Sender: msg.Sender,
                            time: Date.now().toString(),
                        }

                        LastMessage.push(newLM)
                    }
                    else {
                        LastMessage[lmIndex] = {
                            ...lm,
                            LatestMessage: msg.Message,
                            time: Date.now().toString(),
                            UnreadCount: lm.UnreadCount + 1,
                            Sender: msg.Sender,
                        }
                    }
                    // else update the message, time and sender
                })
            }

            io.to((msg.Group as number).toString()).emit('new_chat_message', Msg)
            io.to((msg.Group as number).toString()).emit('update_notification', msg.Group)
        })

        socket.on('get_notification', ({ GroupID, user }) => {
            const lm = LastMessage.find((lastm) => lastm.GroupID == GroupID && lastm.User === user)
            if (lm) {
                socket.emit('take_notification', lm)
            }
        })

        socket.on('read_notification', ({ GroupID, user }) => {
            const lm = LastMessage.find((lastm) => lastm.GroupID === parseInt(GroupID) && lastm.User === user)

            if (lm) {
                lm.UnreadCount = 0
                socket.emit('take_notification', lm)
            }
        })
        // socket.on('update_unread_message', () => {
        //     // update unread message count
        // })



        // socket.on('message', (msg) => {
        //     console.log('message sent by ', socket.id, " : ", msg)
        // })
        // socket.on('disconnect', () => {
        //     console.log('user disconnected', socket.id)
        // })
    })
}


export function EndallConnections(io: Server) {

    io.sockets.sockets.forEach((socket) => {
        console.log('killing socket', socket.id)
        socket.disconnect()
    });
}