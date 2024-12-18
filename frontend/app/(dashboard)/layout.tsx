import Footer from "@/components/base/Footer";
import Navbar from "@/components/base/Navbar";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";

import { redirect } from "next/navigation";
import ChatList from "@/components/chats/ChatList";

export default async function DashboardLayout({
    children,

}: Readonly<{
    children: React.ReactNode;

}>) {

    let error = ''

    const serversession = await getServerSession(authOptions)

    console.log('server session on main page', serversession)
    if (!serversession) {
        redirect('/signin')
    }



    return (
        <div className="flex flex-col w-full h-full">
            <Navbar />
            <div className="flex-1 w-full flex overflow-y-auto">
                <ChatList />
                <div className="flex-1 h-full bg-[#f2f2f2] p-6">

                    <div className="bg-white rounded-md  w-full h-full overflow-y-auto">
                        { children }

                    </div>
                </div>
            </div>
            {/* <Footer /> */ }
        </div>
    );
}