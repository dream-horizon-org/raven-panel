---
sidebar_position: 2
---

# Deployment

Deploy Raven to production environments.

## Environment Configuration

Configure all environment variables before deployment. See `.env.template` for a complete list with placeholders.

### Core Configuration

**Required:**

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_ENV` | Environment identifier: `production` or `uat` (defaults to `production` if not set) |
| `NEXT_PUBLIC_BASE_URL_PROD` | Production API base URL |
| `NEXT_PUBLIC_BASE_URL_UAT` | UAT API base URL |

**Note:** The `NEXT_PUBLIC_ENV` variable determines which API endpoints are used:
- `production` (or if not set) → Uses `NEXT_PUBLIC_BASE_URL_PROD`
- `uat` → Uses `NEXT_PUBLIC_BASE_URL_UAT`

If `NEXT_PUBLIC_ENV` is not set, it falls back to `NODE_ENV`, which defaults to `production` in production builds.

**URL Format Requirements:**

All URL environment variables must be valid HTTP/HTTPS URLs:

- Must start with `http://` or `https://`
- Should not include trailing slashes (they will be added automatically)
- Must be accessible from the deployment environment

**Examples:**
- ✅ `https://api.example.com/v1`
- ✅ `https://gateway.company.com/service`
- ❌ `api.example.com/v1` (missing protocol)
- ❌ `https://api.example.com/v1/` (trailing slash not recommended)

**Note:** If URLs do not match this format, API requests may fail with connection errors.

### Authentication

**Required:**

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |

**Optional:**

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_IS_LOGIN_ENABLED` | Enable Google login (`true`/`false`). If `false`, Google login is not required. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET` | Google OAuth client secret (not used in client-side OAuth flow) |

### Cohorts

**Optional:**

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_ENABLE_COHORT` | Enable cohort functionality (`true`/`false`) |
| `NEXT_PUBLIC_COHORT_URL_PROD` | Production cohort service URL |
| `NEXT_PUBLIC_COHORT_URL_UAT` | UAT cohort service URL |

**Note:** When `NEXT_PUBLIC_ENABLE_COHORT` is set to `false` or not configured, the cohort selection feature will default to including all users, effectively applying journey configurations to the entire user base.

**Expected API Response Format:**

The cohort service URLs should return data in the following format:

---

#### TypeScript Interface

**Location**: `src/api/services/types/cohorts.interface.ts`

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

---

#### API Details

- **Endpoint**: `{COHORT_URL}?pageSize=999999`
- **Method**: `GET`
- **Headers**:
  - `Content-Type: application/json`
  - `user: admin@example.com`

#### Example Response
```json
{
  "data": {
    "records": [
      {
        "id": 1,
        "name": "premium_users",
        "description": "Premium user cohort",
        "lastBatchExecutionTime": 1234567890,
        "cohortType": "static",
        "verified": true
      }
    ]
  }
}
```

**Note:** The application extracts the `name` property from each record in the `data.records` array. If the API response does not match this structure, cohort selection may fail or display incorrectly.

### Events

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_EVENT_URL_PROD` | Production event service URL |
| `NEXT_PUBLIC_EVENT_URL_UAT` | UAT event service URL |

**Note:** Without these event service URLs, the event selection feature will be unavailable when creating new journeys or modifying event triggers in existing journeys. While you can still edit existing journeys that don't require event changes, creating new journeys—which is the core functionality of Raven—requires event triggers and will not be possible without these variables configured.

**Expected API Response Format:**

---

#### TypeScript Interfaces

**Type**: API Response  
**Interface**: `EventsSchemaResponse`  
**Location**: `src/api/services/types/events.interface.ts`

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

---

#### API Details

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

#### Example Response
```json
{
  "data": {
    "eventList": [
      {
        "properties": [
          {
            "propertyName": "userId",
            "type": "string",
            "expectedValue": "",
            "isMandatory": true,
            "description": "User identifier",
            "archived": false
          }
        ],
        "metadata": {
          "eventName": "user_login",
          "eventType": "user_action",
          "description": "User login event",
          "eventSources": ["web", "mobile"],
          "screenNames": ["login"],
          "featureName": "authentication",
          "tags": ["auth", "login"],
          "createdBy": "admin@example.com",
          "createdAt": "2024-01-01T00:00:00Z",
          "owners": ["admin@example.com"],
          "dtName": "company",
          "companyName": "company",
          "archived": false,
          "isActive": true
        }
      }
    ]
  }
}
```

**Note:** If the API response does not match this structure, the event selection feature may fail or display incorrectly.

### Permissions

