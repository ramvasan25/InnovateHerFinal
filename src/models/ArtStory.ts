import mongoose, { Schema, type Document } from 'mongoose'

export interface IArtStory extends Document {
  title: string
  body: string
  category: 'journey' | 'inspiration' | 'challenge' | 'advice' | 'general'
  upvotes: number
  createdAt: Date
}

const ArtStorySchema = new Schema<IArtStory>(
  {
    title: { type: String, required: true, maxlength: 200 },
    body: { type: String, required: true, maxlength: 3000 },
    category: {
      type: String,
      enum: ['journey', 'inspiration', 'challenge', 'advice', 'general'],
      default: 'general',
    },
    upvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
)

ArtStorySchema.index({ createdAt: -1 })
ArtStorySchema.index({ category: 1, createdAt: -1 })

export default mongoose.models.ArtStory || mongoose.model<IArtStory>('ArtStory', ArtStorySchema)
