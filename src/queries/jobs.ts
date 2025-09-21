import { eq, and, like, or } from 'drizzle-orm';
import { jobs, type Job, type NewJob } from '../lib/schema';
import type { Db } from '../lib/db';

export async function createJob(args: { db: Db; job: NewJob }): Promise<Job> {
  const { db, job } = args;
  const [createdJob] = await db.insert(jobs).values(job).returning();
  return createdJob;
}

export async function getAllJobs(args: { 
  db: Db; 
  filters?: { 
    location?: string; 
    type?: string; 
    search?: string;
  };
}): Promise<Job[]> {
  const { db, filters } = args;
  
  if (!filters) {
    return await db.select().from(jobs).orderBy(jobs.createdAt);
  }
  
  const conditions = [];
  
  if (filters.location) {
    conditions.push(like(jobs.location, `%${filters.location}%`));
  }
  
  if (filters.type) {
    conditions.push(eq(jobs.type, filters.type as any));
  }
  
  if (filters.search) {
    conditions.push(
      or(
        like(jobs.title, `%${filters.search}%`),
        like(jobs.company, `%${filters.search}%`),
        like(jobs.description, `%${filters.search}%`)
      )
    );
  }
  
  if (conditions.length === 0) {
    return await db.select().from(jobs).orderBy(jobs.createdAt);
  }
  
  return await db
    .select()
    .from(jobs)
    .where(and(...conditions))
    .orderBy(jobs.createdAt);
}

export async function getJobById(args: { db: Db; id: string }): Promise<Job | null> {
  const { db, id } = args;
  const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
  return job || null;
}

export async function getJobsByUserId(args: { db: Db; userId: string }): Promise<Job[]> {
  const { db, userId } = args;
  return await db.select().from(jobs).where(eq(jobs.userId, userId)).orderBy(jobs.createdAt);
}

export async function updateJob(args: { 
  db: Db; 
  id: string; 
  updates: Partial<NewJob>;
  userId: string;
}): Promise<Job | null> {
  const { db, id, updates, userId } = args;
  
  // First verify the job belongs to the user
  const existingJob = await getJobById({ db, id });
  if (!existingJob || existingJob.userId !== userId) {
    return null;
  }
  
  const [updatedJob] = await db
    .update(jobs)
    .set({ ...updates, updatedAt: new Date().toISOString() })
    .where(and(eq(jobs.id, id), eq(jobs.userId, userId)))
    .returning();
    
  return updatedJob || null;
}

export async function deleteJob(args: { 
  db: Db; 
  id: string; 
  userId: string;
}): Promise<boolean> {
  const { db, id, userId } = args;
  
  // First verify the job belongs to the user
  const existingJob = await getJobById({ db, id });
  if (!existingJob || existingJob.userId !== userId) {
    return false;
  }
  
  const result = await db
    .delete(jobs)
    .where(and(eq(jobs.id, id), eq(jobs.userId, userId)));
    
  return (result.rowCount ?? 0) > 0;
}