**Optional:**

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_ENABLE_PERMISSION` | Enable permission system (`true`/`false`, defaults to `false` if not set) |
| `NEXT_PUBLIC_PERMISSION_S3_URL` | Permission S3 URL (JSON file with roles/permissions) |

**Note:** If `NEXT_PUBLIC_ENABLE_PERMISSION` is set to `true`, then `NEXT_PUBLIC_PERMISSION_S3_URL` is required.

**Expected JSON File Format:**

---

#### TypeScript Interfaces

**Type**: JSON File  
**Interface**: `UserPermission` / `PermissionsResponse`  
**Location**: `src/api/services/types/permissions.interface.ts`

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

---

#### File Details

- **File Location**: `{PERMISSION_S3_URL}` or `/raven-permissions.json`
- **Method**: `GET`
- **Headers**: `Content-Type: application/json`

#### Example Format
```json
[
  {
    "user": "user@example.com",
    "view": true,
    "edit": true,
    "publish": false
  },
  {
    "user": "admin@example.com",
    "view": true,
    "edit": true,
    "publish": true
  }
]
```

**Alternative Format (wrapped in data object):**
```json
{
  "data": [
    {
      "user": "user@example.com",
      "view": true,
      "edit": true,
      "publish": false
    }
  ]
}
```

**Note:** The application handles both array format and wrapped format automatically. If the format does not match, permissions will default to no access.

### Organizations

**Optional:**

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_ORGANIZATIONS_ENABLE_TENANT` | Enable tenant organizations (`true`/`false`) |
| `NEXT_PUBLIC_ORGANIZATIONS` | Organizations configuration |

**Note:** If `NEXT_PUBLIC_ORGANIZATIONS_ENABLE_TENANT` is set to `true`, then `NEXT_PUBLIC_ORGANIZATIONS` is required.

**Expected Configuration Format:**

---

#### TypeScript Interfaces

**Type**: Dropdown Options (Code Configuration)  
**Location**: `src/app/components/TenantSync.tsx`

```typescript
interface TenantOption {
  name: string;
}

type TenantData = {
  id?: string | number;
  name?: string;
};
```

---

#### Configuration Details

When `NEXT_PUBLIC_ORGANIZATIONS_ENABLE_TENANT` is enabled, the tenant data structure should follow this format:

```typescript
{
  id?: string | number;
  name?: string;
}
```

The tenant configuration in the application expects:

```typescript
{
  [tenantName: string]: {
    source: string;
  };
}
```

#### Example Configuration
```json
{
  "tenant1": { "source": "tenant1" },
  "tenant2": { "source": "tenant2" }
}
```

**Note:** If the tenant data structure does not match this format, API requests may fail due to incorrect tenant headers.

### System Properties

**Optional:**

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_SYSTEM_PROPERTIES_URL` | System properties service URL |

**Note:** System properties define global attributes that are included with every event. If not configured, the application will use only the properties specific to that event.

**Expected API Response Format:**

---

#### TypeScript Interfaces

**Type**: API Response  
**Interface**: `SystemPropertiesResponse`  
**Location**: `src/api/services/systemProperties.service.ts`

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

---

#### API Details

- **Endpoint**: `{SYSTEM_PROPERTIES_URL}/getSystemProperties` or `{EVENT_URL}/getSystemProperties` (if `NEXT_PUBLIC_SYSTEM_PROPERTIES_URL` is not set)
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

**Note:** The application extracts property names and types from any of the supported formats. If objects are provided, it uses the `propertyName` and `type` properties. If strings are provided, it uses them directly as property names. If the API response does not match these structures, system properties may not be available for journey configuration.

## Deployment Options

### Container Deployment (Recommended)

Raven includes a production-ready Dockerfile with multi-stage builds.

#### Using Docker Compose

**1. Create `.env` file:**
Copy `.env.template` to `.env` and replace all `{VARIABLE_NAME}` placeholders with your actual values.

**2. Build and run:**
```bash
docker-compose up --build
```

**3. Production (detached mode):**
```bash
docker-compose up -d
```

**Note:** Docker Compose automatically passes all `NEXT_PUBLIC_*` variables from your `.env` file as build arguments.

#### Building Docker Image Manually

**1. Build with all environment variables as build arguments:**

You need to pass all `NEXT_PUBLIC_*` environment variables as build arguments. For a complete list, see the Environment Configuration section above.

**Option A: Using .env file (Recommended):**
```bash
# Export all NEXT_PUBLIC_* variables from .env file
export $(grep -v '^#' .env | grep '^NEXT_PUBLIC_' | xargs)

