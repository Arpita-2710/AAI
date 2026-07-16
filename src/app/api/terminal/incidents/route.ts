import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { incidents, auditLogs } from '@/db/schema'
import { getAllIncidents, getDbUserIdByClerkId } from '@/db/queries'

// GET — fetch all incidents for terminal view
export async function GET() {
  try {
    const data = await getAllIncidents()
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('[GET /api/terminal/incidents]', err)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch incidents' },
      { status: 500 }
    )
  }
}

// POST — create a new incident
export async function POST(req: Request) {
  try {
    const { sessionClaims } = await auth()
    const role = (sessionClaims?.metadata as { role?: string })?.role

    if (role !== 'TERMINAL' && role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      title,
      description,
      severity,
      terminalId,
      location,
    } = body

    // Validate required fields
    if (!title || !severity) {
      return NextResponse.json(
        { success: false, error: 'Title and severity are required' },
        { status: 400 }
      )
    }

    // Resolve Clerk ID to DB User ID (username)
    const dbUserId = await getDbUserIdByClerkId(sessionClaims?.sub as string | undefined)

    // Generate incident ID
    const timestamp  = Date.now()
    const incidentId = `INC-${timestamp}`

    // Insert into DB
    const inserted = await db.insert(incidents).values({
      incident_ref: incidentId,
      title:       title.trim(),
      description: description?.trim() ?? null,
      severity:    severity.toUpperCase(),
      status:      'OPEN',
      terminal_id:  terminalId ?? 'T1',
      assigned_to:  null,
      reported_by:  sessionClaims?.sub ?? null,
      issue_type:  'MANUAL',
      created_at:   new Date(),
      updated_at:   new Date(),
    } as any).returning()

    // Log to audit_logs
    await db.insert(auditLogs).values({
      action:    'INCIDENT_CREATED',
      userId:    dbUserId,
      details:   `New incident created: ${incidentId} — ${title}`,
      severity:  'INFO',
      terminalId: terminalId ?? null,
      timestamp: new Date(),
    })

    const record = inserted[0]
    return NextResponse.json({
      success: true,
      data:    {
        id:          record.incident_ref,
        incident_ref:record.incident_ref,
        title:       record.title,
        description: record.description,
        severity:    record.severity,
        status:      record.status,
        terminalId:  record.terminal_id,
        terminal_id:  record.terminal_id,
        assignedTo:  record.assigned_to,
        reportedBy:  record.reported_by,
        createdAt:   record.created_at,
        updatedAt:   record.updated_at,
      },
      message: `Incident ${incidentId} created successfully`,
    })
  } catch (err) {
    console.error('[POST /api/terminal/incidents]', err)
    return NextResponse.json(
      { success: false, error: 'Failed to create incident' },
      { status: 500 }
    )
  }
}
