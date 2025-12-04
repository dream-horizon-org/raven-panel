---
sidebar_position: 1
---

# Contributing

Thank you for your interest in contributing to Raven Panel! This guide will help you get started.

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build something great together.

## Getting Started

### 1. Fork the Repository

Click the "Fork" button on GitHub to create your own copy of the repository.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/raven-panel.git
cd raven-panel
```

### 3. Set Up the Development Environment

```bash
# Install dependencies
yarn install

# Start the development server
yarn dev
```

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## Development Workflow

### Branch Naming

Use descriptive branch names:

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/description` | `feature/journey-cloning` |
| Bug Fix | `fix/description` | `fix/cohort-selection-bug` |
| Refactor | `refactor/description` | `refactor/api-service-layer` |
| Docs | `docs/description` | `docs/add-api-reference` |
| Chore | `chore/description` | `chore/update-dependencies` |

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

**Examples:**

```bash
feat(journeys): add journey cloning functionality

fix(cohorts): resolve cohort selection dropdown not updating

docs(api): add API reference documentation

refactor(services): extract common API error handling

chore(deps): update TanStack Query to v5.90
```

### Making Changes

1. **Write code** following the style guide
2. **Add tests** for new functionality
3. **Update documentation** if needed
4. **Run linting** before committing

```bash
# Run linting
yarn lint

# Fix auto-fixable issues
yarn lint:fix

# Run tests
yarn test

# Type check
yarn app:check
```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` - use proper typing
- Export types alongside implementations

```typescript
// Good
export interface Journey {
  id: string;
  name: string;
  status: JourneyStatus;
}

export const fetchJourney = async (id: string): Promise<Journey> => {
  // implementation
};

// Bad - avoid any
const fetchJourney = async (id): any => {
  // implementation
};
```

### React Components

- Use functional components with hooks
- Keep components focused and small
- Co-locate styles with components

```tsx
// Good - focused component
function JourneyCard({ journey, onEdit, onDelete }: JourneyCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{journey.name}</Typography>
        <StatusBadge status={journey.status} />
      </CardContent>
      <CardActions>
        <Button onClick={onEdit}>Edit</Button>
        <Button onClick={onDelete}>Delete</Button>
      </CardActions>
    </Card>
  );
}
```

### File Organization

```
ComponentName/
├── ComponentName.tsx      # Main component
├── ComponentName.test.tsx # Tests
├── componentNameStyles.ts # Styles
├── types.ts               # Component-specific types
└── index.ts               # Exports
```

## Pull Request Process

### 1. Update Your Branch

Keep your branch up to date with main:

```bash
git fetch origin
git rebase origin/main
```

### 2. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 3. Create a Pull Request

- Use a descriptive title
- Fill out the PR template
- Link related issues
- Request reviews from maintainers

### PR Checklist

- [ ] Code follows the style guide
- [ ] Tests pass locally
- [ ] New functionality has tests
- [ ] Documentation updated (if needed)
- [ ] No linting errors
- [ ] TypeScript compiles without errors

### 4. Address Review Feedback

- Respond to all comments
- Make requested changes
- Push updates to the same branch

## Testing Guidelines

### Unit Tests

Test utilities and pure functions:

```typescript
// src/__tests__/journeyUtils.test.ts
import { formatJourneyStatus } from '../utils/journeyUtils';

describe('formatJourneyStatus', () => {
  it('should format draft status', () => {
    expect(formatJourneyStatus('draft')).toBe('Draft');
  });

  it('should format active status', () => {
    expect(formatJourneyStatus('active')).toBe('Active');
  });
});
```

### Component Tests

Test React component behavior:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { JourneyCard } from './JourneyCard';

describe('JourneyCard', () => {
  const mockJourney = {
    id: '1',
    name: 'Test Journey',
    status: 'draft',
  };

  it('should render journey name', () => {
    render(<JourneyCard journey={mockJourney} />);
    expect(screen.getByText('Test Journey')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<JourneyCard journey={mockJourney} onEdit={onEdit} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(mockJourney.id);
  });
});
```

## Getting Help

- **Questions**: Open a [GitHub Discussion](https://github.com/your-org/raven-panel/discussions)
- **Bugs**: Create a [GitHub Issue](https://github.com/your-org/raven-panel/issues)
- **Security**: Email security@your-org.com

## Recognition

Contributors are recognized in:
- The CONTRIBUTORS file
- Release notes
- Our documentation

