'use client'
import { getSocket } from '@/lib/socket.config'
import React, { useEffect, useMemo, useState } from 'react'
import { Socket } from 'socket.io-client'
import Link from 'next/link'
import { customFetch } from './utility'
import { signOut, useSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import { GoHomeFill } from "react-icons/go";

type Props = {}


async function getmyGroupChats(session: Session) {


    const myheaders = {
        'Content-Type': 'application/json',
        // Add the token to headers, check if session exists and has mytoken
        ...(session && (session as any).mytoken ? { 'Authorization': `Bearer ${(session as any).mytoken}` } : {})
    }


    const mydata = await fetch('http://localhost:4000/chats/mygroupchats/', {
        method: 'GET',

        // Without Headers , GET handler will not be able to get the session and token
        headers: myheaders,
        cache: 'no-store'
    })


    if (mydata.status === 200) {
        let newd = await mydata.json()
        return newd.results
    }
    if (mydata.status === 401) {
        await signOut()
    }

    return []
}

function ChatList({ }: Props) {

    const [GroupList, setGroupList] = useState<Object[]>([])

    const { data: session, status } = useSession()
    const [queuecall, setQueuecall] = useState(true)

    const path = usePathname()

    async function myfetch() {

        if (status === 'authenticated') {


            const getres = await getmyGroupChats(session)

            setGroupList(getres)
        }
    }
    useEffect(() => {
        if (status === 'authenticated' && queuecall) {

            myfetch()
            setQueuecall(false)
        }

    }, [status, queuecall])

    const socket: Socket = useMemo(() => {

        const socket = getSocket()
        // console.log('socket connection or not', socket.connected)
        if (socket.disconnected)
            return socket.connect()
        return socket
    }, [])



    useEffect(() => {

        if (socket) {

            socket.emit('message', "hi from client")

            socket.on('message', (msg) => {
                console.log('Chat List ', msg)



            })

            socket.on('chatgrouplistupdated', () => {
                setQueuecall(true)
                console.log('chatgrouplistupdated called')
                myfetch()
            })

            return () => {
                socket.disconnect()
            }
        }
    }, [socket])

    return (
        <div className='flex h-full w-[250px] flex-col overflow-y-auto'>
            <Link href={ '/' }
                className={ `w-full flex 
                  gap-2 p-4 border-b items-center
                  border-b-black hover:bg-gray-100 ${decodeURIComponent(path) === '/' ? 'bg-gray-200' : ''}` }>
                <GoHomeFill />
                Home
            </Link>
            {
                GroupList.map((item, i) => {
                    return (
                        <ChatListItem Group={ item } key={ i } />
                    )
                })
            }
            <ChatListItem Group={ { GroupName: 'Random' } } />
            <ChatListItem Group={ { GroupName: 'Random' } } />
            <ChatListItem Group={ { GroupName: 'Random' } } />
            <ChatListItem Group={ { GroupName: 'Random' } } />
            <ChatListItem Group={ { GroupName: 'Random' } } />
            <ChatListItem Group={ { GroupName: 'Random' } } />
            <ChatListItem Group={ { GroupName: 'Random' } } />
            <ChatListItem Group={ { GroupName: 'Random' } } />
            <ChatListItem Group={ { GroupName: 'Random' } } />
            <ChatListItem Group={ { GroupName: 'Random' } } />
            <ChatListItem Group={ { GroupName: 'Random' } } />
            <ChatListItem Group={ { GroupName: 'Random' } } />
            <ChatListItem Group={ { GroupName: 'Random' } } />
        </div>
    )
}

export default ChatList


function ChatListItem({ Group }: { Group: any }) {
    const path = usePathname()

    return (
        // <div className='w-full flex  flex-col gap-2 p-4 border-b border-b-black'>
        <Link href={ '/chat/' + Group?.GroupName }
            className={ `w-full flex  flex-col gap-2 p-4 border-b border-b-black hover:bg-gray-100 ${decodeURIComponent(path) === '/chat/' + Group?.GroupName ? 'bg-gray-200' : ''}` }
        >
            <p>{ Group?.GroupName }</p>
            <div className='w-full justify-between'>
                <p>{ }</p>
                <p></p>
            </div>
            {/* </div> */ }
        </Link>
    )
}