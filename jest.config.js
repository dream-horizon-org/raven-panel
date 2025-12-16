/** @type {import('jest').Config} */
module.exports = {
    roots: ['<rootDir>/src'],
  
    collectCoverageFrom: [
      'src/**/*.utils.ts',
      '!src/**/*.d.ts',
    ],
  
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
    testMatch: [
      '<rootDir>/src/**/*.utils.test.ts',
      '<rootDir>/src/**/*.utils.spec.ts',
    ],
  
    testEnvironment: 'jsdom',
  
    transform: {
      '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
    },
  
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    ],
  
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
    coverageDirectory: 'coverage',
  
    coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  
    resetMocks: true,
  
    clearMocks: true,
  };