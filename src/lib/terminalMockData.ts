import { Washroom, Incident, Device, AuditLog, ReportFile, LiveFeedItem } from '@/types/terminal';

export const mockWashrooms: Washroom[] = [
  {
    id: 'M03',
    gender: 'Male',
    level: 'Level 2',
    whiScore: 18,
    lastCleaned: '42 mins ago',
    status: 'CRITICAL',
    location: 'Gate 12 Male',
    occupancy: 95,
    odorLevel: 'High',
    refillStatus: 15
  },
  {
    id: 'F02',
    gender: 'Female',
    level: 'Level 2',
    whiScore: 32,
    lastCleaned: '15 mins ago',
    status: 'CRITICAL',
    location: 'Departure Hall North',
    occupancy: 80,
    odorLevel: 'Medium',
    refillStatus: 40
  },
  {
    id: 'F03',
    gender: 'Female',
    level: 'Level 1',
    whiScore: 55,
    lastCleaned: '2 hours ago',
    status: 'CLEANING',
    location: 'Arrival Hall East',
    occupancy: 10,
    odorLevel: 'Medium',
    refillStatus: 50
  },
  {
    id: 'M02',
    gender: 'Male',
    level: 'Level 2',
    whiScore: 58,
    lastCleaned: '1 hour ago',
    status: 'AVAILABLE',
    location: 'Zone C - Gate 14',
    occupancy: 60,
    odorLevel: 'Medium',
    refillStatus: 60
  },
  {
    id: 'F04',
    gender: 'Female',
    level: 'Level 1',
    whiScore: 85,
    lastCleaned: '10 mins ago',
    status: 'AVAILABLE',
    location: 'Gate 11 Female',
    occupancy: 15,
    odorLevel: 'Low',
    refillStatus: 90
  },
  {
    id: 'M01',
    gender: 'Male',
    level: 'Level 2',
    whiScore: 88,
    lastCleaned: '5 mins ago',
    status: 'OCCUPIED',
    location: 'Zone B - Lounge',
    occupancy: 40,
    odorLevel: 'Low',
    refillStatus: 85
  },
  {
    id: 'M04',
    gender: 'Male',
    level: 'Level 1',
    whiScore: 65,
    lastCleaned: '18 mins ago',
    status: 'AVAILABLE',
    location: 'Gate 11 Male',
    occupancy: 25,
    odorLevel: 'Low',
    refillStatus: 80
  },
  {
    id: 'F01',
    gender: 'Female',
    level: 'Level 1',
    whiScore: 92,
    lastCleaned: '12 mins ago',
    status: 'AVAILABLE',
    location: 'Zone A - Gate 12',
    occupancy: 20,
    odorLevel: 'Low',
    refillStatus: 95
  }
];

export const mockIncidents: Incident[] = [
  {
    id: 'INC-2940',
    location: 'Terminal 2 - Gate 12 (Male)',
    issue: 'Critical WHI drop (42) - Maintenance Alert',
    priority: 'HIGH',
    status: 'Unassigned',
    time: '2 mins ago',
    details: 'High odor detection & empty soap dispensers. Critical Hygiene Threshold exceeded.'
  },
  {
    id: 'INC-2941',
    location: 'Departure Hall - North Wing',
    issue: 'Sensor Offline - Hub Node B4',
    priority: 'MEDIUM',
    status: 'In Progress',
    time: '18 mins ago',
    assignedTo: 'Anita Sen',
    details: 'Water leak detected by battery backup sensor. Plumbing ticket generated.'
  },
  {
    id: 'INC-2942',
    location: 'Concourse A - Arrivals Hall',
    issue: 'Dispenser Empty - Hand Sanitizer A3',
    priority: 'LOW',
    status: 'Unassigned',
    time: '24 mins ago',
    details: 'Sanitizer fluid level < 5%. Restocking task auto-created.'
  },
  {
    id: 'INC-2943',
    location: 'Terminal 2 - Gate 4',
    issue: 'Soap Dispenser Low Refill',
    priority: 'LOW',
    status: 'Resolved',
    time: '45 mins ago',
    details: 'Soap refill completed by terminal housekeeping team.'
  }
];

