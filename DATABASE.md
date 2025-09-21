# Database Setup Guide

## Prerequisites

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your database credentials from the Supabase dashboard

## Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   - `DATABASE_URL`: Your PostgreSQL connection string from Supabase Settings > Database
   - `NEXT_PUBLIC_SUPABASE_URL`: Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (keep secret)

## Database Scripts

- `pnpm db:generate` - Generate migration files from schema changes
- `pnpm db:migrate` - Apply migrations to the database
- `pnpm db:push` - Push schema changes directly to database (dev only)
- `pnpm db:pull` - Pull/introspect existing schema from database
- `pnpm db:studio` - Open Drizzle Studio for database visualization

## Initial Setup

1. Pull existing schema from Supabase:
   ```bash
   pnpm db:pull
   ```

2. Generate initial migration:
   ```bash
   pnpm db:generate
   ```

3. Push schema to database:
   ```bash
   pnpm db:push
   ```

## Schema

The database includes:
- `users` table (extends Supabase auth.users)
- `jobs` table with job postings
- `job_type` enum for job types (full-time, part-time, contract)