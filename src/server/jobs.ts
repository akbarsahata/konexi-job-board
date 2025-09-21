import { z } from 'zod';
import { router, publicProcedure } from './trpc';
import * as jobQueries from '../queries/jobs';

// Input validation schemas
const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company name is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['Full-Time', 'Part-Time', 'Contract']),
  userId: z.string().uuid(), // In real app, this would come from auth context
});

const updateJobSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  company: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  type: z.enum(['Full-Time', 'Part-Time', 'Contract']).optional(),
  userId: z.string().uuid(), // In real app, this would come from auth context
});

const jobFiltersSchema = z.object({
  location: z.string().optional(),
  type: z.enum(['Full-Time', 'Part-Time', 'Contract']).optional(),
  search: z.string().optional(),
});

const jobIdSchema = z.object({
  id: z.string().uuid(),
});

const userJobsSchema = z.object({
  userId: z.string().uuid(), // In real app, this would come from auth context
});

const deleteJobSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(), // In real app, this would come from auth context
});

export const jobRouter = router({
  // Create a new job (authenticated users only)
  create: publicProcedure
    .input(createJobSchema)
    .mutation(async ({ input, ctx }) => {
      return await jobQueries.createJob({
        db: ctx.db,
        job: input,
      });
    }),

  // Get all jobs with optional filtering (public)
  getAll: publicProcedure
    .input(jobFiltersSchema.optional())
    .query(async ({ input, ctx }) => {
      return await jobQueries.getAllJobs({
        db: ctx.db,
        filters: input,
      });
    }),

  // Get a single job by ID (public)
  getById: publicProcedure
    .input(jobIdSchema)
    .query(async ({ input, ctx }) => {
      return await jobQueries.getJobById({
        db: ctx.db,
        id: input.id,
      });
    }),

  // Get jobs by user ID (authenticated user's dashboard)
  getByUserId: publicProcedure
    .input(userJobsSchema)
    .query(async ({ input, ctx }) => {
      return await jobQueries.getJobsByUserId({
        db: ctx.db,
        userId: input.userId,
      });
    }),

  // Update a job (authenticated users only, own jobs only)
  update: publicProcedure
    .input(updateJobSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, userId, ...updates } = input;
      return await jobQueries.updateJob({
        db: ctx.db,
        id,
        updates,
        userId,
      });
    }),

  // Delete a job (authenticated users only, own jobs only)
  delete: publicProcedure
    .input(deleteJobSchema)
    .mutation(async ({ input, ctx }) => {
      return await jobQueries.deleteJob({
        db: ctx.db,
        id: input.id,
        userId: input.userId,
      });
    }),
});