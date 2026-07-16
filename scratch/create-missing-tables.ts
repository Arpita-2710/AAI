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
    console.log('Creating tables...')

    await sql`
      CREATE TABLE IF NOT EXISTS "washrooms" (
        "id" text PRIMARY KEY NOT NULL,
        "terminal_id" varchar(10) REFERENCES "terminals"("id") ON DELETE SET NULL,
        "name" text NOT NULL,
        "status" text NOT NULL,
        "occupancy" integer NOT NULL DEFAULT 0,
        "whi" text NOT NULL,
        "last_cleaned" timestamp
      );
    `
    console.log('✓ washrooms table created/verified')

    await sql`
      CREATE TABLE IF NOT EXISTS "stalls" (
        "id" text PRIMARY KEY NOT NULL,
        "washroom_id" text REFERENCES "washrooms"("id") ON DELETE SET NULL,
        "label" text NOT NULL,
        "status" text NOT NULL,
        "last_updated" timestamp
      );
    `
    console.log('✓ stalls table created/verified')

    await sql`
      CREATE TABLE IF NOT EXISTS "devices" (
        "id" text PRIMARY KEY NOT NULL,
        "terminal_id" varchar(10) REFERENCES "terminals"("id") ON DELETE SET NULL,
        "type" text NOT NULL,
        "location" text NOT NULL,
        "battery" integer NOT NULL DEFAULT 100,
        "status" text NOT NULL,
        "last_ping" timestamp
      );
    `
    console.log('✓ devices table created/verified')

    await sql`
      CREATE TABLE IF NOT EXISTS "whi_snapshots" (
        "id" serial PRIMARY KEY NOT NULL,
        "washroom_id" text REFERENCES "washrooms"("id") ON DELETE SET NULL,
        "score" text NOT NULL,
        "cleanliness" text NOT NULL,
        "odor_control" text NOT NULL,
        "soap_avail" text NOT NULL,
        "paper_avail" text NOT NULL,
        "recorded_at" timestamp DEFAULT now()
      );
    `
    console.log('✓ whi_snapshots table created/verified')

    await sql`
      CREATE TABLE IF NOT EXISTS "heatmap_zones" (
        "id" text PRIMARY KEY NOT NULL,
        "terminal_id" varchar(10) REFERENCES "terminals"("id") ON DELETE SET NULL,
        "label" text NOT NULL,
        "traffic" integer NOT NULL DEFAULT 0,
        "row_pos" integer NOT NULL,
        "col_pos" integer NOT NULL,
        "updated_at" timestamp DEFAULT now()
      );
    `
    console.log('✓ heatmap_zones table created/verified')

    console.log('All missing tables successfully created in Neon DB!')
  } catch (err) {
    console.error('Error creating tables:', err)
  }
}

run()
