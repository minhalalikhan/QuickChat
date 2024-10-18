
'use client'
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'

type Props = {}

function page({ }: Props) {
    const [SignInCred, SetSignInCred] = useState<Signup>({ email: '', password: '', confirmpassword: '' })
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        SetSignInCred({ ...SignInCred, [e.target.name]: e.target.value })
    }
    return (
        <>
            <h1 className='font-bold'>SIGN UP</h1>
            <div className='flex-1 flex flex-col w-[80%] items-center gap-4 justify-center'>
                <Input
                    name='email' placeholder='Enter Email'
                    value={ SignInCred.email } type='email' onChange={ handleChange } />
                <Input
                    name='password' placeholder='Enter Password'
                    value={ SignInCred.password } type='password' onChange={ handleChange } />
                <Input
                    name='confirmpassword' placeholder='Confirm Password'
                    value={ SignInCred.confirmpassword } type='password' onChange={ handleChange } />
            </div>
            <Button >Create Account</Button>

        </>
    )
}

export default page