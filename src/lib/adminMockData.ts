import { Incident, Terminal, User, Device, AuditLog } from '@/types/admin';

export const initialIncidents: Incident[] = [
  {
    id: 'T2-M03',
    facilityId: 'W-T2-L1-N04',
    location: 'Terminal 2 - Level 1 North',
    priority: 'Critical',
    assignedTo: 'Rahul S. (Maintenance Team B)',
    timestamp: '10:15 AM',
    status: 'In Progress',
    device: 'Moisture Sensor MS-T2-09',
    category: 'Water Leakage / Flooding',
    description: 'Automated Sensor Trigger #WSH-T2-009A - Floor Moisture Critical. High potential of flooding near cubicle block B.',
    chats: [
      { sender: 'Rahul S.', role: 'Maintenance Lead', message: 'Arrived at Terminal 2. The leak is coming from the main supply valve behind stall 3. Shutting off the sub-valve now.', time: '10:25 AM' },
      { sender: 'Alex Chen', role: 'System Architect', message: 'Please verify if the water flow sensor is reporting correct shut-off metrics.', time: '10:27 AM' },
      { sender: 'Rahul S.', role: 'Maintenance Lead', message: 'Sub-valve successfully closed. Water flow has stopped. Cleanup crew is vacuuming the floor.', time: '10:32 AM' }
    ],
    timeline: [
      { title: 'Incident Reported', desc: 'Automated Sensor Trigger #WSH-T2-009A - Floor Moisture Critical.', time: '10:15 AM', status: 'reported' },
      { title: 'In Progress', desc: 'Maintenance Team B assigned and dispatched to Terminal 2.', time: '10:22 AM', status: 'in-progress' }
    ]
  },
  {
    id: 'T1-F02',
    facilityId: 'W-T1-GF-A02',
    location: 'Terminal 1 - Domestic Arrivals',
    priority: 'Urgent',
    assignedTo: 'Amit K. (Lead Supervisor)',
    timestamp: '09:46 AM',
    status: 'Open',
    device: 'Soap Dispenser Sensor SD-024',
    category: 'Consumables Depleted',
    description: 'Soap levels in female washroom arrivals cluster dropped below 10%. Requires immediate replenishment.',
    chats: [],
    timeline: [
      { title: 'Incident Reported', desc: 'Sensor SD-024 reported low soap volume (< 10%).', time: '09:46 AM', status: 'reported' }
    ]
  },
  {
    id: 'T3-M05',
    facilityId: 'W-T3-L2-G05',
    location: 'Terminal 3 - Gates Area',
    priority: 'Medium',
    assignedTo: 'Vikram S. (Facility Staff 04)',
    timestamp: '09:30 AM',
    status: 'In Progress',
    device: 'Ammonia Sensor NH3-T3-05',
    category: 'Sanitation Alert',
    description: 'Ammonia concentration exceeds threshold limit (50 ppm). Increased ventilation triggered.',
    chats: [
      { sender: 'Vikram S.', role: 'Janitor staff', message: 'Cleaned and deodorized the washroom. Vent speed set to maximum.', time: '09:38 AM' }
    ],
    timeline: [
      { title: 'Incident Reported', desc: 'Ammonia concentration threshold breach detected by NH3-T3-05.', time: '09:30 AM', status: 'reported' },
      { title: 'In Progress', desc: 'Janitorial staff dispatched for intensive cleaning cycle.', time: '09:32 AM', status: 'in-progress' }
    ]
  },
  {
    id: 'T2-F01',
    facilityId: 'W-T2-GF-D01',
    location: 'Terminal 2 - International Departures',
    priority: 'Low',
    assignedTo: 'Unassigned',
    timestamp: '08:55 AM',
    status: 'Open',
    device: 'Paper Towel Dispenser PT-112',
    category: 'Consumables Warning',
    description: 'Paper towel levels low in Stall 2. Added to queue for next routine round.',
    chats: [],
    timeline: [
      { title: 'Incident Reported', desc: 'Paper towel levels at 20%.', time: '08:55 AM', status: 'reported' }
    ]
  }
];

