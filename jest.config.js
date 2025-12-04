/** @type {import('jest').Config} */
module.exports = {
    roots: ['<rootDir>/src'],
  
    collectCoverageFrom: [
      'src/**/utils/**/*.ts',
      'src/**/hooks/**/*.ts',
      'src/**/services/**/*.ts',
      'src/lib/**/*.ts',
      'src/config/**/*.ts',
      '!src/**/*.d.ts',
      '!src/**/types/**',
    ],
  
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
      '<rootDir>/src/**/*.{spec,test}.{ts,tsx}',
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