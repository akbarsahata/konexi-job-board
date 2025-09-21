'use client';

import Link from 'next/link';
import { MapPin, Clock, Building2, Calendar, ArrowRight } from 'lucide-react';
import type { Job } from '../lib/schema';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'Full-Time':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Part-Time':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Contract':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-gray-200 transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <Link 
            href={`/jobs/${job.id}`}
            className="block"
          >
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
              {job.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <p className="text-gray-600 font-medium">{job.company}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getJobTypeColor(job.type)} whitespace-nowrap ml-3`}>
          {job.type}
        </span>
      </div>
      
      {/* Metadata */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(job.createdAt)}</span>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
        {job.description.length > 120 
          ? `${job.description.substring(0, 120)}...` 
          : job.description
        }
      </p>
      
      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <Link 
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:gap-3 transition-all duration-200"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}