---
sidebar_position: 2
---

# Journeys API

The Journeys API provides endpoints for creating, reading, updating, and managing customer journeys.

## List Journeys

Retrieve a paginated list of journeys for a tenant.

### Request

```http
GET /tenants/:tenantId/journeys
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20, max: 100) |
| `status` | string | No | Filter by status (draft, active, paused, archived) |
| `search` | string | No | Search by journey name |
| `sortBy` | string | No | Sort field (createdAt, updatedAt, name) |
| `sortOrder` | string | No | Sort order (asc, desc) |

### Response

```typescript
interface JourneysResponse {
  journeys: Journey[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Journey {
  id: string;
  name: string;
  description?: string;
  status: JourneyStatus;
  cohort?: CohortSummary;
  triggers: TriggerSummary[];
  schedule: ScheduleSummary;
  createdAt: string;
  updatedAt: string;
  createdBy: UserSummary;
}
```

### Example

```typescript
import { fetchJourneys } from '@/api/services/journeys.service';

const response = await fetchJourneys('tenant-123', {
  page: 1,
  limit: 20,
  status: 'active',
});

console.log(`Found ${response.total} journeys`);
```

---

## Get Journey

Retrieve a single journey by ID with full details.

### Request

```http
GET /tenants/:tenantId/journeys/:journeyId
```

### Response

```typescript
interface JourneyDetails extends Journey {
  content: ContentConfig;
  frequency: FrequencyConfig;
  analytics?: JourneyAnalytics;
}

interface ContentConfig {
  template: TemplateType;
  elements: ContentElement[];
  styles: StyleConfig;
}

interface FrequencyConfig {
  limit: number;
  period: 'session' | 'day' | 'week' | 'lifetime';
  cooldown?: number;
}
```

### Example

```typescript
import { fetchJourneyById } from '@/api/services/getJourney.service';

const journey = await fetchJourneyById('tenant-123', 'journey-456');

console.log(`Journey: ${journey.name}`);
console.log(`Status: ${journey.status}`);
console.log(`Template: ${journey.content.template}`);
```

---

## Create Journey

Create a new journey.

### Request

```http
POST /tenants/:tenantId/journeys
```

### Request Body

```typescript
interface CreateJourneyInput {
  name: string;
  description?: string;
  cohortId?: string;
  triggers: EventTrigger[];
  schedule: ScheduleConfig;
  frequency: FrequencyConfig;
  content: ContentConfig;
}
```

### Response

Returns the created journey with generated ID.

### Example

```typescript
import { createJourney } from '@/api/services/createJourney.service';

const newJourney = await createJourney('tenant-123', {
  name: 'Welcome Modal',
  description: 'Show welcome message to new users',
  cohortId: 'cohort-new-users',
  triggers: [
    {
      eventName: 'app_opened',
      filters: [
        { property: 'session_count', operator: 'equals', value: 1 }
      ],
    },
  ],
  schedule: {
    type: 'immediate',
  },
  frequency: {
    limit: 1,
    period: 'lifetime',
  },
  content: {
    template: 'modal',
    elements: [
      { type: 'text', content: 'Welcome!' },
      { type: 'button', label: 'Get Started', action: { type: 'dismiss' } },
    ],
  },
});

console.log(`Created journey: ${newJourney.id}`);
```

---

## Update Journey

Update an existing journey. Only draft or paused journeys can be updated.

### Request

```http
PUT /tenants/:tenantId/journeys/:journeyId
```

### Request Body

```typescript
interface UpdateJourneyInput {
  name?: string;
  description?: string;
  cohortId?: string;
  triggers?: EventTrigger[];
  schedule?: ScheduleConfig;
  frequency?: FrequencyConfig;
  content?: ContentConfig;
}
```

### Example

```typescript
import { updateJourney } from '@/api/services/updateJourney.service';

const updated = await updateJourney('tenant-123', 'journey-456', {
  name: 'Updated Welcome Modal',
  content: {
    template: 'modal',
    elements: [
      { type: 'text', content: 'Welcome to our app!' },
      { type: 'button', label: 'Continue', action: { type: 'dismiss' } },
    ],
  },
});
```

---

## Change Journey Status

Transition a journey between states.

### Request

```http
POST /tenants/:tenantId/journeys/:journeyId/status
```

### Request Body

```typescript
interface StatusChangeInput {
  action: 'publish' | 'pause' | 'resume' | 'archive';
}
```

### Valid Transitions

| Current Status | Allowed Actions |
|---------------|-----------------|
| draft | publish, archive |
| active | pause, archive |
| paused | resume, archive |
| archived | (none) |

### Example

```typescript
import { changeJourneyStatus } from '@/api/services/journeyStatus.service';

// Publish a draft journey
await changeJourneyStatus('tenant-123', 'journey-456', {
  action: 'publish',
});

// Pause an active journey
await changeJourneyStatus('tenant-123', 'journey-456', {
  action: 'pause',
});
```

---

## Clone Journey

Create a copy of an existing journey.

### Request

```http
POST /tenants/:tenantId/journeys/:journeyId/clone
```

### Request Body

```typescript
interface CloneJourneyInput {
  name: string; // Name for the new journey
}
```

### Response

Returns the new cloned journey in draft status.

### Example

```typescript
const cloned = await cloneJourney('tenant-123', 'journey-456', {
  name: 'Welcome Modal v2',
});

console.log(`Cloned journey: ${cloned.id}`);
// Cloned journey is in 'draft' status
```

---

## Error Responses

### Common Errors

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid request body |
| 401 | `UNAUTHORIZED` | Missing or invalid auth token |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Journey not found |
| 409 | `CONFLICT` | Invalid status transition |
| 422 | `UNPROCESSABLE` | Business rule violation |

### Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: {
      field: string;
      message: string;
    }[];
  };
}
```

### Example Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      { "field": "name", "message": "Name is required" },
      { "field": "triggers", "message": "At least one trigger is required" }
    ]
  }
}
```

