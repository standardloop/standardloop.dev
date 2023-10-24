import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

type ResponseData = {
    ENV: string,
    SHA: string
}

export async function GET(req: Request, res: NextApiResponse<ResponseData>) {
    return NextResponse.json({
        ENV: "production",
        SHA: "0000000"
    })
}
