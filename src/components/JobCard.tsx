'use client';

import Link from 'next/link';
import type { Job } from '../lib/schema';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'Full-Time':
        return 'bg-green-100 text-green-800';
      case 'Part-Time':
        return 'bg-blue-100 text-blue-800';
      case 'Contract':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link 
            href={`/jobs/${job.id}`}
            className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors"
          >
            {job.title}
          </Link>
          <p className="text-lg text-gray-600 mt-1">{job.company}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job.type)}`}>
          {job.type}
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDate(job.createdAt)}
        </div>
      </div>
      
      <p className="text-gray-700 line-clamp-3 mb-4">
        {job.description.length > 150 
          ? `${job.description.substring(0, 150)}...` 
          : job.description
        }
      </p>
      
      <div className="flex justify-between items-center">
        <Link 
          href={`/jobs/${job.id}`}
          className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}