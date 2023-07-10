import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'


export async function GET(req: NextApiRequest, res: NextApiResponse) {
    return NextResponse.json({
        ENV: "production",
        SHA: "0000000"
    })
}
