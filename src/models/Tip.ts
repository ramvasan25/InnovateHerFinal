import mongoose, { Schema, type Document } from 'mongoose'

export interface ITip extends Document {
  body: string
  category: 'safety' | 'pricing' | 'technique' | 'supplies' | 'general'
  upvotes: number
  createdAt: Date
}

const TipSchema = new Schema<ITip>(
  {
    body: { type: String, required: true, maxlength: 280 },
    category: {
      type: String,
      enum: ['safety', 'pricing', 'technique', 'supplies', 'general'],
      default: 'general',
    },
    upvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
)

TipSchema.index({ createdAt: -1 })
TipSchema.index({ category: 1, createdAt: -1 })

export default mongoose.models.Tip || mongoose.model<ITip>('Tip', TipSchema)
