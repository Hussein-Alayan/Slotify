module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    // Support for @ alias
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};