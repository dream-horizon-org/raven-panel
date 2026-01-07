# API Response Structures Documentation

This document describes the exact data structures expected by the application for Cohort, Event, System Properties, Permission, and Tenant configurations.

## 1. Cohort API Response Structure

### TypeScript Interface

```typescript
export interface CohortsResponse {
  data: {
    records: Array<{
      id: number;
      name: string;
      description?: string;
      lastBatchExecutionTime?: number;
      cohortType: string;
      verified: boolean;
    }>;
  };
}
```

### API Details

- **Endpoint**: `{COHORT_URL}?pageSize=999999`
- **Method**: `GET`
- **Headers**:
  - `Content-Type: application/json`
  - `user: admin@example.com`

---

## 2. Event API Response Structure

**Type**: API Response  
**Interface**: `EventsSchemaResponse`  
**Location**: `src/api/services/types/events.interface.ts`

### TypeScript Interfaces

```typescript
export interface EventProperty {
  propertyName: string;
  type: string;
  expectedValue: string;
  isMandatory: boolean;
  description: string;
  archived: boolean;
}

export interface EventMetadata {
  eventName: string;
  eventType: string;
  description: string;
  eventSources: string[];
  screenNames: string[];
  featureName?: string;
  tags?: string[];
  createdBy: string;
  createdAt: string;
  owners: string[];
  dtName: string;
  companyName: string;
  archived: boolean;
  isActive: boolean;
}

export interface EventListItem {
  properties: EventProperty[];
  metadata: EventMetadata;
}

export interface EventsSchemaResponse {
  data: {
    eventList: EventListItem[];
  };
}
```

### Event API Details

- **Endpoint**: `{EVENT_URL}/schema`
- **Method**: `GET`
- **Query Parameters**:
  - `limit=10000`
  - `companyName=string`
  - `branchId=number`
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: string`
  - `x-skip-validation: false`

---

## 3. System Properties API Details

**Type**: API Response  
**Interface**: `SystemPropertiesResponse`  
**Location**: `src/api/services/systemProperties.service.ts`

### TypeScript Interfaces

```typescript
export interface SystemProperty {
  propertyName: string;
  type: string;
  expectedValue: string;
  isMandatory: boolean;
  description: string;
}

export interface SystemPropertiesResponse {
  data:
    | SystemProperty[]
    | {
        names?: string[];
        properties?: Array<string | { propertyName: string; type?: string }>;
        systemProperties?: Array<
          string | { propertyName: string; type?: string }
        >;
      };
}
```

### API Details

- **Endpoint**: `{SYSTEM_PROPERTIES_URL}/getSystemProperties` or `{EVENT_URL}/getSystemProperties` (if SYSTEM_PROPERTIES_URL is not set)
- **Method**: `GET`
- **Query Parameters**:
  - `limit=10000`
  - `companyName=string`
  - `branchId=number`
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: string`
  - `x-skip-validation: false`
- **Environment Variable**: `NEXT_PUBLIC_SYSTEM_PROPERTIES_URL` (base URL for system properties API)
  - If not set, falls back to `NEXT_PUBLIC_EVENT_URL`
- **Note**: The app extracts property names and types from any of the supported formats. If objects are provided, it uses the `propertyName` and `type` properties. If strings are provided, it uses them directly as property names.

---

## 4. Permission JSON File Structure

**Type**: JSON File  
**Interface**: `UserPermission` / `PermissionsResponse`  
**Location**: `src/api/services/types/permissions.interface.ts`

### TypeScript Interfaces

```typescript
export interface UserPermission {
  user: string;
  view: boolean;
  edit: boolean;
  publish: boolean;
}

export interface PermissionsResponse {
  data: UserPermission[];
}
```

### File Details

- **File Location**: `{PERMISSION_S3_URL}` or `/raven-permissions.json`
- **Method**: `GET`
- **Headers**: `Content-Type: application/json`
- **Note**: The app handles both array format and wrapped format automatically.

---

## 5. Tenant Configuration Structure

**Type**: Environment Variable (`.env.local`)  
**Location**: `src/app/components/constants.ts` and `src/app/components/TenantSync.tsx`

### Environment Variable

**Variable Name**: `NEXT_PUBLIC_ORGANIZATIONS`

**Format**: Comma-separated string of organization names

### TypeScript Interfaces

```typescript
interface TenantOption {
  name: string;
}
```

### Required Structure

The environment variable should contain a comma-separated list of organization names:

```env
# Single organization
NEXT_PUBLIC_ORGANIZATIONS="dream11"

# Multiple organizations
NEXT_PUBLIC_ORGANIZATIONS="dream11,criq"
```

### Implementation Details

- **Location**: `src/app/components/constants.ts`
- **Export**: `export const ORGANIZATIONS = getOrganizations();`
- **Usage**: Used in `OrganizationField.tsx` for the dropdown options
- **Fallback**: Defaults to `["dream11"]` if environment variable is not set

### Notes

- The app parses the comma-separated string and trims whitespace
- Empty values are filtered out
- Used in both the landing page organization dropdown and tenant synchronization
