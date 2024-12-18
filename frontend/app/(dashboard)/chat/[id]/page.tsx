import ChatPage from '@/components/chats/ChatPage'
import React from 'react'

type params = { id: string }

function chat({ params }: { params: params }) {

    return (
        <ChatPage GroupID={ params.id } />
    )
}


export default chat