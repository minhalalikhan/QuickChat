import Footer from "@/components/base/Footer";
import Navbar from "@/components/base/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />

      <Footer />
    </div>
  );
}
