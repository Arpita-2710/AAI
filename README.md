# AAI Smart Washroom Unified Portal

A unified, production-ready Next.js application that consolidates 4 legacy, independent portals running on different ports into a single, unified workspace running on a single port (`3000`). Custom base64 encrypted session cookies are replaced by a secure Clerk Role-Based Access Control (RBAC) auth flow.

---

## 🏛️ Architecture Overview

### 1. Legacy Multi-Port Architecture
Previously, the system was split across four distinct servers on different ports:
- **Port 3000**: `login-portal` (gateway authentication)
- **Port 3001**: `frontend-next-replica-v3` (administrator dashboard)
- **Port 3002**: `frontend-next-replica` (terminal operations)
- **Port 3003**: `AUDIT_LOG` (security audit logger)

### 2. Unified Single-Port Architecture
The unified portal merges all views, components, and api routers into one Next.js App Router workspace running on **Port 3000**:
- **Authentication**: Handled via Clerk SDK.
- **RBAC**: Enforced server-side using Next.js Middleware and route guards.
- **Single Port**: Eliminates cross-port redirect latency and complex cookie decryption checks.

---

## 📂 Project Structure

```
aai-unified-portal/
├── src/
│   ├── app/
│   │   ├── admin/             # Administrator routes
│   │   │   ├── dashboard/     # Recharts KPIs, incidents dispatch
│   │   │   ├── analytics/     # WHI historical performance trends
│   │   │   ├── devices/       # Sensor hardware list
│   │   │   ├── incidents/     # Active incident reports
│   │   │   ├── terminals/     # Terminal block details
│   │   │   ├── users/         # Operator directory
│   │   │   ├── audit-logs/    # Monospace system log views
│   │   │   ├── settings/      # System threshold alerts config
│   │   │   ├── profile/       # Embedded Clerk UserProfile page
│   │   │   └── layout.tsx     # Admin-only server-side guard
│   │   ├── api/
│   │   │   ├── auth/redirect/ # Post-login role redirection handler
│   │   │   └── webhooks/clerk/# Clerk user sync event receiver
│   │   ├── audit/             # System auditor routes
│   │   ├── forbidden/         # 403 Forbidden page
│   │   ├── sign-in/           # Dynamic custom Clerk login container
│   │   ├── terminal/          # Terminal operator routes
│   │   │   ├── washrooms/     # Status check logs
│   │   │   ├── incidents/     # Operator incidents handling list
│   │   │   ├── device-status/ # Sensor logs
│   │   │   ├── floor-heatmap/ # Concourse 4x4 density grids
│   │   │   ├── live-whi/      # Radial WHI dial
│   │   │   ├── reports/       # Summaries & export CSV
│   │   │   ├── audit-log/     # Monospace local operation logs
│   │   │   └── settings/      # Sensor threshold config form
│   │   ├── unauthorized/      # Access mismatch warning comparison card
│   │   ├── globals.css        # Styles & custom scrollbars
│   │   └── layout.tsx         # Clerk and Tooltip providers layout wrapper
│   ├── components/
│   │   ├── admin/             # Charts, Heatmap, KPICard
│   │   ├── audit/             # LogsTable
│   │   ├── auth/              # RoleBadge, LiveRoleBadge
│   │   ├── shell/             # AppShell, Sidebar, Header
│   │   └── terminal/          # StallGrid, DeviceCard
│   ├── lib/
│   │   ├── mockData.ts        # Integrated mock data streams
│   │   └── utils.ts           # Status/severity classes mappings
│   ├── types/
│   │   └── index.ts           # Unified TypeScript definitions
│   └── middleware.ts          # Clerk authentication router
├── package.json
└── tsconfig.json
```

---

## 🔐 Authentication & RBAC Flow

1. **Sign-In**: The user signs in at `/sign-in`. The `LiveRoleBadge` previews their role based on the pattern they type.
2. **Dynamic Metadata Assigning**: Post-login, Next.js calls `/api/auth/redirect`. The API reads the username pattern and automatically updates the Clerk `publicMetadata` role if not already assigned.
3. **Redirection Route**:
   - `ADMIN` (`AP-xxx` pattern) ➔ Redirects to `/admin/dashboard`
   - `TERMINAL` (`TP-xxx` pattern) ➔ Redirects to `/terminal`
   - `AUDITOR` (`ALP-xxx` pattern) ➔ Redirects to `/audit`
4. **Middleware Protection**: `middleware.ts` guards all protected prefixes (`/admin`, `/terminal`, `/audit`). If a user attempts to access an unauthorized path, they are routed to `/unauthorized`.

---

## 🛠️ Development & Production Run Instructions

### 1. Environment Configurations
Create a `.env.local` file inside the `aai-unified-portal` directory:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/api/auth/redirect
CLERK_WEBHOOK_SECRET=whsec_...
```

### 2. Local Development
```bash
# Install dependencies
npm install

# Run dev server
npm run dev -- --port 3000
```

### 3. Production Build & Static Typing check
```bash
# Verify static typing
npx tsc --noEmit

# Compile build
npm run build
```

---

## 🔧 Troubleshooting & Common Issues

- **Port Conflict**: If Next.js runs on a port other than 3000 (e.g. 3001), ensure no legacy node server processes are still running on port 3000 (use `taskkill /F /IM node.exe`).
- **Prerender / Build Warning**: Ensure pages reading query parameters or calling `useSearchParams()` are wrapped in a `<Suspense>` boundary to prevent CSR bailout errors during static optimization.
