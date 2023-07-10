import Head from 'next/head'
import Link from 'next/link'
export default function Home() {
    return (
        <div className="flex min-h-screen bg-gray-50 flex items-center justify-center">
            <Head>
                <title>/animations</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1 className="text-6xl absolute top-10 font-extrabold text-emerald-500">
                <Link href="/">standardloop.dev</Link>
            </h1>
            <h1 className="text-6xl absolute top-10 left-10 font-extrabold text-emerald-500">
                <Link href="/animations">animations</Link>
            </h1>
            <h1 className="text-4xl absolute top-20 left-10 font-extrabold text-emerald-500">
                <Link href="/animations/bubbles">bubbles</Link>
            </h1>
            <h1 className="text-4xl absolute top-21 left-10 font-extrabold text-emerald-500">
                <Link href="/animations/bubbles2">bubbles2</Link>
            </h1>
        </div>
    )
}
