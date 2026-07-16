import { db } from './client'
import {
  terminals, washrooms, stalls, devices, incidents,
  appUsers, auditLogs, systemLogs, whiSnapshots,
  heatmapZones, systemSettings
} from './schema'

async function seed() {
  console.log('🌱 Seeding AAI database...')

  // Clear in reverse dependency order
  console.log('Clearing existing data...')
  await db.delete(whiSnapshots)
  await db.delete(auditLogs)
  await db.delete(systemLogs)
  await db.delete(heatmapZones)
  await db.delete(stalls)
  await db.delete(incidents)
  await db.delete(devices)
  await db.delete(washrooms)
  await db.delete(appUsers)
  await db.delete(terminals)
  await db.delete(systemSettings)

  // 1. TERMINALS
  console.log('Seeding terminals...')
  await db.insert(terminals).values([
    { id: 'T1', name: 'Terminal 1 — Domestic Arrivals',   location: 'IGI Airport, New Delhi',   technician: 'Rajesh Kumar',   washroomCount: 8,  status: 'ACTIVE' },
    { id: 'T2', name: 'Terminal 2 — Domestic Departures', location: 'IGI Airport, New Delhi',   technician: 'Priya Sharma',   washroomCount: 10, status: 'ACTIVE' },
    { id: 'T3', name: 'Terminal 3 — International',       location: 'IGI Airport, New Delhi',   technician: 'Amit Verma',     washroomCount: 14, status: 'ACTIVE' },
    { id: 'T4', name: 'Concourse A',                      location: 'CSIA Airport, Mumbai',     technician: 'Sunita Patil',   washroomCount: 6,  status: 'ACTIVE' },
    { id: 'T5', name: 'Concourse B',                      location: 'CSIA Airport, Mumbai',     technician: 'Vikram Nair',    washroomCount: 6,  status: 'ACTIVE' },
  ])

  // 2. APP USERS
  console.log('Seeding app users...')
  await db.insert(appUsers).values([
    { id: 'AP-001', name: 'Arjun Mehta',     email: 'arjun.mehta@aai.aero',     role: 'ADMIN',    status: 'ACTIVE', lastLogin: new Date() },
    { id: 'AP-002', name: 'Divya Iyer',      email: 'divya.iyer@aai.aero',      role: 'ADMIN',    status: 'ACTIVE', lastLogin: new Date(Date.now() - 3600000) },
    { id: 'AP-003', name: 'Sanjay Gupta',    email: 'sanjay.gupta@aai.aero',    role: 'ADMIN',    status: 'INACTIVE' },
    { id: 'TP-001', name: 'Kavya Reddy',     email: 'kavya.reddy@aai.aero',     role: 'TERMINAL', status: 'ACTIVE', lastLogin: new Date() },
    { id: 'TP-002', name: 'Manoj Singh',     email: 'manoj.singh@aai.aero',     role: 'TERMINAL', status: 'ACTIVE', lastLogin: new Date(Date.now() - 7200000) },
    { id: 'TP-003', name: 'Ananya Pillai',   email: 'ananya.pillai@aai.aero',   role: 'TERMINAL', status: 'ACTIVE' },
    { id: 'ALP-001', name: 'Rohit Bansal',   email: 'rohit.bansal@aai.aero',    role: 'AUDITOR',  status: 'ACTIVE', lastLogin: new Date(Date.now() - 1800000) },
    { id: 'ALP-002', name: 'Neha Joshi',     email: 'neha.joshi@aai.aero',      role: 'AUDITOR',  status: 'ACTIVE' },
    { id: 'AP-004', name: 'AAI Admin Test',    email: 'rmxdeath@gmail.com',       role: 'ADMIN',    status: 'ACTIVE', lastLogin: new Date() },
    { id: 'TP-004', name: 'Terminal Test',     email: 'mannarohan51@gmail.com',   role: 'TERMINAL', status: 'ACTIVE', lastLogin: new Date() },
    { id: 'ALP-004', name: 'Auditor Test',     email: 'rohanmannas2021@gmail.com', role: 'AUDITOR',  status: 'ACTIVE', lastLogin: new Date() },
  ])

  // 3. WASHROOMS
  console.log('Seeding washrooms...')
  const washroomData = [
    { id: 'W1',  terminalId: 'T1', name: 'T1 Gents — Gate 5',         status: 'VACANT',       occupancy: 0,  whi: '92.50' },
    { id: 'W2',  terminalId: 'T1', name: 'T1 Ladies — Gate 5',        status: 'OCCUPIED',     occupancy: 3,  whi: '88.00' },
    { id: 'W3',  terminalId: 'T1', name: 'T1 Handicap — Gate 5',      status: 'CLEANING',     occupancy: 0,  whi: '95.00' },
    { id: 'W4',  terminalId: 'T2', name: 'T2 Gents — Departure Hall', status: 'OCCUPIED',     occupancy: 5,  whi: '75.30' },
    { id: 'W5',  terminalId: 'T2', name: 'T2 Ladies — Departure Hall',status: 'VACANT',       occupancy: 0,  whi: '81.20' },
    { id: 'W6',  terminalId: 'T2', name: 'T2 Gents — Food Court',     status: 'OUT_OF_ORDER', occupancy: 0,  whi: '45.00' },
    { id: 'W7',  terminalId: 'T3', name: 'T3 Intl Gents — Level 4',   status: 'OCCUPIED',     occupancy: 8,  whi: '68.90' },
    { id: 'W8',  terminalId: 'T3', name: 'T3 Intl Ladies — Level 4',  status: 'VACANT',       occupancy: 0,  whi: '97.10' },
    { id: 'W9',  terminalId: 'T3', name: 'T3 Intl Gents — Level 3',   status: 'CLEANING',     occupancy: 0,  whi: '55.40' },
    { id: 'W10', terminalId: 'T4', name: 'Concourse A Gents',         status: 'VACANT',       occupancy: 0,  whi: '90.00' },
    { id: 'W11', terminalId: 'T4', name: 'Concourse A Ladies',        status: 'OCCUPIED',     occupancy: 2,  whi: '83.70' },
    { id: 'W12', terminalId: 'T5', name: 'Concourse B Gents',         status: 'OCCUPIED',     occupancy: 4,  whi: '71.20' },
  ]
  await db.insert(washrooms).values(washroomData.map(w => ({
    ...w,
    lastCleaned: new Date(Date.now() - Math.random() * 14400000),
  })))

  // 4. STALLS
  console.log('Seeding stalls...')
  const stallStatuses = ['VACANT','OCCUPIED','VACANT','VACANT','CLEANING','OCCUPIED']
  const stallRows = []
  for (let w = 1; w <= 5; w++) {
    for (let s = 1; s <= 6; s++) {
      const idx = (s - 1) % stallStatuses.length
      stallRows.push({
        id:         `W${w}-S${s}`,
        washroomId: `W${w}`,
        label:      `${String.fromCharCode(64 + s)}${w}`,
        status:     s === 6 && w === 2 ? 'OUT_OF_ORDER' : stallStatuses[idx],
      })
    }
  }
  await db.insert(stalls).values(stallRows)

  // 5. DEVICES
  console.log('Seeding devices...')
  await db.insert(devices).values([
    { id: 'D001', terminalId: 'T1', type: 'AMMONIA_SENSOR',       location: 'T1 Gents Gate 5',          battery: 94,  status: 'ONLINE',       lastPing: new Date() },
    { id: 'D002', terminalId: 'T1', type: 'OCCUPANCY_SENSOR',     location: 'T1 Ladies Gate 5',         battery: 88,  status: 'ONLINE',       lastPing: new Date() },
    { id: 'D003', terminalId: 'T1', type: 'SOAP_DISPENSER_SENSOR',location: 'T1 Gents Gate 5',          battery: 35,  status: 'ONLINE',       lastPing: new Date() },
    { id: 'D004', terminalId: 'T2', type: 'TEMP_SENSOR',          location: 'T2 Departure Hall',        battery: 67,  status: 'ONLINE',       lastPing: new Date() },
    { id: 'D005', terminalId: 'T2', type: 'WATER_LEAK_DETECTOR',  location: 'T2 Food Court Gents',      battery: 15,  status: 'MAINTENANCE',  lastPing: new Date(Date.now() - 3600000) },
    { id: 'D006', terminalId: 'T2', type: 'PAPER_SENSOR',         location: 'T2 Ladies Departure',      battery: 91,  status: 'ONLINE',       lastPing: new Date() },
    { id: 'D007', terminalId: 'T3', type: 'AMMONIA_SENSOR',       location: 'T3 Intl Level 4',          battery: 100, status: 'ONLINE',       lastPing: new Date() },
    { id: 'D008', terminalId: 'T3', type: 'DOOR_SENSOR',          location: 'T3 Intl Ladies Level 4',   battery: 78,  status: 'ONLINE',       lastPing: new Date() },
    { id: 'D009', terminalId: 'T3', type: 'OCCUPANCY_SENSOR',     location: 'T3 Intl Gents Level 3',    battery: 22,  status: 'OFFLINE',      lastPing: new Date(Date.now() - 7200000) },
    { id: 'D010', terminalId: 'T4', type: 'AMMONIA_SENSOR',       location: 'Concourse A Gents',        battery: 85,  status: 'ONLINE',       lastPing: new Date() },
    { id: 'D011', terminalId: 'T4', type: 'SOAP_DISPENSER_SENSOR',location: 'Concourse A Ladies',       battery: 56,  status: 'ONLINE',       lastPing: new Date() },
    { id: 'D012', terminalId: 'T5', type: 'OCCUPANCY_SENSOR',     location: 'Concourse B Gents',        battery: 11,  status: 'OFFLINE',      lastPing: new Date(Date.now() - 18000000) },
    { id: 'D013', terminalId: 'T5', type: 'WATER_LEAK_DETECTOR',  location: 'Concourse B',              battery: 73,  status: 'ONLINE',       lastPing: new Date() },
    { id: 'D014', terminalId: 'T3', type: 'TEMP_SENSOR',          location: 'T3 Intl Level 3',          battery: 44,  status: 'MAINTENANCE',  lastPing: new Date(Date.now() - 1800000) },
    { id: 'D015', terminalId: 'T1', type: 'DOOR_SENSOR',          location: 'T1 Handicap Gate 5',       battery: 99,  status: 'ONLINE',       lastPing: new Date() },
  ])

  // 6. INCIDENTS
  console.log('Seeding incidents...')
  const now = new Date()
  await db.insert(incidents).values([
    { id: 'INC-001', title: 'Ammonia Level Critical',         description: 'Ammonia reading at 78ppm, threshold is 50ppm', severity: 'CRITICAL', status: 'OPEN',        terminalId: 'T1', assignedTo: 'Rajesh Kumar',   reportedBy: 'TP-001', createdAt: new Date(now.getTime() - 1800000) },
    { id: 'INC-002', title: 'Soap Dispenser Empty',           description: 'Soap sensor reading 0% fill level',            severity: 'MEDIUM',   status: 'IN_PROGRESS', terminalId: 'T3', assignedTo: 'Amit Verma',     reportedBy: 'TP-002', createdAt: new Date(now.getTime() - 3600000) },
    { id: 'INC-003', title: 'Water Leak Detected',            description: 'Moisture sensor triggered under basin',         severity: 'HIGH',     status: 'OPEN',        terminalId: 'T2', assignedTo: 'Priya Sharma',   reportedBy: 'TP-001', createdAt: new Date(now.getTime() - 900000) },
    { id: 'INC-004', title: 'Sensor Offline — D009',          description: 'Occupancy sensor unresponsive for 2 hours',    severity: 'HIGH',     status: 'IN_PROGRESS', terminalId: 'T3', assignedTo: 'Amit Verma',     reportedBy: 'AP-001', createdAt: new Date(now.getTime() - 7200000) },
    { id: 'INC-005', title: 'WHI Score Below Threshold',      description: 'WHI dropped to 45.0, minimum is 60',           severity: 'CRITICAL', status: 'OPEN',        terminalId: 'T2', assignedTo: 'Priya Sharma',   reportedBy: 'AP-001', createdAt: new Date(now.getTime() - 600000) },
    { id: 'INC-006', title: 'Overcrowding Alert',             description: 'Occupancy at 95%, max is 80%',                 severity: 'HIGH',     status: 'RESOLVED',    terminalId: 'T3', assignedTo: 'Amit Verma',     reportedBy: 'TP-002', createdAt: new Date(now.getTime() - 86400000),  resolvedAt: new Date(now.getTime() - 82800000) },
    { id: 'INC-007', title: 'Paper Roll Empty',               description: 'Paper sensor at 0% in 3 stalls',               severity: 'LOW',      status: 'RESOLVED',    terminalId: 'T1', assignedTo: 'Rajesh Kumar',   reportedBy: 'TP-001', createdAt: new Date(now.getTime() - 172800000), resolvedAt: new Date(now.getTime() - 169200000) },
    { id: 'INC-008', title: 'Door Sensor Malfunction',        description: 'Stall B2 door sensor reporting stuck open',    severity: 'MEDIUM',   status: 'IN_PROGRESS', terminalId: 'T1', assignedTo: 'Rajesh Kumar',   reportedBy: 'AP-002', createdAt: new Date(now.getTime() - 5400000) },
    { id: 'INC-009', title: 'Low Battery — D012',             description: 'Device battery at 11%, replacement needed',    severity: 'LOW',      status: 'OPEN',        terminalId: 'T5', assignedTo: 'Vikram Nair',    reportedBy: 'AP-001', createdAt: new Date(now.getTime() - 10800000) },
    { id: 'INC-010', title: 'Temperature Anomaly',            description: 'Temp reading 38°C, HVAC may be failing',       severity: 'CRITICAL', status: 'IN_PROGRESS', terminalId: 'T2', assignedTo: 'Priya Sharma',   reportedBy: 'TP-002', createdAt: new Date(now.getTime() - 2700000) },
    { id: 'INC-011', title: 'Washroom Out of Service',        description: 'Blocked drain, maintenance team called',       severity: 'HIGH',     status: 'IN_PROGRESS', terminalId: 'T2', assignedTo: 'Priya Sharma',   reportedBy: 'TP-001', createdAt: new Date(now.getTime() - 14400000) },
    { id: 'INC-012', title: 'Cleaning Overdue',               description: 'Last cleaned 6h ago, schedule at 4h intervals',severity: 'MEDIUM',   status: 'RESOLVED',    terminalId: 'T4', assignedTo: 'Sunita Patil',   reportedBy: 'AP-002', createdAt: new Date(now.getTime() - 259200000), resolvedAt: new Date(now.getTime() - 255600000) },
    { id: 'INC-013', title: 'Ammonia Alert — Concourse B',    description: 'Ammonia at 62ppm in Concourse B Gents',        severity: 'HIGH',     status: 'OPEN',        terminalId: 'T5', assignedTo: 'Vikram Nair',    reportedBy: 'TP-002', createdAt: new Date(now.getTime() - 4500000) },
    { id: 'INC-014', title: 'Sensor Network Disruption',      description: 'Intermittent connectivity in T3 Level 3',      severity: 'MEDIUM',   status: 'IN_PROGRESS', terminalId: 'T3', assignedTo: 'Amit Verma',     reportedBy: 'AP-001', createdAt: new Date(now.getTime() - 21600000) },
    { id: 'INC-015', title: 'Flood Alert — Minor Leak',       description: 'Water detected on floor near basin D',         severity: 'HIGH',     status: 'RESOLVED',    terminalId: 'T4', assignedTo: 'Sunita Patil',   reportedBy: 'TP-001', createdAt: new Date(now.getTime() - 345600000), resolvedAt: new Date(now.getTime() - 342000000) },
  ])

  // 7. WHI SNAPSHOTS
  console.log('Seeding WHI snapshots...')
  const whiRows = []
  for (let day = 13; day >= 0; day--) {
    for (const w of ['W1','W2','W4','W7','W10']) {
      const base = 75 + Math.random() * 20
      whiRows.push({
        washroomId:  w,
        score:       base.toFixed(2),
        cleanliness: (base + 5 - Math.random() * 10).toFixed(2),
        odorControl: (base - 5 + Math.random() * 8).toFixed(2),
        soapAvail:   (base + Math.random() * 10).toFixed(2),
        paperAvail:  (base - Math.random() * 8).toFixed(2),
        recordedAt:  new Date(Date.now() - day * 86400000),
      })
    }
  }
  await db.insert(whiSnapshots).values(whiRows)

  // 8. HEATMAP ZONES
  console.log('Seeding heatmap zones...')
  const zones = []
  const trafficData = [
    82, 45, 91, 23,
    67, 78, 34, 88,
    15, 55, 72, 41,
    93, 28, 63, 50,
  ]
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const idx = row * 4 + col
      zones.push({
        id:         `ZONE-${String.fromCharCode(65 + row)}${col + 1}`,
        terminalId: 'T5',
        label:      `Zone ${String.fromCharCode(65 + row)}${col + 1}`,
        traffic:    trafficData[idx],
        rowPos:     row,
        colPos:     col,
      })
    }
  }
  await db.insert(heatmapZones).values(zones)

  // 9. AUDIT LOGS
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
  const userIds = ['AP-001','AP-002','TP-001','TP-002','ALP-001']
  const auditRows = []
  for (let i = 0; i < 25; i++) {
    const a = auditActions[i % auditActions.length]
    auditRows.push({
      ...a,
      userId:    userIds[i % userIds.length],
      ipAddress: ips[i % ips.length],
      timestamp: new Date(Date.now() - i * 3600000),
    })
  }
  await db.insert(auditLogs).values(auditRows)

  // 10. SYSTEM LOGS
  console.log('Seeding system logs...')
  const sysEvents = [
    { eventType: 'AUTH_SUCCESS',           severity: 'SUCCESS',  source: 'clerk',        details: 'User AP-001 authenticated successfully' },
    { eventType: 'AUTH_FAILURE',           severity: 'WARNING',  source: 'clerk',        details: 'Failed login attempt for unknown user ID' },
    { eventType: 'SESSION_EXPIRED',        severity: 'INFO',     source: 'middleware',   details: 'Session token expired, user redirected to login' },
    { eventType: 'SENSOR_OFFLINE',         severity: 'CRITICAL', source: 'device-agent', details: 'Device D009 not responding to ping' },
    { eventType: 'SENSOR_RESTORED',        severity: 'SUCCESS',  source: 'device-agent', details: 'Device D005 back online after maintenance' },
    { eventType: 'WHI_THRESHOLD_BREACH',   severity: 'CRITICAL', source: 'whi-engine',   details: 'W6 WHI score dropped to 45.0 below threshold 60' },
    { eventType: 'AMMONIA_ALERT',          severity: 'CRITICAL', source: 'sensor-mon',   details: 'D001 ammonia at 78ppm, threshold 50ppm exceeded' },
    { eventType: 'SYSTEM_HEALTH_CHECK',    severity: 'SUCCESS',  source: 'cron',         details: 'All systems nominal, 15/15 sensors reporting' },
    { eventType: 'DB_BACKUP_COMPLETE',     severity: 'SUCCESS',  source: 'backup-agent', details: 'Neon DB snapshot completed successfully' },
    { eventType: 'API_RATE_LIMIT',         severity: 'WARNING',  source: 'api-gateway',  details: 'Rate limit reached for IP 103.21.244.0' },
    { eventType: 'WEBHOOK_RECEIVED',       severity: 'INFO',     source: 'clerk-webhook',details: 'user.created event processed for TP-003' },
    { eventType: 'SCHEDULED_REPORT',       severity: 'INFO',     source: 'cron',         details: 'Daily incident summary report generated' },
    { eventType: 'DEVICE_LOW_BATTERY',     severity: 'WARNING',  source: 'device-agent', details: 'D012 battery at 11%, replacement alert sent' },
    { eventType: 'CLEANING_CYCLE_START',   severity: 'INFO',     source: 'ops-system',   details: 'Scheduled cleaning started for W3' },
    { eventType: 'CLEANING_CYCLE_COMPLETE',severity: 'SUCCESS',  source: 'ops-system',   details: 'W3 cleaning complete, WHI updated' },
    { eventType: 'INCIDENT_AUTO_ESCALATED',severity: 'CRITICAL', source: 'incident-mgr', details: 'INC-005 auto-escalated after 30min unassigned' },
    { eventType: 'USER_ROLE_UPDATED',      severity: 'WARNING',  source: 'admin-panel',  details: 'Role updated for user TP-003 by AP-001' },
    { eventType: 'MIDDLEWARE_BLOCK',       severity: 'WARNING',  source: 'middleware',   details: 'Unauthorized route access blocked for TP-001' },
    { eventType: 'CONFIG_RELOAD',          severity: 'INFO',     source: 'system',       details: 'System configuration reloaded from database' },
    { eventType: 'ALERT_SUPPRESSED',       severity: 'INFO',     source: 'alert-engine', details: 'Duplicate ammonia alert suppressed (cooldown)' },
  ]
  const sysIps = ['10.0.0.1','192.168.1.100','172.16.0.5','10.0.1.50','127.0.0.1']
  const sysUsers = ['AP-001','TP-001','ALP-001','system','AP-002']
  const sysRows = []
  for (let i = 0; i < 50; i++) {
    const e = sysEvents[i % sysEvents.length]
    sysRows.push({
      ...e,
      userId:    sysUsers[i % sysUsers.length],
      ipAddress: sysIps[i % sysIps.length],
      timestamp: new Date(Date.now() - i * 2400000),
    })
  }
  await db.insert(systemLogs).values(sysRows)

  // 11. SYSTEM SETTINGS
  console.log('Seeding system settings...')
  await db.insert(systemSettings).values({
    ammoniaThreshold:    50,
    trafficLimitPerHour: 200,
    whiAlertThreshold:   60,
    pingIntervalSeconds: 30,
    emailAlerts:         true,
    smsAlerts:           false,
    autoEscalation:      true,
    updatedBy:           'AP-001',
  })

  console.log('✅ Database seeded successfully!')
  console.log('Tables populated: terminals, washrooms, stalls, devices,')
  console.log('  incidents, appUsers, auditLogs, systemLogs, whiSnapshots,')
  console.log('  heatmapZones, systemSettings')
  process.exit(0)
}

seed().catch(e => {
  console.error('❌ Seed failed:', e)
  process.exit(1)
})
