import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { levels, washroomUnits, washroomState, incidents } from '@/db/schema'
import { eq, and, not, count, avg } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id: terminalId } = await params

  try {
    const list = await db
      .select()
      .from(levels)
      .where(eq(levels.terminal_id, terminalId))
      .orderBy(levels.level_number)

    const result = []

    for (const lvl of list) {
      const [unitsCount] = await db
        .select({ count: count() })
        .from(washroomUnits)
        .where(and(eq(washroomUnits.terminal_id, terminalId), eq(washroomUnits.level_id, lvl.id)))
      const totalUnits = Number(unitsCount?.count ?? 0)

      const [onlineCount] = await db
        .select({ count: count() })
        .from(washroomUnits)
        .innerJoin(washroomState, eq(washroomUnits.device_id, washroomState.device_id))
        .where(and(
          eq(washroomUnits.terminal_id, terminalId),
          eq(washroomUnits.level_id, lvl.id),
          eq(washroomUnits.is_active, true)
        ))
      const onlineUnits = Number(onlineCount?.count ?? 0)

      const [avgWhiRow] = await db
        .select({ avg: avg(washroomState.whi_score) })
        .from(washroomUnits)
        .innerJoin(washroomState, eq(washroomUnits.device_id, washroomState.device_id))
        .where(and(eq(washroomUnits.terminal_id, terminalId), eq(washroomUnits.level_id, lvl.id)))
      const avgWhi = Math.round(Number(avgWhiRow?.avg ?? 0) * 10) / 10

      const [incidentsCount] = await db
        .select({ count: count() })
        .from(incidents)
        .where(and(
          eq(incidents.terminal_id, terminalId),
          eq(incidents.level_id, lvl.id),
          not(eq(incidents.status, 'RESOLVED'))
        ))
      const openIncidents = Number(incidentsCount?.count ?? 0)

      result.push({
        ...lvl,
        total_units: totalUnits,
        online_units: onlineUnits,
        avg_whi: avgWhi,
        open_incidents: openIncidents
      })
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('Error fetching levels api:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
