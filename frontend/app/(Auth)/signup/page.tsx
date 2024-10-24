
'use client'
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import axios from 'axios'
import * as yup from 'yup'
import Email from 'next-auth/providers/email'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {}
const Schema = yup.object().shape({
    email: yup.string().email('Must be a valid Email').required('Email is Required'),
    password: yup.string().min(4, 'Password must be atleast 4 characters long').required('Password is required'),
    confirmpassword: yup.string().required('Confirm Password').oneOf([yup.ref('password')], 'Passwords must match')
})

function page({ }: Props) {

    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated' && router) {
            router.push('/')

        }
    }, [status, router])


    const [SignUpCred, SetSignUpCred] = useState<Signup>({ email: '', password: '', confirmpassword: '' })
    const [Error, setError] = useState<string>('')


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        SetSignUpCred({ ...SignUpCred, [e.target.name]: e.target.value })
    }

    async function CreateAccount() {

        try {
            await Schema.validate(SignUpCred, { abortEarly: true })
            const response = await axios.post('http://localhost:4000/auth/signup', {
                email: SignUpCred.email,
                password: SignUpCred.password
            })

            console.log('response is', response)
            if (response.status === 200) {
                setError('')
                await signIn('credentials', {
                    email: SignUpCred.email,
                    password: SignUpCred.password
                })
            }
        }
        catch (e: any) {
            console.log(e)
            if (e.name === 'ValidationError') {
                setError(e.message)
            }

            else if (e?.name === "AxiosError") {
                setError(e.response.data.error)
            }
            else {
                setError('unexpected error')
            }
        }
    }
    if (status === 'loading' || status === 'authenticated')
        return <>
            <Skeleton className='rounded-md w-[80%] h-20 bg-white' />
            <Skeleton className='rounded-md w-[80%] h-14 bg-white' />
            <Skeleton className='rounded-md w-[80%] h-14 bg-white' />
        </>
    else if (status === 'unauthenticated')
        return (
            <>
                <h1 className='font-bold'>SIGN UP</h1>
                <p>{ JSON.stringify(status) }</p>
                <div className='flex-1 flex flex-col w-[80%] items-center gap-4 justify-center'>
                    <Input
                        name='email' placeholder='Enter Email'
                        value={ SignUpCred.email } type='email' onChange={ handleChange } />
                    <Input
                        name='password' placeholder='Enter Password'
                        value={ SignUpCred.password } type='password' onChange={ handleChange } />
                    <Input
                        name='confirmpassword' placeholder='Confirm Password'
                        value={ SignUpCred.confirmpassword } type='password' onChange={ handleChange } />
                </div>
                { Boolean(Error) && <p className='bg-red-200 text-red-600 px-2 py-1 rounded-sm'>{ Error }</p> }
                <Button onClick={ CreateAccount }>Create Account</Button>
                <p className='text-gray-400'>{ 'Already have an Account ? ' }

                    <Link href={ '/signin' } className='text-gray-600 font-semibold'>
                        Sign In
                    </Link>
                </p>
            </>
        )
}

export default page