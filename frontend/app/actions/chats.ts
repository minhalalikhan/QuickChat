'use server'

import { getServerSession } from "next-auth"

export async function getChats() {

    const session = await getServerSession()
    console.log('server sesion inside getchats', session)
    return session
}