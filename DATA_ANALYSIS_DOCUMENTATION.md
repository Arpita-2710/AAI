# Data Analysis Documentation - AAI Smart Washroom Portal

This documentation outlines the parameters, modules, database structures, calculations, and data flows involved in data analysis, aggregations, and hygiene index monitoring within the `aai-unified-portal`.

---

## 1. Executive Summary

### Overall Purpose
The primary purpose of data analysis in the AAI Smart Washroom Portal is to translate real-time raw IoT sensor telemetry (ammonia levels, occupancy count, door status, soap percentages, etc.) into actionable facility management insights. It provides operators and administrators with key metrics like the **Washroom Hygiene Index (WHI)** to optimize cleaning schedules, detect system anomalies, trigger alerts, and track operational SLAs.

### High-Level Architecture
The system follows a modern telemetry pipeline structure:
1. **IoT Edge Layer**: Simulates/interfaces with chemical, load, and fill level sensors in physical washroom units.
2. **Persistence Layer**: Structured Postgres database powered by Neon Serverless and managed via Drizzle ORM.
3. **API & Aggregation Layer**: Next.js route handlers process incoming queries, calculate statistical summaries, query and group historic logs, and track open issues.
4. **Presentation & Dashboard Layer**: Recharts-powered graphs, heatmaps, and live stats widgets built with Next.js Client Components and tailwindcss.

### Complete Data Flow
```
[Sensor/API Data] ──> [Next.js Route Handlers / DB Seeders] ──> [Postgres Database] 
                              │                                     │
                              ▼                                     ▼
                      [Zustand Client Stores] ◄────────────── [Next.js APIs]
                              │
                              ▼
                      [Recharts Visualizations & Dashboard UI]
```

---

## 2. Data Analysis Modules

| Module | File Path | Purpose | Used By |
| ------ | --------- | ------- | ------- |
| **WHI Computations** | `src/db/seed.ts` | Performs local calculation of the Washroom Hygiene Index based on cleanliness, occupancy load, air quality, and consumables. | Database Seed Runner |
| **Dashboard Summary API** | `src/app/api/dashboard/summary/route.ts` | Aggregates system-wide statistics including total units, online/offline count, overall average WHI, terminal averages, incidents counts, and consumables levels. | Admin / Terminal Dashboard |
| **Incidents API** | `src/app/api/incidents/route.ts` | Filters, aggregates counts, and paginates system-wide manual and automated operational incidents. | Incident Monitoring Tables |
| **WHI History API** | `src/app/api/whi/history/route.ts` | Computes historical running averages of WHI scores grouped by date and filtered by terminal. | Admin / Terminal Trends Page |
| **Heatmap Processing** | `src/app/terminal/floor-heatmap/page.tsx` | Grouping, filtering, and averaging WHI scores on a per-floor and gender basis. | Operational Heatmap View |

---

## 3. Parameter Analysis

### Washroom Hygiene Index (WHI)
* **Source**: Calculated from multi-sensor variables (cleanliness, occupancy, consumables, and ammonia levels).
* **API endpoint**: `/api/dashboard/summary`, `/api/whi/history`
* **Database column**: `washroom_state.whi_score`, `whi_history.avg_whi`
* **Units**: Percent / Score (0 to 100)
* **Threshold values**: Critical: `< 60`, Fair: `60 - 75`, Good: `> 75`
* **Formula**:
  $$\text{WHI} = (\text{cleanliness\_score} \times 0.35) + ((100 - \text{occupancy\_load\_pct}) \times 0.20) + (\text{supply\_score} \times 0.25) + (\text{air\_score} \times 0.20)$$
* **Validation rules**: Must be a number between 0 and 100.
* **Why this parameter is analyzed**: Serves as the primary operational SLA KPI representing the sanitization state of a washroom.
* **Business purpose**: Minimizes passenger discomfort, flags overdue cleaning, and targets staff dispatching efficiently.

