import { dbConnect } from '@/lib/db'
import mongoose from 'mongoose'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await dbConnect()
    const status = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    return NextResponse.json({ status, timestamp: new Date().toISOString() })
  } catch {
    return NextResponse.json({ status: 'error', timestamp: new Date().toISOString() }, { status: 500 })
  }
}
