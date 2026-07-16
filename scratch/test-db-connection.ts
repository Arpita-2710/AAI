import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function run() {
  const url = process.env.DATABASE_URL
  console.log('Database URL exists:', !!url)
  if (!url) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }
  try {
    const sql = neon(url)
    const start = Date.now()
    const result = await sql`SELECT NOW() as time, current_database() as db`
    const latency = Date.now() - start
    console.log('DB Connected:', result[0])
    console.log('Latency:', latency, 'ms')
  } catch (err) {
    console.error('DB Connection error:', err)
  }
}

run()
