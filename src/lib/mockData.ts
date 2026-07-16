import {
  Incident,
  Device,
  Terminal,
  AppUser,
  AuditLog,
  Washroom,
  Stall,
  Sensor,
  HeatmapZone,
  WHIBreakdown,
  LogEntry
} from '../types'

export const incidents: Incident[] = [
  { id: 'T2-M03', title: 'Floor Moisture Critical', severity: 'CRITICAL', status: 'IN_PROGRESS', terminal: 'Terminal 2', assignedTo: 'Rahul S. (Maintenance Team B)', timestamp: '10:15 AM' },
  { id: 'T1-F02', title: 'Soap Level Low (< 10%)', severity: 'HIGH', status: 'OPEN', terminal: 'Terminal 1', assignedTo: 'Amit K. (Lead Supervisor)', timestamp: '09:46 AM' },
  { id: 'T3-M05', title: 'Ammonia Level Exceeded (50ppm)', severity: 'MEDIUM', status: 'IN_PROGRESS', terminal: 'Terminal 3', assignedTo: 'Vikram S. (Facility Staff 04)', timestamp: '09:30 AM' },
  { id: 'T2-F01', title: 'Paper Towel Low (20%)', severity: 'LOW', status: 'OPEN', terminal: 'Terminal 2', assignedTo: 'Unassigned', timestamp: '08:55 AM' },
  { id: 'T1-C01', title: 'Water Leakage Near Gate 5', severity: 'CRITICAL', status: 'OPEN', terminal: 'Terminal 1', assignedTo: 'Unassigned', timestamp: '08:15 AM' },
  { id: 'T3-A02', title: 'Air Quality Sensor Error', severity: 'INFO', status: 'RESOLVED', terminal: 'Terminal 3', assignedTo: 'Vikram S. (Facility Staff 04)', timestamp: '07:45 AM' },
  { id: 'T2-D04', title: 'Door Lock Malfunction Cubicle 4', severity: 'MEDIUM', status: 'OPEN', terminal: 'Terminal 2', assignedTo: 'Rahul S. (Maintenance Team B)', timestamp: '07:20 AM' },
  { id: 'T1-S03', title: 'Soap Dispenser Jam Gate 12', severity: 'LOW', status: 'RESOLVED', terminal: 'Terminal 1', assignedTo: 'Amit K. (Lead Supervisor)', timestamp: '06:30 AM' },
  { id: 'T3-W01', title: 'Main Supply Valve Pressure Drop', severity: 'CRITICAL', status: 'IN_PROGRESS', terminal: 'Terminal 3', assignedTo: 'Vikram S. (Facility Staff 04)', timestamp: '06:15 AM' },
  { id: 'T2-E02', title: 'Exhaust Fan Failure East Block', severity: 'HIGH', status: 'OPEN', terminal: 'Terminal 2', assignedTo: 'Unassigned', timestamp: '05:45 AM' }
]

export const devices: Device[] = [
  { id: 'DEV-001', type: 'Moisture Sensor', location: 'Level 1 North', battery: 94, status: 'ONLINE', lastPing: '10 seconds ago' },
  { id: 'DEV-002', type: 'Soap Volume Sensor', location: 'Domestic Arrivals', battery: 18, status: 'ONLINE', lastPing: '1 min ago' },
  { id: 'DEV-003', type: 'Air Quality (NH3)', location: 'Gates Area', battery: 85, status: 'ONLINE', lastPing: '30 seconds ago' },
  { id: 'DEV-004', type: 'Consumables Volume', location: 'International Departures', battery: 92, status: 'ONLINE', lastPing: '3 mins ago' },
  { id: 'DEV-005', type: 'Flow Metric Sensor', location: 'Level 1 North', battery: 0, status: 'OFFLINE', lastPing: '2 hours ago' },
  { id: 'DEV-006', type: 'VOC Gas Sensor', location: 'North Wing', battery: 45, status: 'MAINTENANCE', lastPing: 'Just Now' },
  { id: 'DEV-007', type: 'Feedback Tablet', location: 'Main Lobby', battery: 88, status: 'ONLINE', lastPing: '4 mins ago' },
  { id: 'DEV-008', type: 'Water Pressure Sensor', location: 'Sub-Basement B', battery: 72, status: 'ONLINE', lastPing: '5 mins ago' },
  { id: 'DEV-009', type: 'PIR Motion Sensor', location: 'Cubicle Hallway', battery: 98, status: 'ONLINE', lastPing: '12 seconds ago' },
  { id: 'DEV-010', type: 'Smart Flush Gateway', location: 'Terminal 2 Gate 12', battery: 52, status: 'ONLINE', lastPing: '42 seconds ago' }
]

