"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 4000;
app.get('/', (req, res) => {
    res.send('hello there. welcome to scalable chat app backend');
});
app.get('/new', (req, res) => {
    res.send('new response V2');
});
app.listen(PORT, () => {
    console.log(`chat server running on ${PORT}`);
});
