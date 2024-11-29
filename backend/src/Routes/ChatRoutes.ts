import { Router } from "express";
import { authMiddleware } from "../controllers/AuthController";
import { GroupChats, LastMessage, Messages } from "../../DATA/data";
import bcrypt from 'bcryptjs';

import { SALT } from "../controllers/AuthController";

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

function format(input: any[]) {
    const Newresults = input.map((Group) => {

        return { ...Group, password: '' }
    })

    return Newresults
}
ChatRouter.get('/groupchats', (req, res) => {



    const { SearchText = '' } = req.query

    // return all chats
    // apply pagination
    //  keyword filter
    // order : alphabetic, size , created date

    const email = (req as any).email

    let editGroupChats = GroupChats.filter((grp) => {


        return grp.GroupName.toLowerCase().trim().includes((SearchText as string).toLowerCase().trim())
    })



    editGroupChats = HideMembers(editGroupChats, email)
    editGroupChats = format(editGroupChats)
    res.json(editGroupChats)

})

ChatRouter.get('/getchatmessages', async (req, res) => {
    const { chatid = '' } = req.query
    const email = (req as any).email

    if (!chatid || isNaN(Number(chatid)) || !Number.isInteger(Number(chatid))) {

        res.status(400).json({
            error: "Bad Request",
            message: "Missing or invalid 'id' query parameter. Expected an integer."
        });
        return
    }


    const Group = GroupChats.find((grp) => grp.id === Number(chatid))
    if (!Group) {
        res.status(404).json({ message: 'Group Not found' })
        return
    }
    const checkAccess = Group.members.find((user) => user === email)
    if (!checkAccess) {
        res.status(403).json({ message: 'You Dont have access to this group yet' })
        return
    }

    const GroupMessages = Messages.filter((msg) => msg.Group === Group.id)

    res.json({
        message: 'group chat here',
        data: {
            GroupDetails: { ...Group, password: '' },
            GroupMessages
        }
    })

})

// ChatRouter.get('/getGroupDetails', async (req, res) => {
//     const { chatid = '' } = req.query
//     const email = (req as any).email

//     if (!chatid || isNaN(Number(chatid)) || !Number.isInteger(Number(chatid))) {

//         res.status(400).json({
//             error: "Bad Request",
//             message: "Missing or invalid 'id' query parameter. Expected an integer."
//         });
//         return
//     }


//     const Group = GroupChats.find((grp) => grp.id === Number(chatid))
//     if (!Group) {
//         res.status(404).json({ message: 'Group Not found' })
//         return
//     }

//     res.json({ message: 'group chat here', data: [] })

// })

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
    filteredres = format(filteredres)
    res.json({ results: filteredres })

})

ChatRouter.post('/creategroupchat', async (req, res) => {

    const { GroupName, Description, Password } = req.body

    const admin = (req as any)?.email

    // 1. make sure all credentials are present
    // 2.check if  group already exist 
    // 3. if not proceed by creating group
    // 4. return {group:groupname, id:id}
    console.log('enter create grp')

    const grpcheck = GroupChats.find((grp) => grp.GroupName === GroupName)
    if (grpcheck) {
        res.status(400).json({ message: 'Group Already Exists' })
        return
    }
    else {
        console.log('proceed create grp')
        const id = GroupChats.length + 1
        const hashedpassword = await bcrypt.hash(Password, SALT)

        GroupChats.push({
            id: id,
            Admin: admin,
            description: Description,
            GroupName: GroupName,
            password: hashedpassword,
            created_at: '',
            members: [admin]
        })

        res.json({ message: 'Group Created', data: { GroupName, id } })
    }

})


ChatRouter.post('/joingroupchat', async (req, res) => {

    const { id, Password } = (req.body)


    const email = (req as any).email

    const Group = GroupChats.find((grp) => grp.id === id)
    if (!Group) {
        res.status(404).send('Group Not found')
        return
    }
    // fidn group

    const validpassword = await bcrypt.compare(Password, Group.password)
    if (validpassword) {
        const finduser = Group.members.find((member) => member === email)
        if (finduser) {
            res.json({ message: 'Already Member of the Group' })
            return
        }
        else {
            Group.members.push(email)
            res.json({ message: ' Group joined Successfully', data: { GroupName: Group.GroupName, id: Group.id } })
            return
        }
    }
    else {
        res.status(401).json({ message: 'Invalid Password' })
    }

})


ChatRouter.post('/leavegroupchat', (req, res) => {

    const { chatid } = req.query
    const email = (req as any).email

    if (!chatid || isNaN(Number(chatid)) || !Number.isInteger(Number(chatid))) {

        res.status(400).json({
            error: "Bad Request",
            message: "Missing or invalid 'id' query parameter. Expected an integer."
        });
        return
    }

    console.log('chat ID', chatid)
    const Group = GroupChats.find((grp) => grp.id === Number(chatid))
    if (!Group) {
        res.status(404).json({ message: 'Group Not found' })
        return
    }

    const GroupID = Group.id
    const checkAccess = Group.members.find((user) => user === email)
    if (!checkAccess) {
        res.status(403).json({ message: 'Only exsiting members can leave the group' })
        return
    }

    Group.members = Group.members.filter((member) => member !== email)

    res.json({
        message: 'You are no longer part of this group',
        data: { GroupID }
    })
})

ChatRouter.post('/deletegroupchat', async (req, res) => {

    const { chatid, password } = req.body
    const email = (req as any).email

    if (!chatid || isNaN(Number(chatid)) || !Number.isInteger(Number(chatid))) {

        res.status(400).json({
            error: "Bad Request",
            message: "Missing or invalid 'id' query parameter. Expected an integer."
        });
        return
    }


    const Group = GroupChats.find((grp) => grp.id === Number(chatid))
    if (!Group) {
        res.status(404).json({ message: 'Group Not found' })
        return
    }

    const GroupID = Group.id
    const checkAccess = Group.Admin === email
    if (!checkAccess) {
        res.status(403).json({ message: 'Only Admin can Delete the group' })
        return
    }

    // Validate Password
    const validpassword = await bcrypt.compare(password, Group.password)
    if (!validpassword) {
        res.status(403).json({ message: 'Invalid Credential' })
        return
    }

    // delete all messages related to this group
    for (let i = 0; i < Messages.length; i++) {
        if (Messages[i].Group == Number(chatid)) {
            Messages.splice(i, 1)
        }
    }
    // delete all notifications
    for (let i = 0; i < LastMessage.length; i++) {
        if (LastMessage[i].GroupID == Number(chatid)) {
            LastMessage.splice(i, 1)
        }
    }

    // Delete the group
    const Groupindex = GroupChats.findIndex((grp) => grp.id == Number(chatid))
    GroupChats.splice(Groupindex, 1)


    res.json({
        message: 'You are no longer part of this group',
        data: { GroupID }
    })


})


ChatRouter.get('/', (req, res) => {


    res.json({
        chats: ['mak', 'sam', 'pathak', 'ayush']
    })

})



export default ChatRouter