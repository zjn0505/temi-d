import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'


export function middleware(req: NextRequest) {
    const basicAuth = req.headers.get('authorization')

    if (basicAuth === process.env.ROBOT_AUTHEN_KEY) {
        return NextResponse.next()
    }

    return new Response('Authentication required', {
        status: 401
    })
}