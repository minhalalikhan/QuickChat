'use client'

import { redirect, useRouter } from 'next/navigation'
import React from 'react'

function notFound() {

    const router = useRouter()
    function goToHome() {
        router.replace('/')
    }
    return (
        <div className='w-full h-full flex justify-center items-center flex-col gap-3'>
            <h1 className='font-extrabold text-4xl'>404</h1>
            <h3>Page Not Found</h3>
            <button
                className='px-3 py-1 bg-slate-100 font-semibold rounded-md shadow-md '
                onClick={ goToHome }
            > Go back to HomePage</button>
        </div>
    )
}

export default notFound