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

            // console.log(status, data)
            // const mydata = getdata()
            // console.log('navabr api chats', mydata)
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
        <div className='flex w-full px-6 py-1 flex-row min-h-[50px]
          justify-between items-center'>
            <h1 className='font-bold text-2xl'>Quick Chat</h1>
            <button onClick={ SignOut } className='text-slate-500'>
                SignOut
            </button>
        </div>
    )
}

export default Navbar