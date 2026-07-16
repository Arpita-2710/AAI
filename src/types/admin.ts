export interface ChatMessage {
  sender: string;
  role: string;
  message: string;
  time: string;
  avatarUrl?: string;
}

export interface TimelineEvent {
  title: string;
  desc: string;
  time: string;
  status: string;
  icon?: string;
}

export interface Incident {
  id: string;
  facilityId: string;
  location: string;
  priority: 'Critical' | 'Urgent' | 'Medium' | 'Low';
  assignedTo: string;
  timestamp: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  device: string;
  category: string;
  description: string;
  chats: ChatMessage[];
  timeline: TimelineEvent[];
}

export interface Cubicle {
  id: string;
  name: string;
  type: 'Male' | 'Female' | 'Disabled';
  status: 'Occupied' | 'Vacant' | 'Maintenance' | 'Alert';
}

export interface Terminal {
  id: string;
  name: string;
  location: string;
  healthScore: number;
  status: 'Active' | 'Maintenance' | 'Warning' | 'Critical';
  category: string;
  assignedTechs: { name: string; avatar: string }[];
  lastCheck: string;
  sensors: {
    temperature: string;
    humidity: string;
    ammonia: string;
    odours: string;
    usageCount: number;
  };
  cubicles: Cubicle[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TERMINAL MANAGER' | 'MAINTENANCE STAFF';
  location: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin: string;
  avatarUrl: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  terminal: string;
  washroom: string;
  status: 'Online' | 'Offline' | 'Maintenance';
  battery: number;
  lastPing: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  target: string;
  status: 'Success' | 'Failed' | 'Warning';
  ipAddress: string;
}
