import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { incidents, auditLogs } from '@/db/schema'
import { eq, or } from 'drizzle-orm'
import { getDbUserIdByClerkId } from '@/db/queries'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { sessionClaims } = await auth()
    const role = (sessionClaims?.metadata as { role?: string })?.role

    if (!role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: idVal } = await params
    const body   = await req.json()
    const { status, assignedTo } = body

    const isNumeric = /^\d+$/.test(idVal)

    const updated = await db.update(incidents)
      .set({
        status:     status ?? undefined,
        assignedTo: assignedTo ?? undefined,
        updatedAt:  new Date(),
        resolvedAt: status === 'RESOLVED' ? new Date() : undefined,
      } as any)
      .where(
        isNumeric 
          ? or(eq(incidents.id, Number(idVal)), eq(incidents.incident_ref, idVal))
          : eq(incidents.incident_ref, idVal)
      )
      .returning()

    // Resolve Clerk ID to DB User ID (username)
    const dbUserId = await getDbUserIdByClerkId(sessionClaims?.sub as string | undefined)

    await db.insert(auditLogs).values({
      action:    'INCIDENT_UPDATED',
      userId:    dbUserId,
      details:   `Incident ${idVal} status → ${status}`,
      severity:  'INFO',
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true, data: updated[0] })
  } catch (err) {
    console.error('[PATCH /api/terminal/incidents/[id]]', err)
    return NextResponse.json(
      { error: 'Failed to update incident' },
      { status: 500 }
    )
  }
}
