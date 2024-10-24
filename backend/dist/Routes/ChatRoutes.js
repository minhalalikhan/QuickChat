"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const ChatRouter = (0, express_1.Router)();
ChatRouter.use(AuthController_1.authMiddleware);
ChatRouter.get('/', (req, res) => {
    console.log('got inside chats get');
    res.json({
        chats: ['mak', 'sam', 'pathak', 'ayush']
    });
});
exports.default = ChatRouter;