### Ammonia Level (NH3)
* **Source**: Chemical gas detection sensor.
* **API endpoint**: `/api/washrooms/[deviceId]`
* **Database column**: `washroom_state.ammonia_ppm`
* **Units**: PPM (parts per million)
* **Threshold values**: Alert Threshold: `> 50 ppm`
* **Validation rules**: Real number $\ge 0$
* **Why this parameter is analyzed**: Ammonia levels correlate directly with odor levels and biological waste accumulation.
* **Business purpose**: Triggers automatic ventilation and urgent housekeeping dispatch before passengers experience odor issues.

### Occupancy Count
* **Source**: Infrared doorway beam/counter or stall lock sensors.
* **API endpoint**: `/api/dashboard/summary`
* **Database column**: `washroom_state.occupancy_count`
* **Units**: Integer count
* **Threshold values**: Overcapacity when `occupancy_count > capacity`
* **Validation rules**: Non-negative integer.
* **Why this parameter is analyzed**: Measures physical facility usage density.
* **Business purpose**: Helps schedule cleaning frequencies proportional to actual foot traffic.

### Consumables (Soap, Paper, Sanitizer)
* **Source**: Ultrasonic/capacitive level sensors inside dispensers.
* **API endpoint**: `/api/dashboard/summary` (Low supply alerts)
* **Database column**: `washroom_state.soap_pct`, `washroom_state.paper_pct`, `washroom_state.sanitizer_pct`
* **Units**: Percent (0% to 100%)
* **Threshold values**: Low Supply: `< 20%`
* **Validation rules**: Real numbers in range `0 - 100`.
* **Why this parameter is analyzed**: Tracks the fill status of essential washroom supplies.
* **Business purpose**: Enables proactive replenishment before supplies empty completely, raising passenger satisfaction.

---

## 4. Where Data Analysis Happens

| File | Function | Analysis Performed | Input | Output | Reason |
| ---- | -------- | ------------------ | ----- | ------ | ------ |
| `src/db/seed.ts` | `localComputeWHI` | Weighted calculation of the Hygiene Index. | Cleanliness, occupancy, unit type, soap, paper, sanitizer, ammonia ppm | Number (0 - 100) | Generate mock data representing realistic operational states. |
| `src/app/api/dashboard/summary/route.ts` | `GET` | Aggregates system metrics, calculates average WHI, groups counts by terminal and status. | None (Queries DB) | JSON object containing counts, averages, and alerts | Feeds global stats cards and status breakdowns on the landing dashboard. |
| `src/app/api/whi/history/route.ts` | `GET` | Computes daily moving average of WHI scores. | Terminal ID, days parameter | JSON array of dates and daily average scores | Feeds trend charts mapping historical performance. |
| `src/app/api/incidents/route.ts` | `GET` | Incident counts and pagination filtering. | Terminal, severity, status, page, limit | JSON paginated list and total count | Tracks active operational workload. |
| `src/app/terminal/floor-heatmap/page.tsx` | `FloorHeatmap` | Filters units by gender and computes floor-wide average WHI. | Washroom array | Gender-filtered lists, average WHI, status lists | Renders a color-coded floor plan heatmap. |

---

## 5. Dashboard/Page-wise Data Analysis

| Page | Route | Data Displayed | Analysis Used | API Used | Backend Source |
| ---- | ----- | -------------- | ------------- | -------- | -------------- |
| **Main Landing Page** | `/` | Operational SLA scores, average WHI indicators | Read-only static averages | Static Mock Data | `src/lib/mockData.ts` |
| **Terminal Dashboard** | `/terminal/dashboard` | Live status monitoring, incidents counters, overall WHI system score | Real-time totals, status groups, severity checks | `/api/dashboard/summary` | `washroom_state`, `incidents`, `washroom_units` |
| **Washroom Detail** | `/terminal/washrooms/total-detail` | Ammonia levels, CO2, consumables metrics, battery status, and signal strength | Color-coded thresholds matching warning limits | `/api/washrooms/[deviceId]` | `washroom_state` |
| **Floor Heatmap** | `/terminal/floor-heatmap` | Floor maps of male, female, disabled, and staff toilets | Floor averages, count filters | `/api/terminals/[id]/levels/[level]/washrooms` | `washroom_units` inner-joined with `washroom_state` |
| **Incidents Monitor** | `/terminal/incidents` | Table list of open, in-progress, and resolved issues | Severity filtering and status tracking | `/api/incidents` | `incidents` table |
| **Audit Logs** | `/terminal/audit-log` | Log of user activities, actions, and security levels | User level sorting, security audit mapping | Custom component state | `auditLogs` table (mocked/rendered via client stores) |

