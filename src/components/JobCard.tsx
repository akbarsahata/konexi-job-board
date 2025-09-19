'use client';

import Link from 'next/link';
import { Job } from '@/server/schema';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
              {job.title}
            </Link>
          </h3>
          <p className="text-lg text-gray-600">{job.company}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.type)}`}>
          {job.type}
        </span>
      </div>
      
      <p className="text-gray-600 mb-3 flex items-center">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {job.location}
      </p>
      
      <p className="text-gray-700 mb-4 line-clamp-3">
        {job.description.length > 150 
          ? `${job.description.substring(0, 150)}...` 
          : job.description}
      </p>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Posted {formatDate(new Date(job.createdAt))}
        </span>
        <Link
          href={`/jobs/${job.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}