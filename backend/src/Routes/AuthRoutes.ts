import { Router } from "express";
import { SignIn, SignUp, TokenVerify } from "../controllers/AuthController";

const AuthRouter = Router()


AuthRouter.post('/signin', SignIn)
AuthRouter.post('/signup', SignUp)
AuthRouter.get('/verifytoken', TokenVerify)



export default AuthRouter