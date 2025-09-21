/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v11/router
 * @see https://trpc.io/docs/v11/procedures
 */
import { initTRPC, TRPCError } from '@trpc/server';
import { createClient } from '../lib/supabase/server';
import { db, type Db } from '../lib/db';
import { type User } from '@supabase/supabase-js';

/**
 * Create context for tRPC
 */
export async function createContext() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  return {
    db,
    user,
    supabase,
  };
}

export type Context = {
  db: Db;
  user: User | null;
  supabase: Awaited<ReturnType<typeof createClient>>;
};

const t = initTRPC.context<Context>().create();

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Protected procedure - requires authentication
 **/
export const protectedProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action',
    });
  }
  
  return opts.next({
    ctx: {
      ...ctx,
      user: ctx.user, // user is now guaranteed to be non-null
    },
  });
});

export const router = t.router;
