import Link from 'next/link';
import { Plus, LayoutDashboard, Briefcase, LogOut, User } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showDashboard?: boolean;
  showBrowseJobs?: boolean;
}

export function AppHeader({
  title = 'JobBoard',
  subtitle = 'Find your next opportunity',
  showDashboard = true,
  showBrowseJobs = false,
}: AppHeaderProps) {
  const { user, signOut } = useAuth();
  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {title}
            </Link>
            <p className="text-gray-600 mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/jobs/new"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Post a Job
                </Link>
                {showDashboard && (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2.5 rounded-lg hover:bg-gray-50"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                {showBrowseJobs && (
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2.5 rounded-lg hover:bg-gray-50"
                  >
                    <Briefcase className="w-4 h-4" />
                    Browse Jobs
                  </Link>
                )}
                <div className="flex items-center gap-2 text-gray-600 px-3 py-2.5">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <button
                  onClick={signOut}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-2.5 rounded-lg hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2.5 rounded-lg hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  <User className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
