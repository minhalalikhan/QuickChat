import express, { Express, Response, Request, Application, NextFunction } from "express"
import cors from 'cors'
import AuthRouter from "./Routes/AuthRoutes"
const PORT = process.env.PORT
const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(AuthRouter)


app.get('/', (req: Request, res: Response) => {

    res.send('hello there. welcome to scalable chat app backend')
})


app.listen(PORT, () => {
    console.log(`chat server running on ${PORT}`)
})
