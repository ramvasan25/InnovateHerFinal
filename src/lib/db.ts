import 'server-only'
import mongoose, { type Mongoose } from 'mongoose'

let cached = global.mongoose
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function dbConnect(): Promise<Mongoose> {
  if (cached!.conn) return cached!.conn

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(uri, { bufferCommands: false })
  }
  cached!.conn = await cached!.promise
  return cached!.conn
}