---

## 6. Charts and Visualizations

### 1. Incidents Overview Area Chart
* **File name**: `src/components/admin/Charts.tsx`
* **Component**: `IncidentsOverviewLineChart`
* **Route**: `/terminal/dashboard`
* **Data source**: Hardcoded weekly incident trend array (Mocked)
* **API**: None (Local mock)
* **Calculation**: Daily incidence count mapping
* **Refresh mechanism**: Standard client-side reload

### 2. Washroom Health Donut Chart
* **File name**: `src/components/admin/Charts.tsx`
* **Component**: `WashroomHealthDonutChart`
* **Route**: `/terminal/dashboard`
* **Data source**: Hygiene state groups (Mocked)
* **Calculation**: Reducer summing total washrooms per category (`WHI > 75`, `60 - 75`, `< 60`)
* **Refresh mechanism**: Page refresh / state update

### 3. Washroom Health Trends Area Chart
* **File name**: `src/components/admin/Charts.tsx`
* **Component**: `WashroomHealthTrendsChart`
* **Route**: `/terminal/dashboard`
* **Data source**: Historical WHI dataset (Mocked)
* **Calculation**: Day-to-day timeline projection (14 days)
* **Refresh mechanism**: Client-side load

---

## 7. APIs Used for Data Analysis

| API | Method | Used In | Returns | Purpose |
| --- | ------ | ------- | ------- | ------- |
| `/api/dashboard/summary` | `GET` | Dashboard Stats Cards, Donut Chart | Summarized totals, system avg WHI, terminal scores, low supply count | Provides high-level operational overview at a glance. |
| `/api/whi/history` | `GET` | Trends Tab | Array of `{ date, avg_whi, terminal_id }` | Displays the historical running score charts. |
| `/api/incidents` | `GET` | Incident Tables | Paginated list of incidents and `total` count | Populates interactive queues. |
| `/api/terminals/[id]/levels/[level]/washrooms` | `GET` | Floor Heatmaps | Array of washrooms with active device states | Coordinates layout indicators. |

---

## 8. Backend Processing

### Database Seeder
* **File**: `src/db/seed.ts`
* **Function**: `localComputeWHI`
* **Input**: `{ cleanliness_score: number, occupancy_count: number, unit_type: string, soap_pct: number, paper_pct: number, sanitizer_pct: number, ammonia_ppm: number }`
* **Output**: `number` (Score in range 0 - 100)
* **Purpose**: Generates realistic WHI scores based on physical parameters during database provisioning.

### Dashboard Stats Aggregation
* **File**: `src/app/api/dashboard/summary/route.ts`
* **Function**: `GET`
* **Input**: Database query inputs
* **Output**: JSON object summarizing system health metrics
* **Purpose**: Performs DB-level average, filter, and count aggregations.

---

## 9. Database Analysis

### `whi_history`
* **Columns**: `id`, `device_id`, `date`, `avg_whi`, `min_whi`, `max_whi`, `total_occupancy_count`
* **Analytical fields**: `avg_whi`, `min_whi`, `max_whi`
* **Relationships**: References `washroom_units.device_id`
* **Query Purpose**: Holds daily pre-computed hygiene index intervals for fast trend plotting.

