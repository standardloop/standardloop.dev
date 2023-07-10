import Head from "next/head"
import Link from 'next/link';

export default function BubblesV1() {
  return (
    <div className="flex min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-6xl absolute top-10 font-extrabold text-emerald-500">
        <Link href="/">standardloop.dev</Link>
      </h1>
      <div className="bg-gray-50 w-full flex items-center justify-center">
        <div className="relative w-full max-w-xl">
          {/* top left */}
          <div className="absolute -left-96 -top-96 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob75s "></div>
          {/* top middle left */}
          <div className="absolute -left-36 -top-96 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob56s "></div>
          {/* middle left left */}
          <div className="absolute -left-96 -top-48 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob42s "></div>
          {/* middle top */}
          <div className="absolute left-24 -top-96 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob69s "></div>
          {/* middle left */}
          <div className="absolute -left-36 -top-48 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob64s "></div>
          {/* bottom left */}
          <div className="absolute -left-96 -down-96 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob51s "></div>
          {/* top middle right */}
          <div className="absolute -right-36 -top-96 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob58s "></div>
          {/* middle middle middle */}
          <div className="absolute left-24 -top-48 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob33s "></div>
          {/* bottom middle left */}
          <div className="absolute -left-36 -down-96 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob63s "></div>
          {/* top right */}
          <div className="absolute -right-96 -top-96 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob71s "></div>
          {/* middle right */}
          <div className="absolute -right-36 -top-48 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob44s "></div>
          {/* middle bottom */}
          <div className="absolute left-24 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob47s "></div>
          {/* middle right right */}
          <div className="absolute -right-96 -top-48 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob71s "></div>
          {/* bottom middle right */}
          <div className="absolute -right-36 -down-96 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob37s "></div>
          {/* bottom right */}
          <div className="absolute -right-96 -down-96 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-x opacity-70 animate-blob62s "></div>
        </div>
      </div>
    </div>
  )
}
