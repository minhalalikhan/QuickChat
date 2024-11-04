import React from 'react'

type params = { id: string }

function chat({ params }: { params: params }) {

    return (
        <div className=''>chat with user with ID { params.id }</div>
    )
}


export default chat