import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function run() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }
  try {
    const sql = neon(url)

    const tables = [
      'terminals', 'levels', 'washroom_units', 'washroom_state',
      'maintenance_issues', 'incidents', 'incident_timeline', 'whi_history',
      'app_users', 'audit_logs', 'system_logs', 'system_settings', 'reports'
    ]

    for (const t of tables) {
      try {
        let count = 0
        if (t === 'terminals') {
          const res = await sql`SELECT COUNT(*) as count FROM terminals`
          count = Number(res[0].count)
        } else if (t === 'levels') {
          const res = await sql`SELECT COUNT(*) as count FROM levels`
          count = Number(res[0].count)
        } else if (t === 'washroom_units') {
          const res = await sql`SELECT COUNT(*) as count FROM washroom_units`
          count = Number(res[0].count)
        } else if (t === 'washroom_state') {
          const res = await sql`SELECT COUNT(*) as count FROM washroom_state`
          count = Number(res[0].count)
        } else if (t === 'maintenance_issues') {
          const res = await sql`SELECT COUNT(*) as count FROM maintenance_issues`
          count = Number(res[0].count)
        } else if (t === 'incidents') {
          const res = await sql`SELECT COUNT(*) as count FROM incidents`
          count = Number(res[0].count)
        } else if (t === 'incident_timeline') {
          const res = await sql`SELECT COUNT(*) as count FROM incident_timeline`
          count = Number(res[0].count)
        } else if (t === 'whi_history') {
          const res = await sql`SELECT COUNT(*) as count FROM whi_history`
          count = Number(res[0].count)
        } else if (t === 'app_users') {
          const res = await sql`SELECT COUNT(*) as count FROM app_users`
          count = Number(res[0].count)
        } else if (t === 'audit_logs') {
          const res = await sql`SELECT COUNT(*) as count FROM audit_logs`
          count = Number(res[0].count)
        } else if (t === 'system_logs') {
          const res = await sql`SELECT COUNT(*) as count FROM system_logs`
          count = Number(res[0].count)
        } else if (t === 'system_settings') {
          const res = await sql`SELECT COUNT(*) as count FROM system_settings`
          count = Number(res[0].count)
        } else if (t === 'reports') {
          const res = await sql`SELECT COUNT(*) as count FROM reports`
          count = Number(res[0].count)
        }
        console.log(`${t}: ${count} rows`)
      } catch (e: any) {
        console.log(`${t}: FAILED (${e.message.split('\n')[0]})`)
      }
    }
  } catch (err) {
    console.error('Error:', err)
  }
}

run()