export const initialTerminals: Terminal[] = [
  {
    id: 'T-ALPHA-01',
    name: 'T-ALPHA-01',
    location: 'Primary Logistics Hub - East Wing',
    healthScore: 42,
    status: 'Critical',
    category: 'East Wing Logistics',
    assignedTechs: [
      { name: 'Rahul S.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPvXClbHAuR6f2VWHLIYIhO7_GK1HKlgysQ_gvo4WWtUUiCDxzcFvUeEj0YTVnap_NqDlNX1mDqRCWxNlaMgHO82dU33HlP95LVfufcBhi2RDGd1V1Q9pOhNLcrCuqSmA_42k0OG1dHq5c8rmUczHyk6naQgTTPQwR5HtzGZrXuON27J_nqKcqE7_o6HE5BTCDprXWc3DnKuA7N8BIjh1Yl6FTyEohYrAU3UAkkPpRyWfPgUneBoLgpSXu_gsPsH7YyCkUizMGwgC8' },
      { name: 'Amit K.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKGNjmlOpS2TkirJUwPejBzKhZzE_XwSGw443v_DzNMPPljRm7b8X-m5sOsGtCMlVQDMrzxJn44B_KsNiDtQFpRZUY6GHfRL_ZMWLy_8yckvnM796QURp38kvggBT80hWzRDvHtWjjCTTJZeLTHogEPW7S8os7ruIL0_efxOws1GObf1hEqu3Ci7muM94gc3ChBxNyHlJlVWDjqrnATYm-wndPFdrKrSRb1HrSWYEh5iuH7VI-AZDP37y5vfVJ6IKhgtay_kA2wWom' }
    ],
    lastCheck: '2 mins ago',
    sensors: {
      temperature: '24°C',
      humidity: '62%',
      ammonia: '45 ppm',
      odours: 'High Warning',
      usageCount: 142
    },
    cubicles: [
      { id: 'C1', name: 'Cubicle 1', type: 'Male', status: 'Occupied' },
      { id: 'C2', name: 'Cubicle 2', type: 'Male', status: 'Alert' },
      { id: 'C3', name: 'Cubicle 3', type: 'Male', status: 'Maintenance' },
      { id: 'C4', name: 'Cubicle 4', type: 'Female', status: 'Vacant' },
      { id: 'C5', name: 'Cubicle 5', type: 'Female', status: 'Occupied' },
      { id: 'C6', name: 'Cubicle 6', type: 'Disabled', status: 'Vacant' }
    ]
  },
  {
    id: 'T-BETA-02',
    name: 'T-BETA-02',
    location: 'West Concourse - Gate 14',
    healthScore: 98,
    status: 'Active',
    category: 'West Concourse',
    assignedTechs: [],
    lastCheck: '15 mins ago',
    sensors: {
      temperature: '21°C',
      humidity: '45%',
      ammonia: '8 ppm',
      odours: 'Normal',
      usageCount: 84
    },
    cubicles: [
      { id: 'C1', name: 'Cubicle 1', type: 'Male', status: 'Vacant' },
      { id: 'C2', name: 'Cubicle 2', type: 'Female', status: 'Occupied' },
      { id: 'C3', name: 'Cubicle 3', type: 'Disabled', status: 'Vacant' }
    ]
  },
  {
    id: 'T-GAMMA-03',
    name: 'T-GAMMA-03',
    location: 'Cargo Zone 4B',
    healthScore: 68,
    status: 'Maintenance',
    category: 'Cargo Zone',
    assignedTechs: [],
    lastCheck: '1 hour ago',
    sensors: {
      temperature: '26°C',
      humidity: '70%',
      ammonia: '18 ppm',
      odours: 'Moderate',
      usageCount: 220
    },
    cubicles: [
      { id: 'C1', name: 'Cubicle 1', type: 'Male', status: 'Maintenance' },
      { id: 'C2', name: 'Cubicle 2', type: 'Female', status: 'Maintenance' }
    ]
  },
  {
    id: 'T-DELTA-04',
    name: 'T-DELTA-04',
    location: 'Arrivals Lounge',
    healthScore: 92,
    status: 'Active',
    category: 'Arrivals',
    assignedTechs: [],
    lastCheck: '10 mins ago',
    sensors: {
      temperature: '22°C',
      humidity: '50%',
      ammonia: '12 ppm',
      odours: 'Normal',
      usageCount: 310
    },
    cubicles: [
      { id: 'C1', name: 'Cubicle 1', type: 'Male', status: 'Occupied' },
      { id: 'C2', name: 'Cubicle 2', type: 'Female', status: 'Vacant' }
    ]
  },
  {
    id: 'T-EPSILON-05',
    name: 'T-EPSILON-05',
    location: 'Security Checkpoint C',
    healthScore: 88,
    status: 'Active',
    category: 'Security Area',
    assignedTechs: [],
    lastCheck: '4 mins ago',
    sensors: {
      temperature: '23°C',
      humidity: '48%',
      ammonia: '15 ppm',
      odours: 'Normal',
      usageCount: 422
    },
    cubicles: [
      { id: 'C1', name: 'Cubicle 1', type: 'Male', status: 'Occupied' },
      { id: 'C2', name: 'Cubicle 2', type: 'Female', status: 'Occupied' }
    ]
  },
  {
    id: 'T-ZETA-06',
    name: 'T-ZETA-06',
    location: 'International Terminal B',
    healthScore: 64,
    status: 'Warning',
    category: 'International B',
    assignedTechs: [],
    lastCheck: '32 mins ago',
    sensors: {
      temperature: '25°C',
      humidity: '58%',
      ammonia: '28 ppm',
      odours: 'Moderate Warning',
      usageCount: 196
    },
    cubicles: [
      { id: 'C1', name: 'Cubicle 1', type: 'Male', status: 'Occupied' },
      { id: 'C2', name: 'Cubicle 2', type: 'Female', status: 'Alert' }
    ]
  },
  {
    id: 'T-ETA-07',
    name: 'T-ETA-07',
    location: 'VIP Terminal South',
    healthScore: 99,
    status: 'Active',
    category: 'VIP Lounge',
    assignedTechs: [],
    lastCheck: '5 mins ago',
    sensors: {
      temperature: '20°C',
      humidity: '42%',
      ammonia: '4 ppm',
      odours: 'Excellent',
      usageCount: 15
    },
    cubicles: [
      { id: 'C1', name: 'Cubicle 1', type: 'Male', status: 'Vacant' },
      { id: 'C2', name: 'Cubicle 2', type: 'Female', status: 'Vacant' }
    ]
  }
];

