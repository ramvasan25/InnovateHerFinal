import mongoose, { Schema, type Document, Types } from 'mongoose'

export interface IIncidentReport extends Document {
  venue: Types.ObjectId
  type: 'harassment' | 'unsafe_conditions' | 'nonpayment' | 'discrimination' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  dateOfIncident: Date
  createdAt: Date
}

const IncidentReportSchema = new Schema<IIncidentReport>(
  {
    venue: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },
    type: {
      type: String,
      enum: ['harassment', 'unsafe_conditions', 'nonpayment', 'discrimination', 'other'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    description: { type: String, required: true, maxlength: 2000 },
    dateOfIncident: { type: Date, required: true },
  },
  { timestamps: true }
)

IncidentReportSchema.index({ venue: 1, createdAt: -1 })

export default mongoose.models.IncidentReport || mongoose.model<IIncidentReport>('IncidentReport', IncidentReportSchema)
