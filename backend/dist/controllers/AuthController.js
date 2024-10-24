"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
exports.SignUp = SignUp;
exports.SignIn = SignIn;
exports.TokenVerify = TokenVerify;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const JWT_SECRET = 'quickchat72631';
const SALT = 10;
const Users = [{
        id: 'firstone',
        email: 'minhalalikhan.786@gmail.com',
        password: '$2a$10$JgrjNgVUhcchv/O1mp9Y8ek0oMVzq9X78fuOYMQeXmnTwMbImr3sq'
    }];
function SignUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (Users.find((user) => user.email === email)) {
            res.status(409).json({ error: 'Email already exist' });
            return;
        }
        const id = Date.now().toString();
        const hashedpassword = yield bcryptjs_1.default.hash(password, SALT);
        Users.push({ email, password: hashedpassword, id });
        const token = jsonwebtoken_1.default.sign({ email: email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Account Created', status: 'success', token: token, });
    });
}
function SignIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        const searchuser = Users.find((user) => user.email === email);
        if (!searchuser) {
            console.log('User doesnt exist');
            res.status(404).send('user with Email doesn\'t exist ');
            return;
        }
        const validpassword = yield bcryptjs_1.default.compare(password, searchuser.password);
        if (!validpassword) {
            console.log('invalid password');
            res.status(401).send('Invalid Password');
            return;
        }
        const token = jsonwebtoken_1.default.sign({ email: email }, JWT_SECRET, { expiresIn: '1h' });
        console.log('current token is ', token);
        res.json({ message: 'signIn successfull', status: 'success', token: token, });
    });
}
function TokenVerify(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const token = authHeader.split(' ')[1];
        console.log('got this token from heaers', token);
        try {
            // Verify the JWT token
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            // Attach the decoded user information to the request
            console.log('decoded', decoded);
            res.send('Valid token');
        }
        catch (err) {
            console.log('err', err);
            res.status(401).json({ message: 'Invalid token' });
        }
    });
}
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //  ADDING RETURN AND RES IN SAME LINE GVES TYPESCRIPT ERROR
        //PROBABLY BECAUSE TS DOESNT EXPECT A RESPONSE FROM RETURN 
        res.status(401).json({ message: 'No Token Present' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        // Verify the JWT token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Attach the decoded user information to the request
        console.log('decoded', decoded);
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});
exports.authMiddleware = authMiddleware;
