'use client'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

type Props = {
    children: React.ReactNode,
    //  session: Session
}

function Providers({ children,
    // session
}: Props) {
    return (
        <SessionProvider
        // session={ session }
        >
            { children }
        </SessionProvider>
    )
}

export default Providers