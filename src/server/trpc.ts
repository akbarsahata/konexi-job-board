import { initTRPC, TRPCError } from '@trpc/server';
import { createClient } from '@/lib/supabase/server';
import { db } from './db';

/**
 * Creates the tRPC context for the application.
 * This function is called for each request and provides
 * access to Supabase client and user information.
 */
export const createTRPCContext = async () => {
  try {
    // During build time, Supabase might not be available
    const supabase = await createClient();
    
    if (!supabase) {
      return {
        db,
        supabase: null,
        user: null,
      };
    }
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth error in tRPC context:', error);
    }
    
    return {
      db,
      supabase,
      user,
    };
  } catch (error) {
    console.error('Failed to create tRPC context:', error);
    return {
      db,
      supabase: null,
      user: null,
    };
  }
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  transformer: undefined, // Using default transformer since superjson isn't installed
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure that requires authentication
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // user is now guaranteed to be non-null
    },
  });
});