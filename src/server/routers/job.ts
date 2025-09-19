import { z } from 'zod';
import { eq, and, ilike, or } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { jobs, insertJobSchema, updateJobSchema, jobFilterSchema } from '../schema';

export const jobRouter = createTRPCRouter({
  // Get all jobs with optional filtering (public)
  getAll: publicProcedure
    .input(jobFilterSchema)
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      
      let whereConditions = [];
      
      if (input.location) {
        whereConditions.push(ilike(jobs.location, `%${input.location}%`));
      }
      
      if (input.type) {
        whereConditions.push(eq(jobs.type, input.type));
      }
      
      if (input.search) {
        whereConditions.push(
          or(
            ilike(jobs.title, `%${input.search}%`),
            ilike(jobs.company, `%${input.search}%`),
            ilike(jobs.description, `%${input.search}%`)
          )
        );
      }
      
      const result = await db
        .select()
        .from(jobs)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(jobs.createdAt);
        
      return result;
    }),

  // Get job by ID (public)
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      
      const job = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, input.id))
        .limit(1);
        
      if (!job[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Job not found',
        });
      }
      
      return job[0];
    }),

  // Get user's jobs (protected)
  getUserJobs: protectedProcedure
    .query(async ({ ctx }) => {
      const { db, user } = ctx;
      
      const userJobs = await db
        .select()
        .from(jobs)
        .where(eq(jobs.userId, user.id))
        .orderBy(jobs.createdAt);
        
      return userJobs;
    }),

  // Create job (protected)
  create: protectedProcedure
    .input(insertJobSchema.omit({ userId: true }))
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      
      const newJob = await db
        .insert(jobs)
        .values({
          ...input,
          userId: user.id,
        })
        .returning();
        
      return newJob[0];
    }),

  // Update job (protected)
  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: updateJobSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      
      // Check if job exists and belongs to user
      const existingJob = await db
        .select()
        .from(jobs)
        .where(and(eq(jobs.id, input.id), eq(jobs.userId, user.id)))
        .limit(1);
        
      if (!existingJob[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Job not found or you do not have permission to edit it',
        });
      }
      
      const updatedJob = await db
        .update(jobs)
        .set({
          ...input.data,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(jobs.id, input.id))
        .returning();
        
      return updatedJob[0];
    }),

  // Delete job (protected)
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      
      // Check if job exists and belongs to user
      const existingJob = await db
        .select()
        .from(jobs)
        .where(and(eq(jobs.id, input.id), eq(jobs.userId, user.id)))
        .limit(1);
        
      if (!existingJob[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Job not found or you do not have permission to delete it',
        });
      }
      
      await db
        .delete(jobs)
        .where(eq(jobs.id, input.id));
        
      return { success: true };
    }),
});