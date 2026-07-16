import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { washroomUnits, washroomState, incidents } from '@/db/schema'
import { eq, and, not, count, avg, or, lt } from 'drizzle-orm'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const [totalUnitsRow] = await db.select({ count: count() }).from(washroomUnits)
    const total_units = Number(totalUnitsRow?.count ?? 0)

    const [onlineUnitsRow] = await db
      .select({ count: count() })
      .from(washroomUnits)
      .innerJoin(washroomState, eq(washroomUnits.device_id, washroomState.device_id))
      .where(eq(washroomUnits.is_active, true))
    const online_units = Number(onlineUnitsRow?.count ?? 0)
    const offline_units = total_units - online_units

    const [avgWhiSystemRow] = await db
      .select({ avg: avg(washroomState.whi_score) })
      .from(washroomState)
    const avg_whi_system = Math.round(Number(avgWhiSystemRow?.avg ?? 0) * 10) / 10

    // avg by terminal
    const avg_whi_by_terminal: Record<string, number> = {}
    for (const tId of ['T1', 'T2', 'CGO']) {
      const [avgT] = await db
        .select({ avg: avg(washroomState.whi_score) })
        .from(washroomUnits)
        .innerJoin(washroomState, eq(washroomUnits.device_id, washroomState.device_id))
        .where(eq(washroomUnits.terminal_id, tId))
      avg_whi_by_terminal[tId] = Math.round(Number(avgT?.avg ?? 0) * 10) / 10
    }

    const [openIncidentsRow] = await db
      .select({ count: count() })
      .from(incidents)
      .where(not(eq(incidents.status, 'RESOLVED')))
    const open_incidents = Number(openIncidentsRow?.count ?? 0)

    const [criticalIncidentsRow] = await db
      .select({ count: count() })
      .from(incidents)
      .where(and(eq(incidents.severity, 'CRITICAL'), not(eq(incidents.status, 'RESOLVED'))))
    const critical_incidents = Number(criticalIncidentsRow?.count ?? 0)

    // units by status
    const units_by_status: Record<string, number> = { VACANT: 0, OCCUPIED: 0, CLEANING: 0, OUT_OF_ORDER: 0 }
    const statusRows = await db
      .select({
        status: washroomState.occupancy_status,
        count: count()
      })
      .from(washroomState)
      .groupBy(washroomState.occupancy_status)

    for (const r of statusRows) {
      if (r.status) {
        units_by_status[r.status] = Number(r.count)
      }
    }

    // low supply alerts (any supply < 20%)
    const [lowSupplyRow] = await db
      .select({ count: count() })
      .from(washroomState)
      .where(
        or(
          lt(washroomState.soap_pct, 20),
          lt(washroomState.paper_pct, 20),
          lt(washroomState.sanitizer_pct, 20)
        )
      )
    const low_supply_alerts = Number(lowSupplyRow?.count ?? 0)

    return NextResponse.json({
      total_units,
      online_units,
      offline_units,
      avg_whi_system,
      avg_whi_by_terminal,
      open_incidents,
      critical_incidents,
      units_by_status,
      low_supply_alerts
    })
  } catch (err) {
    console.error('Error fetching dashboard summary api:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