export const mockDevices: Device[] = [
  {
    id: 'SN-024',
    name: 'Odor Sensor Gateway',
    type: 'Hygiene Hub',
    status: 'Online',
    battery: 92,
    lastPing: '1 min ago',
    location: 'Terminal 2 Gate 12',
    signalUptime: '98.5%'
  },
  {
    id: 'SN-088',
    name: 'Water Flow Controller',
    type: 'Leak Detector',
    status: 'Offline',
    battery: 45,
    lastPing: '15 mins ago',
    location: 'Departure Hall North',
    signalUptime: '95.0%'
  },
  {
    id: 'SN-122',
    name: 'Soap Dispenser Sensor',
    type: 'Fluid Monitor',
    status: 'Online',
    battery: 85,
    lastPing: '2 mins ago',
    location: 'Zone A Arrival',
    signalUptime: '99.1%'
  },
  {
    id: 'SN-150',
    name: 'Flush Sensor Valve',
    type: 'Water Monitor',
    status: 'Online',
    battery: 70,
    lastPing: '5 mins ago',
    location: 'Gate 11 Female',
    signalUptime: '99.8%'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'L-9021',
    timestamp: '2026-06-20 14:15',
    user: 'Alex Thompson',
    role: 'Ops Lead',
    action: 'Sensor Restart',
    details: 'Initiated SN-024 reset command on Terminal 2 - Gate 12 Male gateway'
  },
  {
    id: 'L-9020',
    timestamp: '2026-06-20 13:42',
    user: 'System Admin',
    role: 'Admin',
    action: 'Threshold Update',
    details: 'Increased warning WHI threshold configuration to 45 across all Terminal areas'
  },
  {
    id: 'L-9019',
    timestamp: '2026-06-20 13:10',
    user: 'Anita Sen',
    role: 'Operator',
    action: 'Incident Resolved',
    details: 'Marked incident #INC-2943 (Gate 4 Refill) as resolved in system'
  },
  {
    id: 'L-9018',
    timestamp: '2026-06-20 12:05',
    user: 'Alex Thompson',
    role: 'Ops Lead',
    action: 'Manual Sanitation Log',
    details: 'Logged manual verification and cleanup for Universal Restroom U02'
  }
];

export const mockReports: ReportFile[] = [
  {
    id: 'R-381',
    name: 'Monthly_Compliance_May.pdf',
    type: 'pdf',
    size: '4.2 MB',
    generated: '2h ago'
  },
  {
    id: 'R-382',
    name: 'Inventory_Usage_Q2.csv',
    type: 'csv',
    size: '850 KB',
    generated: 'yesterday'
  },
  {
    id: 'R-383',
    name: 'Terminal_2_Audit_Full.pdf',
    type: 'pdf',
    size: '12.4 MB',
    generated: '3 days ago'
  }
];

export const mockLiveFeed: LiveFeedItem[] = [
  {
    id: 'feed-1',
    zone: 'Zone B - Gate 12 (Male)',
    whi: 42,
    status: 'critical',
    message: 'High odor detection & empty soap dispensers.',
    time: '2 mins ago'
  },
  {
    id: 'feed-2',
    zone: 'Zone A - Arrival Hall',
    whi: 94,
    status: 'optimal',
    message: 'Optimal hygiene conditions confirmed.',
    time: '15 mins ago'
  },
  {
    id: 'feed-3',
    zone: 'Zone C - Food Court (North)',
    whi: 68,
    status: 'fair',
    message: 'Heavy traffic. Cleaning scheduled in 10m.',
    time: '18 mins ago'
  },
  {
    id: 'feed-4',
    zone: 'Zone B - Gate 4',
    whi: 88,
    status: 'optimal',
    message: 'Restocking complete.',
    time: '24 mins ago'
  }
];