# Build with all variables
docker build \
  --build-arg NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV} \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID} \
  --build-arg NEXT_PUBLIC_IS_LOGIN_ENABLED=${NEXT_PUBLIC_IS_LOGIN_ENABLED} \
  --build-arg NEXT_PUBLIC_BASE_URL_PROD=${NEXT_PUBLIC_BASE_URL_PROD} \
  --build-arg NEXT_PUBLIC_BASE_URL_UAT=${NEXT_PUBLIC_BASE_URL_UAT} \
  --build-arg NEXT_PUBLIC_ENABLE_COHORT=${NEXT_PUBLIC_ENABLE_COHORT} \
  --build-arg NEXT_PUBLIC_COHORT_URL_PROD=${NEXT_PUBLIC_COHORT_URL_PROD} \
  --build-arg NEXT_PUBLIC_COHORT_URL_UAT=${NEXT_PUBLIC_COHORT_URL_UAT} \
  --build-arg NEXT_PUBLIC_EVENT_URL_PROD=${NEXT_PUBLIC_EVENT_URL_PROD} \
  --build-arg NEXT_PUBLIC_EVENT_URL_UAT=${NEXT_PUBLIC_EVENT_URL_UAT} \
  --build-arg NEXT_PUBLIC_SYSTEM_PROPERTIES_URL=${NEXT_PUBLIC_SYSTEM_PROPERTIES_URL} \
  --build-arg NEXT_PUBLIC_ENABLE_PERMISSION=${NEXT_PUBLIC_ENABLE_PERMISSION} \
  --build-arg NEXT_PUBLIC_PERMISSION_S3_URL=${NEXT_PUBLIC_PERMISSION_S3_URL} \
  --build-arg NEXT_PUBLIC_ORGANIZATIONS_ENABLE_TENANT=${NEXT_PUBLIC_ORGANIZATIONS_ENABLE_TENANT} \
  --build-arg NEXT_PUBLIC_ORGANIZATIONS=${NEXT_PUBLIC_ORGANIZATIONS} \
  -t raven-panel:latest .
```

**Option B: Inline values (for testing):**
```bash
docker build \
  --build-arg NEXT_PUBLIC_ENV=production \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id \
  --build-arg NEXT_PUBLIC_BASE_URL_PROD=https://api.example.com \
  --build-arg NEXT_PUBLIC_BASE_URL_UAT=https://api-uat.example.com \
  -t raven-panel:latest .
```

**2. Run the container:**
```bash
docker run -p 3000:3000 raven-panel:latest
```

**Note:** When building manually, ensure all required `NEXT_PUBLIC_*` variables are passed as build arguments. Missing variables will result in `undefined` values in the built application.

#### Docker Features

- Multi-stage build with Node.js 20 Alpine
- Non-root user (`nextjs`, UID 1001)
- Health checks via `/healthcheck.txt` (every 30s)
- Standalone Next.js output for minimal image size
- Frozen lockfile for reproducible builds

**Note:** Requires `output: 'standalone'` in `next.config.ts`.

#### Container Platforms

Deploy the containerized application to cloud container platforms like Kubernetes, AWS ECS, Azure Container Instances, or Google Cloud Run.

**Steps:**
1. Build and tag: `docker build -t your-registry/raven-panel:latest .`
2. Push to registry: `docker push your-registry/raven-panel:latest`
3. Deploy to your platform using the image

**Important:** When deploying to container platforms, environment variables are baked into the image during build time (as build arguments). If you need to change environment variables, rebuild and redeploy the image.

**Kubernetes Example:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: raven-panel
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: raven-panel
        image: your-registry/raven-panel:latest
        ports:
        - containerPort: 3000
        # Note: NEXT_PUBLIC_* variables are baked into the image during build
        # Only runtime environment variables need to be set here
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /healthcheck.txt
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: raven-panel-service
spec:
  selector:
    app: raven-panel
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

**Note:** The distinction between local and cloud container deployment is primarily the infrastructure where containers run:
- **Local**: Containers run on your local machine using Docker Desktop/Engine
- **Cloud**: Containers run on cloud infrastructure (Kubernetes, ECS, etc.) with orchestration, scaling, and load balancing

### Cloud Hosting

**Vercel** (recommended for Next.js):
1. Connect GitHub repository
2. Configure environment variables in dashboard
3. Auto-deploys on push to main

**Other options:** AWS Amplify, Netlify, Railway, Render

### Traditional Server

1. Build: `yarn build`
2. Start: `yarn start`
3. Use PM2 or similar process manager

## Post-Deployment

1. Verify health: Check `/healthcheck.txt` endpoint
2. Test authentication: Ensure Google OAuth works
3. Test journey creation: Create a test journey
4. Monitor logs: Watch for errors

## Troubleshooting

**Application won't start:**
- Verify all environment variables are set in `.env`
- Check port 3000 availability
- Review logs: `docker-compose logs raven-panel`

**Authentication issues:**
- Verify Google OAuth credentials match environment variables
- Check redirect URIs configuration

**API connection problems:**
- Verify `NEXT_PUBLIC_ENV` matches your environment
- Check API endpoint URLs are accessible

