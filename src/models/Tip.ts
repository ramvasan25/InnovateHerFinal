/**
 * Tip model
 * Stores short, community-submitted advice for artists.
 * Tips can be upvoted and filtered by category.
 */

import mongoose, { Schema, type Document } from 'mongoose'

/**
 * Interface representing a tip document
 */
export interface ITip extends Document {
  body: string                 
  category:
    | 'safety'
    | 'pricing'
    | 'technique'
    | 'supplies'
    | 'general'
  upvotes: number              
  createdAt: Date
}

/**
 * Schema definition for tips
 */
const TipSchema = new Schema<ITip>(
  {
    // Main tip text (tweet-length)
    body: { type: String, required: true, maxlength: 280 },

    // Category for filtering and discovery
    category: {
      type: String,
      enum: ['safety', 'pricing', 'technique', 'supplies', 'general'],
      default: 'general',
    },

    // Simple engagement metric
    upvotes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

// Indexes for sorting by recency and category
TipSchema.index({ createdAt: -1 })
TipSchema.index({ category: 1, createdAt: -1 })

export default mongoose.models.Tip ||
  mongoose.model<ITip>('Tip', TipSchema)
