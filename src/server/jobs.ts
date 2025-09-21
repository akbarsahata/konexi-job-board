import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from './trpc';
import * as jobQueries from '../queries/jobs';

// Input validation schemas
const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company name is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['Full-Time', 'Part-Time', 'Contract']),
});

const updateJobSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  company: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  type: z.enum(['Full-Time', 'Part-Time', 'Contract']).optional(),
});

const jobFiltersSchema = z.object({
  location: z.string().optional(),
  type: z.enum(['Full-Time', 'Part-Time', 'Contract']).optional(),
  search: z.string().optional(),
});

const jobIdSchema = z.object({
  id: z.string().uuid(),
});

const deleteJobSchema = z.object({
  id: z.string().uuid(),
});

export const jobRouter = router({
  // Create a new job (authenticated users only)
  create: protectedProcedure
    .input(createJobSchema)
    .mutation(async ({ input, ctx }) => {
      return await jobQueries.createJob({
        db: ctx.db,
        job: {
          ...input,
          userId: ctx.user.id,
        },
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

  // Get jobs by current user (authenticated user's dashboard)
  getMyJobs: protectedProcedure
    .query(async ({ ctx }) => {
      return await jobQueries.getJobsByUserId({
        db: ctx.db,
        userId: ctx.user.id,
      });
    }),

  // Update a job (authenticated users only, own jobs only)
  update: protectedProcedure
    .input(updateJobSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updates } = input;
      return await jobQueries.updateJob({
        db: ctx.db,
        id,
        updates,
        userId: ctx.user.id,
      });
    }),

  // Delete a job (authenticated users only, own jobs only)
  delete: protectedProcedure
    .input(deleteJobSchema)
    .mutation(async ({ input, ctx }) => {
      return await jobQueries.deleteJob({
        db: ctx.db,
        id: input.id,
        userId: ctx.user.id,
      });
    }),
});