import { test as base } from '@playwright/test';

// Database fixture for isolated testing
export interface DatabaseFixture {
  clearDatabase: () => Promise<void>;
  seedTestData: () => Promise<void>;
}

// User fixture for authentication testing
export interface UserFixture {
  testUser: {
    email: string;
    password: string;
  };
  signUpUser: (email: string, password: string) => Promise<void>;
  signInUser: (email: string, password: string) => Promise<void>;
}

// For now, just export the base test and expect
export const test = base;
export { expect } from '@playwright/test';
