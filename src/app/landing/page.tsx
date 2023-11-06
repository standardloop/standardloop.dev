import Head from 'next/head'
import Link from 'next/link'

export default function Landing() {
    return (
        <div className="flex min-h-screen bg-gray-900 flex items-center justify-center cursor-default">
            <Head>
                <title>landing</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="text-9xl font-extrabold text-emerald-500 cursor-text">
                Hello ✌️😊✌️
            </div>
        </div >
    )
}
