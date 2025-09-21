'use client';

import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { JobCard } from '../../components/JobCard';
import { JobFilters } from '../../components/JobFilters';
import Link from 'next/link';

export default function JobsPage() {
  const [filters, setFilters] = useState<{
    location?: string;
    type?: 'Full-Time' | 'Part-Time' | 'Contract';
    search?: string;
  }>({});

  const { data: jobs, isLoading, error } = trpc.jobs.getAll.useQuery(filters);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link href="/" className="text-2xl font-bold text-gray-900">
                JobBoard
              </Link>
              <p className="text-gray-600 mt-1">Find your next opportunity</p>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/jobs/new"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Post a Job
              </Link>
              <Link 
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="text-gray-600 mt-2">
            Discover amazing opportunities from top companies
          </p>
        </div>

        {/* Filters */}
        <JobFilters onFiltersChange={setFilters} />

        {/* Results Summary */}
        {!isLoading && jobs && (
          <div className="mb-6">
            <p className="text-gray-600">
              {jobs.length === 0 
                ? 'No jobs found matching your criteria'
                : `${jobs.length} job${jobs.length === 1 ? '' : 's'} found`
              }
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading jobs</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>There was an error loading the job listings. Please try again later.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Grid */}
        {!isLoading && !error && jobs && (
          <>
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your search criteria or check back later for new opportunities.
                </p>
                <Link 
                  href="/jobs/new"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
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