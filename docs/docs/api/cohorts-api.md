---
sidebar_position: 3
---

# Cohorts API

The Cohorts API provides endpoints for retrieving cohort information used to target users in journeys.

## List Cohorts

Retrieve all available cohorts for a tenant.

### Request

```http
GET /tenants/:tenantId/cohorts
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Search by cohort name |
| `source` | string | No | Filter by source (analytics, manual, dynamic) |

### Response

```typescript
interface CohortsResponse {
  cohorts: Cohort[];
  total: number;
}

interface Cohort {
  id: string;
  name: string;
  description?: string;
  userCount: number;
  source: 'analytics' | 'manual' | 'dynamic';
  lastUpdated: string;
  metadata?: Record<string, unknown>;
}
```

### Example

```typescript
import { fetchCohorts } from '@/api/services/cohorts.service';

const response = await fetchCohorts('tenant-123');

response.cohorts.forEach(cohort => {
  console.log(`${cohort.name}: ${cohort.userCount} users`);
});
```

---

## Get Cohort Details

Retrieve detailed information about a specific cohort.

### Request

```http
GET /tenants/:tenantId/cohorts/:cohortId
```

### Response

```typescript
interface CohortDetails extends Cohort {
  criteria?: CohortCriteria[];
  sampleUsers?: UserSample[];
  analytics?: CohortAnalytics;
}

interface CohortCriteria {
  property: string;
  operator: string;
  value: unknown;
}

interface UserSample {
  userId: string;
  attributes: Record<string, unknown>;
}

interface CohortAnalytics {
  activeUsers: number;      // Active in last 30 days
  growthRate: number;       // % change in last week
  avgEngagement: number;    // Engagement score
}
```

### Example

```typescript
import { fetchCohortById } from '@/api/services/cohorts.service';

const cohort = await fetchCohortById('tenant-123', 'cohort-456');

console.log(`Cohort: ${cohort.name}`);
console.log(`Total users: ${cohort.userCount}`);
console.log(`Active users: ${cohort.analytics?.activeUsers}`);
```

---

## Using Cohorts Hook

The `useCohortsList` hook provides cached access to cohorts:

```typescript
import { useCohortsList } from '@/hooks/useCohortsList';

function CohortSelector({ value, onChange }) {
  const { data, isLoading, error } = useCohortsList(tenantId);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <FormControl fullWidth>
      <InputLabel>Target Cohort</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label="Target Cohort"
      >
        {data.cohorts.map(cohort => (
          <MenuItem key={cohort.id} value={cohort.id}>
            <div>
              <Typography>{cohort.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {cohort.userCount.toLocaleString()} users
              </Typography>
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
```

---

## Error Responses

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 401 | `UNAUTHORIZED` | Missing or invalid auth token |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Cohort not found |

