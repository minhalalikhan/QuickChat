'use client'
import React, { ChangeEvent, useState, useEffect, useRef } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { IoSend } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5";

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

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type Props = { GroupName: string }

function ChatPage({ GroupName }: Props) {


    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Function to scroll to the bottom
    const scrollToBottom = () => {
        if (messagesEndRef.current)
            messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    };

    // Scroll to bottom on component mount
    useEffect(() => {
        scrollToBottom();
    }, []);

    return (
        <div className='w-full h-full flex flex-col '>
            {/* Header */ }
            <div className='w-full h-[50px] border-b-2 bg-slate-100 px-2 flex items-center justify-between'>
                <h4 className='font-bold'>{ decodeURIComponent(GroupName) }</h4>
                {/* ACTIONS : leave group , share group invite view members */ }
                <Settings />
            </div>
            {/* Chat */ }
            <div className='flex-1 flex flex-col overflow-y-auto w-full gap-3 p-3 items-end'
                id='msgcontainer'>
                <Message msg='Time up' type='USER' />
                <Message msg='hello there' type='OTHER' />
                <Message msg='amigo' type='OTHER' />
                <Message msg='random' type='OTHER' />
                <Message msg='oyyyye' type='USER' />
                <Message msg='Time to work' type='USER' />
                <Message msg='random' type='OTHER' />
                <Message msg='msg 1' type='USER' />
                <Message msg='Time up' type='USER' />
                <Message msg='hello there' type='OTHER' />
                <Message msg='amigo' type='OTHER' />
                <Message msg='random' type='OTHER' />
                <Message msg='oyyyye' type='USER' />
                <Message msg='Time to work' type='USER' />
                <Message msg='random' type='OTHER' />
                <div ref={ messagesEndRef } />
            </div>
            {/* Text Field */ }
            <MessageInputBar />

        </div>
    )
}

export default ChatPage


function Settings() {
    return (

        <Popover>
            <PopoverTrigger><IoSettingsSharp /></PopoverTrigger>
            <PopoverContent className='w-[200px] mr-4'>
                <div className='flex flex-col w-full'>
                    <div className='w-full h-[40px] p-1 hover:bg-slate-100 border-b cursor-pointer'>
                        <ShareInvitePopup />
                    </div>
                    <div className='w-full h-[40px] p-1 hover:bg-slate-100 border-b cursor-pointer'>
                        <LeaveGroupChatPopup />
                    </div>
                    <div className='w-full h-[40px] p-1 hover:bg-slate-100 border-b cursor-pointer'>
                        <DeleteGroupChatPopup />
                    </div>
                    <div className='w-full h-[40px] p-1 hover:bg-slate-100 border-b cursor-pointer'>
                        <ViewMembersPopup />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}


function LeaveGroupChatPopup() {

    const [LeaveGroupPopup, setLeaveGroupPopup] = useState(false)
    const [err, setErr] = useState('')


    async function Leave() {

        try {
            alert('leave group')


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

function DeleteGroupChatPopup() {

    const [DeleteGroupPopup, setDeleteGroupPopup] = useState(false)
    const [DeleteCred, setDeleteCred] = useState('')
    const [err, setErr] = useState('')


    async function Delete() {

        try {
            alert('Delete group')


        }
        catch (e: any) {
            setErr('Error Occured !! Please try again later')
        }

    }
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

function ViewMembersPopup() {
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

                    <p className='cursor-pointer font-bold h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum (Admin)</p>

                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>
                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>
                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>

                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>

                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>
                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>
                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>
                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>

                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>
                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>
                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>
                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>

                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>
                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>
                    <p className='cursor-pointer h-fit p-1 rounded-sm
                     hover:bg-slate-200'>Loerem Ipsum</p>

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
    msg: string,
    type: 'OTHER' | 'USER'
}

function Message({ msg, type }: Messageprop) {
    return (
        <div className={ ` rounded-lg px-2 py-1 w-fit max-w-[60%]  flex flex-col ${type === 'OTHER' ? 'bg-[#efefef] self-start' : ' bg-purple-400  text-white'} ` }>
            { type === 'OTHER' && <p className='font-bold'>Sender Name</p> }
            { msg }
        </div>
    )
}

function MessageInputBar() {
    const [message, SetMessage] = useState('')

    function HandleInput(e: ChangeEvent<HTMLInputElement>) {
        SetMessage(e.target.value)
    }

    function SendMessage() {
        if (!message) {
            alert('empty')
        }
        const msg = message
        // send this to backend 

        SetMessage('')
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
                disabled={ !message }
                onClick={ SendMessage }
            >
                <IoSend />
            </Button>
        </div>
    )
}