export const terminals: Terminal[] = [
  { id: 'T-ALPHA-01', name: 'Terminal 1 Alpha', location: 'Primary Logistics Hub - East Wing', technician: 'Rahul S.', washroomCount: 12, status: 'Warning' },
  { id: 'T-BETA-02', name: 'Terminal 2 Beta', location: 'West Concourse - Gate 14', technician: 'Amit K.', washroomCount: 15, status: 'Active' },
  { id: 'T-GAMMA-03', name: 'Terminal 3 Gamma', location: 'Cargo Zone 4B', technician: 'Vikram S.', washroomCount: 8, status: 'Maintenance' },
  { id: 'T-DELTA-04', name: 'Terminal 4 Delta', location: 'Arrivals Lounge', technician: 'Marcus W.', washroomCount: 10, status: 'Active' },
  { id: 'T-EPSILON-05', name: 'Terminal 5 Epsilon', location: 'Security Checkpoint C', technician: 'Sarah L.', washroomCount: 6, status: 'Active' }
]

export const appUsers: AppUser[] = [
  { id: 'USR-001', name: 'Marcus Wainwright', role: 'ADMIN', lastLogin: '2 mins ago', status: 'ACTIVE', email: 'm.wainwright@aai.aero' },
  { id: 'USR-002', name: 'Sarah Lin', role: 'TERMINAL', lastLogin: '10 mins ago', status: 'ACTIVE', email: 's.lin@aai.aero' },
  { id: 'USR-003', name: 'Robert Kowalski', role: 'AUDITOR', lastLogin: '3 days ago', status: 'INACTIVE', email: 'r.kowalski@aai.aero' },
  { id: 'USR-004', name: 'Elena Moretti', role: 'TERMINAL', lastLogin: 'Yesterday', status: 'ACTIVE', email: 'e.moretti@aai.aero' },
  { id: 'USR-005', name: 'Amit Kumar', role: 'ADMIN', lastLogin: '4 hours ago', status: 'ACTIVE', email: 'a.kumar@aai.aero' },
  { id: 'USR-006', name: 'Vikram Singh', role: 'TERMINAL', lastLogin: '12 days ago', status: 'ACTIVE', email: 'v.singh@aai.aero' }
]

