import { NextResponse } from 'next/server'
import { currentUser, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/db/client'
import { appUsers } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    const email = user.emailAddresses?.[0]?.emailAddress || ''
    const username = user.username || ''

    let role = (user.publicMetadata as any)?.role

    // 1. Try matching the user in our database by email (case-insensitive)
    if (email) {
      const dbUser = await db.select().from(appUsers)
        .where(sql`LOWER(${appUsers.email}) = LOWER(${email})`)
        .limit(1)
      if (dbUser[0]) {
        role = dbUser[0].role
      }
    }

    // 2. If not found in DB, fallback to regex-based detection
    if (!role || !['ADMIN', 'TERMINAL', 'AUDITOR'].includes(role)) {
      const normEmail = email.toLowerCase()
      const normUser = username.toLowerCase()

      if (
        /^ap-\d{3}$/i.test(username) ||
        /^ap-\d{3}@/i.test(email) ||
        normUser.includes('admin') ||
        normEmail.includes('admin')
      ) {
        role = 'ADMIN'
      } else if (
        /^tp-\d{3}$/i.test(username) ||
        /^tp-\d{3}@/i.test(email) ||
        normUser.includes('terminal') ||
        normEmail.includes('terminal') ||
        normUser.includes('manager') ||
        normEmail.includes('manager')
      ) {
        role = 'TERMINAL'
      } else if (
        /^alp-\d{3}$/i.test(username) ||
        /^alp-\d{3}@/i.test(email) ||
        normUser.includes('audit') ||
        normEmail.includes('audit')
      ) {
        role = 'AUDITOR'
      } else {
        // Fallback for custom dev testers
        role = 'ADMIN'
      }
    }

    // 3. Sync role to Clerk's publicMetadata for future session tokens
    if (role) {
      const client = await clerkClient()
      await client.users.updateUserMetadata(user.id, {
        publicMetadata: { role }
      })
    }

    // 4. Redirect to the correct portal route
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } else if (role === 'TERMINAL') {
      return NextResponse.redirect(new URL('/terminal', request.url))
    } else if (role === 'AUDITOR') {
      return NextResponse.redirect(new URL('/audit', request.url))
    }

    return NextResponse.redirect(
      new URL(`/unauthorized?required=ANY&current=${role || 'NONE'}`, request.url)
    )
  } catch (error) {
    console.error('Redirect handler error:', error)
    return NextResponse.redirect(
      new URL('/unauthorized?required=ERROR&current=ERROR', request.url)
    )
  }
}
