import React from "react";
import Link from 'next/link'

export default function Header() {
    return (
        <React.Fragment>
            <header>
                <nav className="bg-emerald-500 border-gray-200 px-4 lg:px-6 py-2.5 cursor-default">
                    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                        <Link href="/" className="flex items-center">
                            <div className="cursor-pointer self-center text-xl font-semibold whitespace-nowrap">
                                standardloop
                            </div>
                        </Link>
                        <div className="flex items-center lg:order-2">
                            <Link href="/wip" className="text-gray-800 hover:bg-gray-50 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 cursor-pointer">
                                Login
                            </Link>
                            <Link href="/wip" className="text-gray-800 hover:bg-gray-50 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 cursor-pointer">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>
        </React.Fragment>
    );
}
