'use client'
import React, { ChangeEvent, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { IoSend } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type Props = { GroupName: string }

function ChatPage({ GroupName }: Props) {




    return (
        <div className='w-full h-full flex flex-col'>
            {/* Header */ }
            <div className='w-full h-[50px] border-b-2 bg-slate-100 px-2 flex items-center justify-between'>
                <h4 className='font-bold'>{ decodeURIComponent(GroupName) }</h4>
                {/* ACTIONS : leave group , share group invite view members */ }
                <Settings />
            </div>
            {/* Chat */ }
            <div className='flex-1 flex flex-col overflow-y-auto w-full gap-3 p-3 items-end'>
                <Message msg='hello there' type='OTHER' />
                <Message msg='amigo' type='OTHER' />
                <Message msg='random' type='OTHER' />
                <Message msg='oyyyye' type='USER' />
                <Message msg='random' type='OTHER' />
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
                        Share Invite
                    </div>
                    <div className='w-full h-[40px] p-1 hover:bg-slate-100 border-b cursor-pointer'>
                        Leave Group
                    </div>
                    <div className='w-full h-[40px] p-1 hover:bg-slate-100 border-b cursor-pointer'>
                        View Members
                    </div>
                </div>
            </PopoverContent>
        </Popover>
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