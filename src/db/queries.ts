'use server'

import { db } from './client'
import {
  terminals, incidents, appUsers, auditLogs, systemLogs, systemSettings, reports,
  washrooms, stalls, devices, whiSnapshots, heatmapZones
} from './schema'
import { eq, desc, asc, and, not, count, avg, sql } from 'drizzle-orm'

// ── CLERK ID TO DB USER ID RESOLVER ─────────────────────

export async function getDbUserIdByClerkId(clerkId: string | null | undefined): Promise<string | null> {
  if (!clerkId) return null
  const result = await db.select({ id: appUsers.id }).from(appUsers).where(eq(appUsers.clerkId, clerkId)).limit(1)
  return result[0]?.id ?? null
}

// ── TERMINALS ──────────────────────────────────────────

export async function getAllTerminals(): Promise<any[]> {
  return db.select().from(terminals).orderBy(asc(terminals.id))
}
export const getTerminals = getAllTerminals

export async function getTerminalById(id: string): Promise<any | null> {
  const result = await db.select().from(terminals).where(eq(terminals.id, id)).limit(1)
  return result[0] || null
}

// ── WASHROOMS ───────────────────────

export async function getAllWashrooms(): Promise<any[]> {
  const list = await db.select().from(washrooms).orderBy(asc(washrooms.id))
  return list.map((w: any) => ({
    id: w.id,
    name: w.name,
    status: w.status,
    occupancy: w.occupancy,
    whi: parseFloat(w.whi),
    lastCleaned: w.lastCleaned?.toISOString() || ''
  }))
}
export const getWashrooms = getAllWashrooms

export async function getWashroomsByTerminal(terminalId: string): Promise<any[]> {
  const list = await db.select().from(washrooms).where(eq(washrooms.terminalId, terminalId)).orderBy(asc(washrooms.id))
  return list.map((w: any) => ({
    id: w.id,
    name: w.name,
    status: w.status,
    occupancy: w.occupancy,
    whi: parseFloat(w.whi),
    lastCleaned: w.lastCleaned?.toISOString() || ''
  }))
}

// ── STALLS ──────────────────────────

export async function getAllStalls(): Promise<any[]> {
  return db.select().from(stalls).orderBy(asc(stalls.id))
}

export async function getStallsByWashroom(washroomId: string): Promise<any[]> {
  return db.select().from(stalls).where(eq(stalls.washroomId, washroomId)).orderBy(asc(stalls.id))
}

// ── DEVICES ─────────────────────────

export async function getAllDevices(): Promise<any[]> {
  return db.select().from(devices).orderBy(asc(devices.id))
}
export const getDevices = getAllDevices

export async function getDevicesByStatus(status: string): Promise<any[]> {
  return db.select().from(devices).where(eq(devices.status, status.toUpperCase())).orderBy(asc(devices.id))
}

export async function getDevicesByTerminal(terminalId: string): Promise<any[]> {
  return db.select().from(devices).where(eq(devices.terminalId, terminalId)).orderBy(asc(devices.id))
}

export async function getDeviceStats(): Promise<any[]> {
  const list = await db.select().from(devices)
  const online = list.filter((d: any) => d.status === 'ONLINE').length
  const offline = list.filter((d: any) => d.status === 'OFFLINE').length
  const maintenance = list.filter((d: any) => d.status === 'MAINTENANCE').length
  return [
    { name: 'ONLINE', value: online },
    { name: 'OFFLINE', value: offline },
    { name: 'MAINTENANCE', value: maintenance }
  ]
}

// ── INCIDENTS ──────────────────────────────────────────

export async function getIncidents(): Promise<any[]> {
  const list = await db.select().from(incidents).orderBy(desc(incidents.created_at))
  return list.map((i: any) => ({
    id: String(i.id),
    title: i.title,
    severity: i.severity,
    status: i.status,
    terminal: i.terminal_id,
    assignedTo: i.assigned_to || 'Unassigned',
    timestamp: i.created_at.toISOString()
  }))
}

export async function getIncidentById(id: string): Promise<any | null> {
  const incidentId = parseInt(id)
  if (isNaN(incidentId)) return null
  const result = await db.select().from(incidents).where(eq(incidents.id, incidentId)).limit(1)
  if (!result[0]) return null
  const i = result[0]
  return {
    id: String(i.id),
    title: i.title,
    severity: i.severity,
    status: i.status,
    terminal: i.terminal_id,
    assignedTo: i.assigned_to || 'Unassigned',
    timestamp: i.created_at.toISOString()
  }
}

// ── APP USERS ──────────────────────────────────────────

