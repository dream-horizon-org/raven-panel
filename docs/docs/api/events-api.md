---
sidebar_position: 4
---

# Events API

The Events API provides endpoints for retrieving event definitions and system properties used in journey triggers.

## List Events

Retrieve all trackable events for a tenant.

### Request

```http
GET /tenants/:tenantId/events
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | No | Filter by event category |
| `search` | string | No | Search by event name |

### Response

```typescript
interface EventsResponse {
  events: Event[];
  total: number;
}

interface Event {
  name: string;
  displayName: string;
  description?: string;
  category: EventCategory;
  properties: EventProperty[];
  metadata?: {
    volume: number;        // Average daily occurrences
    lastSeen?: string;     // Last occurrence timestamp
  };
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
  displayName: string;
  description?: string;
  examples?: string[];
  required?: boolean;
}
```

### Example

```typescript
import { fetchEvents } from '@/api/services/events.service';

const response = await fetchEvents('tenant-123');

// Group events by category
const eventsByCategory = response.events.reduce((acc, event) => {
  const category = event.category;
  if (!acc[category]) acc[category] = [];
  acc[category].push(event);
  return acc;
}, {});
```

---

## Get Event Details

Retrieve detailed information about a specific event.

### Request

```http
GET /tenants/:tenantId/events/:eventName
```

### Response

```typescript
interface EventDetails extends Event {
  samplePayloads?: Record<string, unknown>[];
  relatedEvents?: string[];
  usage?: {
    journeyCount: number;  // Journeys using this event
    lastTriggered?: string;
  };
}
```

---

## System Properties

System properties are available on all events and can be used in filters.

### Request

```http
GET /system/properties
```

### Response

```typescript
interface SystemPropertiesResponse {
  properties: SystemProperty[];
}

interface SystemProperty {
  key: string;
  displayName: string;
  type: PropertyType;
  description: string;
  operators: FilterOperator[];
  values?: string[];  // For enum types
}

type PropertyType = 'string' | 'number' | 'boolean' | 'date' | 'enum';

type FilterOperator = 
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'greater_than_or_equals'
  | 'less_than'
  | 'less_than_or_equals'
  | 'in'
  | 'not_in'
  | 'exists'
  | 'not_exists';
```

### Common System Properties

| Property | Type | Description |
|----------|------|-------------|
| `user_id` | string | Unique user identifier |
| `session_id` | string | Current session ID |
| `device_type` | enum | mobile, desktop, tablet |
| `platform` | enum | ios, android, web |
| `app_version` | string | Application version |
| `os_version` | string | Operating system version |
| `country` | string | User's country |
| `language` | string | User's language |

---

## Using Events Hook

```typescript
import { useEventsList } from '@/hooks/useEventsList';

function EventTriggerBuilder() {
  const { data, isLoading } = useEventsList(tenantId);

  if (isLoading) return <Skeleton />;

  return (
    <Autocomplete
      options={data.events}
      groupBy={(event) => event.category}
      getOptionLabel={(event) => event.displayName}
      renderInput={(params) => (
        <TextField {...params} label="Select Event" />
      )}
      renderOption={(props, event) => (
        <li {...props}>
          <div>
            <Typography fontWeight={500}>
              {event.displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {event.name}
            </Typography>
          </div>
        </li>
      )}
    />
  );
}
```

---

## Filter List API

Get available filter options for building event triggers.

### Request

```http
GET /tenants/:tenantId/filters
```

### Response

```typescript
interface FiltersResponse {
  filters: FilterDefinition[];
}

interface FilterDefinition {
  property: string;
  displayName: string;
  type: PropertyType;
  operators: FilterOperator[];
  values?: FilterValue[];  // Predefined values for selection
}

interface FilterValue {
  value: string;
  label: string;
  count?: number;  // How many users match
}
```

### Example

```typescript
import { useFiltersList } from '@/hooks/useFiltersList';

function PropertyFilter({ eventName, property, onChange }) {
  const { data } = useFiltersList(tenantId);
  
  const filter = data.filters.find(f => f.property === property);
  
  return (
    <div>
      <Select
        label="Operator"
        value={filter.operator}
        options={filter?.operators.map(op => ({
          value: op,
          label: operatorLabels[op],
        }))}
      />
      
      {filter?.values ? (
        <Select
          label="Value"
          options={filter.values}
        />
      ) : (
        <TextField label="Value" />
      )}
    </div>
  );
}
```

