import { dbConnect } from '@/lib/db'
import Venue from '@/models/Venue'
import IncidentReport from '@/models/IncidentReport'
import { incidentSchema } from '@/lib/validate'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const { id } = await params
  const incidents = await IncidentReport.find({ venue: id }).sort({ createdAt: -1 }).limit(50).lean()
  return NextResponse.json(incidents)
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const { id } = await params
  const body = await req.json()
  const parsed = incidentSchema.safeParse({ ...body, venueId: id })
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { type, severity, description, dateOfIncident } = parsed.data
  const incident = await IncidentReport.create({ venue: id, type, severity, description, dateOfIncident })

  await Venue.findByIdAndUpdate(id, { $inc: { totalIncidents: 1 } })

  return NextResponse.json(incident, { status: 201 })
}
