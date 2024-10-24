// src/app/api/chats/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import axios from 'axios';
import { authOptions } from '@/lib/AuthOptions'; // Adjust the import according to your file structure
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest, res: NextResponse) {
    // Get the session from NextAuth

    // WHEN REQUEST IS MADE FROM SERVER COMPONENTS ENSURE THAT Headers are ADDED EXPLICITLY USING NEXT/HEADERS

    // console.log('this is the input req', req)
    const session = await getServerSession(authOptions);

    // getToken uses ENV variable NEXTAUTH_SECRET to decode
    const backendToken = await getToken({ req })

    // console.log('api/chats backtoken', backendToken)
    // console.log('api/chats session obj', session)

    if (!session) {
        // console.log('api/chats session', session)
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!backendToken || !backendToken?.mytoken) {
        // console.log('api/chats token', backendToken)
        return NextResponse.json({ message: 'Backend Token Not present' }, { status: 401 });
    }
    try {
        // Make the GET request to your Express backend
        const response = await axios.get('http://localhost:4000/chats', {
            headers: {
                Authorization: `Bearer ${backendToken.mytoken}`, // Use the token from the session
            },
        });

        // console.log('response inside /api/chats', response)
        return NextResponse.json(response.data);


    } catch (error: any) {
        // console.log('error in chats', error?.response)
        return NextResponse.json({ message: 'Failed to fetch data from Express backend' }, { status: 500 });
    }
}
