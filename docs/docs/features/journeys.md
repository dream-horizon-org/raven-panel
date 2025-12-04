---
sidebar_position: 1
---

# Journeys

Journeys are the core feature of Raven Panel. They allow you to create automated user engagement flows triggered by specific events or schedules.

## Overview

A journey consists of several key components:

- **Target Audience** - Which users should receive this journey (cohorts)
- **Triggers** - What events start the journey
- **Content** - What to show users (in-app messages, modals, etc.)
- **Schedule** - When the journey is active
- **Frequency** - How often users can see this journey

## Journey States

```
┌──────────┐    Publish    ┌──────────┐    Pause     ┌──────────┐
│  Draft   │─────────────▶│  Active  │─────────────▶│  Paused  │
└──────────┘              └──────────┘              └──────────┘
     │                          │                        │
     │                          │                        │
     └────────── Archive ───────┴───── Archive ─────────┘
                                │
                                ▼
                          ┌──────────┐
                          │ Archived │
                          └──────────┘
```

| State | Description |
|-------|-------------|
| **Draft** | Journey is being created/edited, not live |
| **Active** | Journey is published and reaching users |
| **Paused** | Journey temporarily stopped |
| **Archived** | Journey retired, no longer accessible |

## Creating a Journey

### 1. Basic Information

Start by providing the journey name and description:

```typescript
interface JourneyBasicInfo {
  name: string;        // Required, unique identifier
  description?: string; // Optional details
}
```

### 2. Define Target Audience

Select which users should see this journey by choosing a cohort:

```typescript
interface CohortSelection {
  cohortId: string;
  cohortName: string;
  userCount: number;  // Estimated reach
}
```

:::tip
Create cohorts in your analytics platform first, then import them to Raven Panel.
:::

### 3. Set Up Event Triggers

Define what events should trigger this journey:

```typescript
interface EventTrigger {
  eventName: string;
  operator: 'equals' | 'contains' | 'matches';
  value?: string;
  properties?: PropertyFilter[];
}

interface PropertyFilter {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  operator: FilterOperator;
  value: unknown;
}
```

#### Example Triggers

| Trigger Type | Example |
|--------------|---------|
| Page View | User visits `/checkout` page |
| Button Click | User clicks "Add to Cart" button |
| Custom Event | User completes onboarding |
| Session Start | User opens app after 7 days |

### 4. Design Content

Use the content editor to design what users will see:

- **Templates** - Pre-built layouts (modal, banner, tooltip)
- **Elements** - Buttons, text, images, forms
- **Styling** - Colors, fonts, animations
- **Actions** - What happens on interaction

### 5. Configure Schedule

Set when the journey should be active:

```typescript
interface JourneySchedule {
  type: 'immediate' | 'scheduled' | 'recurring';
  startDate?: Date;
  endDate?: Date;
  timezone?: string;
  recurrence?: RecurrencePattern;
}
```

### 6. Set Frequency Rules

Control how often users see this journey:

```typescript
interface FrequencyConfig {
  limit: number;           // Max times to show
  period: 'session' | 'day' | 'week' | 'lifetime';
  cooldown?: number;       // Minutes between shows
}
```

## Journey Listing

The dashboard displays all journeys with filtering and sorting:

```typescript
// Filter options
interface JourneyFilters {
  status?: JourneyStatus[];
  search?: string;
  createdBy?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Sort options
type SortField = 'name' | 'createdAt' | 'updatedAt' | 'status';
type SortOrder = 'asc' | 'desc';
```

## Journey Actions

### Edit Journey

Modify any aspect of a draft or paused journey:

```typescript
await updateJourney(journeyId, {
  name: 'Updated Journey Name',
  schedule: { type: 'scheduled', startDate: new Date() },
});
```

### Clone Journey

Create a copy of an existing journey:

```typescript
const newJourney = await cloneJourney(originalJourneyId, {
  name: 'Journey Copy',
});
```

### Change Status

Transition journey between states:

```typescript
// Publish draft
await publishJourney(journeyId);

// Pause active journey
await pauseJourney(journeyId);

// Resume paused journey
await resumeJourney(journeyId);

// Archive journey
await archiveJourney(journeyId);
```

## Best Practices

### Naming Conventions

Use descriptive names that indicate:
- Target audience
- Purpose/goal
- Campaign (if applicable)

**Good**: `New Users - Welcome Modal - Q1 2024`  
**Bad**: `Journey 1`

### Testing Journeys

Before publishing:

1. Preview content on different devices
2. Test with a small cohort first
3. Verify event triggers work correctly
4. Check frequency limits behave as expected

### Performance Tips

- Keep content lightweight for fast loading
- Use lazy loading for images
- Minimize JavaScript in content
- Test on low-end devices

## Code Examples

### Fetching Journeys

```typescript
import { useJourneysList } from '@/hooks/useJourneysList';

function JourneyList() {
  const { data, isLoading, error } = useJourneysList(tenantId);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {data.journeys.map(journey => (
        <JourneyCard key={journey.id} journey={journey} />
      ))}
    </div>
  );
}
```

### Creating a Journey

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJourney } from '@/api/services/createJourney.service';

function useCreateJourney() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createJourney,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
    },
  });
}
```

