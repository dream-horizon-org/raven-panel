---
sidebar_position: 1
---

# API Overview

Raven Panel uses a service-based architecture for communicating with the backend API. All API calls are made through dedicated service modules using Axios and cached with TanStack Query.

## Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│    React        │      │    TanStack     │      │    Service      │
│    Components   │─────▶│    Query        │─────▶│    Layer        │
│                 │      │    (Cache)      │      │    (Axios)      │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                                          │
                                                          ▼
                                                  ┌─────────────────┐
                                                  │   Backend API   │
                                                  └─────────────────┘
```

## Axios Configuration

The Axios instance is configured in `src/lib/axios.ts`:

```typescript
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);
```

## Service Structure

Each API domain has its own service file:

```
src/api/services/
├── journeys.service.ts      # Journey listing
├── getJourney.service.ts    # Get single journey
├── createJourney.service.ts # Create journey
├── updateJourney.service.ts # Update journey
├── journeyStatus.service.ts # Status transitions
├── cohorts.service.ts       # Cohort management
├── events.service.ts        # Event definitions
├── filterList.service.ts    # Filter options
├── permissions.service.ts   # User permissions
├── systemProperties.service.ts # System config
└── types/                   # TypeScript types
```

## Service Pattern

### Basic Service

```typescript
// Example: journeys.service.ts
import { axiosInstance } from '@/lib/axios';
import type { Journey, JourneysResponse } from './types/journey.types';

export const fetchJourneys = async (
  tenantId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
  }
): Promise<JourneysResponse> => {
  const response = await axiosInstance.get(
    `/tenants/${tenantId}/journeys`,
    { params }
  );
  return response.data;
};

export const fetchJourneyById = async (
  tenantId: string,
  journeyId: string
): Promise<Journey> => {
  const response = await axiosInstance.get(
    `/tenants/${tenantId}/journeys/${journeyId}`
  );
  return response.data;
};
```

### Mutation Service

```typescript
// Example: createJourney.service.ts
import { axiosInstance } from '@/lib/axios';
import type { Journey, CreateJourneyInput } from './types/journey.types';

export const createJourney = async (
  tenantId: string,
  data: CreateJourneyInput
): Promise<Journey> => {
  const response = await axiosInstance.post(
    `/tenants/${tenantId}/journeys`,
    data
  );
  return response.data;
};
```

## Using Services with TanStack Query

### Query Hook Pattern

```typescript
// src/hooks/useJourneysList.ts
import { useQuery } from '@tanstack/react-query';
import { fetchJourneys } from '@/api/services/journeys.service';

export const useJourneysList = (
  tenantId: string,
  options?: { page?: number; limit?: number }
) => {
  return useQuery({
    queryKey: ['journeys', tenantId, options],
    queryFn: () => fetchJourneys(tenantId, options),
    enabled: !!tenantId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
```

### Mutation Hook Pattern

```typescript
// Example mutation hook
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJourney } from '@/api/services/createJourney.service';

export const useCreateJourney = (tenantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJourneyInput) => createJourney(tenantId, data),
    onSuccess: () => {
      // Invalidate and refetch journeys list
      queryClient.invalidateQueries({ queryKey: ['journeys', tenantId] });
    },
    onError: (error) => {
      console.error('Failed to create journey:', error);
    },
  });
};
```

## Error Handling

### API Error Types

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
```

### Error Handling in Components

```tsx
function JourneyList() {
  const { data, isLoading, error } = useJourneysList(tenantId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load journeys"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  return <JourneyTable data={data.journeys} />;
}
```

## Authentication

### Token Management

```typescript
// Auth token utilities
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};
```

### Multi-Tenant Context

All API calls include tenant context:

```typescript
// Headers automatically include tenant
axiosInstance.interceptors.request.use((config) => {
  const tenantId = getCurrentTenantId();
  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId;
  }
  return config;
});
```

## API Endpoints Summary

| Method | Endpoint | Service |
|--------|----------|---------|
| GET | `/tenants/:id/journeys` | `journeys.service.ts` |
| GET | `/tenants/:id/journeys/:id` | `getJourney.service.ts` |
| POST | `/tenants/:id/journeys` | `createJourney.service.ts` |
| PUT | `/tenants/:id/journeys/:id` | `updateJourney.service.ts` |
| POST | `/tenants/:id/journeys/:id/status` | `journeyStatus.service.ts` |
| GET | `/tenants/:id/cohorts` | `cohorts.service.ts` |
| GET | `/tenants/:id/events` | `events.service.ts` |
| GET | `/tenants/:id/filters` | `filterList.service.ts` |
| GET | `/permissions` | `permissions.service.ts` |
| GET | `/system/properties` | `systemProperties.service.ts` |

