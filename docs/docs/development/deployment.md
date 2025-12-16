---
sidebar_position: 4
---

# Deployment

Deploy Raven Panel to production environments.

## Pre-Deployment Checklist

- ✅ All environment variables configured
- ✅ Google OAuth credentials set up
- ✅ API endpoints accessible from production
- ✅ User permissions and access controls configured
- ✅ Health checks working

## Environment Configuration

### Required Variables

| Variable | Description | Example |
|:--------|:------------|:--------|
| `NEXT_PUBLIC_ENV` | Environment identifier | `production`, `uat`, or `development` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | `your-google-client-id.apps.googleusercontent.com` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `your-google-client-secret` |
| `NEXT_PUBLIC_BASE_URL_PROD` | Production API base URL | `https://kong.dream11.com` |
| `NEXT_PUBLIC_BASE_URL_UAT` | UAT API base URL | `https://kong-uat.dream11.com` |

### Optional Variables

| Variable | Description |
|:--------|:------------|
| `NEXT_PUBLIC_ENABLE_COHORT` | Enable cohort functionality |
| `NEXT_PUBLIC_COHORT_URL_PROD` | Production cohort service URL |
| `NEXT_PUBLIC_COHORT_URL_UAT` | UAT cohort service URL |
| `NEXT_PUBLIC_EVENT_URL` | Event service URL |
| `NEXT_PUBLIC_SYSTEM_PROPERTIES_URL` | System properties service URL |
| `NEXT_PUBLIC_ENABLE_PERMISSION` | Enable permission system |
| `NEXT_PUBLIC_PERMISSION_S3_URL` | Permission S3 URL |
| `NEXT_PUBLIC_ORGANIZATIONS_ENABLE_TENANT` | Enable tenant organizations |
| `NEXT_PUBLIC_ORGANIZATIONS` | Organizations configuration |

### Environment Behavior

The `NEXT_PUBLIC_ENV` variable determines API endpoints:

- **production** → `kong.dream11.com`
- **uat** → `kong-uat.dream11.com`
- **development** → Local development endpoints

## Deployment Platforms

### Cloud Hosting (Recommended)

**Vercel** (recommended for Next.js):
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push to main

**Other options:** AWS Amplify, Netlify, Railway, Render

### Container Deployment

Raven Panel includes a multi-stage Dockerfile optimized for production.

#### Building the Docker Image

**1. Prepare environment variables:**
Create a `.env` file or set build arguments with all required `NEXT_PUBLIC_*` variables.

**2. Build the image:**
```bash
docker build \
  --build-arg NEXT_PUBLIC_ENV=production \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-secret \
  --build-arg NEXT_PUBLIC_BASE_URL_PROD=https://kong.dream11.com \
  --build-arg NEXT_PUBLIC_BASE_URL_UAT=https://kong-uat.dream11.com \
  -t raven-panel:latest .
```

**3. Run the container:**
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_ENV=production \
  raven-panel:latest
```

#### Using Docker Compose

**1. Create `.env` file:**
```bash
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-secret
# ... other variables
```

**2. Build and run:**
```bash
docker-compose up --build
```

**3. Production deployment:**
```bash
docker-compose -f docker-compose.yml up -d
```

#### Docker Features

- **Multi-stage build** - Optimized image size
- **Non-root user** - Enhanced security
- **Health checks** - Automatic container health monitoring
- **Standalone output** - Self-contained Next.js build

**Note:** The Dockerfile requires Next.js standalone output. Ensure your `next.config.ts` includes:
```typescript
const nextConfig = {
  output: 'standalone',
  // ... other config
};
```

#### Deploying to Container Platforms

1. Build and tag the image
2. Push to your container registry (Docker Hub, ECR, GCR, etc.)
3. Deploy to your platform (Kubernetes, ECS, Azure Container Instances, etc.)

**Example for Kubernetes:**
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

### Traditional Server

1. Build: `yarn build`
2. Start: `yarn start`
3. Use PM2 or similar process manager

## Post-Deployment

1. **Verify health** - Check `/healthcheck.txt` endpoint
2. **Test authentication** - Ensure Google OAuth works
3. **Test journey creation** - Create a test journey
4. **Monitor logs** - Watch for errors
5. **Check permissions** - Verify user access controls

## Monitoring

Monitor key metrics:
- Application health (uptime, response times)
- User authentication (login success rates)
- Journey performance (creation, publishing)
- Error rates

## Troubleshooting

**Application Won't Start:**
- Check environment variables
- Verify Node.js version (requires Node 20+)
- Check port availability

**Authentication Issues:**
- Verify Google OAuth credentials
- Check redirect URIs
- Ensure environment variables match OAuth setup

**API Connection Problems:**
- Verify `NEXT_PUBLIC_ENV` is set correctly
- Check network connectivity
- Review API endpoint URLs

