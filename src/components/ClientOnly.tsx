'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function ClientOnlyComponent({ children }: ClientOnlyProps) {
  return <>{children}</>;
}

export const ClientOnly = dynamic(() => Promise.resolve(ClientOnlyComponent), {
  ssr: false,
});