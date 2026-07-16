import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { washroomUnits, washroomState } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { deviceId } = await params

  try {
    const [unit] = await db
      .select()
      .from(washroomUnits)
      .where(eq(washroomUnits.device_id, deviceId))
      .limit(1)

    if (!unit) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const [state] = await db
      .select()
      .from(washroomState)
      .where(eq(washroomState.device_id, deviceId))
      .limit(1)

    return NextResponse.json({
      ...unit,
      state: state || null
    })
  } catch (err) {
    console.error('Error fetching washroom details api:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
