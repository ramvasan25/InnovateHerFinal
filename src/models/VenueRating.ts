/**
 * VenueRating model
 * Stores individual ratings left by artists for a specific venue.
 * Each rating contributes to the venue's aggregated safety, pay, and respect scores.
 */

import mongoose, { Schema, type Document, Types } from 'mongoose'

/**
 * Interface representing a single venue rating document
 */
export interface IVenueRating extends Document {
  venue: Types.ObjectId          // Reference to the venue being rated
  safety: number                 // Safety score (1–5)
  fairPay: number                // Fair pay score (1–5)
  respect: number                // Respect score (1–5)
  comment: string                // Optional written feedback
  createdAt: Date                // Auto-generated timestamp
}

/**
 * Schema definition for venue ratings
 */
const VenueRatingSchema = new Schema<IVenueRating>(
  {
    // Venue this rating belongs to
    venue: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },

    // Core rating dimensions (1–5 scale)
    safety: { type: Number, required: true, min: 1, max: 5 },
    fairPay: { type: Number, required: true, min: 1, max: 5 },
    respect: { type: Number, required: true, min: 1, max: 5 },

    // Optional written feedback
    comment: { type: String, maxlength: 500, default: '' },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
)

// Index for quickly retrieving most recent ratings for a venue
VenueRatingSchema.index({ venue: 1, createdAt: -1 })

// Export model (prevents recompilation in Next.js / hot reload)
export default mongoose.models.VenueRating ||
  mongoose.model<IVenueRating>('VenueRating', VenueRatingSchema)

