'use client';

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
      <body className="bg-gray-50 min-h-screen">
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <>
                <Toaster richColors />
                {children}
              </>
            </AuthProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </body>
    </html>
  );
}
