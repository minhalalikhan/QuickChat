import express, { Express, Response, Request, Application, NextFunction } from "express"
import cors from 'cors'
import AuthRouter from "./Routes/AuthRoutes"
import bcrypt from 'bcryptjs'
import ChatRouter from "./Routes/ChatRoutes"

import { createServer } from "http"
import { Server } from "socket.io"
import { SetupSocket } from "./socket"



const PORT = 4000
const app: Application = express()

const server = createServer(app)
const io = new Server(server, { cors: { origin: '*' } })
export { io }

SetupSocket(io)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/auth', AuthRouter)
app.use('/chats', ChatRouter)


app.get('/', async (req: Request, res: Response) => {

    const hashedpassword = await bcrypt.hash('mak123', 10)
    res.send('the has for you is :' + hashedpassword)
})


server.listen(PORT, () => {
    console.log(`chat server running on ${PORT}`)
})
