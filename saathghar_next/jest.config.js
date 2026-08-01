const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/__tests__/e2e/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
