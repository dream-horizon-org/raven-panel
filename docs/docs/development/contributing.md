---
sidebar_position: 4
---

# Contributing

Guidelines for contributing to Raven Panel.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/raven-panel.git
   cd raven-panel
   ```
3. **Set up environment:**
   ```bash
   yarn install
   yarn dev
   ```
4. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Branch Naming

| Type | Format | Example |
|:-----|:-------|:--------|
| Feature | `feature/description` | `feature/journey-cloning` |
| Bug Fix | `fix/description` | `fix/cohort-selection-bug` |
| Refactor | `refactor/description` | `refactor/api-service-layer` |
| Docs | `docs/description` | `docs/add-api-reference` |
| Chore | `chore/description` | `chore/update-dependencies` |

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description
```

**Examples:**
- `feat(journeys): add journey cloning functionality`
- `fix(cohorts): resolve cohort selection dropdown not updating`
- `docs(api): add API reference documentation`

### Before Committing

```bash
yarn lint:fix    # Fix linting issues
yarn test        # Run tests
yarn app:check   # Type check
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
```

### React Components

- Use functional components with hooks
- Keep components focused and small
- Co-locate styles with components

## Pull Request Process

1. **Update your branch:**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Push your changes:**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request:**
   - Use a descriptive title
   - Fill out the PR template
   - Link related issues
   - Request reviews from maintainers

   **PR Checklist:**
   - [ ] Code follows the style guide
   - [ ] Tests pass locally
   - [ ] New functionality has tests
   - [ ] No linting errors
   - [ ] TypeScript compiles without errors

4. **Address review feedback** - Respond to comments and push updates

## Testing Guidelines

Write tests for new functionality. See [Testing](./testing) for detailed patterns and examples.

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Create a GitHub Issue
- **Security**: Contact the security team

