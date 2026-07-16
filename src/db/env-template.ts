/*
  ENVIRONMENT VARIABLES NEEDED FOR PRODUCTION DB
  Copy these to .env.local and fill in real values
  when connecting to Supabase / Postgres / PlanetScale

  # Database (Supabase)
  DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
  NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT].supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  SUPABASE_SERVICE_ROLE_KEY=eyJ...

  # Database (Direct Postgres)
  POSTGRES_HOST=localhost
  POSTGRES_PORT=5432
  POSTGRES_DB=aai_washroom
  POSTGRES_USER=postgres
  POSTGRES_PASSWORD=your_password

  # Clerk (already set)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
  CLERK_SECRET_KEY=sk_test_...
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/api/auth/redirect
  CLERK_WEBHOOK_SECRET=whsec_...

  # App
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  NODE_ENV=development
*/
export {}