export const initialUsers: User[] = [
  {
    id: '1',
    name: 'Marcus Wainwright',
    email: 'm.wainwright@aerometric.com',
    role: 'ADMIN',
    location: 'Terminal 3 - Central Hub',
    status: 'Active',
    lastLogin: '2 mins ago',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA35vwMO1WQ6wyU_P7DY9Ho2qPy5zjrU362SzDAgZhHZ4loOGj1UJxAT7H1mWDPxuPd-K8B-kvZ8Cvhu8TKYk_t9TzPXVTAIwq3sTshXjDlpzG2BmhKbgGJtXzGPHa0OH1xF11RF9tC36oBF2ijM5psii9JQxIEbug0zQWgtbGh3bfrlxcbypIVyDIuKPMP8IKz-KAQlky03gHS5GyaxyWRlK2QL1kziNu5P0CszTFHSs8JFRbUYwURc_m7kpqrdNC32ECFXvJPs3s2'
  },
  {
    id: '2',
    name: 'Sarah Lin',
    email: 's.lin@aerometric.com',
    role: 'TERMINAL MANAGER',
    location: 'Terminal 1 - North Wing',
    status: 'Active',
    lastLogin: '14 Oct, 09:12',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF_6fxlr-8GZBzFjKJ2i-_EJqCEuQV0d2P6BBP-p22yRpBh-0X1deThxjxHblUZN4if9yggpqxxDNrSyy1RLTmZlnsH-kZWhmnikI06oupUHmrjs69_aezY7yNj-tHc4RB8Aj6UzHcivo8V2bOJSEa16rcTqc2l3smr1h7YOgyJeXiBsAPDLgKsqSnV6Ax42QA6AQ3eCZKgnb6mftNE-CMQbqeAYjyJEtHUksiX-HI5b9KY4TSUmUovkztksH3TryD2EGpwDvbINBc'
  },
  {
    id: '3',
    name: 'Robert Kowalski',
    email: 'r.kowalski@aerometric.com',
    role: 'MAINTENANCE STAFF',
    location: 'All Terminals - Ground',
    status: 'Inactive',
    lastLogin: '3 days ago',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfwmoS1chH0HBPfMkolBqRbQgxQSrBuw76wXqnMjiDrnd9Za6Q2zN2il6xu6xiEFnjtI-UADoqpjjP-Fz1MgbmFgYonUFo2ZyvZQfB0HfLUK75uhOJ-ZcCkysTXc4DLEEJ6i9jsabVtY7jJdJh1t2TNDWP0K6W_mqgWTtot3D6qCvGtk_Y--K_v1t9jLxEWQokbMPfTqb6yW1hE_PboRi2_1s7W6vXYQ0P-2lBrqoh5tB0k9HJHtAD9Rctf_XV8RmtNBp43FLkenub'
  },
  {
    id: '4',
    name: 'Elena Moretti',
    email: 'e.moretti@aerometric.com',
    role: 'TERMINAL MANAGER',
    location: 'Terminal 2 - South Wing',
    status: 'Active',
    lastLogin: '10 Oct, 18:30',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqOSXRZE-abMaBLWixal-Btf6NxaHp493R2ZNplIf5RYYSAVIG0FOzDRRgCoakFKZESxG87zhtTtS-XIJT22v5Sg8mn1MCQgx7efIORSdIloi2oLoomQCKSIP9_YtAFjVlM3bPjjpOY3QfJsGlx9QbJyupZdQ3Y2sosokFnbDfKgZsy4J2angSFc99nJ2O-x7qc642lwyMNFbhsDyrGz01FN26agTcll7DzvhnUJFIzKXOCSdheF8XgJMOCsPezntQL3qRDIcmPjsa'
  }
];