### `washroom_state`
* **Columns**: `device_id`, `updated_at`, `occupancy_status`, `occupancy_count`, `door_status`, `cleanliness_score`, `soap_pct`, `paper_pct`, `sanitizer_pct`, `ammonia_ppm`, `co2_ppm`, `humidity_pct`, `temp_celsius`, `battery_level`, `signal_strength`, `whi_score`
* **Analytical fields**: `whi_score`, `soap_pct`, `paper_pct`, `sanitizer_pct`, `ammonia_ppm`, `battery_level`
* **Query Purpose**: Contains the current real-time state of each IoT terminal.

---

## 10. Data Flow Detail

```
[IoT Sensor Nodes] (Cleanliness, Fill, Ammonia Levels)
        ↓
[Ingestion / API endpoint] (Data Validation & Formatting)
        ↓
[Hygiene Calculation Engine] (Weighted WHI Score Computation)
        ↓
[Relational Database] (Saves state to washroom_state / history to whi_history)
        ↓
[Backend API Handler] (Aggregates counts, checks low-supply alerts, filters by terminal)
        ↓
[Client Data Store] (Zustand Cache / React Query Hook Updates)
        ↓
[Visual Dashboard] (Recharts Area/Donut Graphs, Floor heatmaps)
```

---

## 11. Required Modules for Data Analysis

* **React Query (`@tanstack/react-query`)**: Handles caching, automatic refetching, and state management of fetched telemetry data on the frontend.
* **Zustand**: Manages local client state (e.g., active filters, selected terminal, and routing preferences).
* **Recharts**: Renders area, donut, and bar charts representing historical performance trends and severity breakdowns.
* **Drizzle ORM (`drizzle-orm`)**: Constructs query builders, aggregations (using `avg()`, `count()`), and conditional statements (using `and()`, `eq()`, `lt()`).

---

## 12. Calculations and Formulas

### Washroom Hygiene Index (WHI) Formula
* **Formula**:
  $$WHI = (\text{cleanliness\_score} \times 0.35) + ((100 - \text{occupancy\_load\_pct}) \times 0.20) + (\text{supply\_score} \times 0.25) + (\text{air\_score} \times 0.20)$$
* **Variables**:
  * $\text{occupancy\_load\_pct} = \min((\text{occupancy\_count} / \text{capacity}) \times 100, 100)$
  * $\text{supply\_score} = (\text{soap\_pct} + \text{paper\_pct} + \text{sanitizer\_pct}) / 3$
  * $\text{air\_score} = \max(0, 100 - \min((\text{ammonia\_ppm} / 50) \times 100, 100))$
* **Input**: Numeric sensor metrics
* **Output**: Real number (rounded to one decimal place)
* **File location**: `src/db/seed.ts`

---

## 13. Missing or Incomplete Analysis

* **Unused Legacy Seeding Utilities**: The seed configuration in `package.json` previously referenced `seed-runner.ts` and `reset-and-reseed.ts` which were outdated and caused schema conflicts. These have been bypassed in favor of `src/db/seed.ts`.
* **Mock Visualizations**: The Dashboard Charts (Incidents Area Chart, Donut Chart, and Trends Chart) in `src/components/admin/Charts.tsx` currently render static datasets rather than fetching dynamically from `/api/whi/history` or `/api/dashboard/summary`.
* **No Uptime SLA Analytics**: Uptime SLA metrics are shown as static (e.g., `99.98%`) and are not dynamically evaluated from sensor downtime or signal drops.

---

## 14. Recommendations

1. **Connect Charts to API Data**: Refactor `src/components/admin/Charts.tsx` to accept live data feeds from the respective API endpoints (using `@tanstack/react-query`) to show true operational trends instead of mock data.
2. **Compute WHI in Real-Time API**: Create a helper module `src/lib/whi.ts` exporting `computeWHI` so both database seed scripts and runtime sensor ingestion endpoints can compute the score using the exact same code, avoiding duplication.
3. **Database Indexing**: Add database indices on `washroom_state.whi_score` and `incidents.status` to ensure aggregate queries remain fast as telemetry volume grows.
