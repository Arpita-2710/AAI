import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { terminals, washroomUnits, washroomState, incidents } from '@/db/schema'
import { eq, and, not, count, avg } from 'drizzle-orm'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const list = await db.select().from(terminals)
    const result = []

    for (const t of list) {
      // get total units
      const [unitsCount] = await db
        .select({ count: count() })
        .from(washroomUnits)
        .where(eq(washroomUnits.terminal_id, t.id))
      const totalUnits = Number(unitsCount?.count ?? 0)

      // get online units (is_active = true and has a state row)
      const [onlineCount] = await db
        .select({ count: count() })
        .from(washroomUnits)
        .innerJoin(washroomState, eq(washroomUnits.device_id, washroomState.device_id))
        .where(and(eq(washroomUnits.terminal_id, t.id), eq(washroomUnits.is_active, true)))
      const onlineUnits = Number(onlineCount?.count ?? 0)

      // get average WHI
      const [avgWhiRow] = await db
        .select({ avg: avg(washroomState.whi_score) })
        .from(washroomUnits)
        .innerJoin(washroomState, eq(washroomUnits.device_id, washroomState.device_id))
        .where(eq(washroomUnits.terminal_id, t.id))
      const avgWhi = Math.round(Number(avgWhiRow?.avg ?? 0) * 10) / 10

      // get open incidents count
      const [incidentsCount] = await db
        .select({ count: count() })
        .from(incidents)
        .where(and(eq(incidents.terminal_id, t.id), not(eq(incidents.status, 'RESOLVED'))))
      const openIncidents = Number(incidentsCount?.count ?? 0)

      result.push({
        ...t,
        levels_count: t.total_levels,
        total_units: totalUnits,
        online_units: onlineUnits,
        avg_whi: avgWhi,
        open_incidents: openIncidents
      })
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('Error fetching terminals api:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
