import Head from 'next/head'

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50 flex items-center justify-center">
      <Head>
        <title>standardloop.dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-6xl absolute top-10 font-extrabold text-emerald-500">standardloop.dev</h1>
      <div className="bg-gray-50 w-full flex items-center justify-center">
        <div className="relative w-full max-w-xl">
          {/* top left */}
          <div className="absolute -left-96 -top-96 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob30s "></div>
          {/* top middle left */}
          <div className="absolute -left-36 -top-96 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob50s "></div>
          {/* middle left left */}
          <div className="absolute -left-96 -top-48 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob40s "></div>
          {/* middle top */}
          <div className="absolute left-24 -top-96 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob70s "></div>
          {/* middle left */}
          <div className="absolute -left-36 -top-48 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob60s "></div>
          {/* bottom left */}
          <div className="absolute -left-96 -down-96 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob50s "></div>
          {/* top middle right */}
          <div className="absolute -right-36 -top-96 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob60s "></div>
          {/* middle middle middle */}
          <div className="absolute left-24 -top-48 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob30s "></div>
          {/* bottom middle left */}
          <div className="absolute -left-36 -down-96 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob60s "></div>
          {/* top right */}
          <div className="absolute -right-96 -top-96 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob70s "></div>
          {/* middle right */}
          <div className="absolute -right-36 -top-48 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob50s "></div>
          {/* middle bottom */}
          <div className="absolute left-24 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob40s "></div>
          {/* middle right right */}
          <div className="absolute -right-96 -top-48 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob70s "></div>
          {/* bottom middle right */}
          <div className="absolute -right-36 -down-96 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob30s "></div>
          {/* bottom right */}
          <div className="absolute -right-96 -down-96 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob60s "></div>
          {/* <div className="m-8 relative space-y-4">
            <div className="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
              <div className="flex-1">
                <div className="h-4 w-48 bg-gray-300 rounded"></div>
              </div>
              <div>
                <div className="w-24 h-6 rounded-lg bg-emerald-300"></div>
              </div>
            </div>
            <div className="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
              <div className="flex-1">
                <div className="h-4 w-56 bg-gray-300 rounded"></div>
              </div>
              <div>
                <div className="w-20 h-6 rounded-lg bg-emerald-300"></div>
              </div>
            </div>
            <div className="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
              <div className="flex-1">
                <div className="h-4 w-44 bg-gray-300 rounded"></div>
              </div>
              <div>
                <div className="w-28 h-6 rounded-lg bg-emerald-300"></div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
