import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const jobTypeEnum = pgEnum("job_type", [
  "Full-Time",
  "Part-Time",
  "Contract",
]);

// Tables
export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  type: jobTypeEnum("type").notNull(),
  userId: uuid("user_id").notNull(), // Reference to Supabase auth user
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

// Zod schemas for validation
export const insertJobSchema = createInsertSchema(jobs, {
  title: z
    .string()
    .min(1, "Job title is required")
    .max(100, "Job title must be less than 100 characters"),
  company: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be less than 5000 characters"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(100, "Location must be less than 100 characters"),
  type: z.enum(["Full-Time", "Part-Time", "Contract"]),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectJobSchema = createSelectSchema(jobs);
export const updateJobSchema = insertJobSchema.partial();

// Filter schema for job browsing
export const jobFilterSchema = z.object({
  location: z.string().optional(),
  type: z.enum(["Full-Time", "Part-Time", "Contract"]).optional(),
  search: z.string().optional(),
});

// Types
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type JobFilter = z.infer<typeof jobFilterSchema>;
export type UpdateJob = z.infer<typeof updateJobSchema>;
