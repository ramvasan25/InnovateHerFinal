import { z } from 'zod'

export const ratingSchema = z.object({
  venueId: z.string().min(1),
  safety: z.number().int().min(1).max(5),
  fairPay: z.number().int().min(1).max(5),
  respect: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional().default(''),
})

export const incidentSchema = z.object({
  venueId: z.string().min(1),
  type: z.enum(['harassment', 'unsafe_conditions', 'nonpayment', 'discrimination', 'other']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().min(10).max(2000),
  dateOfIncident: z.string().transform((s) => new Date(s)),
})

export const tipSchema = z.object({
  body: z.string().min(1).max(280),
  category: z.enum(['safety', 'pricing', 'technique', 'supplies', 'general']).optional().default('general'),
})

export const opportunitySchema = z.object({
  title: z.string().min(1).max(200),
  artistName: z.string().min(1).max(100),
  description: z.string().min(10).max(2000),
  story: z.string().max(3000).optional().default(''),
  medium: z.enum(['digital', 'painting', 'pottery', 'sculpture', 'graffiti', 'photography', 'textile', 'mixed_media', 'other']).optional().default('other'),
  imageUrl: z.string().optional().default(''),
  price: z.string().optional().default('Not for sale'),
  negotiable: z.boolean().optional().default(false),
})

export const storySchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(10).max(3000),
  category: z.enum(['journey', 'inspiration', 'challenge', 'advice', 'general']).optional().default('general'),
})

export const checkinSchema = z.object({
  sessionId: z.string().min(1),
  venueName: z.string().min(1),
  durationMinutes: z.number().int().min(15).max(720),
})
