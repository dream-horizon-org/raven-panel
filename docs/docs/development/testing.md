---
sidebar_position: 2
---

# Testing

Raven Panel uses Jest and React Testing Library for testing. This guide covers testing patterns and best practices.

## Test Setup

### Configuration

Tests are configured in `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
```

### Setup File

The `jest.setup.js` file configures testing utilities:

```javascript
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
});
```

## Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Run specific test file
yarn test journeyUtils.test.ts
```

## Test Organization

Tests are located in `src/__tests__/`:

```
src/__tests__/
├── journeyUtils.test.ts      # Journey utility functions
├── propertyTypeUtils.test.ts # Property type utilities
├── tenant.utils.test.ts      # Tenant utilities
└── validation.test.ts        # Form validation
```

## Testing Patterns

### Unit Testing Utilities

Test pure functions in isolation:

```typescript
// src/__tests__/journeyUtils.test.ts
import { 
  formatJourneyStatus,
  isJourneyEditable,
  calculateReach 
} from '../app/dashboard/create/utils/journeyUtils';

describe('journeyUtils', () => {
  describe('formatJourneyStatus', () => {
    it('should capitalize status', () => {
      expect(formatJourneyStatus('draft')).toBe('Draft');
      expect(formatJourneyStatus('active')).toBe('Active');
    });

    it('should handle undefined', () => {
      expect(formatJourneyStatus(undefined)).toBe('Unknown');
    });
  });

  describe('isJourneyEditable', () => {
    it('should return true for draft journeys', () => {
      expect(isJourneyEditable({ status: 'draft' })).toBe(true);
    });

    it('should return true for paused journeys', () => {
      expect(isJourneyEditable({ status: 'paused' })).toBe(true);
    });

    it('should return false for active journeys', () => {
      expect(isJourneyEditable({ status: 'active' })).toBe(false);
    });
  });
});
```

### Testing Validation

```typescript
// src/__tests__/validation.test.ts
import { validateJourneyForm } from '../app/dashboard/create/utils/validation';

describe('validateJourneyForm', () => {
  it('should require journey name', () => {
    const result = validateJourneyForm({ name: '' });
    expect(result.errors.name).toBe('Name is required');
  });

  it('should require at least one trigger', () => {
    const result = validateJourneyForm({ 
      name: 'Test',
      triggers: [] 
    });
    expect(result.errors.triggers).toBe('At least one trigger is required');
  });

  it('should pass with valid data', () => {
    const result = validateJourneyForm({
      name: 'Valid Journey',
      triggers: [{ eventName: 'page_view' }],
    });
    expect(result.valid).toBe(true);
  });
});
```

### Testing Type Utilities

```typescript
// src/__tests__/propertyTypeUtils.test.ts
import { 
  getOperatorsForType,
  formatPropertyValue 
} from '../app/dashboard/create/utils/propertyTypeUtils';

describe('propertyTypeUtils', () => {
  describe('getOperatorsForType', () => {
    it('should return string operators', () => {
      const operators = getOperatorsForType('string');
      expect(operators).toContain('equals');
      expect(operators).toContain('contains');
    });

    it('should return number operators', () => {
      const operators = getOperatorsForType('number');
      expect(operators).toContain('greater_than');
      expect(operators).toContain('less_than');
    });

    it('should return boolean operators', () => {
      const operators = getOperatorsForType('boolean');
      expect(operators).toEqual(['equals', 'not_equals']);
    });
  });
});
```

### Testing Components

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Wrapper with providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('JourneyCard', () => {
  const mockJourney = {
    id: '1',
    name: 'Test Journey',
    status: 'draft',
    createdAt: '2024-01-01T00:00:00Z',
  };

  it('should render journey name', () => {
    render(
      <JourneyCard journey={mockJourney} />,
      { wrapper: createWrapper() }
    );
    
    expect(screen.getByText('Test Journey')).toBeInTheDocument();
  });

  it('should show status badge', () => {
    render(
      <JourneyCard journey={mockJourney} />,
      { wrapper: createWrapper() }
    );
    
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('should call onEdit when edit button clicked', async () => {
    const onEdit = jest.fn();
    const user = userEvent.setup();

    render(
      <JourneyCard journey={mockJourney} onEdit={onEdit} />,
      { wrapper: createWrapper() }
    );

    await user.click(screen.getByRole('button', { name: /edit/i }));
    
    expect(onEdit).toHaveBeenCalledWith('1');
  });
});
```

### Mocking API Calls

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Create mock server
const server = setupServer(
  rest.get('/api/journeys', (req, res, ctx) => {
    return res(
      ctx.json({
        journeys: [
          { id: '1', name: 'Journey 1', status: 'active' },
          { id: '2', name: 'Journey 2', status: 'draft' },
        ],
        total: 2,
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('JourneyList', () => {
  it('should display journeys from API', async () => {
    render(<JourneyList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Journey 1')).toBeInTheDocument();
      expect(screen.getByText('Journey 2')).toBeInTheDocument();
    });
  });

  it('should handle API error', async () => {
    server.use(
      rest.get('/api/journeys', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<JourneyList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/error loading journeys/i)).toBeInTheDocument();
    });
  });
});
```

## Coverage

### Viewing Coverage Report

After running `yarn test:coverage`, open `coverage/lcov-report/index.html` in your browser.

### Coverage Thresholds

Configure minimum coverage in `jest.config.js`:

```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

## Best Practices

### Do

- ✅ Test behavior, not implementation
- ✅ Use descriptive test names
- ✅ Keep tests focused and small
- ✅ Use proper assertions
- ✅ Clean up after tests

### Don't

- ❌ Test implementation details
- ❌ Test third-party libraries
- ❌ Write flaky tests
- ❌ Over-mock dependencies
- ❌ Ignore test failures

