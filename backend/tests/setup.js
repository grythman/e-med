// Jest setup file
require('dotenv').config({ path: '.env.test' });

// Mock MongoDB connection
jest.mock('../config/database', () => ({
  connect: jest.fn(),
  connection: {
    readyState: 1,
  },
}));

// Mock Redis connection
jest.mock('../config/redis', () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  connect: jest.fn(),
}));

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

