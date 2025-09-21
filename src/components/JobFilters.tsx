'use client';

import { useState } from 'react';
import { Search, MapPin, Briefcase, X } from 'lucide-react';

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filter Jobs</h2>
        {(location || type || search) && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              placeholder="Enter location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Job Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Job Type
          </label>
          <div className="relative">
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm appearance-none bg-white"
            >
              <option value="">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}