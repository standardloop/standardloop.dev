import Head from "next/head"
import Link from 'next/link';


export default function BubblesV2() {
    return (
        <div className="flex min-h-screen bg-gray-50 flex items-center justify-center">
            <h1 className="text-6xl absolute top-10 font-extrabold text-emerald-500">
                <Link href="/">bubbles2</Link>
            </h1>
            <div className="bg-gray-50 w-full flex items-center justify-center">
                <div className="relative w-full max-w-xl">
                    {/* middle middle middle */}
                    <div className="absolute w-48 h-48 bg-yellow-100 rounded-full mix-blend-multiply filter blur-x opacity-70 "></div>
                </div>
            </div>
        </div>
    )
}
