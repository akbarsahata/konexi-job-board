'use client';

import { useState } from 'react';
import { api } from '@/lib/providers';
import { JobCard } from './JobCard';
import { JobFilters } from './JobFilters';
import { JobFilter, Job } from '@/server/schema';

export function JobList() {
  const [filters, setFilters] = useState<JobFilter>({});
  
  const { data: jobs, isLoading, error } = api.job.getAll.useQuery(filters);

  const handleFiltersChange = (newFilters: JobFilter) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <JobFilters filters={filters} onFiltersChange={handleFiltersChange} />
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <JobFilters filters={filters} onFiltersChange={handleFiltersChange} />
        <div className="text-center py-12">
          <p className="text-red-600">Error loading jobs: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <JobFilters filters={filters} onFiltersChange={handleFiltersChange} />
      
      {jobs && jobs.length > 0 ? (
        <div className="grid gap-6">
          {jobs.map((job: Job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}