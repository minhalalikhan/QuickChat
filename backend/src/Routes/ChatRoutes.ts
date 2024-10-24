import { Router } from "express";
import { authMiddleware } from "../controllers/AuthController";

const ChatRouter = Router()
ChatRouter.use(authMiddleware)

ChatRouter.get('/', (req, res) => {

    console.log('got inside chats get')
    res.json({
        chats: ['mak', 'sam', 'pathak', 'ayush']
    })

})



export default ChatRouter