export async function getAppUsers(): Promise<any[]> {
  const list = await db.select().from(appUsers)
  return list.map((u: any) => ({
    id: u.id,
    name: u.name,
    role: u.role,
    lastLogin: u.lastLogin?.toISOString() || new Date().toISOString(),
    status: u.status || 'ACTIVE',
    email: u.email
  }))
}

// ── AUDIT LOGS ─────────────────────────────────────────

export async function getAllAuditLogs(limit = 50): Promise<any[]> {
  const list = await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(limit)
  return list.map((l: any) => ({
    id: String(l.id),
    timestamp: l.timestamp?.toISOString() || new Date().toISOString(),
    action: l.action,
    userId: l.userId || '',
    ip: l.ipAddress || '',
    details: l.details || '',
    severity: l.severity || 'INFO',
    user: l.userId || ''
  }))
}
export const getAuditLogs = getAllAuditLogs

// ── SYSTEM LOGS ────────────────────────────────────────

export async function getAllSystemLogs(): Promise<any[]> {
  const list = await db.select().from(systemLogs).orderBy(desc(systemLogs.timestamp)).limit(50)
  return list.map((l: any) => ({
    id: String(l.id),
    timestamp: l.timestamp?.toISOString() || new Date().toISOString(),
    eventType: l.eventType,
    severity: l.severity || 'INFO',
    userId: l.userId || 'system',
    ip: l.ipAddress || '',
    details: l.details || ''
  }))
}
export const getSystemLogs = getAllSystemLogs

export async function getSystemLogsBySeverity(severity: string): Promise<any[]> {
  const list = await db.select().from(systemLogs).where(eq(systemLogs.severity, severity)).orderBy(desc(systemLogs.timestamp)).limit(50)
  return list.map((l: any) => ({
    id: String(l.id),
    timestamp: l.timestamp?.toISOString() || new Date().toISOString(),
    eventType: l.eventType,
    severity: l.severity || 'INFO',
    userId: l.userId || 'system',
    ip: l.ipAddress || '',
    details: l.details || ''
  }))
}

export async function getSystemLogStats(): Promise<any> {
  const list = await db.select().from(systemLogs)
  const critical = list.filter((l: any) => l.severity === 'CRITICAL').length
  const warning = list.filter((l: any) => l.severity === 'WARNING').length
  const info = list.filter((l: any) => l.severity === 'INFO').length
  const success = list.filter((l: any) => l.severity === 'SUCCESS').length
  return { critical, warning, info, success }
}

// ── WHI ─────────────────────────────

export async function getLatestWHI() {
  const res = await db.select().from(whiSnapshots).orderBy(desc(whiSnapshots.recordedAt)).limit(1)
  return res[0] || null
}

export async function getLiveWHI() {
  const res = await db.select().from(whiSnapshots).orderBy(desc(whiSnapshots.recordedAt)).limit(1)
  if (res[0]) {
    return { score: Math.round(parseFloat(res[0].score)) }
  }
  return { score: 82 }
}

