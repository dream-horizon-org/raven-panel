---
sidebar_position: 3
---

# Testing

Raven uses Jest and React Testing Library for testing.

## Running Tests

```bash
yarn test              # Run all tests
yarn test:watch        # Run tests in watch mode
yarn test:coverage     # Run tests with coverage
yarn test filename.ts  # Run specific test file
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
import { formatJourneyStatus, isJourneyEditable } from '../utils/journeyUtils';

describe('journeyUtils', () => {
    it('should capitalize status', () => {
      expect(formatJourneyStatus('draft')).toBe('Draft');
      expect(formatJourneyStatus('active')).toBe('Active');
    });

    it('should return true for draft journeys', () => {
      expect(isJourneyEditable({ status: 'draft' })).toBe(true);
  });
});
```

### Testing Validation

```typescript
import { validateJourneyForm } from '../utils/validation';

describe('validateJourneyForm', () => {
  it('should require journey name', () => {
    const result = validateJourneyForm({ name: '' });
    expect(result.errors.name).toBe('Name is required');
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

### Testing Components

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('JourneyCard', () => {
  const mockJourney = { id: '1', name: 'Test Journey', status: 'draft' };

  it('should render journey name', () => {
    render(<JourneyCard journey={mockJourney} />, { wrapper: createWrapper() });
    expect(screen.getByText('Test Journey')).toBeInTheDocument();
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

Use MSW (Mock Service Worker) for API mocking:

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/journeys', (req, res, ctx) => {
    return res(ctx.json({ journeys: [{ id: '1', name: 'Journey 1' }] }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Coverage

After running `yarn test:coverage`, open `coverage/lcov-report/index.html` in your browser.

## Best Practices

**Do:**
- ✅ Test behavior, not implementation
- ✅ Use descriptive test names
- ✅ Keep tests focused and small
- ✅ Clean up after tests

**Don't:**
- ❌ Test implementation details
- ❌ Test third-party libraries
- ❌ Write flaky tests
- ❌ Over-mock dependencies

