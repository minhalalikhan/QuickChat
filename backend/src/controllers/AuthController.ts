import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

export const JWT_SECRET = 'quickchat72631'
export const SALT = 10

type User = {
    id: string,
    email: string,
    password: string
}

const Users: User[] = [{
    id: 'firstone',
    email: 'minhalalikhan.786@gmail.com',
    password: '$2a$10$JgrjNgVUhcchv/O1mp9Y8ek0oMVzq9X78fuOYMQeXmnTwMbImr3sq'
}]

export async function SignUp(req: Request, res: Response) {

    const { email, password } = req.body


    if (Users.find((user) => user.email === email)) {
        res.status(409).json({ error: 'Email already exist' })
        return
    }

    const id = Date.now().toString()
    const hashedpassword = await bcrypt.hash(password, SALT)
    Users.push({ email, password: hashedpassword, id })
    const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: '1h' })

    res.json({ message: 'Account Created', status: 'success', token: token, })

}


export async function SignIn(req: Request, res: Response) {

    const { email, password } = req.body

    const searchuser = Users.find((user) => user.email === email)

    if (!searchuser) {
        console.log('User doesnt exist')
        res.status(404).send('user with Email doesn\'t exist ')
        return
    }

    const validpassword = await bcrypt.compare(password, searchuser.password)
    if (!validpassword) {
        console.log('invalid password')
        res.status(401).send('Invalid Password')
        return
    }


    const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: '1h' })
    console.log('current token is ', token)
    res.json({ message: 'signIn successfull', status: 'success', token: token, })

}

export async function TokenVerify(req: Request, res: Response) {


    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized' });
        return
    }

    const token = authHeader.split(' ')[1];

    console.log('got this token from heaers', token)
    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        // Attach the decoded user information to the request
        console.log('decoded', decoded)
        res.send('Valid token')

    } catch (err) {
        console.log('err', err)
        res.status(401).json({ message: 'Invalid token' });
    }

}


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //  ADDING RETURN AND RES IN SAME LINE GVES TYPESCRIPT ERROR
        //PROBABLY BECAUSE TS DOESNT EXPECT A RESPONSE FROM RETURN 
        res.status(401).json({ message: 'No Token Present' });
        return
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        // Attach the decoded user information to the request
        console.log('decoded', decoded);

        (req as any).email = (decoded as any).email


        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};