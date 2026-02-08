/**
 * Venue model
 * Represents a physical or public creative space where artists work,
 * exhibit, or perform. Aggregated scores are derived from VenueRatings.
 */

import mongoose, { Schema, type Document } from 'mongoose'

/**
 * Interface representing a venue document
 */
export interface IVenue extends Document {
  name: string
  address: string
  city: string
  category:
    | 'gallery'
    | 'studio'
    | 'pottery_studio'
    | 'graffiti_spot'
    | 'makerspace'
    | 'outdoor'
    | 'other'

  // Aggregated rating metrics
  avgSafety: number
  avgFairPay: number
  avgRespect: number

  // Metadata
  totalRatings: number
  totalIncidents: number
  createdAt: Date
}

/**
 * Schema definition for venues
 */
const VenueSchema = new Schema<IVenue>(
  {
    // Basic venue information
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },

    // Venue type/category
    category: {
      type: String,
      enum: [
        'gallery',
        'studio',
        'pottery_studio',
        'graffiti_spot',
        'makerspace',
        'outdoor',
        'other',
      ],
      default: 'other',
    },

    // Aggregated averages from ratings
    avgSafety: { type: Number, default: 0 },
    avgFairPay: { type: Number, default: 0 },
    avgRespect: { type: Number, default: 0 },

    // Counters for analytics and moderation
    totalRatings: { type: Number, default: 0 },
    totalIncidents: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

// Indexes for fast searching and filtering
VenueSchema.index({ city: 1 })
VenueSchema.index({ name: 'text', city: 'text' })

export default mongoose.models.Venue ||
  mongoose.model<IVenue>('Venue', VenueSchema)
