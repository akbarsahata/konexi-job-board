# Konexi Job Board

A modern, full-stack job board application built with Next.js, tRPC, Drizzle ORM, and Supabase.

## Features

- **Browse Jobs**: Public job listings with filtering by location, type, and search
- **Authentication**: User signup and login via Supabase Auth
- **Post Jobs**: Authenticated users can create job postings
- **User Dashboard**: Manage your posted jobs (edit, delete)
- **Job Details**: Dedicated pages for each job posting
- **Type Safety**: End-to-end type safety with tRPC and Drizzle Zod

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript, TailwindCSS
- **Backend**: tRPC for API layer, Drizzle ORM for database operations
- **Database**: PostgreSQL with Drizzle migrations
- **Authentication**: Supabase Auth
- **Validation**: Zod with Drizzle Zod integration
- **Deployment**: Vercel-ready configuration

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   tRPC API      │    │   Database      │
│   (Next.js)     │◄──►│   (Type-safe)   │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • Job Listings  │    │ • Job Router    │    │ • Jobs Table    │
│ • Auth Pages    │    │ • Protected     │    │ • User Auth     │
│ • Dashboard     │    │   Procedures    │    │   (Supabase)    │
│ • Job Forms     │    │ • Validation    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── jobs/[id]/        # Job detail pages
│   ├── post-job/         # Job posting form
│   └── api/trpc/[trpc]/  # tRPC API endpoints
├── components/            # React components
│   ├── Header.tsx
│   ├── JobCard.tsx
│   ├── JobList.tsx
│   └── JobFilters.tsx
├── lib/                  # Utilities and configurations
│   ├── api.ts           # tRPC client setup
│   ├── providers.tsx    # React Query + tRPC providers
│   └── supabase/        # Supabase client configurations
└── server/              # Backend logic
    ├── db.ts           # Database connection
    ├── schema.ts       # Database schema and validation
    ├── trpc.ts         # tRPC setup and procedures
    └── routers/        # tRPC routers
        ├── index.ts    # Main router
        └── job.ts      # Job-related endpoints
```

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd konexi-job-board
pnpm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
# Database (use your Supabase database URL)
DATABASE_URL="postgresql://postgres.xxx:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Next.js
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Set Up Database

Generate and run database migrations:

```bash
# Generate migration files
pnpm db:generate

# Push schema to database
pnpm db:push
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Drizzle migration files
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## Database Schema

```sql
-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  type job_type NOT NULL, -- 'Full-Time' | 'Part-Time' | 'Contract'
  user_id UUID NOT NULL,  -- References Supabase auth.users
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## API Endpoints (tRPC)

- `job.getAll(filters?)` - Get all jobs with optional filtering
- `job.getById(id)` - Get job by ID
- `job.getUserJobs()` - Get current user's jobs (protected)
- `job.create(data)` - Create new job (protected)
- `job.update(id, data)` - Update job (protected, owner only)
- `job.delete(id)` - Delete job (protected, owner only)

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The application is configured to work seamlessly with Vercel's deployment system.

## What Would You Improve If Given More Time?

### Performance Optimizations
- Implement pagination for job listings
- Add infinite scrolling or virtual scrolling for large datasets
- Optimize images with Next.js Image component
- Implement proper caching strategies with React Query

### Enhanced Features
- **Job Applications**: Allow users to apply for jobs with resume upload
- **Company Profiles**: Dedicated company pages with multiple job listings
- **Advanced Search**: Full-text search with Elasticsearch or similar
- **Email Notifications**: Alert users about new jobs matching their criteria
- **Saved Jobs**: Allow users to bookmark interesting positions
- **Analytics Dashboard**: For employers to track application metrics

### User Experience
- **Mobile Responsiveness**: Enhanced mobile UI/UX
- **Dark Mode**: Theme switching capability
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Loading States**: Better skeleton screens and loading indicators

### Technical Improvements
- **Rate Limiting**: Implement API rate limiting for security
- **Error Boundaries**: Better error handling and user feedback
- **Testing**: Unit tests, integration tests, and E2E tests
- **Monitoring**: Error tracking with Sentry, analytics with Vercel Analytics
- **SEO**: Meta tags, structured data, sitemap generation

### Security & Compliance
- **Input Sanitization**: Prevent XSS attacks
- **GDPR Compliance**: Data privacy features
- **Content Moderation**: Automatic job posting review
- **Spam Prevention**: reCAPTCHA integration

### DevOps & Scaling
- **Database Optimization**: Indexes, query optimization
- **CDN**: Static asset optimization
- **Database Backup**: Automated backup strategies
- **Environment Management**: Staging environments
- **CI/CD**: Automated testing and deployment pipelines

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
