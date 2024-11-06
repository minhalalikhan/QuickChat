import { Router } from "express";
import { authMiddleware } from "../controllers/AuthController";
import { GroupChats } from "../../DATA/data";

const ChatRouter = Router()
ChatRouter.use(authMiddleware)


function HideMembers(input: any[], email: string) {


    const Newresults = input.map((Group) => {

        const checkuser = Group.members.find((member: string) => member === email)


        if (checkuser) {
            return { ...Group, members: [email] }
        }
        return { ...Group, members: [] }
    })

    return Newresults
}

ChatRouter.get('/groupchats', (req, res) => {

    // return all chats
    // apply pagination
    //  keyword filter
    // order : alphabetic, size , created date

    const email = (req as any).email

    // const editGroupChats = GroupChats.map((Group) => {

    //     const checkuser = Group.members.find((member) => member === email)


    //     if (checkuser) {
    //         return { ...Group, members: [email] }
    //     }
    //     return { ...Group, members: [] }
    // })

    const editGroupChats = HideMembers(GroupChats, email)

    res.json(editGroupChats)

})


ChatRouter.get('/mygroupchats/', (req, res) => {

    // MAYBE ADD THIS TO SOCKET
    const email = (req as any).email
    // return all chats that I am part of 
    const page = req.query.page
    // apply pagination
    const keyword = req.query.keyword
    //  keyword filter
    const order = req.query.order
    // order : alphabetic, size , created date


    let filteredres = GroupChats.filter((item) => {


        const find = item.members.find((member) => member === email)

        if (find)
            return true

        return false
    })

    filteredres = HideMembers(filteredres, email)
    res.json({ results: filteredres })

})

ChatRouter.post('/creategroupchat', (req, res) => {

    // return all chats that I am part of 
    // apply pagination
    //  keyword filter
    // order : alphabetic, size , created date

    res.send('working on this one')

})


ChatRouter.post('/joingroupchat', (req, res) => {

    let group = (req.body)
    group = group.groupchat

    const email = (req as any).email
    // return all chats that I am part of 
    // apply pagination
    //  keyword filter
    // order : alphabetic, size , created date

    const checkgrp = GroupChats.find((item) => {

        return item.id === group.id
    })

    if (!checkgrp) {
        res.status(404).send('Group Not found')
    }

    checkgrp?.members.push(email)
    res.send({ message: 'proceed' })

})


ChatRouter.post('/leavegroupchat', (req, res) => {

    // return all chats that I am part of 
    // apply pagination
    //  keyword filter
    // order : alphabetic, size , created date

    res.send('working on this one')

})

ChatRouter.delete('/deletegroupchat', (req, res) => {

    // return all chats that I am part of 
    // apply pagination
    //  keyword filter
    // order : alphabetic, size , created date

    res.send('working on this one')

})


ChatRouter.get('/', (req, res) => {

    console.log('got inside chats get')
    res.json({
        chats: ['mak', 'sam', 'pathak', 'ayush']
    })

})



export default ChatRouter