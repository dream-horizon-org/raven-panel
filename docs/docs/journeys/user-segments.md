---
sidebar_position: 3
---

# User Segments

Cohorts allow you to define specific groups of users to target with your journeys. This enables precise audience segmentation for personalized engagement.

## What is a User Segment?

A user segment (also called a cohort) is a defined group of users who share specific characteristics or behaviors. Segments are typically created in your analytics platform and synced to Raven Panel.

## Cohort Structure

```typescript
interface Cohort {
  id: string;
  name: string;
  description?: string;
  userCount: number;
  lastUpdated: Date;
  source: 'analytics' | 'manual' | 'dynamic';
}
```

## Types of Cohorts

### Static Cohorts

Users are added to the cohort at a specific point in time and don't change:

- Users who signed up in January 2024
- Users who made their first purchase
- Users imported from a CSV

### Dynamic Cohorts

User membership updates automatically based on criteria:

- Active users in the last 7 days
- Users with more than 5 orders
- Premium subscription users

## Using Cohorts in Journeys

### Selecting a Cohort

When creating a journey, select a cohort from the dropdown:

```tsx
<CohortSection>
  <CohortSelector
    value={selectedCohort}
    onChange={setSelectedCohort}
    cohorts={availableCohorts}
  />
</CohortSection>
```

### Cohort Preview

Before publishing, preview the cohort reach:

```typescript
interface CohortPreview {
  totalUsers: number;
  activeUsers: number;  // Users active in last 30 days
  estimatedReach: number;
  lastCalculated: Date;
}
```

## Fetching Cohorts

Use the `useCohortsList` hook to fetch available cohorts:

```typescript
import { useCohortsList } from '@/hooks/useCohortsList';

function CohortSelector() {
  const { data, isLoading, error } = useCohortsList(tenantId);
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <Select>
      {data.cohorts.map(cohort => (
        <MenuItem key={cohort.id} value={cohort.id}>
          {cohort.name} ({cohort.userCount.toLocaleString()} users)
        </MenuItem>
      ))}
    </Select>
  );
}
```

## Best Practices

### Cohort Naming

Use clear, descriptive names:

✅ **Good**:
- `New Users - Last 7 Days`
- `Premium Subscribers - Active`
- `Cart Abandoners - High Value`

❌ **Bad**:
- `Cohort 1`
- `Test`
- `Users`

### Cohort Size

Consider cohort size when creating journeys:

| Size | Recommendation |
|------|----------------|
| < 100 | Good for testing |
| 100 - 10,000 | Ideal for targeted campaigns |
| 10,000 - 100,000 | Standard campaigns |
| > 100,000 | Consider segmentation |

### Overlap Handling

When a user belongs to multiple cohorts:

1. **Priority Rules** - Higher priority journeys take precedence
2. **Frequency Caps** - Global limits prevent over-messaging
3. **Exclusion Lists** - Explicitly exclude users

## Integration

Cohorts are synced from external analytics platforms:

```
┌─────────────────┐      Sync       ┌─────────────────┐
│   Analytics     │────────────────▶│  Raven Panel    │
│   Platform      │                 │    Cohorts      │
└─────────────────┘                 └─────────────────┘
```

### Supported Integrations

- Amplitude
- Mixpanel  
- Segment
- Custom webhooks

