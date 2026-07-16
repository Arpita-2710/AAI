import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { incidents, incidentTimeline } from '@/db/schema'
import { eq, and, not, count, desc } from 'drizzle-orm'

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const terminal = searchParams.get('terminal')
  const severity = searchParams.get('severity')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  try {
    const conditions = []
    if (terminal) conditions.push(eq(incidents.terminal_id, terminal))
    if (severity) conditions.push(eq(incidents.severity, severity))
    if (status) conditions.push(eq(incidents.status, status))

    const baseQuery = db.select().from(incidents)
    const countQuery = db.select({ count: count() }).from(incidents)

    if (conditions.length > 0) {
      baseQuery.where(and(...conditions))
      countQuery.where(and(...conditions))
    }

    const [totalRow] = await countQuery
    const total = Number(totalRow?.count ?? 0)

    const list = await baseQuery
      .orderBy(desc(incidents.created_at))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      data: list,
      total,
      page
    })
  } catch (err) {
    console.error('Error fetching incidents api:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    const { device_id, terminal_id, level_id, title, description, issue_type, severity, reported_by } = body

    if (!terminal_id || !title || !issue_type || !severity) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Generate incident_ref
    const [existingCountRow] = await db.select({ count: count() }).from(incidents)
    const index = Number(existingCountRow?.count ?? 0) + 1
    const incident_ref = `INC-2026-${String(index).padStart(5, '0')}`

    const [newIncident] = await db
      .insert(incidents)
      .values({
        incident_ref,
        device_id: device_id || null,
        terminal_id,
        level_id: level_id || null,
        title,
        description: description || null,
        issue_type,
        severity,
        status: 'OPEN',
        reported_by: reported_by || 'Staff Operator',
        assigned_to: 'Unassigned',
      })
      .returning()

    // Create timeline entry
    await db.insert(incidentTimeline).values({
      incident_id: newIncident.id,
      actor: reported_by || 'Staff Operator',
      action: 'Reported',
      note: 'Incident registered manually on portal.',
    })

    return NextResponse.json(newIncident)
  } catch (err) {
    console.error('Error creating manual incident api:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
