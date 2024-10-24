"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prismaClient = (0, client_1.PrismaClient)({
    log: ['error', 'query']
});
exports.default = prismaClient;
