import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { incidents, washroomUnits, terminals, incidentTimeline } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id: incidentIdStr } = await params
  const incidentId = parseInt(incidentIdStr)

  try {
    const [incident] = await db
      .select()
      .from(incidents)
      .where(eq(incidents.id, incidentId))
      .limit(1)

    if (!incident) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const [unit] = incident.device_id
      ? await db
          .select()
          .from(washroomUnits)
          .where(eq(washroomUnits.device_id, incident.device_id))
          .limit(1)
      : [null]

    const [terminal] = await db
      .select()
      .from(terminals)
      .where(eq(terminals.id, incident.terminal_id))
      .limit(1)

    const timeline = await db
      .select()
      .from(incidentTimeline)
      .where(eq(incidentTimeline.incident_id, incidentId))
      .orderBy(asc(incidentTimeline.happened_at))

    return NextResponse.json({
      ...incident,
      unit: unit || null,
      terminal,
      timeline
    })
  } catch (err) {
    console.error('Error fetching incident detail api:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id: incidentIdStr } = await params
  const incidentId = parseInt(incidentIdStr)

  try {
    const body = await request.json()
    const { status, note, actor } = body

    if (!status || !actor) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const [existing] = await db
      .select()
      .from(incidents)
      .where(eq(incidents.id, incidentId))
      .limit(1)

    if (!existing) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const now = new Date()
    const isResolved = status === 'RESOLVED'

    const [updated] = await db
      .update(incidents)
      .set({
        status,
        updated_at: now,
        resolved_at: isResolved ? now : null
      })
      .where(eq(incidents.id, incidentId))
      .returning()

    // Add timeline log
    await db.insert(incidentTimeline).values({
      incident_id: incidentId,
      actor,
      action: status === 'RESOLVED' ? 'Resolved' : 'In Progress',
      note: note || (status === 'RESOLVED' ? 'Incident resolved.' : 'Work started on resolving incident.'),
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('Error patching incident status api:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
