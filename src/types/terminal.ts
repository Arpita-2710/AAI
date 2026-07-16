export interface Washroom {
  id: string;
  gender: 'Male' | 'Female' | 'Universal';
  level: string;
  whiScore: number;
  lastCleaned: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'CRITICAL';
  location: string;
  occupancy: number; // percentage
  odorLevel: 'Low' | 'Medium' | 'High';
  refillStatus: number; // percentage
}

export interface Incident {
  id: string;
  location: string;
  issue: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'Unassigned' | 'In Progress' | 'Resolved';
  time: string;
  assignedTo?: string;
  details?: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'Online' | 'Offline';
  battery: number;
  lastPing: string;
  location: string;
  signalUptime: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
}

export interface ReportFile {
  id: string;
  name: string;
  type: 'pdf' | 'csv' | 'xls';
  size: string;
  generated: string;
}

export interface LiveFeedItem {
  id: string;
  zone: string;
  whi: number;
  status: 'critical' | 'optimal' | 'fair';
  message: string;
  time: string;
}