export const initialDevices: Device[] = [
  { id: 'DEV-001', name: 'Moisture Sensor MS-T2-09', type: 'Moisture Sensor', terminal: 'Terminal 2', washroom: 'Level 1 North', status: 'Online', battery: 94, lastPing: '10 seconds ago' },
  { id: 'DEV-002', name: 'Soap Dispenser Sensor SD-024', type: 'Soap Volume Sensor', terminal: 'Terminal 1', washroom: 'Domestic Arrivals', status: 'Online', battery: 78, lastPing: '1 min ago' },
  { id: 'DEV-003', name: 'Ammonia Sensor NH3-T3-05', type: 'Air Quality (NH3)', terminal: 'Terminal 3', washroom: 'Gates Area', status: 'Online', battery: 85, lastPing: '30 seconds ago' },
  { id: 'DEV-004', name: 'Paper Towel Sensor PT-112', type: 'Consumables Volume', terminal: 'Terminal 2', washroom: 'International Departures', status: 'Online', battery: 92, lastPing: '3 mins ago' },
  { id: 'DEV-005', name: 'Flush Valve Sensor FV-01', type: 'Flow Metric Sensor', terminal: 'Terminal 2', washroom: 'Level 1 North', status: 'Offline', battery: 0, lastPing: '2 hours ago' },
  { id: 'DEV-006', name: 'Odour Sensor OD-105', type: 'VOC Gas Sensor', terminal: 'Terminal 1', washroom: 'North Wing', status: 'Maintenance', battery: 45, lastPing: 'Just Now' }
];

export const initialAuditLogs: AuditLog[] = [
  { id: 'LOG-881', timestamp: '19-06-2026 10:22:15', user: 'Rahul S.', role: 'Maintenance Lead', action: 'Incident Status Update', target: 'Incident T2-M03 (In Progress)', status: 'Success', ipAddress: '192.168.4.12' },
  { id: 'LOG-880', timestamp: '19-06-2026 10:15:30', user: 'System Sensor', role: 'IoT Gateway', action: 'Critical Alert Triggered', target: 'W-T2-L1-N04 Floor Moisture', status: 'Warning', ipAddress: '10.0.12.89' },
  { id: 'LOG-879', timestamp: '19-06-2026 09:46:00', user: 'System Sensor', role: 'IoT Gateway', action: 'Alert Triggered', target: 'SD-024 Low Consumable', status: 'Success', ipAddress: '10.0.12.92' },
  { id: 'LOG-878', timestamp: '19-06-2026 09:12:00', user: 'Sarah Lin', role: 'Terminal Manager', action: 'User Authenticated', target: 'Login Session Portal', status: 'Success', ipAddress: '192.168.2.45' },
  { id: 'LOG-877', timestamp: '19-06-2026 08:30:10', user: 'Marcus Wainwright', role: 'System Admin', action: 'Configuration Modified', target: 'Settings Sensor Thresholds', status: 'Success', ipAddress: '192.168.1.100' },
  { id: 'LOG-876', timestamp: '18-06-2026 23:11:42', user: 'Elena Moretti', role: 'Terminal Manager', action: 'Exported Analytics Report', target: 'Weekly Traffic Report', status: 'Success', ipAddress: '192.168.3.11' }
];
