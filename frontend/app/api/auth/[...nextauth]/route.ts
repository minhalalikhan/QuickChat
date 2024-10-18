import { authOptions } from "@/lib/AuthOptions";
import NextAuth from "next-auth/next";


const Handler = NextAuth(authOptions)

export const GET = Handler
export const POST = Handler
