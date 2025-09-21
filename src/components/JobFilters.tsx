'use client';

import { useState } from 'react';

interface JobFiltersProps {
  onFiltersChange: (filters: {
    location?: string;
    type?: 'Full-Time' | 'Part-Time' | 'Contract';
    search?: string;
  }) => void;
}

export function JobFilters({ onFiltersChange }: JobFiltersProps) {
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'Full-Time' | 'Part-Time' | 'Contract' | ''>('');
  const [search, setSearch] = useState('');

  const handleFiltersChange = () => {
    onFiltersChange({
      location: location || undefined,
      type: type || undefined,
      search: search || undefined,
    });
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setTimeout(() => {
      onFiltersChange({
        location: value || undefined,
        type: type || undefined,
        search: search || undefined,
      });
    }, 300);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setTimeout(() => {
      onFiltersChange({
        location: location || undefined,
        type: type || undefined,
        search: value || undefined,
      });
    }, 300);
  };

  const clearFilters = () => {
    setLocation('');
    setType('');
    setSearch('');
    onFiltersChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Jobs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search jobs, companies..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            placeholder="Enter location..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Job Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Job Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => {
              const selectedType = e.target.value as 'Full-Time' | 'Part-Time' | 'Contract' | '';
              setType(selectedType);
              setTimeout(() => {
                onFiltersChange({
                  location: location || undefined,
                  type: selectedType || undefined,
                  search: search || undefined,
                });
              }, 0);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {(location || type || search) && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}