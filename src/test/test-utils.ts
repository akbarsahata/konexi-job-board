import { vi } from 'vitest';
import type { Job, NewJob } from '../lib/schema';
import type { Db } from '../lib/db';

// Mock job data for testing
export const mockJob: Job = {
  id: 'test-job-id-123',
  title: 'Senior Software Engineer',
  company: 'Tech Corp',
  description: 'We are looking for a senior software engineer to join our team...',
  location: 'San Francisco, CA',
  type: 'Full-Time',
  userId: 'test-user-id-456',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

export const mockNewJob: NewJob = {
  title: 'Frontend Developer',
  company: 'StartupCorp',
  description: 'Join our exciting startup as a frontend developer...',
  location: 'Remote',
  type: 'Contract',
  userId: 'test-user-id-789',
};

export const mockJobs: Job[] = [
  mockJob,
  {
    id: 'test-job-id-456',
    title: 'Backend Developer',
    company: 'Enterprise Inc',
    description: 'Backend developer position with focus on scalability...',
    location: 'New York, NY',
    type: 'Part-Time',
    userId: 'test-user-id-789',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
  },
  {
    id: 'test-job-id-789',
    title: 'DevOps Engineer',
    company: 'Cloud Solutions',
    description: 'Looking for DevOps engineer with AWS experience...',
    location: 'Seattle, WA',
    type: 'Full-Time',
    userId: 'test-user-id-456',
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-17T12:00:00Z',
  },
];

// Mock database interface
export const createMockDb = (): Db => {
  const mockDb = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    set: vi.fn().mockReturnThis(),
  };

  return mockDb as unknown as Db;
};

// Helper to create mock query results
export const mockQueryResult = (result: any) => {
  return Promise.resolve(result);
};

// Mock Drizzle ORM functions
export const mockDrizzleORM = () => {
  vi.doMock('drizzle-orm', () => ({
    eq: vi.fn((field, value) => ({ type: 'eq', field, value })),
    and: vi.fn((...conditions) => ({ type: 'and', conditions })),
    like: vi.fn((field, pattern) => ({ type: 'like', field, pattern })),
    or: vi.fn((...conditions) => ({ type: 'or', conditions })),
  }));
};

// Helper to reset all mocks
export const resetAllMocks = () => {
  vi.clearAllMocks();
};