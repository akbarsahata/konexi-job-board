import { createTRPCRouter } from '../trpc';
import { jobRouter } from './job';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  job: jobRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;