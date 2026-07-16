import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getAllReports, createReport, getDbUserIdByClerkId } from '@/db/queries'
import { db } from '@/db/client'
import { incidents, washroomUnits, washroomState } from '@/db/schema'
import { count, eq } from 'drizzle-orm'

export async function GET() {
  try {
    const data = await getAllReports()
    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { sessionClaims } = await auth()
    const clerkId = sessionClaims?.sub
    const dbUserId = await getDbUserIdByClerkId(clerkId)

    const body = await req.json()
    const { type, terminalId } = body

    // Auto-generate report summary from DB
    const [incidentCount, washroomCount, deviceCount] = await Promise.all([
      db.select({ count: count() }).from(incidents),
      db.select({ count: count() }).from(washroomUnits),
      db.select({ count: count() })
        .from(washroomUnits)
        .innerJoin(washroomState, eq(washroomUnits.device_id, washroomState.device_id))
        .where(eq(washroomUnits.is_active, true)),
    ])

    const summary = `Total Incidents: ${incidentCount[0]?.count ?? 0} | ` +
      `Washrooms: ${washroomCount[0]?.count ?? 0} | ` +
      `Online Devices: ${deviceCount[0]?.count ?? 0}`

    const title = `${type ?? 'Facility'} Report — ${
      new Date().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      })
    }`

    const report = await createReport({
      title,
      type:        type ?? 'FACILITY',
      generatedBy: dbUserId,
      terminalId:  terminalId ?? null,
      summary,
      reportData: {
        generatedAt:    new Date().toISOString(),
        incidentCount:  incidentCount[0]?.count ?? 0,
        washroomCount:  washroomCount[0]?.count ?? 0,
        onlineDevices:  deviceCount[0]?.count ?? 0,
      }
    })

    return NextResponse.json({ success: true, data: report })
  } catch (err) {
    console.error('[POST /api/terminal/reports]', err)
    return NextResponse.json(
      { success: false, error: 'Failed to create report' },
      { status: 500 }
    )
  }
}
