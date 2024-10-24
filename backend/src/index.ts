import express, { Express, Response, Request, Application, NextFunction } from "express"
import cors from 'cors'
import AuthRouter from "./Routes/AuthRoutes"
import bcrypt from 'bcryptjs'
import ChatRouter from "./Routes/ChatRoutes"
const PORT = 4000
const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/auth', AuthRouter)
app.use('/chats', ChatRouter)


app.get('/', async (req: Request, res: Response) => {

    const hashedpassword = await bcrypt.hash('mak123', 10)
    res.send('the has for you is :' + hashedpassword)
})


app.listen(PORT, () => {
    console.log(`chat server running on ${PORT}`)
})
