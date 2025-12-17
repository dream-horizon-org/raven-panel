---
sidebar_position: 2
---

# Deployment

Deploy Raven Panel to production environments.

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

### Authentication

**Required:**

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |

**Optional:**

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET` | Google OAuth client secret (not used in client-side OAuth flow) |

### Cohorts

**Optional:**

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_ENABLE_COHORT` | Enable cohort functionality (`true`/`false`) |
| `NEXT_PUBLIC_COHORT_URL_PROD` | Production cohort service URL |
| `NEXT_PUBLIC_COHORT_URL_UAT` | UAT cohort service URL |

### Events

**Optional:**

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_EVENT_URL_PROD` | Production event service URL |
| `NEXT_PUBLIC_EVENT_URL_UAT` | UAT event service URL |

### Permissions

**Optional:**

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_ENABLE_PERMISSION` | Enable permission system (`true`/`false`) |
| `NEXT_PUBLIC_PERMISSION_S3_URL` | Permission S3 URL (JSON file with roles/permissions) |

**Note:** If `NEXT_PUBLIC_ENABLE_PERMISSION` is set to `true`, then `NEXT_PUBLIC_PERMISSION_S3_URL` is required.

### Organizations

**Optional:**

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_ORGANIZATIONS_ENABLE_TENANT` | Enable tenant organizations (`true`/`false`) |
| `NEXT_PUBLIC_ORGANIZATIONS` | Organizations configuration |

**Note:** If `NEXT_PUBLIC_ORGANIZATIONS_ENABLE_TENANT` is set to `true`, then `NEXT_PUBLIC_ORGANIZATIONS` is required.

### System Properties

**Optional:**

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_SYSTEM_PROPERTIES_URL` | System properties service URL |

**Note:** System properties define global attributes that are included with every event. If not configured, events will use only the attributes directly associated with them.

## Deployment Options

### Container Deployment (Recommended)

Raven Panel includes a production-ready Dockerfile with multi-stage builds.

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
```bash
docker build \
  --build-arg NEXT_PUBLIC_ENV=production \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-secret \
  --build-arg NEXT_PUBLIC_BASE_URL_PROD=https://kong.dream11.com \
  --build-arg NEXT_PUBLIC_BASE_URL_UAT=https://kong-uat.dream11.com \
  -t raven-panel:latest .
```

**2. Run the container:**
```bash
docker run -p 3000:3000 raven-panel:latest
```

#### Docker Features

- Multi-stage build with Node.js 20 Alpine
- Non-root user (`nextjs`, UID 1001)
- Health checks via `/healthcheck.txt` (every 30s)
- Standalone Next.js output for minimal image size
- Frozen lockfile for reproducible builds

**Note:** Requires `output: 'standalone'` in `next.config.ts`.

#### Container Platforms

1. Build and tag: `docker build -t your-registry/raven-panel:latest .`
2. Push to registry: `docker push your-registry/raven-panel:latest`
3. Deploy to platform (Kubernetes, ECS, etc.)

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
        env:
        - name: NEXT_PUBLIC_ENV
          value: "production"
```

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

