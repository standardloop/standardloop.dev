import Link from "next/link"
import Head from "next/head"

export default function Custom404() {
    return (
        <div className="flex min-h-screen bg-gray-900 flex items-center justify-center cursor-default">
            <Head>
                <title>404 - standardloop.dev</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Link href="/">
                <div className="text-6xl font-extrabold text-emerald-500 cursor-pointer">
                    Page Not Found (404)
                </div>
            </Link>
        </div >
    )
}
