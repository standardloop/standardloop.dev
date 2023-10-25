import Head from 'next/head'
import Link from 'next/link'

export default function Home() {

  return (
    <div className="flex min-h-screen bg-gray-900 flex items-center justify-center cursor-default">
      <Head>
        <title>standardloop.dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/landing">
        <div className="text-9xl font-extrabold text-emerald-500 cursor-pointer">
          standardloop.dev
        </div>
      </Link>
    </div >
  )
}
