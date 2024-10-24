'use client'
import axios from 'axios'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import React, { useEffect } from 'react'


type Props = {}

async function getdata() {
    try {
        const res = await axios.get('http://localhost:3000/api/chats')
        return res
    }
    catch (e) {
        return e
    }
}


function Navbar({ }: Props) {
    const { data, status } = useSession()
    const router = useRouter()
    // console.log('session data from home', data)
    useEffect(() => {
        if (status === 'authenticated') {

            console.log(status, data)
            const mydata = getdata()
            console.log('navabr api chats', mydata)
        }
    }, [status])

    useEffect(() => {
        if (status === 'unauthenticated')
            router.push('/')
    }, [status, router])

    async function SignOut() {

        try {

            const Res = await signOut({ callbackUrl: '/signin' })

        } catch (e) {
            console.log('get chats from navabr failed')
        }
    }

    return (
        <div className='flex w-full px-2 py-1 flex-row bg-slate-500 min-h-[50px]
         text-white justify-between items-center'>
            <h1>Quick Chat</h1>
            <button onClick={ SignOut }>
                SignOut
            </button>
        </div>
    )
}

export default Navbar