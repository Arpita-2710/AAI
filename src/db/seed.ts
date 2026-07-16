import { db } from './client'
import {
  terminals, levels, washroomUnits, washroomState,
  maintenanceIssues, incidents, incidentTimeline, whiHistory
} from './schema'

// Deterministic Pseudo-Random Generator
function createRandom(seed = 12345) {
  let s = seed
  return function() {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}
const nextRand = createRandom(42)

function randRange(min: number, max: number) {
  return min + nextRand() * (max - min)
}

function randElement<T>(arr: T[]): T {
  return arr[Math.floor(nextRand() * arr.length)]
}

// local computeWHI to avoid ts-node import complications
function localComputeWHI(params: {
  cleanliness_score: number
  occupancy_count: number
  unit_type: 'PPM' | 'PPF' | 'PPD' | 'STF'
  soap_pct: number
  paper_pct: number
  sanitizer_pct: number
  ammonia_ppm: number
}): number {
  const CAPACITY = { PPM: 4, PPF: 4, PPD: 2, STF: 3 }
  const capacity = CAPACITY[params.unit_type]
  const occupancyLoadPct = Math.min((params.occupancy_count / capacity) * 100, 100)
  const supplyScore = (params.soap_pct + params.paper_pct + params.sanitizer_pct) / 3
  const airScore = Math.max(0, 100 - Math.min((params.ammonia_ppm / 50) * 100, 100))
  return Math.round((
    params.cleanliness_score * 0.35 +
    (100 - occupancyLoadPct) * 0.20 +
    supplyScore * 0.25 +
    airScore * 0.20
  ) * 10) / 10
}

const TERMINALS = [
  { id: 'T1',  name: 'Old Domestic Terminal',          code: 'T1',  type: 'domestic',      total_levels: 6 },
  { id: 'T2',  name: 'New International Terminal',     code: 'T2',  type: 'international', total_levels: 6 },
  { id: 'CGO', name: 'Cargo Terminal',                 code: 'CGO', type: 'cargo',         total_levels: 6 },
]

const LEVEL_LABELS: Record<string, Record<number, string>> = {
  T1: {
    1: 'Level 1 — Ground / Arrivals',
    2: 'Level 2 — Baggage & Immigration',
    3: 'Level 3 — Departures Check-in',
    4: 'Level 4 — Security & Gates',
    5: 'Level 5 — Retail & F&B',
    6: 'Level 6 — Rooftop / Utilities',
  },
  T2: {
    1: 'Level 1 — Ground / Arrivals Hall',
    2: 'Level 2 — Immigration & Customs',
    3: 'Level 3 — Departures & Check-in',
    4: 'Level 4 — International Security',
    5: 'Level 5 — Airside Retail & Lounges',
    6: 'Level 6 — Administrative & Utilities',
  },
  CGO: {
    1: 'Level 1 — Ground Operations',
    2: 'Level 2 — Cargo Intake',
    3: 'Level 3 — Sorting & Screening',
    4: 'Level 4 — Cold Storage',
    5: 'Level 5 — Office & Staff Areas',
    6: 'Level 6 — Rooftop / Mechanical',
  },
}

const UNIT_TYPES = [
  { type: 'PPM', label: 'Public Passenger — Male',     count: 28, capacity: 4 },
  { type: 'PPF', label: 'Public Passenger — Female',   count: 28, capacity: 4 },
  { type: 'PPD', label: 'Public Passenger — Disabled', count: 24, capacity: 2 },
  { type: 'STF', label: 'Staff & Worker',              count: 35, capacity: 3 },
] as const

async function main() {
  console.log('Clearing database...')
  await db.delete(whiHistory)
  await db.delete(incidentTimeline)
  await db.delete(incidents)
  await db.delete(maintenanceIssues)
  await db.delete(washroomState)
  await db.delete(washroomUnits)
  await db.delete(levels)
  await db.delete(terminals)

  console.log('Seeding terminals...')
  await db.insert(terminals).values(TERMINALS)

  console.log('Seeding levels...')
  const levelsMapping: Record<string, Record<number, number>> = {}
  for (const t of TERMINALS) {
    levelsMapping[t.id] = {}
    for (let l = 1; l <= 6; l++) {
      const label = LEVEL_LABELS[t.id][l] || `Level ${l}`
      const [insertedLevel] = await db.insert(levels).values({
        terminal_id: t.id,
        level_number: l,
        label,
        is_active: true
      }).returning()
      levelsMapping[t.id][l] = insertedLevel.id
    }
  }

  console.log('Generating 2070 washroom units and states...')
  const allUnits: typeof washroomUnits.$inferInsert[] = []
  const allStates: typeof washroomState.$inferInsert[] = []

  for (const t of TERMINALS) {
    for (let l = 1; l <= 6; l++) {
      const levelId = levelsMapping[t.id][l]
      for (const ut of UNIT_TYPES) {
        for (let num = 1; num <= ut.count; num++) {
          const deviceId = `${t.id}-L${l}-${ut.type}-${String(num).padStart(3, '0')}`
          const label = `${t.code} · L${l} · ${ut.type === 'PPM' ? 'Male' : ut.type === 'PPF' ? 'Female' : ut.type === 'PPD' ? 'Disabled' : 'Staff'} · Unit ${String(num).padStart(2, '0')}`
          
          allUnits.push({
            device_id: deviceId,
            terminal_id: t.id,
            level_id: levelId,
            unit_type: ut.type,
            unit_number: num,
            label,
            capacity: ut.capacity,
            location_desc: `Near Gate ${10 + num}, Level ${l}`,
            is_active: true
          })

          // Generate state
          const statusRand = nextRand()
          let occupancyStatus: 'VACANT' | 'OCCUPIED' | 'CLEANING' | 'OUT_OF_ORDER' = 'VACANT'
          if (statusRand > 0.97) occupancyStatus = 'OUT_OF_ORDER'
          else if (statusRand > 0.90) occupancyStatus = 'CLEANING'
          else if (statusRand > 0.60) occupancyStatus = 'OCCUPIED'

          const occupancyCount = occupancyStatus === 'VACANT' ? 0 : occupancyStatus === 'OCCUPIED' ? Math.floor(randRange(1, ut.capacity + 1)) : 0
          const doorStatus = occupancyStatus === 'OUT_OF_ORDER' ? 'LOCKED' : occupancyCount > 0 ? 'CLOSED' : 'OPEN'

          const cleanlinessScore = Math.round(randRange(55, 100))
          const soapPct = Math.round(randRange(20, 100))
          const paperPct = Math.round(randRange(20, 100))
          const sanitizerPct = Math.round(randRange(20, 100))
          const ammoniaPpm = randRange(2, 48)
          const co2Ppm = randRange(400, 1150)
          const humidityPct = randRange(45, 68)
          const tempCelsius = randRange(22, 28)
          const batteryLevel = randRange(40, 100)
          const signalStrength = randRange(-85, -45)

          const whiScore = localComputeWHI({
            cleanliness_score: cleanlinessScore,
            occupancy_count: occupancyCount,
            unit_type: ut.type,
            soap_pct: soapPct,
            paper_pct: paperPct,
            sanitizer_pct: sanitizerPct,
            ammonia_ppm: ammoniaPpm
          })

          const now = new Date()
          allStates.push({
            device_id: deviceId,
            updated_at: now,
            occupancy_status: occupancyStatus,
            occupancy_count: occupancyCount,
            door_status: doorStatus,
            cleanliness_score: cleanlinessScore,
            soap_pct: soapPct,
            paper_pct: paperPct,
            sanitizer_pct: sanitizerPct,
            ammonia_ppm: ammoniaPpm,
            co2_ppm: co2Ppm,
            humidity_pct: humidityPct,
            temp_celsius: tempCelsius,
            battery_level: batteryLevel,
            signal_strength: signalStrength,
            whi_score: whiScore,
            last_cleaned_at: new Date(now.getTime() - Math.floor(randRange(10, 480)) * 60000),
            last_inspected_at: new Date(now.getTime() - Math.floor(randRange(30, 1440)) * 60000),
          })
        }
      }
    }
  }

  console.log('Batch inserting units in chunks of 500...')
  for (let i = 0; i < allUnits.length; i += 500) {
    await db.insert(washroomUnits).values(allUnits.slice(i, i + 500))
  }

  console.log('Batch inserting states in chunks of 500...')
  for (let i = 0; i < allStates.length; i += 500) {
    await db.insert(washroomState).values(allStates.slice(i, i + 500))
  }

  console.log('Seeding maintenance issues...')
  const issuesToSeed: typeof maintenanceIssues.$inferInsert[] = []
  for (let i = 0; i < 20; i++) {
    const randomUnit = randElement(allUnits)
    issuesToSeed.push({
      device_id: randomUnit.device_id,
      issue_text: randElement(['Ammonia levels high', 'Soap dispenser low', 'Paper towels depleted', 'Exhaust fan noise', 'Water pressure low']),
      is_resolved: false
    })
  }
  await db.insert(maintenanceIssues).values(issuesToSeed)

  console.log('Seeding active incidents and timeline logs...')
  const titles = [
    { title: 'Excessive Ammonia Odour Detected', type: 'Odour', severity: 'CRITICAL' },
    { title: 'Water Leakage Near Basin', type: 'Overflow', severity: 'HIGH' },
    { title: 'Soap Supplies Depleted', type: 'Out of Supplies', severity: 'MEDIUM' },
    { title: 'Door Lock Mechanism Malfunction', type: 'Broken Fixture', severity: 'LOW' }
  ]
  const staff = ['Arpit Sharma', 'S. K. Gupta', 'Pranab Roy', 'K. K. Sen']

  for (let i = 1; i <= 8; i++) {
    const randomUnit = randElement(allUnits)
    const t = randElement(titles)
    const ref = `INC-2026-${String(i).padStart(5, '0')}`

    const [insertedIncident] = await db.insert(incidents).values({
      incident_ref: ref,
      device_id: randomUnit.device_id,
      terminal_id: randomUnit.terminal_id,
      level_id: randomUnit.level_id,
      title: t.title,
      description: 'Diagnostic registers show abnormal parameters. Action required.',
      issue_type: t.type,
      severity: t.severity,
      status: i % 3 === 0 ? 'RESOLVED' : i % 2 === 0 ? 'IN_PROGRESS' : 'OPEN',
      reported_by: 'System Sentinel',
      assigned_to: randElement(staff),
      created_at: new Date(Date.now() - 3600000 * i),
      updated_at: new Date(),
      resolved_at: i % 3 === 0 ? new Date() : null
    }).returning()

    await db.insert(incidentTimeline).values([
      {
        incident_id: insertedIncident.id,
        actor: 'System Sentinel',
        action: 'Reported',
        note: 'Incident automatically opened by diagnostics monitor.',
        happened_at: insertedIncident.created_at
      }
    ])
  }

  console.log('Seeding 7-day WHI history rollups...')
  const allHistory: typeof whiHistory.$inferInsert[] = []
  const today = new Date()
  
  // To avoid performance issues seeding 14,490 rows in one transaction,
  // we seed historical rollups for a subset of 300 random units to cover dashboard trends.
  const subsetUnits = allUnits.slice(0, 300)
  for (const u of subsetUnits) {
    const stateObj = allStates.find(x => x.device_id === u.device_id)
    const baseWhi = stateObj ? stateObj.whi_score : 85
    for (let d = 1; d <= 7; d++) {
      const dateStr = new Date(today.getTime() - d * 24 * 3600 * 1000).toISOString().split('T')[0]
      allHistory.push({
        device_id: u.device_id,
        date: dateStr,
        avg_whi: Math.min(100, Math.max(20, Math.round(baseWhi + randRange(-5, 5)))),
        min_whi: Math.min(100, Math.max(10, Math.round(baseWhi - randRange(5, 15)))),
        max_whi: Math.min(100, Math.max(30, Math.round(baseWhi + randRange(2, 6)))),
        total_occupancy_count: Math.floor(randRange(10, 80))
      })
    }
  }

  console.log('Inserting WHI history chunks...')
  for (let i = 0; i < allHistory.length; i += 500) {
    await db.insert(whiHistory).values(allHistory.slice(i, i + 500))
  }

  console.log('Seeding finished successfully!')
}

main().catch(err => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
