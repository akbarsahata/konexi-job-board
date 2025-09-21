/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from '~/server/trpc';
import { appRouter } from '~/server/router';
import type { NextRequest } from 'next/server';

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type { AppRouter } from '~/server/router';

// App Router API handler
const handler = (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req,
    createContext: createContext,
  });
};

export { handler as GET, handler as POST };
