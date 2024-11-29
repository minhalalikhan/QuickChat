'use client'
import React, { ChangeEvent, useState, useEffect, useRef, useMemo } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { IoSend } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5";
import { Skeleton } from '@/components/ui/skeleton';
import axios, { AxiosHeaders, AxiosRequestHeaders } from "axios";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Label } from "@/components/ui/label";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket.config';
import { useSession } from 'next-auth/react';

type Props = { GroupID: string }


function ChatPage({ GroupID }: Props) {

    const socket: Socket = getSocket()


    // const socket: Socket = useMemo(() => {

    //     const socket = getSocket()

    //     return socket
    // }, [])

    const { data: session, status } = useSession()
    const router = useRouter()

    const [errmsg, setErrmsg] = useState('')
    const [GroupDetails, setGroupDetails] = useState(
        {
            id: 0,
            GroupName: '',
            Admin: '',
            members: [],
            description: ''
        })

    const ThisUser = session?.user?.email
    const IsAdmin = GroupDetails && GroupDetails.Admin === ThisUser ? true : false
    const [ChatMessages, setChatMessages] = useState<any[]>([])
    const [Chatstatus, setChatStatus] =
        useState<'INIT' | 'Loading' | 'error' | 'GRP-NOT-FOUND' | 'CREDS-REQUIRED' | 'OK'>('INIT')

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    async function GetChatMessages() {
        setChatStatus('Loading')
        try {

            const myheaders = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(session as any).mytoken}`
            }

            const response = await axios.get('http://localhost:4000/chats/getchatmessages?chatid=' + GroupID, { headers: myheaders })

            if (response.status === 200) {

                setChatStatus('OK')
                console.log('dataaaaaaa', response)
                setChatMessages(response.data.data.GroupMessages)
                setGroupDetails(response.data.data.GroupDetails)
                //send socket event for Chat
            }

        }
        catch (e: any) {
            if (e?.status === 403) {
                setChatStatus('CREDS-REQUIRED')
            }
            else if (e?.status === 404) {
                setChatStatus('GRP-NOT-FOUND')
            }
            else if (e?.status === 400) {
                setChatStatus('error')
                setErrmsg('Invalid Chat ID. Expcted an Integrer')
            }
            else {
                console.log('chat message fetch err', e)

                setChatStatus('error')
                setErrmsg('Unexpected Error occured !! ')
            }
        }

    }

    // Function to scroll to the bottom
    const scrollToBottom = () => {
        if (messagesEndRef.current)
            messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    };

    // Scroll to bottom on component mount
    useEffect(() => {

        scrollToBottom();
    }, []);

    useEffect(() => {

        console.log(GroupDetails, ChatMessages)
    }, [GroupDetails, ChatMessages])

    useEffect(() => {

        if (session && Chatstatus === 'INIT') {
            console.log('time to get chat')
            GetChatMessages()
        }

    }, [session, Chatstatus])


    useEffect(() => {

        console.log(Chatstatus, socket.connected)
        if (Chatstatus === 'OK') {
            console.log('socket is connected for chatpage')
            socket.on('new_chat_message', (chat: any) => {
                console.log('got new messgae', ChatMessages, chat, GroupID)
                if (chat.Group == GroupID) {
                    console.log('set chat msg')
                    console.log([...ChatMessages, chat])
                    setChatMessages([...ChatMessages, chat])

                }
            })
            socket.on('groupdestroyed', (GrpID) => {

                if (GroupID == GrpID) {
                    router.replace('/')
                }
            })
        }
    }, [Chatstatus, ChatMessages, router])

    useEffect(() => {
        console.log('final state of chat', ChatMessages)
        scrollToBottom()
    }, [ChatMessages])

    if (Chatstatus === 'Loading')
        return (<PageLoading />)
    if (Chatstatus === 'error')
        return (<div className='flex w-full h-full items-center justify-center flex-col gap-2'>
            <h3 className='font-medium text-slate-600'> { errmsg }</h3>
            <Button onClick={ () => router.replace('/') }>Go back to Homepage</Button>
        </div>)

    if (Chatstatus === 'GRP-NOT-FOUND')
        return (<div>
            <GroupNotFound />
        </div>)
    if (Chatstatus === 'CREDS-REQUIRED')
        return (
            <PageCredRequired GroupID={ GroupID } get={ GetChatMessages } />
        )

    if (Chatstatus === 'OK')
        return (
            <div className='w-full h-full flex flex-col '>
                {/* Header */ }
                <div className='w-full h-[50px] border-b-2 bg-slate-100 px-2 flex items-center justify-between'>
                    <h4 className='font-bold'>{ GroupDetails?.GroupName }{ IsAdmin }</h4>

                    {/* ACTIONS : leave group , share group invite view members */ }
                    <Settings IsAdmin={ IsAdmin } GroupDetails={ GroupDetails } />
                </div>
                {/* Chat */ }
                <div className='flex-1 flex flex-col overflow-y-auto w-full gap-3 p-3 items-end'
                    id='msgcontainer'>
                    {
                        ChatMessages.map((msg: any, i) => {

                            return <Message
                                msg={ msg }
                                key={ i }
                                type={ msg.Sender === ThisUser ? 'USER' : 'OTHER' } />
                        })
                    }


                    <div ref={ messagesEndRef } />
                </div>
                {/* Text Field */ }
                <MessageInputBar status={ Chatstatus } GroupID={ GroupID } />

            </div>
        )
}

export default ChatPage


function Settings({ IsAdmin, GroupDetails }: { IsAdmin: boolean, GroupDetails: any }) {
    return (

        <Popover>
            <PopoverTrigger><IoSettingsSharp /></PopoverTrigger>
            <PopoverContent className='w-[200px] mr-4'>
                <div className='flex flex-col w-full'>
                    {/* <div className='w-full h-[40px] p-1 hover:bg-slate-100 border-b cursor-pointer'>
                        <ShareInvitePopup />
                    </div> */}
                    <div className='w-full h-[40px] p-1 hover:bg-slate-100 border-b cursor-pointer'>
                        <LeaveGroupChatPopup GroupID={ GroupDetails.id } />
                    </div>
                    {
                        IsAdmin &&
                        <div className='w-full h-[40px] p-1 hover:bg-slate-100 border-b cursor-pointer'>
                            <DeleteGroupChatPopup GroupID={ GroupDetails.id } />
                        </div>
                    }
                    <div className='w-full h-[40px] p-1 hover:bg-slate-100 border-b cursor-pointer'>
                        <ViewMembersPopup members={ GroupDetails.members } Admin={ GroupDetails.Admin } />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}


function LeaveGroupChatPopup({ GroupID }: { GroupID: number }) {

    const [LeaveGroupPopup, setLeaveGroupPopup] = useState(false)
    const router = useRouter()

    const [err, setErr] = useState('')
    const { data: session, status } = useSession()

    const socket: Socket = useMemo(() => {

        const socket = getSocket()

        return socket
    }, [])


    useEffect(() => {
        if (LeaveGroupPopup) {
            setErr('')
        }
    }, [LeaveGroupPopup])

    async function Leave() {

        try {
            const myheaders = {
                'Content-Type': 'application/json',
                // Add the token to headers, check if session exists and has mytoken
                'Authorization': `Bearer ${(session as any).mytoken}`
            }

            const response = await axios.post('http://localhost:4000/chats/leavegroupchat?chatid=' + GroupID, {}, { headers: myheaders })

            if (response.status === 200) {

                router.replace('/')
                socket.emit('deletegroup', response.data.data.GroupID)

                //send socket event for Chat
            }


        }
        catch (e: any) {
            setErr('Error Occured !! Please try again later')
        }

    }

    return (
        <Dialog open={ LeaveGroupPopup } onOpenChange={ setLeaveGroupPopup }>
            <DialogTrigger asChild>
                {/* <Button
                    onClick={ () => setLeaveGroupPopup(true) }>Leave Group</Button> */}
                <p onClick={ () => setLeaveGroupPopup(true) }>Leave Group</p>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Leave Group Chat</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to leave this group
                    </DialogDescription>
                </DialogHeader>

                <div className="min-h-[56px] py-2">
                    {
                        err && <div className=" p-2 bg-red-500 text-white">{ err }</div>
                    }
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button onClick={ Leave } variant={ 'destructive' } >Leave Group</Button>
                </DialogFooter>


            </DialogContent>
        </Dialog>
    )
}

function DeleteGroupChatPopup({ GroupID }: { GroupID: number }) {

    const [DeleteGroupPopup, setDeleteGroupPopup] = useState(false)
    const [DeleteCred, setDeleteCred] = useState('')
    const [err, setErr] = useState('')
    const { data: session, status } = useSession()
    const router = useRouter()

    const socket: Socket = useMemo(() => {

        const socket = getSocket()

        return socket
    }, [])

    async function Delete() {

        try {
            const myheaders = {
                'Content-Type': 'application/json',
                // Add the token to headers, check if session exists and has mytoken
                'Authorization': `Bearer ${(session as any).mytoken}`
            }

            const response = await axios.post('http://localhost:4000/chats/deletegroupchat', { chatid: GroupID, password: DeleteCred }, { headers: myheaders })

            if (response.status === 200) {

                router.replace('/')
                socket.emit('deletegroup', response.data.data.GroupID)

                //send socket event for Chat
            }


        }
        catch (e: any) {
            setErr('Error Occured !! Please try again later')
        }

    }

    useEffect(() => {
        if (DeleteGroupPopup) {
            setErr('')
        }
    }, [DeleteGroupPopup])
    return (
        <Dialog open={ DeleteGroupPopup } onOpenChange={ setDeleteGroupPopup }>
            <DialogTrigger asChild>
                {/* <Button
                    onClick={ () => setDeleteGroupPopup(true) }>Leave Group</Button> */}
                <p onClick={ () => setDeleteGroupPopup(true) }>Delete Group</p>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Group Chat</DialogTitle>
                    <DialogDescription>
                        Enter Password to proceed with deletion
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="GroupName" className="">
                            Password
                        </Label>
                        <Input id="GroupName"

                            onChange={ (e) => setDeleteCred(e.target.value) }

                            value={ DeleteCred } className="col-span-3 border-black" />
                    </div>
                </div>




                <div className="min-h-[56px] py-2">
                    {
                        err && <div className=" p-2 bg-red-500 text-white">{ err }</div>
                    }
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button onClick={ Delete } variant={ 'destructive' } >Delete Group</Button>
                </DialogFooter>


            </DialogContent>
        </Dialog>
    )
}


function ShareInvitePopup() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <p>Share Invite</p>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                        Invite more people to this group
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue="https://ui.shadcn.com/docs/installation"
                            readOnly
                        />
                    </div>
                    <Button type="submit" size="sm" className="px-3">
                        <span className="sr-only">Copy</span>
                        {/* <Copy /> */ }
                        <IoCopyOutline />
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ViewMembersPopup({ members, Admin }: { members: string[], Admin: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <p>View Members</p>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Group Members</DialogTitle>
                    <DialogDescription>
                        Here is a list of all Group Members
                    </DialogDescription>
                </DialogHeader>
                <div className="flex w-full h-[300px] gap-2 flex-col overflow-y-auto">

                    { members.map((member) => {

                        return (
                            <p className='cursor-pointer font-bold h-fit p-1 rounded-sm relative
                        hover:bg-slate-200'>{ member }
                                <span className='absolute right-0'>
                                    { member === Admin ? ' Admin' : '' }
                                </span>
                            </p>
                        )
                    })
                    }

                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

type Messageprop = {
    msg: any,
    type: 'OTHER' | 'USER'
}

function Message({ msg, type }: Messageprop) {
    return (
        <div className={ ` rounded-lg px-2 py-1 w-fit max-w-[60%]  flex flex-col ${type === 'OTHER' ? 'bg-[#efefef] self-start' : ' bg-purple-400  text-white'} ` }>
            { type === 'OTHER' && <p className='font-bold'>{ (msg?.Sender as string).split('@')[0] }</p> }
            { msg?.Message }
        </div>
    )
}

function MessageInputBar({ status, GroupID }: { status: string, GroupID: string }) {
    const [message, SetMessage] = useState('')
    const socket: Socket = useMemo(() => {

        const socket = getSocket()

        return socket
    }, [])

    const { data: session, status: sessionstatus } = useSession()


    useEffect(() => {

        if (socket) {
            socket.on('msg_ack', (msg) => {
                console.log('message recieved by server')
                SetMessage('')
            })

        }
    }, [socket])

    function SendMessage() {
        if (socket.connected && session) {
            socket.emit('send_message',
                {
                    Sender: session.user?.email,
                    Message: message,
                    Group: parseInt(GroupID)
                })


        }
    }
    function HandleInput(e: ChangeEvent<HTMLInputElement>) {
        SetMessage(e.target.value)
    }



    return (
        <div className='flex h-[50px] w-full bg-slate-100 justify-end 
        gap-2
        items-center py-1 px-3'>
            <Input placeholder='Enter Text' className='border-black border-solid '
                value={ message }
                onChange={ HandleInput }
            />
            <Button className={ ` active:bg-slate-700` }
                disabled={ !message || status !== 'OK' }
                onClick={ SendMessage }
            >
                <IoSend />
            </Button>
        </div>
    )
}

function PageLoading() {

    return (
        <div className="flex flex-col w-full px-4 py-2">
            <Skeleton className="h-12 w-full  bg-slate-300" />
            <div className=" flex flex-col gap-10 mt-10">
                <Skeleton className="h-10 w-[70%] bg-slate-300 " />
                <Skeleton className="h-10 w-[70%] bg-slate-300 self-end" />
                <Skeleton className="h-10 w-[70%] bg-slate-300" />
                <Skeleton className="h-10 w-[70%] bg-slate-300 self-end" />
                <Skeleton className="h-10 w-[70%] bg-slate-300" />
                <Skeleton className="h-10 w-[70%] bg-slate-300 self-end" />
            </div>
        </div>
    )
}

function GroupNotFound() {

    const router = useRouter()
    return (
        <AlertDialog open={ true }>
            <AlertDialogTrigger asChild>

            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Group Chat Not Found</AlertDialogTitle>
                    <AlertDialogDescription>
                        NO Group Chat with the given ID exist
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>

                    <AlertDialogAction onClick={ () => router.replace('/') }>Go Back To Homepage</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

function PageCredRequired({ GroupID, get }: { GroupID: string, get: Function }) {
    const router = useRouter()

    const [password, setPassword] = useState<string>('')
    const [err, setErr] = useState('')
    const { data: session, status } = useSession()

    const socket: Socket = useMemo(() => {

        const socket = getSocket()

        return socket
    }, [])

    async function Join(e: any) {
        e.preventDefault()
        setErr('')
        try {

            const myheaders = {
                'Content-Type': 'application/json',
                // Add the token to headers, check if session exists and has mytoken
                'Authorization': `Bearer ${(session as any).mytoken}`
            }

            const response = await axios.post('http://localhost:4000/chats/joingroupchat', { id: parseInt(GroupID), Password: password }, { headers: myheaders })

            if (response.status === 200) {

                get()
                socket.emit('joingroup', response.data.data)

                //send socket event for Chat
            }


        }
        catch (e: any) {
            if (e) {
                setErr(e?.message || 'Error Occured !')
            }

        }

    }
    return (
        <AlertDialog open={ true }>
            <AlertDialogTrigger asChild>

            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Credentials required</AlertDialogTitle>
                    <AlertDialogDescription>
                        You need credentials to join this group
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="">
                            Password
                        </Label>
                        <Input id="password"

                            onChange={ (e) => setPassword(e.target.value) }

                            value={ password }
                            className="col-span-3 border-black" />
                    </div>
                    <div className="min-h-[56px] py-2">
                        {
                            err && <div className=" p-2 bg-red-500 text-white">{ err }</div>
                        }
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={ () => router.replace('/') }>Go to Homepage</AlertDialogCancel>
                    <AlertDialogAction onClick={ Join }>Join Group</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}