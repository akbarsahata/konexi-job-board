import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getJobsByUserId,
  updateJob,
} from '../queries/jobs';
import {
  createMockDb,
  mockJob,
  mockJobs,
  mockNewJob,
  resetAllMocks,
} from './test-utils';

// Mock the schema
vi.mock('../lib/schema', () => ({
  jobs: {
    id: 'id',
    title: 'title',
    company: 'company',
    description: 'description',
    location: 'location',
    type: 'type',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
}));

// Mock drizzle-orm functions
vi.mock('drizzle-orm', () => ({
  eq: vi.fn((field, value) => ({ type: 'eq', field, value })),
  and: vi.fn((...conditions) => ({ type: 'and', conditions })),
  like: vi.fn((field, pattern) => ({ type: 'like', field, pattern })),
  or: vi.fn((...conditions) => ({ type: 'or', conditions })),
}));

describe('Jobs Queries', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDb: any;

  beforeEach(() => {
    mockDb = createMockDb();
    resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createJob', () => {
    it('should create a new job successfully', async () => {
      // Arrange
      const expectedJob = {
        ...mockNewJob,
        id: 'new-job-id',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      };
      mockDb.returning.mockResolvedValueOnce([expectedJob]);

      // Act
      const result = await createJob({ db: mockDb, job: mockNewJob });

      // Assert
      expect(mockDb.insert).toHaveBeenCalledTimes(1);
      expect(mockDb.values).toHaveBeenCalledWith(mockNewJob);
      expect(mockDb.returning).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedJob);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockDb.returning.mockRejectedValueOnce(dbError);

      // Act & Assert
      await expect(createJob({ db: mockDb, job: mockNewJob })).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('getAllJobs', () => {
    it('should return all jobs when no filters are provided', async () => {
      // Arrange
      mockDb.orderBy.mockResolvedValueOnce(mockJobs);

      // Act
      const result = await getAllJobs({ db: mockDb });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.from).toHaveBeenCalledTimes(1);
      expect(mockDb.orderBy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockJobs);
    });

    it('should return all jobs when filters object is provided but empty', async () => {
      // Arrange
      mockDb.orderBy.mockResolvedValueOnce(mockJobs);

      // Act
      const result = await getAllJobs({ db: mockDb, filters: {} });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.orderBy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockJobs);
    });

    it('should filter jobs by location', async () => {
      // Arrange
      const filteredJobs = mockJobs.filter(job =>
        job.location.includes('San Francisco')
      );
      mockDb.orderBy.mockResolvedValueOnce(filteredJobs);

      // Act
      const result = await getAllJobs({
        db: mockDb,
        filters: { location: 'San Francisco' },
      });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.where).toHaveBeenCalledTimes(1);
      expect(mockDb.orderBy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(filteredJobs);
    });

    it('should filter jobs by type', async () => {
      // Arrange
      const filteredJobs = mockJobs.filter(job => job.type === 'Full-Time');
      mockDb.orderBy.mockResolvedValueOnce(filteredJobs);

      // Act
      const result = await getAllJobs({
        db: mockDb,
        filters: { type: 'Full-Time' },
      });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.where).toHaveBeenCalledTimes(1);
      expect(mockDb.orderBy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(filteredJobs);
    });

    it('should filter jobs by search term', async () => {
      // Arrange
      const filteredJobs = mockJobs.filter(
        job =>
          job.title.includes('Engineer') ||
          job.company.includes('Engineer') ||
          job.description.includes('Engineer')
      );
      mockDb.orderBy.mockResolvedValueOnce(filteredJobs);

      // Act
      const result = await getAllJobs({
        db: mockDb,
        filters: { search: 'Engineer' },
      });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.where).toHaveBeenCalledTimes(1);
      expect(mockDb.orderBy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(filteredJobs);
    });

    it('should apply multiple filters simultaneously', async () => {
      // Arrange
      const filteredJobs = [mockJob]; // Only one job matches multiple criteria
      mockDb.orderBy.mockResolvedValueOnce(filteredJobs);

      // Act
      const result = await getAllJobs({
        db: mockDb,
        filters: {
          location: 'San Francisco',
          type: 'Full-Time',
          search: 'Software',
        },
      });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.where).toHaveBeenCalledTimes(1);
      expect(mockDb.orderBy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(filteredJobs);
    });

    it('should return empty array when no jobs match filters', async () => {
      // Arrange
      mockDb.orderBy.mockResolvedValueOnce([]);

      // Act
      const result = await getAllJobs({
        db: mockDb,
        filters: { location: 'Nonexistent City' },
      });

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getJobById', () => {
    it('should return a job when found', async () => {
      // Arrange
      mockDb.where.mockResolvedValueOnce([mockJob]);

      // Act
      const result = await getJobById({ db: mockDb, id: mockJob.id });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.where).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockJob);
    });

    it('should return null when job is not found', async () => {
      // Arrange
      mockDb.where.mockResolvedValueOnce([]);

      // Act
      const result = await getJobById({ db: mockDb, id: 'nonexistent-id' });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.where).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      // Arrange
      const dbError = new Error('Database query failed');
      mockDb.where.mockRejectedValueOnce(dbError);

      // Act & Assert
      await expect(getJobById({ db: mockDb, id: 'test-id' })).rejects.toThrow(
        'Database query failed'
      );
    });
  });

  describe('getJobsByUserId', () => {
    it('should return jobs for a specific user', async () => {
      // Arrange
      const userJobs = mockJobs.filter(
        job => job.userId === 'test-user-id-456'
      );
      mockDb.orderBy.mockResolvedValueOnce(userJobs);

      // Act
      const result = await getJobsByUserId({
        db: mockDb,
        userId: 'test-user-id-456',
      });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.where).toHaveBeenCalledTimes(1);
      expect(mockDb.orderBy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(userJobs);
    });

    it('should return empty array when user has no jobs', async () => {
      // Arrange
      mockDb.orderBy.mockResolvedValueOnce([]);

      // Act
      const result = await getJobsByUserId({
        db: mockDb,
        userId: 'user-with-no-jobs',
      });

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('updateJob', () => {
    const updates = {
      title: 'Updated Job Title',
      description: 'Updated description',
    };
    const userId = 'test-user-id-456';
    const jobId = 'test-job-id-123';

    it('should update a job successfully when user owns the job', async () => {
      // Arrange
      const updatedJob = {
        ...mockJob,
        ...updates,
        updatedAt: expect.any(String),
      };

      // Mock getJobById call
      mockDb.where.mockResolvedValueOnce([mockJob]);
      // Mock update call
      mockDb.returning.mockResolvedValueOnce([updatedJob]);

      // Act
      const result = await updateJob({
        db: mockDb,
        id: jobId,
        updates,
        userId,
      });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1); // getJobById call
      expect(mockDb.update).toHaveBeenCalledTimes(1);
      expect(mockDb.set).toHaveBeenCalledWith({
        ...updates,
        updatedAt: expect.any(String),
      });
      expect(mockDb.returning).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedJob);
    });

    it('should return null when job does not exist', async () => {
      // Arrange
      mockDb.where.mockResolvedValueOnce([]); // Job not found

      // Act
      const result = await updateJob({
        db: mockDb,
        id: 'nonexistent-id',
        updates,
        userId,
      });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1); // getJobById call
      expect(mockDb.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when user does not own the job', async () => {
      // Arrange
      const jobOwnedByOtherUser = { ...mockJob, userId: 'different-user-id' };
      mockDb.where.mockResolvedValueOnce([jobOwnedByOtherUser]);

      // Act
      const result = await updateJob({
        db: mockDb,
        id: jobId,
        updates,
        userId,
      });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1); // getJobById call
      expect(mockDb.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle partial updates', async () => {
      // Arrange
      const partialUpdates = { title: 'Only Title Updated' };
      const updatedJob = {
        ...mockJob,
        ...partialUpdates,
        updatedAt: expect.any(String),
      };

      mockDb.where.mockResolvedValueOnce([mockJob]);
      mockDb.returning.mockResolvedValueOnce([updatedJob]);

      // Act
      const result = await updateJob({
        db: mockDb,
        id: jobId,
        updates: partialUpdates,
        userId,
      });

      // Assert
      expect(mockDb.set).toHaveBeenCalledWith({
        ...partialUpdates,
        updatedAt: expect.any(String),
      });
      expect(result).toEqual(updatedJob);
    });
  });

  describe('deleteJob', () => {
    const userId = 'test-user-id-456';
    const jobId = 'test-job-id-123';

    it('should delete a job successfully when user owns the job', async () => {
      // Arrange
      mockDb.where.mockResolvedValueOnce([mockJob]); // getJobById call

      // Mock delete operation with rowCount
      const deleteResult = { rowCount: 1 };
      mockDb.delete.mockReturnThis();
      mockDb.where.mockResolvedValueOnce(deleteResult);

      // Act
      const result = await deleteJob({ db: mockDb, id: jobId, userId });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1); // getJobById call
      expect(mockDb.delete).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should return false when job does not exist', async () => {
      // Arrange
      mockDb.where.mockResolvedValueOnce([]); // Job not found

      // Act
      const result = await deleteJob({
        db: mockDb,
        id: 'nonexistent-id',
        userId,
      });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1); // getJobById call
      expect(mockDb.delete).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false when user does not own the job', async () => {
      // Arrange
      const jobOwnedByOtherUser = { ...mockJob, userId: 'different-user-id' };
      mockDb.where.mockResolvedValueOnce([jobOwnedByOtherUser]);

      // Act
      const result = await deleteJob({ db: mockDb, id: jobId, userId });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1); // getJobById call
      expect(mockDb.delete).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false when delete operation affects no rows', async () => {
      // Arrange
      mockDb.where.mockResolvedValueOnce([mockJob]); // getJobById call

      // Mock delete operation with no affected rows
      const deleteResult = { rowCount: 0 };
      mockDb.delete.mockReturnThis();
      mockDb.where.mockResolvedValueOnce(deleteResult);

      // Act
      const result = await deleteJob({ db: mockDb, id: jobId, userId });

      // Assert
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.delete).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('should handle undefined rowCount', async () => {
      // Arrange
      mockDb.where.mockResolvedValueOnce([mockJob]); // getJobById call

      // Mock delete operation with undefined rowCount
      const deleteResult = { rowCount: undefined };
      mockDb.delete.mockReturnThis();
      mockDb.where.mockResolvedValueOnce(deleteResult);

      // Act
      const result = await deleteJob({ db: mockDb, id: jobId, userId });

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty string parameters', async () => {
      // Arrange
      mockDb.where.mockResolvedValueOnce([]);

      // Act
      const result = await getJobById({ db: mockDb, id: '' });

      // Assert
      expect(result).toBeNull();
    });

    it('should handle null/undefined parameters gracefully', async () => {
      // Arrange
      mockDb.where.mockResolvedValueOnce([]);

      // Act & Assert
      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getJobById({ db: mockDb, id: null as any })
      ).resolves.toBeNull();
    });

    it('should handle database timeout errors', async () => {
      // Arrange
      const timeoutError = new Error('Database timeout');
      mockDb.orderBy.mockRejectedValueOnce(timeoutError);

      // Act & Assert
      await expect(getAllJobs({ db: mockDb })).rejects.toThrow(
        'Database timeout'
      );
    });

    it('should handle SQL injection attempts safely', async () => {
      // Arrange
      const maliciousInput = "'; DROP TABLE jobs; --";
      mockDb.orderBy.mockResolvedValueOnce([]);

      // Act
      const result = await getAllJobs({
        db: mockDb,
        filters: { search: maliciousInput },
      });

      // Assert
      expect(mockDb.where).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });
});
