'use client'

import { useSession } from "next-auth/react"


export async function customFetch(endpoint: string, method: string, body: any) {

    const { data: serversession, status } = useSession()


    const myheaders = {
        'Content-Type': 'application/json',
        // Add the token to headers, check if session exists and has mytoken
        ...(serversession && (serversession as any).mytoken ? { 'Authorization': `Bearer ${(serversession as any).mytoken}` } : {})
    }



    const mydata = await fetch('http://localhost:4000/' + endpoint, {
        method: method,

        body: JSON.stringify({
            body
        }),
        // Without Headers , GET handler will not be able to get the session and token
        headers: myheaders,
        cache: 'no-store'
    })


    return mydata



}
