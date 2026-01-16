# API Response Structures Documentation

This document describes the exact data structures expected by the application for Cohort, Permission, and Tenant configurations.

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

## 2. Permission JSON File Structure

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

## 3. Tenant Configuration Structure

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
