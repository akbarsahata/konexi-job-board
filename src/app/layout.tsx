'use client';

import { AppProgressProvider } from '@bprogress/next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from '../components/AuthProvider';
import { trpc, trpcClient } from '../utils/trpc';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <head>
        <title>Konexi JobBoard</title>
      </head>
      <body className="gradient-hero min-h-screen">
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AppProgressProvider
                height="3px"
                color="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                options={{ showSpinner: false }}
                shallowRouting
              >
                <Toaster richColors />
                {children}
              </AppProgressProvider>
            </AuthProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </body>
    </html>
  );
}
