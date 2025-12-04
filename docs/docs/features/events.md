---
sidebar_position: 3
---

# Events

Events are the triggers that start journeys. They represent user actions or system occurrences that you want to respond to with targeted engagement.

## Event Structure

```typescript
interface Event {
  name: string;
  displayName: string;
  description?: string;
  category: EventCategory;
  properties: EventProperty[];
}

type EventCategory = 
  | 'page_view'
  | 'user_action'
  | 'transaction'
  | 'system'
  | 'custom';

interface EventProperty {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array';
  description?: string;
  examples?: string[];
}
```

## Common Event Types

### Page View Events

Triggered when users visit specific pages:

```typescript
{
  name: 'page_viewed',
  properties: [
    { key: 'path', type: 'string' },
    { key: 'title', type: 'string' },
    { key: 'referrer', type: 'string' },
  ]
}
```

### User Action Events

Triggered by user interactions:

```typescript
// Button click
{
  name: 'button_clicked',
  properties: [
    { key: 'button_id', type: 'string' },
    { key: 'button_text', type: 'string' },
    { key: 'page', type: 'string' },
  ]
}

// Form submission
{
  name: 'form_submitted',
  properties: [
    { key: 'form_id', type: 'string' },
    { key: 'form_name', type: 'string' },
    { key: 'success', type: 'boolean' },
  ]
}
```

### Transaction Events

E-commerce and purchase events:

```typescript
{
  name: 'purchase_completed',
  properties: [
    { key: 'order_id', type: 'string' },
    { key: 'total', type: 'number' },
    { key: 'currency', type: 'string' },
    { key: 'items', type: 'array' },
  ]
}
```

## Event Triggers in Journeys

### Configuring Triggers

When creating a journey, configure event triggers with optional filters:

```typescript
interface EventTrigger {
  eventName: string;
  filters?: EventFilter[];
  combinator: 'and' | 'or';
}

interface EventFilter {
  property: string;
  operator: FilterOperator;
  value: unknown;
}

type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'in'
  | 'not_in'
  | 'exists'
  | 'not_exists';
```

### Example: Page View Trigger

Show a modal when users visit the pricing page:

```typescript
const pricingPageTrigger: EventTrigger = {
  eventName: 'page_viewed',
  filters: [
    {
      property: 'path',
      operator: 'equals',
      value: '/pricing',
    },
  ],
  combinator: 'and',
};
```

### Example: Cart Abandonment

Trigger when users add items but don't checkout:

```typescript
const cartTrigger: EventTrigger = {
  eventName: 'cart_updated',
  filters: [
    {
      property: 'item_count',
      operator: 'greater_than',
      value: 0,
    },
    {
      property: 'checkout_started',
      operator: 'equals',
      value: false,
    },
  ],
  combinator: 'and',
};
```

## Fetching Events

Use the `useEventsList` hook to fetch available events:

```typescript
import { useEventsList } from '@/hooks/useEventsList';

function EventSelector({ value, onChange }) {
  const { data, isLoading } = useEventsList(tenantId);
  
  if (isLoading) return <Skeleton />;
  
  return (
    <Autocomplete
      options={data.events}
      value={value}
      onChange={(_, event) => onChange(event)}
      getOptionLabel={(event) => event.displayName}
      renderOption={(props, event) => (
        <li {...props}>
          <div>
            <strong>{event.displayName}</strong>
            <Typography variant="caption" color="text.secondary">
              {event.category}
            </Typography>
          </div>
        </li>
      )}
    />
  );
}
```

## Event Properties

### System Properties

Available on all events:

| Property | Type | Description |
|----------|------|-------------|
| `timestamp` | date | When event occurred |
| `user_id` | string | Unique user identifier |
| `session_id` | string | Session identifier |
| `device_type` | string | mobile, desktop, tablet |
| `platform` | string | ios, android, web |

### Custom Properties

Event-specific data defined by your tracking:

```typescript
// Use useSystemProperties to get available properties
import { useSystemProperties } from '@/hooks/useSystemProperties';

function PropertyFilter({ eventName }) {
  const { data } = useSystemProperties(tenantId);
  
  const eventProperties = data.properties.filter(
    p => p.events.includes(eventName)
  );
  
  return (
    <Select>
      {eventProperties.map(prop => (
        <MenuItem key={prop.key} value={prop.key}>
          {prop.displayName}
        </MenuItem>
      ))}
    </Select>
  );
}
```

## Best Practices

### Event Naming

Use consistent naming conventions:

```
category_action_object
```

**Examples**:
- `page_view_home`
- `button_click_signup`
- `purchase_complete_subscription`

### Property Types

Choose appropriate types for filtering:

| Data | Use Type | Avoid |
|------|----------|-------|
| IDs | `string` | `number` |
| Counts | `number` | `string` |
| Flags | `boolean` | `string` |
| Timestamps | `date` | `string` |

### Testing Events

1. Use browser dev tools to verify events fire correctly
2. Check event properties contain expected data
3. Test filter combinations
4. Verify on different platforms/devices

