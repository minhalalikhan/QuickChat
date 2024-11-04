import Footer from "@/components/base/Footer";
import Navbar from "@/components/base/Navbar";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";

import { redirect } from "next/navigation";

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
            <div className="flex-1">
                { children }
            </div>
            <Footer />
        </div>
    );
}