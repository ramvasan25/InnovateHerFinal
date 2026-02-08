import mongoose, { Schema, type Document, Types } from 'mongoose'

export interface IVenueRating extends Document {
  venue: Types.ObjectId
  safety: number
  fairPay: number
  respect: number
  comment: string
  createdAt: Date
}

const VenueRatingSchema = new Schema<IVenueRating>(
  {
    venue: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },
    safety: { type: Number, required: true, min: 1, max: 5 },
    fairPay: { type: Number, required: true, min: 1, max: 5 },
    respect: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500, default: '' },
  },
  { timestamps: true }
)

VenueRatingSchema.index({ venue: 1, createdAt: -1 })

export default mongoose.models.VenueRating || mongoose.model<IVenueRating>('VenueRating', VenueRatingSchema)
