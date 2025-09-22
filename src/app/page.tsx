'use client';

import { AlertCircle, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AppHeader } from '~/components/AppHeader';
import { JobCard } from '../components/JobCard';
import { JobFilters } from '../components/JobFilters';
import { trpc } from '../utils/trpc';

export const metadata = {
  title: 'JobBoard - Find Your Next Opportunity',
  description:
    'Discover amazing job opportunities from top companies. Browse and apply to jobs that match your skills and interests.',
};

export default function HomePage() {
  const [filters, setFilters] = useState<{
    location?: string;
    type?: 'Full-Time' | 'Part-Time' | 'Contract';
    search?: string;
  }>({});

  const { data: jobs, isLoading, error } = trpc.jobs.getAll.useQuery(filters);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <AppHeader
        title="JobBoard"
        subtitle="Find your next opportunity"
        showDashboard={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
          <p className="text-lg text-gray-600">
            Discover amazing opportunities from top companies
          </p>
        </div>

        <JobFilters onFiltersChange={setFilters} />

        {!isLoading && jobs && (
          <div className="mb-6">
            <p className="text-gray-600 text-lg">
              {jobs.length === 0
                ? 'No jobs found matching your criteria'
                : `${jobs.length} job${jobs.length === 1 ? '' : 's'} found`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg mb-4 w-2/3"></div>
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">
                  Error loading jobs
                </h3>
                <div className="mt-2 text-red-700">
                  <p>
                    There was an error loading the job listings. Please try
                    again later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && jobs && (
          <>
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Try adjusting your search criteria or check back later for new
                  opportunities.
                </p>
                <Link
                  href="/jobs/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Post the first job
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
