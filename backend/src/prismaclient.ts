import { PrismaClient } from "@prisma/client";

const prismaClient = PrismaClient({
    log: ['error', 'query']
})

export default prismaClient