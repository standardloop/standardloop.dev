import Circle from "@/components/circle";
import Head from "next/head";

export default function Test() {
    return (
        <div className="">
            <Head>
                <title>standardloop.dev/test</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Circle />
        </div>
    );
}
