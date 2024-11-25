import { Router } from "express";
import { authMiddleware } from "../controllers/AuthController";
import { GroupChats } from "../../DATA/data";
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

    const { GroupName, id, Password } = (req.body)


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


    res.json({
        chats: ['mak', 'sam', 'pathak', 'ayush']
    })

})



export default ChatRouter