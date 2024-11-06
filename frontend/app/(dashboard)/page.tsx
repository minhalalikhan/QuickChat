'use client'

import ChatList from "@/components/chats/ChatList";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/AuthOptions";
import { getSocket } from "@/lib/socket.config";
import { AxiosResponse } from "axios";

import { getServerSession, Session } from "next-auth";
import { getSession, signOut, useSession } from "next-auth/react";
import { FetchEventResult } from "next/dist/server/web/types";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";

// import { headers } from "next/headers";


async function getGroupChats(serversession: Session) {
    const myheaders = {
        'Content-Type': 'application/json',
        // Add the token to headers, check if session exists and has mytoken
        ...(serversession && (serversession as any).mytoken ? { 'Authorization': `Bearer ${(serversession as any).mytoken}` } : {})
    }



    const mydata = await fetch('http://localhost:4000/chats/groupchats', {
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


    const [resMydata, setresMydata] = useState<Object[]>([])

    // const HeaderList = headers()

    async function fetch() {

        if (serversession) {

            const getres = await getGroupChats(serversession)

            setresMydata(getres)
        }
    }

    useEffect(() => {

        if (serversession && resMydata.length === 0) {

            fetch()
        }
    }, [serversession])



    return (
        <div className="w-full h-full p-3">
            <h3 className="font-bold">
                Dashboard
            </h3>

            <div className="p-3 flex flex-col gap-3">
                { resMydata.map((item, i) => {

                    return (
                        <GroupChatCard FetchFunc={ fetch } key={ i } groupchat={ item } />
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

        socket.on('message', () => {



            return () => {
                socket.disconnect()
            }
        })
    }, [])
    const [apicall, setApiCall] = useState({ data: null, error: false, loading: false })

    async function JoinGroup() {
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
            FetchFunc()
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
        Router.push('/chat/' + groupchat.GroupName)

    }

    return (<div className="w-[400px] min-h-[100px] p-2  shadow-lg flex flex-col">
        <h4 className="font-bold py-2">{ groupchat.GroupName }</h4>
        <p className="font-medium text-gray-700">{ groupchat.description }</p>
        { groupchat.members.length === 0 ? <Button className="self-end m-[10px]"
            onClick={ JoinGroup }
        >Join group</Button> :
            <Button className="self-end m-[10px] bg-slate-50 text-black border-2
             border-black rounded-md hover:bg-gray-200 "
                onClick={ ViewGroup }
            >View group</Button> }
    </div>)
}