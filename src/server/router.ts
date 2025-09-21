import { z } from 'zod';
import { router, publicProcedure } from './trpc';
import { jobRouter } from './jobs';

export const appRouter = router({
  // Legacy greeting endpoint (keep for compatibility)
  greeting: publicProcedure
    .input(
      z.object({
        name: z.string().nullish(),
      }),
    )
    .query(({ input }) => {
      return {
        text: `hello ${input?.name ?? 'world'}`,
      };
    }),

  // Job board routes
  jobs: jobRouter,

  // Health check endpoint
  health: publicProcedure
    .query(() => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };
    }),
});

// Export type definition of API
export type AppRouter = typeof appRouter;