export const auditLogs: AuditLog[] = [
  { id: 'LOG-881', timestamp: '19-06-2026 10:22:15', action: 'Incident Status Update', userId: 'AP-001', ip: '192.168.4.12', details: 'Incident T2-M03 status updated to IN_PROGRESS', severity: 'INFO' },
  { id: 'LOG-880', timestamp: '19-06-2026 10:15:30', action: 'Critical Alert Triggered', userId: 'System Sensor', ip: '10.0.12.89', details: 'Automated trigger #WSH-T2-009A moisture critical', severity: 'CRITICAL' },
  { id: 'LOG-879', timestamp: '19-06-2026 09:46:00', action: 'Alert Triggered', userId: 'System Sensor', ip: '10.0.12.92', details: 'Soap level SD-024 fell below 10%', severity: 'HIGH' },
  { id: 'LOG-878', timestamp: '19-06-2026 09:12:00', user: 'Sarah Lin', action: 'User Authenticated', userId: 'TP-001', ip: '192.168.2.45', details: 'Login success through gateway portal', severity: 'INFO' },
  { id: 'LOG-877', timestamp: '19-06-2026 08:30:10', user: 'Marcus Wainwright', action: 'Configuration Modified', userId: 'AP-001', ip: '192.168.1.100', details: 'Settings changed: ammonia threshold set to 50ppm', severity: 'MEDIUM' },
  { id: 'LOG-876', timestamp: '18-06-2026 23:11:42', user: 'Elena Moretti', action: 'Exported Analytics Report', userId: 'TP-002', ip: '192.168.3.11', details: 'Weekly incident report exported to CSV', severity: 'INFO' },
  { id: 'LOG-875', timestamp: '18-06-2026 20:05:00', action: 'Device Offline Warn', userId: 'System Sensor', ip: '10.0.12.99', details: 'Flow controller SN-088 ping missed', severity: 'HIGH' },
  { id: 'LOG-874', timestamp: '18-06-2026 18:40:12', action: 'Manual Sanitization Log', userId: 'TP-001', ip: '192.168.2.45', details: 'Housekeeper logged manual clean for Stall B2', severity: 'INFO' },
  { id: 'LOG-873', timestamp: '18-06-2026 16:30:00', action: 'System Backup Complete', userId: 'SYSTEM', ip: '127.0.0.1', details: 'Daily database backup written to secure container', severity: 'LOW' },
  { id: 'LOG-872', timestamp: '18-06-2026 15:12:33', action: 'User Role Update', userId: 'AP-001', ip: '192.168.1.100', details: 'Sarah Lin role upgraded to Supervisor', severity: 'MEDIUM' },
  { id: 'LOG-871', timestamp: '18-06-2026 14:02:11', action: 'Security Policy Ingest', userId: 'SYSTEM', ip: '127.0.0.1', details: 'Applied firewall rule: Block range 192.168.25.x', severity: 'HIGH' },
  { id: 'LOG-870', timestamp: '17-06-2026 11:30:45', action: 'Sensor Registered', userId: 'AP-002', ip: '192.168.1.105', details: 'Registered DEV-010 smart gateway', severity: 'INFO' },
  { id: 'LOG-869', timestamp: '17-06-2026 09:22:15', action: 'Database Index Rebuild', userId: 'SYSTEM', ip: '127.0.0.1', details: 'Index rebuilt for audit logs table', severity: 'LOW' },
  { id: 'LOG-868', timestamp: '17-06-2026 08:15:30', action: 'Ammonia Breach Logged', userId: 'System Sensor', ip: '10.0.12.85', details: 'Ammonia breach (58ppm) in Terminal 3 Restroom', severity: 'CRITICAL' },
  { id: 'LOG-867', timestamp: '16-06-2026 10:45:00', action: 'Maintenance Team Dispatched', userId: 'TP-002', ip: '192.168.3.11', details: 'Assigned Rahul S. to moisture alert T2-M03', severity: 'INFO' }
]

export const weeklyIncidentsData = [
  { day: 'Mon', incidents: 4 },
  { day: 'Tue', incidents: 6 },
  { day: 'Wed', incidents: 8 },
  { day: 'Thu', incidents: 5 },
  { day: 'Fri', incidents: 7 },
  { day: 'Sat', incidents: 9 },
  { day: 'Sun', incidents: 3 }
]

export const washroomHealthData = [
  { name: 'Good', value: 78, color: '#22C55E' },
  { name: 'Fair', value: 16, color: '#EAB308' },
  { name: 'Poor', value: 6, color: '#EF4444' }
]

export const incidentsByTerminalData = [
  { terminal: 'Terminal 1', incidents: 14 },
  { terminal: 'Terminal 2', incidents: 25 },
  { terminal: 'Terminal 3', incidents: 9 },
  { terminal: 'Terminal 4', incidents: 5 },
  { terminal: 'Terminal 5', incidents: 2 }
]

export const whiTrendData = [
  { date: '01 Jul', whi: 82 },
  { date: '02 Jul', whi: 85 },
  { date: '03 Jul', whi: 81 },
  { date: '04 Jul', whi: 88 },
  { date: '05 Jul', whi: 84 },
  { date: '06 Jul', whi: 89 },
  { date: '07 Jul', whi: 87 }
]

export const washrooms: Washroom[] = [
  { id: 'M03', name: 'Gate 12 Male', status: 'OUT_OF_ORDER', occupancy: 95, whi: 18, lastCleaned: '42 mins ago' },
  { id: 'F02', name: 'Departure Hall North', status: 'OUT_OF_ORDER', occupancy: 80, whi: 32, lastCleaned: '15 mins ago' },
  { id: 'F03', name: 'Arrival Hall East', status: 'CLEANING', occupancy: 10, whi: 55, lastCleaned: '2 hours ago' },
  { id: 'M02', name: 'Zone C - Gate 14', status: 'VACANT', occupancy: 60, whi: 58, lastCleaned: '1 hour ago' },
  { id: 'F04', name: 'Gate 11 Female', status: 'VACANT', occupancy: 15, whi: 85, lastCleaned: '10 mins ago' },
  { id: 'M01', name: 'Zone B - Lounge', status: 'OCCUPIED', occupancy: 40, whi: 88, lastCleaned: '5 mins ago' },
  { id: 'M04', name: 'Gate 11 Male', status: 'VACANT', occupancy: 25, whi: 65, lastCleaned: '18 mins ago' },
  { id: 'F01', name: 'Zone A - Gate 12', status: 'VACANT', occupancy: 20, whi: 92, lastCleaned: '12 mins ago' }
]

