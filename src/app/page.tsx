import { Header } from '@/components/Header';
import { JobList } from '@/components/JobList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing job opportunities from top companies
          </p>
        </div>
        
        <JobList />
      </main>
    </div>
  );
}