export async function getWHITrend() {
  const list = await db.select().from(whiSnapshots).orderBy(asc(whiSnapshots.recordedAt)).limit(14)
  return list.map((s: any) => ({
    date: s.recordedAt ? new Date(s.recordedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '',
    whi: Math.round(parseFloat(s.score))
  }))
}

export async function getWashroomHealthChart() {
  const list = await db.select().from(washrooms)
  const good = list.filter((w: any) => parseFloat(w.whi) >= 75).length
  const fair = list.filter((w: any) => parseFloat(w.whi) >= 60 && parseFloat(w.whi) < 75).length
  const poor = list.filter((w: any) => parseFloat(w.whi) < 60).length
  return [
    { name: 'Good', value: good, color: '#22C55E' },
    { name: 'Fair', value: fair, color: '#EAB308' },
    { name: 'Poor', value: poor, color: '#EF4444' }
  ]
}

// ── HEATMAP ─────────────────────────

export async function getAllHeatmapZones(): Promise<any[]> {
  return db.select().from(heatmapZones).orderBy(asc(heatmapZones.id))
}
export const getHeatmapZones = getAllHeatmapZones

// ── SETTINGS ───────────────────────────────────────────

export async function getSystemSettings(): Promise<any> {
  const result = await db.select().from(systemSettings).limit(1)
  if (result[0]) {
    const s = result[0]
    return {
      id: s.id,
      ammoniaThreshold: s.ammoniaThreshold ?? 50,
      trafficLimitPerHour: s.trafficLimitPerHour ?? 200,
      whiAlertThreshold: s.whiAlertThreshold ?? 60,
      pingIntervalSeconds: s.pingIntervalSeconds ?? 30,
      emailAlerts: !!s.emailAlerts,
      smsAlerts: !!s.smsAlerts,
      autoEscalation: !!s.autoEscalation,
      updatedAt: s.updatedAt?.toISOString(),
      updatedBy: s.updatedBy || ''
    }
  }
  return {}
}

export async function updateSystemSettings(data: any): Promise<any[]> {
  const result = await db.select().from(systemSettings).limit(1)
  if (result[0]) {
    return db.update(systemSettings)
      .set({
        ammoniaThreshold: data.ammoniaThreshold ?? undefined,
        trafficLimitPerHour: data.trafficLimitPerHour ?? undefined,
        whiAlertThreshold: data.whiAlertThreshold ?? undefined,
        pingIntervalSeconds: data.pingIntervalSeconds ?? undefined,
        emailAlerts: data.emailAlerts !== undefined ? !!data.emailAlerts : undefined,
        smsAlerts: data.smsAlerts !== undefined ? !!data.smsAlerts : undefined,
        autoEscalation: data.autoEscalation !== undefined ? !!data.autoEscalation : undefined,
        updatedAt: new Date(),
        updatedBy: data.updatedBy ?? null
      })
      .where(eq(systemSettings.id, result[0].id))
      .returning()
  } else {
    return db.insert(systemSettings)
      .values({
        ammoniaThreshold: data.ammoniaThreshold ?? 50,
        trafficLimitPerHour: data.trafficLimitPerHour ?? 200,
        whiAlertThreshold: data.whiAlertThreshold ?? 60,
        pingIntervalSeconds: data.pingIntervalSeconds ?? 30,
        emailAlerts: data.emailAlerts !== undefined ? !!data.emailAlerts : true,
        smsAlerts: data.smsAlerts !== undefined ? !!data.smsAlerts : false,
        autoEscalation: data.autoEscalation !== undefined ? !!data.autoEscalation : true,
        updatedAt: new Date(),
        updatedBy: data.updatedBy ?? null
      })
      .returning()
  }
}

export async function getDashboardStats(): Promise<any> {
  const [tCount] = await db.select({ count: count() }).from(terminals)
  const [wCount] = await db.select({ count: count() }).from(washrooms)
  const [dCount] = await db.select({ count: count() }).from(devices).where(eq(devices.status, 'ONLINE'))
  const [iCount] = await db.select({ count: count() }).from(incidents).where(not(eq(incidents.status, 'RESOLVED')))
  const [cCount] = await db.select({ count: count() }).from(incidents).where(and(eq(incidents.severity, 'CRITICAL'), not(eq(incidents.status, 'RESOLVED'))))
  return {
    totalTerminals: Number(tCount?.count ?? 0),
    totalWashrooms: Number(wCount?.count ?? 0),
    onlineDevices: Number(dCount?.count ?? 0),
    openIncidents: Number(iCount?.count ?? 0),
    criticalAlerts: Number(cCount?.count ?? 0)
  }
}

export async function getPublicStats(): Promise<any> {
  const stats = await getDashboardStats()
  const whi = await getLiveWHI()
  return {
    totalAirports: 24,
    activeWashrooms: stats.totalWashrooms,
    sensorsOnline: stats.onlineDevices,
    avgWHIScore: String(whi.score)
  }
}

export async function getAllIncidents(): Promise<any[]> {
  const list = await db.select().from(incidents).orderBy(desc(incidents.created_at))
  return list.map((i: any) => ({
    id: i.incident_ref || String(i.id),
    incident_ref: i.incident_ref,
    title: i.title,
    description: i.description,
    severity: i.severity,
    status: i.status,
    terminalId: i.terminal_id,
    terminal_id: i.terminal_id,
    assignedTo: i.assigned_to,
    reportedBy: i.reported_by,
    createdAt: i.created_at,
    updatedAt: i.updated_at,
  }))
}

export async function getAllReports(limit = 50) {
  return db.select().from(reports)
    .orderBy(desc(reports.createdAt))
    .limit(limit)
}

export async function getReportsByUser(userId: string) {
  return db.select().from(reports)
    .where(eq(reports.generatedBy, userId))
    .orderBy(desc(reports.createdAt))
}

export async function createReport(data: {
  title: string
  type: string
  generatedBy?: string | null
  terminalId?: string | null
  summary?: string | null
  reportData?: Record<string, unknown> | null
}) {
  const id = `RPT-${Date.now()}`
  const inserted = await db.insert(reports).values({
    id,
    title:       data.title,
    type:        data.type,
    generatedBy: data.generatedBy ?? null,
    terminalId:  data.terminalId  ?? null,
    summary:     data.summary     ?? null,
    data:        data.reportData  ?? null,
    status:      'GENERATED',
    createdAt:   new Date(),
  }).returning()
  return inserted[0]
}
