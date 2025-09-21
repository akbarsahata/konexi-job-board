import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const jobType = pgEnum('job_type', [
  'Full-Time',
  'Part-Time',
  'Contract',
]);

export const jobs = pgTable('jobs', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  title: text().notNull(),
  company: text().notNull(),
  description: text().notNull(),
  location: text().notNull(),
  type: jobType().notNull(),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});
