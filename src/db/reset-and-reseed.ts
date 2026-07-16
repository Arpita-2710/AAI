import { db } from './client'
import { isNull } from 'drizzle-orm'
import {
  terminals, washrooms, stalls, devices, incidents,
  auditLogs, systemLogs, whiSnapshots, heatmapZones,
  systemSettings, appUsers, levels, washroomUnits,
  washroomState, maintenanceIssues, incidentTimeline, whiHistory
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

const TERMINAL_SEEDS = [
  { id: 'T1',  name: 'Terminal 1 — Domestic Arrivals',    code: 'T1',  type: 'domestic',      total_levels: 6, is_active: true },
  { id: 'T2',  name: 'Terminal 2 — Domestic Departures',  code: 'T2',  type: 'domestic',      total_levels: 6, is_active: true },
  { id: 'T3',  name: 'Terminal 3 — International',        code: 'T3',  type: 'international', total_levels: 6, is_active: true },
  { id: 'T4',  name: 'Concourse A',                       code: 'T4',  type: 'domestic',      total_levels: 6, is_active: true },
  { id: 'T5',  name: 'Concourse B',                       code: 'T5',  type: 'domestic',      total_levels: 6, is_active: true },
  { id: 'CGO', name: 'Cargo Terminal',                 code: 'CGO', type: 'cargo',         total_levels: 6, is_active: true },
]

const LEVEL_LABELS: Record<string, Record<number, string>> = {
  T1: { 1: 'Level 1 — Ground / Arrivals', 2: 'Level 2 — Baggage & Immigration', 3: 'Level 3 — Departures Check-in', 4: 'Level 4 — Security & Gates', 5: 'Level 5 — Retail & F&B', 6: 'Level 6 — Rooftop / Utilities' },
  T2: { 1: 'Level 1 — Ground / Arrivals Hall', 2: 'Level 2 — Immigration & Customs', 3: 'Level 3 — Departures & Check-in', 4: 'Level 4 — International Security', 5: 'Level 5 — Airside Retail & Lounges', 6: 'Level 6 — Administrative & Utilities' },
  T3: { 1: 'Level 1 — Ground Hall', 2: 'Level 2 — Customs', 3: 'Level 3 — Departures', 4: 'Level 4 — Security', 5: 'Level 5 — Lounges', 6: 'Level 6 — Utilities' },
  T4: { 1: 'Level 1 — Arrivals', 2: 'Level 2 — Baggage', 3: 'Level 3 — Check-in', 4: 'Level 4 — Security', 5: 'Level 5 — Retail', 6: 'Level 6 — Utilities' },
  T5: { 1: 'Level 1 — Arrivals', 2: 'Level 2 — Baggage', 3: 'Level 3 — Check-in', 4: 'Level 4 — Security', 5: 'Level 5 — Retail', 6: 'Level 6 — Utilities' },
  CGO: { 1: 'Level 1 — Ground Operations', 2: 'Level 2 — Cargo Intake', 3: 'Level 3 — Sorting & Screening', 4: 'Level 4 — Cold Storage', 5: 'Level 5 — Office & Staff Areas', 6: 'Level 6 — Rooftop / Mechanical' },
}

const UNIT_TYPES = [
  { type: 'PPM', label: 'Public Passenger — Male',     count: 28, capacity: 4 },
  { type: 'PPF', label: 'Public Passenger — Female',   count: 28, capacity: 4 },
  { type: 'PPD', label: 'Public Passenger — Disabled', count: 24, capacity: 2 },
  { type: 'STF', label: 'Staff & Worker',              count: 35, capacity: 3 },
] as const

async function resetAndReseed() {
  console.log('🗑️  Clearing all data (preserving real users)...')

  // FK-safe deletion for BOTH schemas
  await db.delete(whiSnapshots)
  await db.delete(whiHistory)
  await db.delete(incidentTimeline)
  await db.delete(incidents)
  await db.delete(maintenanceIssues)
  await db.delete(washroomState)
  await db.delete(washroomUnits)
  await db.delete(levels)
  await db.delete(auditLogs)
  await db.delete(systemLogs)
  await db.delete(heatmapZones)
  await db.delete(stalls)
  await db.delete(devices)
  await db.delete(washrooms)
  await db.delete(terminals)
  await db.delete(systemSettings)

  // Clear mock users (where clerkId is null)
  await db.delete(appUsers).where(isNull(appUsers.clerkId))
  console.log('✓ Cleared database.')

  // ── SEEDING TERMINALS ──
  console.log('Seeding terminals...')
  await db.insert(terminals).values(TERMINAL_SEEDS)

  // ── SEEDING LEVELS (New Schema) ──
  console.log('Seeding levels...')
  const levelsMapping: Record<string, Record<number, number>> = {}
  for (const t of TERMINAL_SEEDS) {
    levelsMapping[t.id] = {}
    for (let l = 1; l <= 6; l++) {
      const label = LEVEL_LABELS[t.id]?.[l] || `Level ${l}`
      const [insertedLevel] = await db.insert(levels).values({
        terminal_id: t.id,
        level_number: l,
        label,
        is_active: true
      }).returning()
      levelsMapping[t.id][l] = insertedLevel.id
    }
  }

  // ── SEEDING WASHROOMS (Old Schema) ──
  console.log('Seeding washrooms...')
  const now = new Date()
  await db.insert(washrooms).values([
    { id: 'W1',  terminalId: 'T1', name: 'T1 Gents — Gate 5',          status: 'VACANT',       occupancy: 0, whi: '92.5', lastCleaned: new Date(now.getTime() - 3600000) },
    { id: 'W2',  terminalId: 'T1', name: 'T1 Ladies — Gate 5',         status: 'OCCUPIED',     occupancy: 3, whi: '88.0', lastCleaned: new Date(now.getTime() - 7200000) },
    { id: 'W3',  terminalId: 'T1', name: 'T1 Handicap — Gate 5',       status: 'CLEANING',     occupancy: 0, whi: '95.0', lastCleaned: new Date(now.getTime() - 1800000) },
    { id: 'W4',  terminalId: 'T2', name: 'T2 Gents — Departure Hall',  status: 'OCCUPIED',     occupancy: 5, whi: '75.3', lastCleaned: new Date(now.getTime() - 10800000) },
    { id: 'W5',  terminalId: 'T2', name: 'T2 Ladies — Departure Hall', status: 'VACANT',       occupancy: 0, whi: '81.2', lastCleaned: new Date(now.getTime() - 5400000) },
    { id: 'W6',  terminalId: 'T2', name: 'T2 Gents — Food Court',      status: 'OUT_OF_ORDER', occupancy: 0, whi: '45.0', lastCleaned: new Date(now.getTime() - 86400000) },
    { id: 'W7',  terminalId: 'T3', name: 'T3 Intl Gents — Level 4',   status: 'OCCUPIED',     occupancy: 8, whi: '68.9', lastCleaned: new Date(now.getTime() - 14400000) },
    { id: 'W8',  terminalId: 'T3', name: 'T3 Intl Ladies — Level 4',  status: 'VACANT',       occupancy: 0, whi: '97.1', lastCleaned: new Date(now.getTime() - 900000) },
    { id: 'W9',  terminalId: 'T3', name: 'T3 Intl Gents — Level 3',   status: 'CLEANING',     occupancy: 0, whi: '55.4', lastCleaned: new Date(now.getTime() - 21600000) },
    { id: 'W10', terminalId: 'T4', name: 'Concourse A Gents',          status: 'VACANT',       occupancy: 0, whi: '90.0', lastCleaned: new Date(now.getTime() - 4500000) },
    { id: 'W11', terminalId: 'T4', name: 'Concourse A Ladies',         status: 'OCCUPIED',     occupancy: 2, whi: '83.7', lastCleaned: new Date(now.getTime() - 9000000) },
    { id: 'W12', terminalId: 'T5', name: 'Concourse B Gents',          status: 'OCCUPIED',     occupancy: 4, whi: '71.2', lastCleaned: new Date(now.getTime() - 18000000) },
  ])

  // ── SEEDING STALLS (Old Schema) ──
  console.log('Seeding stalls...')
  const stallStatuses = ['VACANT','OCCUPIED','VACANT','VACANT','CLEANING','OCCUPIED']
  const stallRows = []
  for (let w = 1; w <= 5; w++) {
    for (let s = 1; s <= 6; s++) {
      stallRows.push({
        id:         `W${w}-S${s}`,
        washroomId: `W${w}`,
        label:      `${String.fromCharCode(64 + s)}${w}`,
        status:     s === 6 && w === 2 ? 'OUT_OF_ORDER' : stallStatuses[(s - 1) % stallStatuses.length],
        lastUpdated: new Date(),
      })
    }
  }
  await db.insert(stalls).values(stallRows)

  // ── SEEDING DEVICES (Old Schema) ──
  console.log('Seeding devices...')
  await db.insert(devices).values([
    { id: 'D001', terminalId: 'T1', type: 'AMMONIA_SENSOR',        location: 'T1 Gents Gate 5',         battery: 94,  status: 'ONLINE',      lastPing: new Date() },
    { id: 'D002', terminalId: 'T1', type: 'OCCUPANCY_SENSOR',      location: 'T1 Ladies Gate 5',        battery: 88,  status: 'ONLINE',      lastPing: new Date() },
    { id: 'D003', terminalId: 'T1', type: 'SOAP_DISPENSER_SENSOR', location: 'T1 Gents Gate 5',         battery: 35,  status: 'ONLINE',      lastPing: new Date() },
    { id: 'D004', terminalId: 'T2', type: 'TEMP_SENSOR',           location: 'T2 Departure Hall',       battery: 67,  status: 'ONLINE',      lastPing: new Date() },
    { id: 'D005', terminalId: 'T2', type: 'WATER_LEAK_DETECTOR',   location: 'T2 Food Court Gents',     battery: 15,  status: 'MAINTENANCE', lastPing: new Date(now.getTime() - 3600000) },
    { id: 'D006', terminalId: 'T2', type: 'PAPER_SENSOR',          location: 'T2 Ladies Departure',     battery: 91,  status: 'ONLINE',      lastPing: new Date() },
    { id: 'D007', terminalId: 'T3', type: 'AMMONIA_SENSOR',        location: 'T3 Intl Level 4',         battery: 100, status: 'ONLINE',      lastPing: new Date() },
    { id: 'D008', terminalId: 'T3', type: 'DOOR_SENSOR',           location: 'T3 Intl Ladies Level 4',  battery: 78,  status: 'ONLINE',      lastPing: new Date() },
    { id: 'D009', terminalId: 'T3', type: 'OCCUPANCY_SENSOR',      location: 'T3 Intl Gents Level 3',   battery: 22,  status: 'OFFLINE',     lastPing: new Date(now.getTime() - 7200000) },
    { id: 'D010', terminalId: 'T4', type: 'AMMONIA_SENSOR',        location: 'Concourse A Gents',       battery: 85,  status: 'ONLINE',      lastPing: new Date() },
    { id: 'D011', terminalId: 'T4', type: 'SOAP_DISPENSER_SENSOR', location: 'Concourse A Ladies',      battery: 56,  status: 'ONLINE',      lastPing: new Date() },
    { id: 'D012', terminalId: 'T5', type: 'OCCUPANCY_SENSOR',      location: 'Concourse B Gents',       battery: 11,  status: 'OFFLINE',     lastPing: new Date(now.getTime() - 18000000) },
    { id: 'D013', terminalId: 'T5', type: 'WATER_LEAK_DETECTOR',   location: 'Concourse B',             battery: 73,  status: 'ONLINE',      lastPing: new Date() },
    { id: 'D014', terminalId: 'T3', type: 'TEMP_SENSOR',           location: 'T3 Intl Level 3',         battery: 44,  status: 'MAINTENANCE', lastPing: new Date(now.getTime() - 1800000) },
    { id: 'D015', terminalId: 'T1', type: 'DOOR_SENSOR',           location: 'T1 Handicap Gate 5',      battery: 99,  status: 'ONLINE',      lastPing: new Date() },
  ])

  // ── SEEDING INCIDENTS (Old & Shared) ──
  console.log('Seeding incidents...')
  await db.insert(incidents).values([
    { incident_ref: 'INC-001', title: 'Ammonia Level Critical',       severity: 'CRITICAL', status: 'OPEN',        terminal_id: 'T1', assigned_to: 'Rajesh Kumar',  created_at: new Date(now.getTime() - 1800000), issue_type: 'MANUAL', updated_at: new Date() },
    { incident_ref: 'INC-002', title: 'Soap Dispenser Empty',         severity: 'MEDIUM',   status: 'IN_PROGRESS', terminal_id: 'T3', assigned_to: 'Amit Verma',    created_at: new Date(now.getTime() - 3600000), issue_type: 'MANUAL', updated_at: new Date() },
    { incident_ref: 'INC-003', title: 'Water Leak Detected',          severity: 'HIGH',     status: 'OPEN',        terminal_id: 'T2', assigned_to: 'Priya Sharma',  created_at: new Date(now.getTime() - 900000),  issue_type: 'MANUAL', updated_at: new Date() },
    { incident_ref: 'INC-004', title: 'Sensor Offline — D009',        severity: 'HIGH',     status: 'IN_PROGRESS', terminal_id: 'T3', assigned_to: 'Amit Verma',    created_at: new Date(now.getTime() - 7200000), issue_type: 'MANUAL', updated_at: new Date() },
    { incident_ref: 'INC-005', title: 'WHI Score Below Threshold',    severity: 'CRITICAL', status: 'OPEN',        terminal_id: 'T2', assigned_to: 'Priya Sharma',  created_at: new Date(now.getTime() - 600000),  issue_type: 'MANUAL', updated_at: new Date() },
    { incident_ref: 'INC-006', title: 'Overcrowding Alert T3',        severity: 'HIGH',     status: 'RESOLVED',    terminal_id: 'T3', assigned_to: 'Amit Verma',    created_at: new Date(now.getTime() - 86400000),  resolved_at: new Date(now.getTime() - 82800000), issue_type: 'MANUAL', updated_at: new Date() },
    { incident_ref: 'INC-007', title: 'Paper Roll Empty T1',          severity: 'LOW',      status: 'RESOLVED',    terminal_id: 'T1', assigned_to: 'Rajesh Kumar',  created_at: new Date(now.getTime() - 172800000), resolved_at: new Date(now.getTime() - 169200000), issue_type: 'MANUAL', updated_at: new Date() },
    { incident_ref: 'INC-008', title: 'Door Sensor Malfunction',      severity: 'MEDIUM',   status: 'IN_PROGRESS', terminal_id: 'T1', assigned_to: 'Rajesh Kumar',  created_at: new Date(now.getTime() - 5400000),  issue_type: 'MANUAL', updated_at: new Date() },
    { incident_ref: 'INC-009', title: 'Low Battery — D012',           severity: 'LOW',      status: 'OPEN',        terminal_id: 'T5', assigned_to: 'Vikram Nair',   created_at: new Date(now.getTime() - 10800000), issue_type: 'MANUAL', updated_at: new Date() },
    { incident_ref: 'INC-010', title: 'Temperature Anomaly T2',       severity: 'CRITICAL', status: 'IN_PROGRESS', terminal_id: 'T2', assigned_to: 'Priya Sharma',  created_at: new Date(now.getTime() - 2700000),  issue_type: 'MANUAL', updated_at: new Date() },
    { incident_ref: 'INC-011', title: 'Washroom Out of Service T2',   severity: 'HIGH',     status: 'IN_PROGRESS', terminal_id: 'T2', assigned_to: 'Priya Sharma',  created_at: new Date(now.getTime() - 14400000), issue_type: 'MANUAL', updated_at: new Date() },
    { incident_ref: 'INC-012', title: 'Cleaning Overdue T4',          severity: 'MEDIUM',   status: 'RESOLVED',    terminal_id: 'T4', assigned_to: 'Sunita Patil',  created_at: new Date(now.getTime() - 259200000), resolved_at: new Date(now.getTime() - 255600000), issue_type: 'MANUAL', updated_at: new Date() },
    { incident_ref: 'INC-013', title: 'Ammonia Alert Concourse B',    severity: 'HIGH',     status: 'OPEN',        terminal_id: 'T5', assigned_to: 'Vikram Nair',   created_at: new Date(now.getTime() - 4500000),  issue_type: 'MANUAL', updated_at: new Date() },
    { incident_ref: 'INC-014', title: 'Sensor Network Disruption T3', severity: 'MEDIUM',   status: 'IN_PROGRESS', terminal_id: 'T3', assigned_to: 'Amit Verma',    created_at: new Date(now.getTime() - 21600000), issue_type: 'MANUAL', updated_at: new Date() },
    { incident_ref: 'INC-015', title: 'Flood Alert Minor Leak T4',    severity: 'HIGH',     status: 'RESOLVED',    terminal_id: 'T4', assigned_to: 'Sunita Patil',  created_at: new Date(now.getTime() - 345600000), resolved_at: new Date(now.getTime() - 342000000), issue_type: 'MANUAL', updated_at: new Date() },
  ] as any)

  // ── SEEDING WHI SNAPSHOTS (Old Schema) ──
  console.log('Seeding WHI snapshots...')
  const whiRows = []
  for (let day = 13; day >= 0; day--) {
    for (const wId of ['W1','W2','W4','W7','W10']) {
      const base = 72 + Math.random() * 22
      whiRows.push({
        washroomId:  wId,
        score:       base.toFixed(2),
        cleanliness: (base + 4 - Math.random() * 8).toFixed(2),
        odorControl: (base - 4 + Math.random() * 7).toFixed(2),
        soapAvail:   Math.min(100, base + Math.random() * 12).toFixed(2),
        paperAvail:  Math.max(0, base - Math.random() * 10).toFixed(2),
        recordedAt:  new Date(now.getTime() - day * 86400000 - Math.random() * 3600000),
      })
    }
  }
  await db.insert(whiSnapshots).values(whiRows)

  // ── SEEDING HEATMAP ZONES (Old Schema) ──
  console.log('Seeding heatmap zones...')
  const trafficData = [82,45,91,23,67,78,34,88,15,55,72,41,93,28,63,50]
  const zones = []
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      zones.push({
        id:         `ZONE-${String.fromCharCode(65 + row)}${col + 1}`,
        terminalId: 'T5',
        label:      `Zone ${String.fromCharCode(65 + row)}${col + 1}`,
        traffic:    trafficData[row * 4 + col],
        rowPos:     row,
        colPos:     col,
        updatedAt:  new Date(),
      })
    }
  }
  await db.insert(heatmapZones).values(zones)

  // ── SEEDING SYSTEM LOGS ──
  console.log('Seeding system logs...')
  const sysEvents = [
    { eventType: 'SYSTEM_HEALTH_CHECK',     severity: 'SUCCESS',  source: 'cron',         details: 'All 13 online sensors reporting normally' },
    { eventType: 'SENSOR_OFFLINE',          severity: 'CRITICAL', source: 'device-agent', details: 'D009 not responding to ping after 3 retries' },
    { eventType: 'WHI_THRESHOLD_BREACH',    severity: 'CRITICAL', source: 'whi-engine',   details: 'W6 WHI at 45.0, threshold is 60' },
    { eventType: 'AMMONIA_ALERT',           severity: 'CRITICAL', source: 'sensor-mon',   details: 'D001 reading 78ppm, limit 50ppm' },
    { eventType: 'AUTH_SUCCESS',            severity: 'SUCCESS',  source: 'clerk',        details: 'User authenticated via Clerk SSO' },
    { eventType: 'SESSION_CREATED',         severity: 'INFO',     source: 'clerk',        details: 'New authenticated session started' },
    { eventType: 'DEVICE_LOW_BATTERY',      severity: 'WARNING',  source: 'device-agent', details: 'D012 battery at 11%' },
    { eventType: 'CLEANING_CYCLE_COMPLETE', severity: 'SUCCESS',  source: 'ops-system',   details: 'W3 cleaning completed, status reset to VACANT' },
    { eventType: 'INCIDENT_AUTO_ESCALATED', severity: 'CRITICAL', source: 'incident-mgr', details: 'INC-005 escalated after 30 min without assignment' },
    { eventType: 'DB_BACKUP_COMPLETE',      severity: 'SUCCESS',  source: 'neon-backup',  details: 'Automated Neon DB backup completed' },
    { eventType: 'WEBHOOK_RECEIVED',        severity: 'INFO',     source: 'clerk-webhook',details: 'Clerk user lifecycle event processed' },
    { eventType: 'MIDDLEWARE_BLOCK',        severity: 'WARNING',  source: 'middleware',   details: 'Unauthorized route access blocked' },
    { eventType: 'SENSOR_RESTORED',         severity: 'SUCCESS',  source: 'device-agent', details: 'D005 back online after maintenance' },
    { eventType: 'CONFIG_RELOAD',           severity: 'INFO',     source: 'system',       details: 'Settings reloaded from database' },
    { eventType: 'SCHEDULED_REPORT',        severity: 'INFO',     source: 'cron',         details: 'Daily incident summary generated' },
    { eventType: 'API_RATE_LIMIT',          severity: 'WARNING',  source: 'api-gateway',  details: 'Rate limit hit from 103.21.244.0' },
    { eventType: 'AUTH_FAILURE',            severity: 'WARNING',  source: 'clerk',        details: 'Failed sign-in attempt, invalid credentials' },
    { eventType: 'OVERCROWDING_ALERT',      severity: 'CRITICAL', source: 'sensor-mon',   details: 'W7 occupancy at 95%, threshold 80%' },
    { eventType: 'PAPER_LEVEL_LOW',         severity: 'WARNING',  source: 'sensor-mon',   details: 'D006 paper sensor at 8% fill level' },
    { eventType: 'SYSTEM_STARTUP',          severity: 'SUCCESS',  source: 'system',       details: 'AAI Washroom Monitor system started successfully' },
  ]
  const sysRows = []
  for (let i = 0; i < 50; i++) {
    const e = sysEvents[i % sysEvents.length]
    sysRows.push({
      ...e,
      userId:    ['system','clerk','device-agent','cron'][i % 4],
      ipAddress: ['10.0.0.1','192.168.1.100','172.16.0.5','127.0.0.1'][i % 4],
      timestamp: new Date(now.getTime() - i * 2400000),
    })
  }
  await db.insert(systemLogs).values(sysRows)

  // ── SEEDING AUDIT LOGS ──
  console.log('Seeding audit logs...')
  const auditActions = [
    { action: 'USER_LOGIN',          severity: 'INFO',     details: 'Successful login from web portal' },
    { action: 'SETTINGS_UPDATED',    severity: 'WARNING',  details: 'Ammonia threshold changed from 45 to 50 ppm' },
    { action: 'INCIDENT_ASSIGNED',   severity: 'INFO',     details: 'INC-001 assigned to Rajesh Kumar' },
    { action: 'DEVICE_ACKNOWLEDGED', severity: 'INFO',     details: 'Device D009 offline status acknowledged' },
    { action: 'REPORT_EXPORTED',     severity: 'INFO',     details: 'Weekly incident report exported as CSV' },
    { action: 'USER_CREATED',        severity: 'INFO',     details: 'New terminal operator account created' },
    { action: 'THRESHOLD_CHANGED',   severity: 'WARNING',  details: 'WHI alert threshold changed to 60' },
    { action: 'INCIDENT_RESOLVED',   severity: 'SUCCESS',  details: 'INC-006 marked as resolved' },
    { action: 'SESSION_EXPIRED',     severity: 'INFO',     details: 'User session expired after 24h' },
    { action: 'UNAUTHORIZED_ACCESS', severity: 'CRITICAL', details: 'Terminal user attempted to access admin panel' },
  ]
  const ips = ['103.21.244.0','49.36.87.201','122.161.51.0','117.196.0.1','59.178.45.2']
  const auditRows = []
  for (let i = 0; i < 25; i++) {
    const a = auditActions[i % auditActions.length]
    auditRows.push({
      ...a,
      ipAddress: ips[i % ips.length],
      timestamp: new Date(Date.now() - i * 3600000),
    })
  }
  await db.insert(auditLogs).values(auditRows)

  // ── SEEDING SYSTEM SETTINGS ──
  console.log('Seeding system settings...')
  await db.insert(systemSettings).values({
    ammoniaThreshold:    50,
    trafficLimitPerHour: 200,
    whiAlertThreshold:   60,
    pingIntervalSeconds: 30,
    emailAlerts:         true,
    smsAlerts:           false,
    autoEscalation:      true,
    updatedBy:           'system',
  })

  // ── SEEDING WASHROOM UNITS & STATES (New Schema - 2070 rows) ──
  console.log('Generating 2070 washroom units and states for new schema...')
  const allUnits: typeof washroomUnits.$inferInsert[] = []
  const allStates: typeof washroomState.$inferInsert[] = []

  for (const t of TERMINAL_SEEDS) {
    for (let l = 1; l <= 6; l++) {
      const levelId = levelsMapping[t.id]?.[l]
      if (!levelId) continue
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

  // ── SEEDING MAINTENANCE ISSUES ──
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

  // ── SEEDING incidentTimeline ──
  console.log('Seeding incidentTimeline...')
  const dbIncidents = await db.select().from(incidents)
  for (const inc of dbIncidents) {
    await db.insert(incidentTimeline).values({
      incident_id: inc.id,
      actor: 'System Sentinel',
      action: 'Reported',
      note: 'Incident automatically opened by diagnostics monitor.',
      happened_at: inc.created_at
    })
  }

  // ── SEEDING 7-day WHI history rollups ──
  console.log('Seeding WHI history rollups...')
  const allHistory: typeof whiHistory.$inferInsert[] = []
  const today = new Date()
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

  for (let i = 0; i < allHistory.length; i += 500) {
    await db.insert(whiHistory).values(allHistory.slice(i, i + 500))
  }

  console.log('✅ Reset and reseed complete for BOTH schemas!')
  process.exit(0)
}

resetAndReseed().catch(e => {
  console.error('❌ Reset failed:', e)
  process.exit(1)
})
