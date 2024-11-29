'use client'


import { Button } from "@/components/ui/button";

import { getSocket } from "@/lib/socket.config";

import * as yup from 'yup'

import { signOut, useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
import { FormEvent, MouseEventHandler, useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";

import { Input } from '@/components/ui/input'
import { FaSearch } from "react-icons/fa";
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

import { Label } from "@/components/ui/label";
import axios, { AxiosHeaders, AxiosRequestHeaders } from "axios";

// import { headers } from "next/headers";

type Group = {
    GroupName: string,
    Description: string,

}

async function getGroupChats(serversession: Session, SearchText: string = '') {
    const myheaders = {
        'Content-Type': 'application/json',
        // Add the token to headers, check if session exists and has mytoken
        ...(serversession && (serversession as any).mytoken ? { 'Authorization': `Bearer ${(serversession as any).mytoken}` } : {})
    }

    const params = new URLSearchParams({
        SearchText
    })

    const mydata = await fetch('http://localhost:4000/chats/groupchats?' + params, {
        method: 'GET',

        // Without Headers , GET handler will not be able to get the session and token
        headers: myheaders,
        cache: 'no-store'
    })


    if (mydata.status === 200) {
        let newd = await mydata.json()
        return newd
    }
    if (mydata.status === 401) {
        await signOut()
    }

    return []
}


export default function Dashboard() {
    let error = ''

    const { data: serversession, status } = useSession()
    const [SearchParams, setSearchParams] = useState({ searchText: '' })


    const [resMydata, setresMydata] = useState<Object[]>([])

    // const HeaderList = headers()

    useEffect(() => {

        if (serversession) {
            myfetch()
        }
    }, [SearchParams, serversession])

    async function myfetch() {

        if (serversession) {

            const getres = await getGroupChats(serversession, SearchParams.searchText)
            console.log('getres', getres)
            setresMydata(getres)
        }
    }

    useEffect(() => {

        if (serversession && resMydata.length === 0) {

            myfetch()
        }
    }, [serversession])



    return (
        <div className="w-full h-full p-3">
            <div className="flex w-full justify-between">
                <h3 className="font-bold p-3">
                    Dashboard
                </h3>
                <CreateGroupChatPopup />

            </div>
            <div className='flex gap-[10px] items-center p-3'>

                <Input placeholder='Search Chat Groups'
                    value={ SearchParams.searchText }
                    onChange={ (e) => setSearchParams({ ...SearchParams, searchText: e.target.value }) }
                    className='w-[300px] focus-visible:ring-0 bg-[#f5f5f5]' />
                <div className='p-1 rounded hover:bg-gray-200 cursor-pointer active:bg-gray-300'>

                    <FaSearch className='text-[18px]' />
                </div>
            </div>

            <div className="p-3 flex flex-wrap gap-3">
                { resMydata.map((item, i) => {

                    return (
                        <GroupChatCard FetchFunc={ myfetch } key={ i } groupchat={ item } />

                    )
                }) }
            </div>
        </div>

    );
}


function GroupChatCard({ groupchat, FetchFunc }: { groupchat: any, FetchFunc: Function }) {

    const { data: serversession, status } = useSession()
    const socket: Socket = useMemo(() => {

        const socket = getSocket()

        return socket
    }, [])



    useEffect(() => {

        socket.on('message', (msg) => {
            console.log('msg from server socket :', msg)



        })
    }, [])
    const [apicall, setApiCall] = useState({ data: null, error: false, loading: false })

    async function JoinGroup() {


        return
        setApiCall({ ...apicall, loading: true })
        const myheaders = {
            'Content-Type': 'application/json',
            // Add the token to headers, check if session exists and has mytoken
            ...(serversession && (serversession as any).mytoken ? { 'Authorization': `Bearer ${(serversession as any).mytoken}` } : {})
        }
        const mydata = await fetch('http://localhost:4000/chats/joingroupchat', {
            method: 'POST',

            body: JSON.stringify({
                groupchat
            }),
            // Without Headers , GET handler will not be able to get the session and token
            headers: myheaders,
            cache: 'no-store'
        })

        if (mydata.status === 200) {
            let newd = await mydata.json()
            // console.log('yaaayyyy')
            socket.emit('joingroup', groupchat.GroupName)
            // FetchFunc()
            return newd
        }
        if (mydata.status === 401) {

            await signOut()
        }
        else {
            // console.log('erreo happen')
            setApiCall({ ...apicall, error: true })
        }



        setApiCall({ ...apicall, loading: false })
    }

    const Router = useRouter()

    function ViewGroup() {
        Router.push('/chat/' + groupchat.id)

    }

    function IsMember(members: string[]) {
        const findm = members.find((member: string) => member === serversession?.user?.email)

        if (findm)
            return true

        return false
    }

    return (<div className="w-[400px] min-h-[100px] p-2  shadow-lg flex flex-col">
        <h4 className="font-bold py-2">{ groupchat.GroupName }</h4>
        <p className="font-medium text-gray-700">{ groupchat.description }</p>
        { IsMember(groupchat.members) ?
            <Button className="self-end m-[10px] bg-slate-50 text-black border-2
          border-black rounded-md hover:bg-gray-200 "
                onClick={ ViewGroup }
            >View group</Button> :
            // <Button className="self-end m-[10px]"
            //     onClick={ JoinGroup }
            // >Join group</Button> 
            <JoinGroupChatPopup GroupDetails={ groupchat } />

        }
    </div>)
}

function CreateGroupChatPopup() {

    const socket: Socket = useMemo(() => {

        const socket = getSocket()

        return socket
    }, [])

    const { data: session, status } = useSession()
    const [CreateGroupPopup, setCreateGroupPopup] = useState(false)
    const [err, setErr] = useState('')
    const router = useRouter()

    useEffect(() => {

        if (!CreateGroupPopup) {
            setGroupData({ GroupName: '', Description: '', Password: '', ConfirmPassword: '' })
            setErr('')
        }
    }, [CreateGroupPopup])

    const [GroupData, setGroupData] = useState<Group & { Password: string, ConfirmPassword: string }>({
        GroupName: '', Description: '', Password: '', ConfirmPassword: ''
    })

    const Schema = yup.object().shape({
        GroupName: yup.string().required('Please Enter a Group Name').max(100, "Group Name can't be longer than 100 characters"),
        Description: yup.string().required('Please Enter Group Description').max(200, 'Desctiption cannot be longer than 200 words'),
        Password: yup.string().min(4, 'Password must be atleast 4 characters long').required('Password is required'),
        ConfirmPassword: yup.string().required('Confirm Password').oneOf([yup.ref('Password')], 'Passwords must match')


    });

    async function Create(e: FormEvent) {
        e.preventDefault()
        setErr('')
        try {
            const validate = await Schema.validate(GroupData, { abortEarly: true })
            const myheaders = {
                'Content-Type': 'application/json',
                // Add the token to headers, check if session exists and has mytoken
                'Authorization': `Bearer ${(session as any).mytoken}`
            }

            const response = await axios.post('http://localhost:4000/chats/creategroupchat', GroupData, { headers: myheaders })

            if (response.status === 200) {

                // route to page
                socket.emit('creategroup', response.data.data)
                router.push('/chat/' + response.data.data.id)
                //send socket event for Chat
            }
            setCreateGroupPopup(false)
        }
        catch (e: any) {
            if (e.name === 'ValidationError') {
                setErr(e.message)
            }
        }

    }
    return (
        <Dialog open={ CreateGroupPopup } onOpenChange={ setCreateGroupPopup }>
            <DialogTrigger asChild>
                <Button onClick={ () => setCreateGroupPopup(true) }>Create Group +</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Group Chat</DialogTitle>
                    <DialogDescription>
                        Enter The following Details
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={ Create }>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="GroupName" className="">
                                Group Name
                            </Label>
                            <Input id="GroupName"
                                onChange={ (e) => setGroupData({ ...GroupData, [e.target.id]: e.target.value }) }

                                value={ GroupData.GroupName } className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="Description" className="">
                                Description
                            </Label>
                            <Input id="Description"
                                onChange={ (e) => setGroupData({ ...GroupData, [e.target.id]: e.target.value }) }

                                value={ GroupData.Description } className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="Password" className="">
                                Password
                            </Label>
                            <Input id="Password"
                                type="password"
                                onChange={ (e) => setGroupData({ ...GroupData, [e.target.id]: e.target.value }) }

                                value={ GroupData.Password } className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="ConfirmPassword" className="">
                                Confirm Password
                            </Label>
                            <Input id="ConfirmPassword"
                                type="password"
                                onChange={ (e) => setGroupData({ ...GroupData, [e.target.id]: e.target.value }) }
                                value={ GroupData.ConfirmPassword }
                                className="col-span-3" />
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
                        <Button type="submit">Create Group</Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}


function JoinGroupChatPopup({ GroupDetails }: { GroupDetails: any }) {

    const [JoinGroupPopup, setJoinGroupPopup] = useState(false)
    const [err, setErr] = useState('')
    const { data: session, status } = useSession()
    const router = useRouter()
    const socket: Socket = getSocket()
    // useMemo(() => {

    //     const socket = getSocket()

    //     return socket
    // }, [])


    useEffect(() => {

        if (!JoinGroupPopup) {
            setGroupData({ Password: '', ConfirmPassword: '' })
            setErr('')
        }
    }, [JoinGroupPopup])

    const [GroupData, setGroupData] = useState<{ Password: string, ConfirmPassword: string }>({
        Password: '', ConfirmPassword: ''
    })

    const Schema = yup.object().shape({
        Password: yup.string().min(4, 'Password must be atleast 4 characters long').required('Password is required'),
        ConfirmPassword: yup.string().required('Confirm Password').oneOf([yup.ref('Password')], 'Passwords must match')


    });

    async function Join(e: FormEvent) {
        e.preventDefault()
        setErr('')
        try {
            const validate = await Schema.validate(GroupData, { abortEarly: true })
            const myheaders = {
                'Content-Type': 'application/json',
                // Add the token to headers, check if session exists and has mytoken
                'Authorization': `Bearer ${(session as any).mytoken}`
            }

            const response = await axios.post('http://localhost:4000/chats/joingroupchat', { ...GroupDetails, ...GroupData }, { headers: myheaders })

            if (response.status === 200) {


                socket.emit('joingroup', response.data.data)
                router.push('/chat/' + response.data.data.id)
                //send socket event for Chat
            }

            setJoinGroupPopup(false)
        }
        catch (e: any) {
            if (e.name === 'ValidationError') {
                setErr(e.message)
            }
            else {
                console.log(e)
            }
        }

    }
    return (
        <Dialog open={ JoinGroupPopup } onOpenChange={ setJoinGroupPopup }>
            <DialogTrigger asChild>
                <Button onClick={ () => setJoinGroupPopup(true) }
                    className="self-end m-[10px]"
                >Join Group </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Join New Group Chat</DialogTitle>
                    <DialogDescription>
                        Enter The following Details
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={ Join }>

                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <p className="font-bold text-xl">Group Name</p>
                            <p className="text-gray-500">Description</p>
                        </div>


                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="Password" className="">
                                Password
                            </Label>
                            <Input id="Password"
                                type="password"
                                onChange={ (e) => setGroupData({ ...GroupData, [e.target.id]: e.target.value }) }

                                value={ GroupData.Password } className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="ConfirmPassword" className="">
                                Confirm Password
                            </Label>
                            <Input id="ConfirmPassword"
                                type="password"
                                onChange={ (e) => setGroupData({ ...GroupData, [e.target.id]: e.target.value }) }
                                value={ GroupData.ConfirmPassword }
                                className="col-span-3" />
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
                        <Button type="submit">Join Group</Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}