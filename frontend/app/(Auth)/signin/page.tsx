
'use client'
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'

type Props = {}

function page({ }: Props) {

    const [SignInCred, SetSignInCred] = useState<Signin>({ email: '', password: '' })
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        SetSignInCred({ ...SignInCred, [e.target.name]: e.target.value })
    }
    return (
        <>
            <h1 className='font-bold'>SIGN IN</h1>
            <div className='flex-1 flex flex-col w-[80%] items-center gap-4 justify-center'>
                <Input
                    name='email' placeholder='Enter Email'
                    value={ SignInCred.email } type='email' onChange={ handleChange } />
                <Input
                    name='password' placeholder='Enter Password'
                    value={ SignInCred.password } type='password' onChange={ handleChange } />
            </div>
            <Button >Submit</Button>

        </>

    )
}

export default page