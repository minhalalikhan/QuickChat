
'use client'
import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { signIn, useSession } from 'next-auth/react'
import * as yup from 'yup'
import Email from 'next-auth/providers/email'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {}

const Schema = yup.object().shape({
    email: yup.string().email('Must be a valid Email').required('Email is Required'),
    password: yup.string().min(4, 'Password must be atleast 4 characters long').required('Password is required')
})

function page({ }: Props) {

    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated' && router) {
            router.push('/')

        }
    }, [status, router])

    const [SignInCred, SetSignInCred] = useState<Signin>({ email: 'minhalalikhan.786@gmail.com', password: '68835832' })
    const [Error, setError] = useState<string>('')

    async function handlesubmit() {

        try {

            // validate will trhow error if validation fails
            await Schema.validate(SignInCred, { abortEarly: true })

            const res = await signIn('credentials',
                { email: SignInCred.email, password: SignInCred.password, redirect: false })


            console.log(res)
            if (!res) {
                setError('Unexpected Error')
            }
            else {
                if (res.error)
                    setError(res.error)
                else setError('')
            }

        } catch (err: any) {
            if (err?.name === 'ValidationError') {
                setError(err.message); // Set validation error message
            }

            else
                setError('Unexpected Error Happended')
        }

    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        SetSignInCred({ ...SignInCred, [e.target.name]: e.target.value })
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
                <h1 className='font-bold'>SIGN IN</h1>
                <div className='flex-1 flex flex-col w-[80%] items-center gap-4 justify-center'>
                    <Input
                        name='email' placeholder='Enter Email'
                        value={ SignInCred.email } type='email' onChange={ handleChange } />
                    <Input
                        name='password' placeholder='Enter Password'
                        value={ SignInCred.password } type='password' onChange={ handleChange } />
                </div>
                { Boolean(Error) && <p className='bg-red-200 text-red-600 px-2 py-1 rounded-sm'>{ Error }</p> }
                <Button onClick={ handlesubmit } >Submit</Button>
                <p className='text-gray-400'>{ 'Dont have an Account ? ' }

                    <Link href={ '/signup' } className='text-gray-600 font-semibold'>
                        Create Now
                    </Link>
                </p>
            </>

        )
}

export default page