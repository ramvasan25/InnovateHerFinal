/**
 * Opportunity model
 * Represents an art listing, commission, or showcase opportunity
 * created by or for women artists.
 */

import mongoose, { Schema, type Document } from 'mongoose'

/**
 * Interface representing an opportunity document
 */
export interface IOpportunity extends Document {
  title: string
  artistName: string
  description: string
  story: string
  medium:
    | 'digital'
    | 'painting'
    | 'pottery'
    | 'sculpture'
    | 'graffiti'
    | 'photography'
    | 'textile'
    | 'mixed_media'
    | 'other'
  imageUrl: string
  price: string
  negotiable: boolean
  createdAt: Date
}

/**
 * Schema definition for opportunities
 */
const OpportunitySchema = new Schema<IOpportunity>(
  {
    // Short headline for the listing
    title: { type: String, required: true, maxlength: 200 },

    // Name of the artist or creator
    artistName: { type: String, required: true, maxlength: 100 },

    // Primary description of the opportunity
    description: { type: String, required: true, maxlength: 2000 },

    // Optional background or personal story
    story: { type: String, default: '', maxlength: 3000 },

    // Artistic medium
    medium: {
      type: String,
      enum: [
        'digital',
        'painting',
        'pottery',
        'sculpture',
        'graffiti',
        'photography',
        'textile',
        'mixed_media',
        'other',
      ],
      default: 'other',
    },

    // Image preview URL
    imageUrl: { type: String, default: '' },

    // Pricing information
    price: { type: String, default: 'Not for sale' },
    negotiable: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

OpportunitySchema.set('autoIndex', false)

export default mongoose.models.Opportunity ||
  mongoose.model<IOpportunity>('Opportunity', OpportunitySchema)
