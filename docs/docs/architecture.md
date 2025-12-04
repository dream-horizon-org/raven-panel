---
sidebar_position: 3
---

# Architecture

This document provides an overview of Raven Panel's architecture, design decisions, and code organization.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   App       │  │  Providers  │  │    Components       │  │
│  │   Router    │  │  (Context)  │  │    & Hooks          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                              │                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              API Service Layer (TanStack Query)        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                             │
└─────────────────────────────────────────────────────────────┘
```

## Core Concepts

### App Router Structure

Raven Panel uses Next.js 15's App Router with the following page structure:

```
app/
├── page.tsx              # Landing page
├── layout.tsx            # Root layout with providers
├── globals.css           # Global styles
└── dashboard/
    ├── page.tsx          # Journey listing
    ├── layout.tsx        # Dashboard layout
    ├── create/           # Journey creation
    ├── edit/             # Journey editing
    └── clone/            # Journey cloning
```

### Provider Architecture

The application uses a layered provider architecture for state and context management:

```tsx
// src/app/providers/Providers.tsx
<QueryProvider>
  <ThemeProvider>
    <ThemeModeProvider>
      <MultiTenantProvider>
        <PermissionProvider>
          {children}
        </PermissionProvider>
      </MultiTenantProvider>
    </ThemeModeProvider>
  </ThemeProvider>
</QueryProvider>
```

| Provider | Purpose |
|----------|---------|
| **QueryProvider** | TanStack Query client for server state |
| **ThemeProvider** | Material UI theme configuration |
| **ThemeModeProvider** | Light/dark mode switching |
| **MultiTenantProvider** | Tenant context and switching |
| **PermissionProvider** | User permissions and access control |

## API Layer

### Service Architecture

API calls are organized into service modules in `src/api/services/`:

```
services/
├── journeys.service.ts      # List journeys
├── getJourney.service.ts    # Get single journey
├── createJourney.service.ts # Create journey
├── updateJourney.service.ts # Update journey
├── journeyStatus.service.ts # Journey status changes
├── cohorts.service.ts       # Cohort management
├── events.service.ts        # Event definitions
├── filterList.service.ts    # Filter options
├── permissions.service.ts   # User permissions
└── systemProperties.service.ts # System config
```

### Example Service Pattern

```typescript
// src/api/services/journeys.service.ts
import { axiosInstance } from '@/lib/axios';
import type { Journey } from './types/journey.types';

export interface JourneysResponse {
  journeys: Journey[];
  total: number;
}

export const fetchJourneys = async (
  tenantId: string,
  params?: { page?: number; limit?: number }
): Promise<JourneysResponse> => {
  const response = await axiosInstance.get(`/tenants/${tenantId}/journeys`, {
    params,
  });
  return response.data;
};
```

### Custom Hooks

Services are consumed through custom hooks with TanStack Query:

```typescript
// src/hooks/useJourneysList.ts
import { useQuery } from '@tanstack/react-query';
import { fetchJourneys } from '@/api/services/journeys.service';

export const useJourneysList = (tenantId: string) => {
  return useQuery({
    queryKey: ['journeys', tenantId],
    queryFn: () => fetchJourneys(tenantId),
    enabled: !!tenantId,
  });
};
```

## Dashboard Module

The dashboard is the core module containing journey management features:

### Component Structure

```
dashboard/
├── components/
│   ├── JourneyListingPage.tsx   # Main listing component
│   ├── JourneyCard.tsx          # Individual journey card
│   └── JourneyFilters.tsx       # Filtering controls
└── create/
    ├── components/
    │   ├── CreateJourney.tsx    # Main form container
    │   ├── JourneyHeader.tsx    # Journey name/details
    │   ├── JourneyTabs.tsx      # Tab navigation
    │   ├── CohortSection.tsx    # Target audience
    │   ├── EventTriggerSection.tsx  # Event triggers
    │   ├── ScheduleSection.tsx  # Timing config
    │   ├── ContentEditor.tsx    # Content management
    │   └── content/             # Content sub-components
    ├── contexts/
    │   └── ElementLocatorContext.tsx
    ├── types/
    │   └── journeyTypes.ts
    └── utils/
        ├── journeyUtils.ts
        ├── validation.ts
        └── propertyTypeUtils.ts
```

### State Management Pattern

Journey creation uses React Hook Form with a centralized form state:

```typescript
const methods = useForm<JourneyFormData>({
  defaultValues: {
    name: '',
    description: '',
    cohort: null,
    triggers: [],
    schedule: { type: 'immediate' },
    content: { template: null, elements: [] },
  },
});
```

## Authentication

### Auth Flow

```
1. User clicks "Sign in with Google"
2. Google OAuth returns token
3. Token decoded and validated
4. User info stored in context
5. Permissions fetched from backend
```

### Auth Components

```
Auth/
├── Auth.constants.ts    # OAuth configuration
├── Auth.utils.ts        # Token utilities
├── components/
│   ├── LoginButton.tsx  # OAuth trigger
│   └── AuthGuard.tsx    # Protected route wrapper
└── hooks/
    └── useAuth.ts       # Auth state hook
```

## Styling Architecture

### Approach

Raven Panel uses a hybrid styling approach:

1. **Material UI** - Component library with theme customization
2. **Tailwind CSS** - Utility classes for layout and spacing
3. **TypeStyle** - CSS-in-JS for complex component styles

### Theme Configuration

```typescript
// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#8b5cf6',
    },
    // ...
  },
  typography: {
    fontFamily: 'Outfit, sans-serif',
  },
});
```

### Component Styles Pattern

Complex components use co-located style files:

```
ComponentName/
├── ComponentName.tsx
└── componentNameStyles.ts
```

## Testing Strategy

### Test Structure

```
__tests__/
├── journeyUtils.test.ts      # Utility function tests
├── propertyTypeUtils.test.ts # Type utility tests
├── tenant.utils.test.ts      # Tenant utility tests
└── validation.test.ts        # Form validation tests
```

### Running Tests

```bash
# Run all tests
yarn test

# With coverage
yarn test:coverage

# Watch mode
yarn test:watch
```

## Best Practices

### Code Organization

1. **Feature-first structure** - Related code stays together
2. **Shared code in root dirs** - Common utilities in `src/hooks`, `src/components`
3. **Type co-location** - Types near their usage in `types/` subdirectories

### Performance

1. **TanStack Query** - Automatic caching and deduplication
2. **Next.js Turbopack** - Fast development builds
3. **Code splitting** - Automatic with App Router

### Type Safety

1. **Strict TypeScript** - No implicit any
2. **API Types** - Full typing for request/response
3. **Form Types** - Typed form state with React Hook Form

