import mongoose, { Schema, type Document } from 'mongoose'

export interface IOpportunity extends Document {
  title: string
  artistName: string
  description: string
  story: string
  medium: 'digital' | 'painting' | 'pottery' | 'sculpture' | 'graffiti' | 'photography' | 'textile' | 'mixed_media' | 'other'
  imageUrl: string
  price: string
  negotiable: boolean
  createdAt: Date
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    title: { type: String, required: true, maxlength: 200 },
    artistName: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 2000 },
    story: { type: String, default: '', maxlength: 3000 },
    medium: {
      type: String,
      enum: ['digital', 'painting', 'pottery', 'sculpture', 'graffiti', 'photography', 'textile', 'mixed_media', 'other'],
      default: 'other',
    },
    imageUrl: { type: String, default: '' },
    price: { type: String, default: 'Not for sale' },
    negotiable: { type: Boolean, default: false },
  },
  { timestamps: true }
)

OpportunitySchema.set('autoIndex', false)

export default mongoose.models.Opportunity || mongoose.model<IOpportunity>('Opportunity', OpportunitySchema)
