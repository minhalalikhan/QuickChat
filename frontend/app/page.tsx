
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

  // const mydata = await fetch('http://localhost:3000/api/chats', {
  //   method: 'GET',

  //   headers: HeaderList,
  //   cache: 'no-store'
  // })
  // console.log('mydata', mydata.statusText)

  // const show = mydata?.status === 401 ? 'fetch failed' : JSON.stringify(mydata.json())
  const show = ''
  //   // const finaldata_ = await mydata.json()
  //   // console.log(finaldata_)
  //   const finaldata_ = await getChats()
  //   console.log(finaldata_)
  // } catch (e: any) {

  //   if (e.response) {
  //     console.log('this is error response from page.tsx', e.response)
  //   }
  //   else {
  //     console.log('some error', e)
  //   }

  // }



  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />
      <div className="flex-1">
        <h1>MY chats data</h1>
        {/* { JSON.stringify(finaldata_) } */ }
        { show }
        { false && <p className="bg-red-500 text-white p-3 text-xl">{ error }</p> }
      </div>
      <Footer />
    </div>
  );
}
