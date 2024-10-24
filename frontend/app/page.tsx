
import Footer from "@/components/base/Footer";
import Navbar from "@/components/base/Navbar";
import axios, { AxiosResponse } from "axios";
import { getChats } from "./actions/chats";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";
import { headers } from "next/headers";


export default async function Home() {

  let error = ''

  const HeaderList = headers()

  const mydata = await fetch('http://localhost:3000/api/chats', {
    method: 'GET',

    // Without Headers , GET handler will not be able to get the session and token
    headers: HeaderList,
    cache: 'no-store'
  })

  if (!(mydata.status === 200)) {

    return <div>
      Hompage data load failed
    </div>
  }
  const resMydata = await mydata.json()
  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />
      <div className="flex-1">
        <h1>MY chats data</h1>
        {/* { JSON.stringify(finaldata_) } */ }
        { JSON.stringify(resMydata) }
        { false && <p className="bg-red-500 text-white p-3 text-xl">{ error }</p> }
      </div>
      <Footer />
    </div>
  );
}
