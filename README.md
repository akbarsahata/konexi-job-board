# Mini Job Board Application

A full-stack job board web application built with Next.js, Supabase, and tRPC. This application allows companies to post job openings and enables users to browse and apply for positions.

## 🚀 Live Demo

**Production URL:** [https://konexi-job-board.vercel.app/](https://konexi-job-board.vercel.app/)

## ✨ Features

### Core Functionality

- **🔐 Authentication** - Secure user registration and login via Supabase Auth
- **💼 Job Posting** - Authenticated users can create job listings with detailed information
- **🔍 Job Browsing** - Public job listings with advanced filtering and search capabilities
- **📄 Job Details** - Dedicated pages for complete job information
- **📊 User Dashboard** - Manage posted jobs with edit and delete functionality

### Additional Features

- **🎨 Modern UI** - Clean, responsive design with Tailwind CSS
- **⚡ Real-time Updates** - Type-safe API calls with tRPC
- **🔒 Protected Routes** - Middleware-based authentication protection
- **📱 Mobile Responsive** - Optimized for all device sizes
- **🎯 Advanced Filtering** - Filter jobs by location, type, and search terms

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router)
- **Backend:** Supabase (PostgreSQL + Auth)
- **API Layer:** tRPC with React Query
- **Database ORM:** Drizzle ORM
- **Styling:** Tailwind CSS v4 + Lucide Icons
- **Language:** TypeScript
- **Deployment:** Vercel

## 📋 Requirements Met

✅ **Authentication** - Supabase Auth integration with signup/login  
✅ **Post Jobs** - Complete job creation form with validation  
✅ **Browse Jobs** - Public job listings with filtering  
✅ **Job Details** - Individual job pages with full information  
✅ **User Dashboard** - CRUD operations for user's job postings  
✅ **Next.js App Router** - Modern Next.js architecture  
✅ **Supabase Backend** - Database and authentication  
✅ **Vercel Deployment** - Live production application  
✅ **Tailwind CSS** - Modern, responsive styling  

## 🏗 Architecture Overview

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # User dashboard
│   ├── jobs/              # Job-related routes
│   │   ├── [id]/         # Job detail & edit pages
│   │   └── new/          # Job creation
│   ├── login/            # Authentication pages
│   └── signup/
├── components/           # Reusable React components
├── lib/                 # Database & utility configurations
│   ├── supabase/       # Supabase client & middleware
│   ├── db.ts           # Database connection
│   └── schema.ts       # Database schema
├── queries/            # Database query functions
├── server/             # tRPC router & procedures
└── utils/              # Utility functions & tRPC client
```

### Data Flow
1. **Authentication:** Supabase Auth handles user sessions
2. **API Layer:** tRPC provides type-safe API endpoints
3. **Database:** Drizzle ORM with PostgreSQL on Supabase
4. **State Management:** React Query for server state
5. **UI Updates:** Real-time data fetching and optimistic updates

### Key Design Decisions
- **tRPC:** Chosen for end-to-end type safety and excellent DX
- **Drizzle ORM:** Lightweight, type-safe database queries
- **App Router:** Leverages Next.js 13+ features for better performance
- **Middleware Auth:** Route protection at the edge for security
- **Component Architecture:** Modular, reusable components

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/akbarsahata/konexi-job-board.git
cd konexi-job-board
```

### 2. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URL (for Drizzle)
DATABASE_URL=your_postgresql_connection_string
```

### 4. Database Setup
The application uses the following database schema:

```sql
-- Jobs table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  type job_type NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Job type enum
CREATE TYPE job_type AS ENUM ('Full-Time', 'Part-Time', 'Contract');
```

### 5. Run Development Server
```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production
```bash
pnpm build
pnpm start
```

## 📱 Usage

### For Job Seekers
1. **Browse Jobs** - Visit the homepage to see all available positions
2. **Filter & Search** - Use filters to find jobs by location, type, or keywords
3. **View Details** - Click on any job to see complete information
4. **Apply** - Contact companies directly through job details

### For Employers
1. **Sign Up** - Create an account to start posting jobs
2. **Post Jobs** - Use the "Post a Job" button to create new listings
3. **Manage Jobs** - Access your dashboard to edit or delete postings
4. **Track Applications** - Monitor your job postings' performance

## 🔧 Development

### Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks
```

### Key Files
- `src/lib/schema.ts` - Database schema definitions
- `src/server/trpc.ts` - tRPC router configuration
- `middleware.ts` - Route protection logic
- `src/app/layout.tsx` - Root layout with providers

## 🎯 What Would You Improve If Given More Time?

### Enhanced Features
- **Email Notifications** - Notify users of new jobs matching their criteria
- **Advanced Search** - Full-text search with relevance scoring
- **Application Tracking** - Built-in application management system
- **Company Profiles** - Dedicated pages for company information
- **Salary Ranges** - Add salary information to job postings
- **Job Categories** - Organize jobs by industry/category
- **Favorites System** - Allow users to save interesting jobs
- **Application Analytics** - Dashboard insights for employers

### Technical Improvements
- **Image Uploads** - Company logos and job images via Supabase Storage
- **Real-time Features** - WebSocket notifications for new jobs
- **Caching Strategy** - Redis for improved performance
- **SEO Optimization** - Enhanced meta tags and structured data
- **A/B Testing** - Feature flag system for experimentation
- **Internationalization** - Multi-language support
- **API Rate Limiting** - Protect against abuse
- **Comprehensive Testing** - Unit, integration, and E2E tests

### User Experience
- **Advanced Filtering** - More granular filter options
- **Job Recommendations** - AI-powered job suggestions
- **Progressive Web App** - Offline support and mobile app features
- **Accessibility** - WCAG compliance improvements
- **Performance** - Image optimization and code splitting
- **Error Handling** - Better error boundaries and user feedback

### DevOps & Monitoring
- **Logging System** - Structured logging with monitoring
- **Performance Monitoring** - Real-time application insights
- **Database Optimization** - Query optimization and indexing
- **CI/CD Pipeline** - Automated testing and deployment
- **Security Audit** - Regular security assessments
- **Backup Strategy** - Automated database backups

## 📄 License

This project is MIT licensed.

## 👨‍💻 Author

Built by [Akbar Sahata](https://github.com/akbarsahata)

---

**Note:** This application was built as a take-home assignment demonstrating full-stack development skills with modern web technologies.