export const stalls: Stall[] = [
  { id: 'ST-01', label: 'Male Cubicle 1', status: 'OCCUPIED' },
  { id: 'ST-02', label: 'Male Cubicle 2', status: 'VACANT' },
  { id: 'ST-03', label: 'Male Cubicle 3', status: 'CLEANING' },
  { id: 'ST-04', label: 'Male Cubicle 4', status: 'OUT_OF_ORDER' },
  { id: 'ST-05', label: 'Female Cubicle 1', status: 'VACANT' },
  { id: 'ST-06', label: 'Female Cubicle 2', status: 'OCCUPIED' },
  { id: 'ST-07', label: 'Female Cubicle 3', status: 'VACANT' },
  { id: 'ST-08', label: 'Female Cubicle 4', status: 'VACANT' },
  { id: 'ST-09', label: 'Disabled Cubicle 1', status: 'VACANT' },
  { id: 'ST-10', label: 'Disabled Cubicle 2', status: 'OCCUPIED' },
  { id: 'ST-11', label: 'Male Cubicle 5', status: 'VACANT' },
  { id: 'ST-12', label: 'Male Cubicle 6', status: 'OCCUPIED' },
  { id: 'ST-13', label: 'Female Cubicle 5', status: 'CLEANING' },
  { id: 'ST-14', label: 'Female Cubicle 6', status: 'VACANT' },
  { id: 'ST-15', label: 'Male Cubicle 7', status: 'VACANT' },
  { id: 'ST-16', label: 'Male Cubicle 8', status: 'VACANT' },
  { id: 'ST-17', label: 'Female Cubicle 7', status: 'OCCUPIED' },
  { id: 'ST-18', label: 'Female Cubicle 8', status: 'VACANT' },
  { id: 'ST-19', label: 'Universal Cabin A', status: 'VACANT' },
  { id: 'ST-20', label: 'Universal Cabin B', status: 'OUT_OF_ORDER' }
]

export const sensors: Sensor[] = [
  { id: 'SN-024', type: 'Hygiene Hub', battery: 92, location: 'Terminal 2 Gate 12', status: 'ONLINE' },
  { id: 'SN-088', type: 'Leak Detector', battery: 45, location: 'Departure Hall North', status: 'OFFLINE' },
  { id: 'SN-122', type: 'Fluid Monitor', battery: 85, location: 'Zone A Arrival', status: 'ONLINE' },
  { id: 'SN-150', type: 'Water Monitor', battery: 70, location: 'Gate 11 Female', status: 'ONLINE' },
  { id: 'SN-201', type: 'Ammonia NH3 Detector', battery: 78, location: 'Gate 12 Male', status: 'ONLINE' },
  { id: 'SN-202', type: 'Soap Dispenser Sensor', battery: 12, location: 'Zone A Gate 12', status: 'MAINTENANCE' },
  { id: 'SN-203', type: 'Moisture Grid B2', battery: 94, location: 'Level 1 North', status: 'ONLINE' },
  { id: 'SN-204', type: 'PIR Motion Sensor', battery: 60, location: 'Main Concourse Lobby', status: 'ONLINE' },
  { id: 'SN-205', type: 'Paper Towel Monitor', battery: 40, location: 'Departures Stall 2', status: 'ONLINE' },
  { id: 'SN-206', type: 'Feedback Terminal Tablet', battery: 88, location: 'VIP Lounge Gate 1', status: 'ONLINE' }
]

export const floorHeatmapZones: HeatmapZone[] = [
  { id: 'Z1', label: 'Concourse Entry', traffic: 15 },
  { id: 'Z2', label: 'Corridor A', traffic: 40 },
  { id: 'Z3', label: 'Stall Block A', traffic: 68 },
  { id: 'Z4', label: 'Handwash Area East', traffic: 88 },
  { id: 'Z5', label: 'Universal Stall', traffic: 22 },
  { id: 'Z6', label: 'Corridor B', traffic: 32 },
  { id: 'Z7', label: 'Stall Block B', traffic: 92 },
  { id: 'Z8', label: 'Handwash Area West', traffic: 72 },
  { id: 'Z9', label: 'Lounge Restroom', traffic: 12 },
  { id: 'Z10', label: 'Corridor C', traffic: 48 },
  { id: 'Z11', label: 'Stall Block C', traffic: 60 },
  { id: 'Z12', label: 'Janitor Supply', traffic: 8 },
  { id: 'Z13', label: 'Arrivals Foyer', traffic: 52 },
  { id: 'Z14', label: 'Corridor D', traffic: 35 },
  { id: 'Z15', label: 'Stall Block D', traffic: 82 },
  { id: 'Z16', label: 'Main Exit Path', traffic: 98 }
]

