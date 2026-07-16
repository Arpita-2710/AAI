import { clerkClient } from '@clerk/nextjs/server'
import { db } from './client'
import { appUsers } from './schema'

function detectRole(username: string | null | undefined): string {
  if (!username) return 'TERMINAL'
  if (/^AP-\d{3,}$/i.test(username))  return 'ADMIN'
  if (/^TP-\d{3,}$/i.test(username))  return 'TERMINAL'
  if (/^ALP-\d{3,}$/i.test(username)) return 'AUDITOR'
  return 'TERMINAL'
}

async function syncClerkUsers() {
  console.log('🔄 Syncing Clerk users to Neon DB...')

  const client = await clerkClient()

  // Fetch all users from Clerk (handles pagination)
  let allUsers: any[] = []
  let offset = 0
  const limit = 100

  while (true) {
    const response = await client.users.getUserList({ limit, offset })
    allUsers = allUsers.concat(response.data)
    if (response.data.length < limit) break
    offset += limit
  }

  console.log(`Found ${allUsers.length} users in Clerk`)

  for (const user of allUsers) {
    const {
      id: clerkId,
      username,
      firstName,
      lastName,
      emailAddresses,
      publicMetadata,
      createdAt,
      lastSignInAt,
    } = user

    const fullName     = [firstName, lastName].filter(Boolean).join(' ')
      || username || 'Unknown User'
    const primaryEmail = emailAddresses?.[0]?.emailAddress ?? ''
    const role         = (publicMetadata?.role as string) ?? detectRole(username)

    // Update Clerk metadata if role not set
    if (!publicMetadata?.role) {
      await client.users.updateUserMetadata(clerkId, {
        publicMetadata: { role }
      })
      console.log(`  ↳ Set role "${role}" for ${username ?? clerkId}`)
    }

    // Upsert into DB
    await db.insert(appUsers).values({
      id:        username ?? clerkId,
      name:      fullName,
      email:     primaryEmail,
      role,
      clerkId,
      status:    'ACTIVE',
      lastLogin: lastSignInAt ? new Date(lastSignInAt) : null,
      createdAt: new Date(createdAt),
    }).onConflictDoUpdate({
      target: appUsers.clerkId,
      set: {
        name:      fullName,
        email:     primaryEmail,
        role,
        lastLogin: lastSignInAt ? new Date(lastSignInAt) : undefined,
      }
    })

    console.log(`  ✓ Synced: ${username ?? clerkId} (${role})`)
  }

  console.log('✅ Clerk user sync complete!')
  process.exit(0)
}

syncClerkUsers().catch(e => {
  console.error('❌ Sync failed:', e)
  process.exit(1)
})
