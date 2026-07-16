import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL || ''

if (typeof window === 'undefined' && !databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const sql = typeof window === 'undefined' ? neon(databaseUrl) : (null as any)

export const db = typeof window === 'undefined' ? drizzle(sql, { schema, logger: true }) : (null as any)

export type DB = typeof db
