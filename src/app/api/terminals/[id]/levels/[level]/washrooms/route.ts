import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { levels, washroomUnits, washroomState } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; level: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id: terminalId, level: levelNumberStr } = await params
  const levelNumber = parseInt(levelNumberStr)

  try {
    // Find the level's DB record
    const [levelRecord] = await db
      .select()
      .from(levels)
      .where(and(eq(levels.terminal_id, terminalId), eq(levels.level_number, levelNumber)))
      .limit(1)

    if (!levelRecord) {
      return NextResponse.json([])
    }

    const list = await db
      .select()
      .from(washroomUnits)
      .where(and(eq(washroomUnits.terminal_id, terminalId), eq(washroomUnits.level_id, levelRecord.id)))
      .orderBy(washroomUnits.unit_type, washroomUnits.unit_number)

    const result = []

    for (const unit of list) {
      const [state] = await db
        .select()
        .from(washroomState)
        .where(eq(washroomState.device_id, unit.device_id))
        .limit(1)

      result.push({
        ...unit,
        state: state || null
      })
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('Error fetching terminal level washrooms api:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
