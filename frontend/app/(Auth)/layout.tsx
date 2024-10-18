import React from 'react'
import './Auth.css'

type Props = { children: React.ReactNode }

function layout({ children }: Props) {
    return (
        <div className='w-full h-full bg-white flex items-center justify-center'>
            <div
                className='rounded-md bg-gray-100 shadow-lg
            min-w-[400px] flex flex-col gap-3 items-center
            p-3 min-h-[400px]
            '>
                { children }
            </div>

        </div>
    )
}

export default layout