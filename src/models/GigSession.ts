import mongoose, { Schema, type Document } from 'mongoose'

export interface IGigSession extends Document {
  sessionId: string
  venueName: string
  startTime: Date
  expectedEnd: Date
  status: 'active' | 'checked_out' | 'overdue' | 'alert_sent'
  createdAt: Date
}

const GigSessionSchema = new Schema<IGigSession>(
  {
    sessionId: { type: String, required: true, unique: true },
    venueName: { type: String, required: true },
    startTime: { type: Date, required: true },
    expectedEnd: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'checked_out', 'overdue', 'alert_sent'],
      default: 'active',
    },
  },
  { timestamps: true }
)

GigSessionSchema.index({ status: 1, expectedEnd: 1 })

export default mongoose.models.GigSession || mongoose.model<IGigSession>('GigSession', GigSessionSchema)
