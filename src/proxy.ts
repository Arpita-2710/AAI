import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from './db/client'
import { appUsers } from './db/schema'
import { eq } from 'drizzle-orm'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk(.*)',
  '/api/auth/redirect(.*)',
  '/unauthorized(.*)'
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isTerminalRoute = createRouteMatcher(['/terminal(.*)'])
const isAuditRoute = createRouteMatcher(['/audit(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  let currentRole = (sessionClaims?.metadata as { role?: string })?.role

  // 1. If user is accessing a public route, let them proceed
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // 2. If user is not logged in, enforce sign-in redirect
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // 3. Fallback: Query Neon DB if Clerk publicMetadata is stale/missing in sessionClaims
  if (!currentRole) {
    try {
      const [dbUser] = await db.select({ role: appUsers.role })
        .from(appUsers)
        .where(eq(appUsers.clerkId, userId))
        .limit(1)
      if (dbUser) {
        currentRole = dbUser.role
      }
    } catch (e) {
      console.error('Failed to resolve role from database in proxy middleware:', e)
    }
  }

  // 4. Enforce RBAC rules
  if (isAdminRoute(req) && currentRole !== 'ADMIN') {
    return NextResponse.redirect(
      new URL(`/unauthorized?required=ADMIN&current=${currentRole || 'NONE'}`, req.url)
    )
  }

  if (isTerminalRoute(req) && currentRole !== 'TERMINAL') {
    return NextResponse.redirect(
      new URL(`/unauthorized?required=TERMINAL&current=${currentRole || 'NONE'}`, req.url)
    )
  }

  if (isAuditRoute(req) && currentRole !== 'AUDITOR') {
    return NextResponse.redirect(
      new URL(`/unauthorized?required=AUDITOR&current=${currentRole || 'NONE'}`, req.url)
    )
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
