"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const AuthRouter = (0, express_1.Router)();
AuthRouter.post('/signin', AuthController_1.SignIn);
AuthRouter.post('/signup', AuthController_1.SignUp);
AuthRouter.get('/verifytoken', AuthController_1.TokenVerify);
exports.default = AuthRouter;
