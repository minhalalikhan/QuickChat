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

    console.log('getting data for sidebar')
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
    const [NotificationsList, setNotificationsList] = useState<Record<string, any>>({})

    const { data: session, status } = useSession()
    const [queuecall, setQueuecall] = useState(true)

    const path = usePathname()

    async function myfetch() {

        if (status === 'authenticated') {


            const getres = await getmyGroupChats(session)

            setGroupList(getres)
            socket.emit('Login', { groups: getres, user: session.user?.email })
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

        return socket
    }, [])



    useEffect(() => {

        if (socket) {

            socket.on('chatgrouplistupdated', () => {
                setQueuecall(true)
                console.log('chatgrouplistupdated called')
                myfetch()
            })

        }
    }, [socket])

    useEffect(() => {
        if (socket && GroupList.length > 0) {



            socket.on('update_notification', (GroupID) => {
                socket.emit('get_notification', { GroupID: GroupID, user: session?.user?.email })
            })

            socket.on('take_notification', (lm: any) => {
                console.log(lm)
                if (lm?.GroupID)
                    setNotificationsList({ ...NotificationsList, [lm.GroupID]: lm })

            })
            // console.log('login ', GroupList)
        }
    }, [socket, GroupList, path])

    useEffect(() => {

        if (Object.keys(NotificationsList).length > 0) {

            console.log('path', path)
            const pathnum = path.split('/')[2]
            console.log('path data', pathnum)
            console.log(NotificationsList)
            if (pathnum && NotificationsList[pathnum]?.UnreadCount > 0) {
                // if notification coutn for current page >1 
                console.log('trigger read', { GroupID: pathnum, user: session?.user?.email })
                socket.emit('read_notification', { GroupID: pathnum, user: session?.user?.email })
            }
        }
    }, [NotificationsList, path])



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
                        <ChatListItem Group={ item } key={ i } Notification={ NotificationsList[(item as any)?.id] } />
                    )
                })
            }


        </div>
    )
}

export default ChatList


function ChatListItem({ Group, Notification }: { Group: any, Notification: any }) {
    const path = usePathname()

    return (
        // <div className='w-full flex  flex-col gap-2 p-4 border-b border-b-black'>
        <Link href={ '/chat/' + Group?.id }
            className={ `w-full flex  flex-col gap-2 p-4 border-b border-b-black hover:bg-gray-100 ${decodeURIComponent(path) === '/chat/' + Group?.GroupName ? 'bg-gray-200' : ''}` }
        >
            <div className='flex gap-3'>

                <p className='font-semibold'>{ Group?.GroupName }</p>
                { Notification &&
                    Notification.UnreadCount > 0 &&
                    <p className='rounded-full bg-red-500 text-white px-2'>{ Notification.UnreadCount }</p> }
            </div>
            <div className='w-full flex  gap-1 overflow-hidden text-slate-500 italic flex-wrap'>
                { Notification && <p>{ (Notification.Sender as string).split('@')[0] } : </p> }
                { Notification && <p className=''>{ (Notification.LatestMessage as string).slice(0, 10) } </p> }
            </div>
            {/* </div> */ }
        </Link>
    )
}