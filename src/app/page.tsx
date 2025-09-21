'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Home page - redirects to jobs listing
 */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to jobs page immediately
    router.replace('/jobs');
  }, [router]);

  // Show a brief loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to jobs...</p>
      </div>
    </div>
  );
}