export const liveWHIScore = 82

export const liveWHIBreakdown: WHIBreakdown = {
  cleanliness: 90,
  odorControl: 85,
  soapAvailability: 95,
  paperAvailability: 80
}

export const systemLogs: LogEntry[] = [
  { id: 'LOG-001', timestamp: '2026-06-22 14:23:45.092', eventType: 'Brute-force detected', severity: 'CRITICAL', userId: 'UNAUTHORIZED', ip: '192.168.4.11', details: '50 failed attempts from IP 192.168.4.11' },
  { id: 'LOG-002', timestamp: '2026-06-22 14:23:42.115', eventType: 'I/O Wait breach', severity: 'WARNING', userId: 'SYSTEM', ip: '127.0.0.1', details: 'I/O Wait exceeding threshold (850ms) on Volume E-200' },
  { id: 'LOG-003', timestamp: '2026-06-22 14:23:38.552', eventType: 'Credential Sync', severity: 'INFO', userId: 'SYNC_DAEMON', ip: '10.0.0.12', details: 'Completed periodic synchronization of credentials vault' },
  { id: 'LOG-004', timestamp: '2026-06-22 14:23:30.221', eventType: 'Handshake Client', severity: 'SUCCESS', userId: 'UI_GATEWAY', ip: '192.168.1.15', details: 'Handshake initiated with client (v2.4.1) on channel 12' },
  { id: 'LOG-005', timestamp: '2026-06-22 14:23:25.881', eventType: 'Firewall Policy App', severity: 'SUCCESS', userId: 'NETWORK_MOD', ip: '10.0.2.1', details: 'Firewall policy update applied successfully to external gateway' },
  { id: 'LOG-006', timestamp: '2026-06-22 14:23:12.981', eventType: 'Vault Lock Intercept', severity: 'CRITICAL', userId: 'VAULT_LOCK', ip: '10.0.12.89', details: 'Unauthorized lock initiation command intercepted' },
  { id: 'LOG-007', timestamp: '2026-06-22 14:23:01.442', eventType: 'Pipeline latency warning', severity: 'WARNING', userId: 'DB_CLUSTER_01', ip: '10.0.3.5', details: 'Ingestion pipeline warning: latency spikes (420ms)' },
  { id: 'LOG-008', timestamp: '2026-06-22 14:20:00.123', eventType: 'Database Health Check', severity: 'INFO', userId: 'DB_MONITOR', ip: '127.0.0.1', details: 'All postgres clusters report healthy state' },
  { id: 'LOG-009', timestamp: '2026-06-22 14:18:22.900', eventType: 'User Sign In Success', severity: 'SUCCESS', userId: 'AP-001', ip: '192.168.1.100', details: 'Authenticated via Clerk SSO' },
  { id: 'LOG-010', timestamp: '2026-06-22 14:15:10.005', eventType: 'Token Revocation', severity: 'INFO', userId: 'AP-001', ip: '192.168.1.100', details: 'Session token active list updated' },
  { id: 'LOG-011', timestamp: '2026-06-22 14:12:00.887', eventType: 'SSL Cert Rotate', severity: 'SUCCESS', userId: 'SSL_BOT', ip: '127.0.0.1', details: 'Rotated Let\'s Encrypt certificates' },
  { id: 'LOG-012', timestamp: '2026-06-22 14:05:00.412', eventType: 'Threshold Update', severity: 'INFO', userId: 'AP-001', ip: '192.168.1.100', details: 'Increased warning WHI threshold configuration to 45' },
  { id: 'LOG-013', timestamp: '2026-06-22 13:58:32.199', eventType: 'Sensor Reset Command', severity: 'WARNING', userId: 'TP-001', ip: '192.168.2.45', details: 'Initiated SN-024 reset command on Terminal 2 gateway' },
  { id: 'LOG-014', timestamp: '2026-06-22 13:45:00.000', eventType: 'Disk Space Warn', severity: 'WARNING', userId: 'SYSTEM', ip: '127.0.0.1', details: 'Disk usage on /var/log exceeds 85%' },
  { id: 'LOG-015', timestamp: '2026-06-22 13:30:12.715', eventType: 'Maintenance Dispatch', severity: 'INFO', userId: 'TP-002', ip: '192.168.3.11', details: 'Assigned Amit K. to low soap refilling task' },
  { id: 'LOG-016', timestamp: '2026-06-22 13:12:44.209', eventType: 'Config Pulled', severity: 'SUCCESS', userId: 'GATEWAY_ROUTER', ip: '10.0.12.1', details: 'Loaded routing config version v1.21' },
  { id: 'LOG-017', timestamp: '2026-06-22 13:00:15.000', eventType: 'NTP Time Sync', severity: 'SUCCESS', userId: 'SYSTEM', ip: '127.0.0.1', details: 'Time synchronized with in.pool.ntp.org' },
  { id: 'LOG-018', timestamp: '2026-06-22 12:45:00.320', eventType: 'Log Rotation Service', severity: 'INFO', userId: 'LOG_BOT', ip: '127.0.0.1', details: 'Compressed and uploaded previous day log fragments' },
  { id: 'LOG-019', timestamp: '2026-06-22 12:30:00.999', eventType: 'Incident Solved', severity: 'SUCCESS', userId: 'TP-001', ip: '192.168.2.45', details: 'Marked incident INC-2943 soap refill complete' },
  { id: 'LOG-020', timestamp: '2026-06-22 12:15:11.455', eventType: 'Access Denied Block', severity: 'CRITICAL', userId: 'TP-001', ip: '192.168.2.45', details: 'Attempted access to /admin/dashboard blocked' },
  { id: 'LOG-021', timestamp: '2026-06-22 12:00:00.002', eventType: 'Uptime Ping', severity: 'SUCCESS', userId: 'STATUS_CHECKER', ip: '10.0.0.5', details: 'Portal heartbeat OK' },
  { id: 'LOG-022', timestamp: '2026-06-22 11:45:33.111', eventType: 'Memory Flush', severity: 'INFO', userId: 'SYSTEM', ip: '127.0.0.1', details: 'Reclaimed 420MB unused buffers' },
  { id: 'LOG-023', timestamp: '2026-06-22 11:30:15.890', eventType: 'SMTP Test Mail', severity: 'SUCCESS', userId: 'AP-002', ip: '192.168.1.105', details: 'SMTP verification mail successfully sent' },
  { id: 'LOG-024', timestamp: '2026-06-22 11:15:00.100', eventType: 'SSH Login Success', severity: 'WARNING', userId: 'root', ip: '182.16.55.90', details: 'Root login detected via terminal console' },
  { id: 'LOG-025', timestamp: '2026-06-22 11:00:22.450', eventType: 'Websocket Connected', severity: 'INFO', userId: 'UI_GATEWAY', ip: '192.168.1.55', details: 'Opened live session stream for user sarah_lin' },
  { id: 'LOG-026', timestamp: '2026-06-22 10:45:00.091', eventType: 'Clerk Sync Triggered', severity: 'SUCCESS', userId: 'CLERK_WEBHOOK', ip: '10.0.12.44', details: 'Synchronized profile AP-002 metadata' },
  { id: 'LOG-027', timestamp: '2026-06-22 10:30:00.005', eventType: 'Gateway Node Init', severity: 'INFO', userId: 'SYSTEM', ip: '127.0.0.1', details: 'Node #4 joins cluster beta-pool' },
  { id: 'LOG-028', timestamp: '2026-06-22 10:15:22.880', eventType: 'Auth Failure Alert', severity: 'CRITICAL', userId: 'ALP-001', ip: '192.168.5.15', details: 'Invalid passcode entered during vault unlocking' },
  { id: 'LOG-029', timestamp: '2026-06-22 10:00:00.012', eventType: 'CRON: Clean Cache', severity: 'SUCCESS', userId: 'SYSTEM', ip: '127.0.0.1', details: 'Pruned 1,200 stale tokens' },
  { id: 'LOG-030', timestamp: '2026-06-22 09:45:11.909', eventType: 'API Rate Limit', severity: 'WARNING', userId: 'GUEST', ip: '192.168.80.12', details: 'Rate limit exceeded on endpoint /api/sensors/status' }
]
