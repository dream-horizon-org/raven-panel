---
sidebar_position: 3
---

# Deployment

This guide covers building and deploying Raven Panel to various environments.

## Build Process

### Production Build

Create an optimized production build:

```bash
yarn build
```

This generates the `.next` directory containing the production-ready application.

### Build Output

```
.next/
├── cache/           # Build cache
├── server/          # Server-side bundles
├── static/          # Static assets
└── standalone/      # Standalone server (if configured)
```

### Environment Variables

Set environment variables for production:

```bash
# Required
NEXT_PUBLIC_API_BASE_URL=https://api.production.example.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-production-client-id

# Optional
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## Deployment Options

### Vercel (Recommended)

The easiest way to deploy Next.js applications:

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

```bash
# Or using Vercel CLI
npx vercel --prod
```

### Docker

#### Dockerfile

```dockerfile
# Base image
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Build and Run

```bash
# Build image
docker build -t raven-panel .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.example.com \
  raven-panel
```

### Kubernetes

#### Deployment Manifest

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: raven-panel
spec:
  replicas: 3
  selector:
    matchLabels:
      app: raven-panel
  template:
    metadata:
      labels:
        app: raven-panel
    spec:
      containers:
        - name: raven-panel
          image: your-registry/raven-panel:latest
          ports:
            - containerPort: 3000
          env:
            - name: NEXT_PUBLIC_API_BASE_URL
              valueFrom:
                configMapKeyRef:
                  name: raven-config
                  key: api-url
          resources:
            requests:
              memory: "256Mi"
              cpu: "200m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          readinessProbe:
            httpGet:
              path: /healthcheck.txt
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /healthcheck.txt
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: raven-panel
spec:
  selector:
    app: raven-panel
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'yarn'
      - run: yarn install --frozen-lockfile
      - run: yarn lint
      - run: yarn test
      - run: yarn app:check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'yarn'
      - run: yarn install --frozen-lockfile
      - run: yarn build
        env:
          NEXT_PUBLIC_API_BASE_URL: ${{ secrets.API_URL }}
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: .next

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: .next
      # Deploy to your platform
      - run: echo "Deploy to production"
```

## Health Checks

### Health Check Endpoint

The application includes a health check file at `/healthcheck.txt`:

```
OK
```

### Custom Health Check

For more detailed health checks, create an API route:

```typescript
// app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      api: await checkApiConnection(),
      database: await checkDatabaseConnection(),
    },
  };

  const allHealthy = Object.values(health.checks).every(c => c.status === 'up');

  return Response.json(health, {
    status: allHealthy ? 200 : 503,
  });
}
```

## Monitoring

### Recommended Tools

| Tool | Purpose |
|------|---------|
| **Sentry** | Error tracking |
| **Datadog** | APM and logging |
| **Prometheus** | Metrics collection |
| **Grafana** | Visualization |

### Sentry Integration

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

## Security Checklist

Before deploying to production:

- [ ] Environment variables are secure
- [ ] HTTPS is enforced
- [ ] CORS is configured correctly
- [ ] Authentication is working
- [ ] Rate limiting is in place
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies are up to date
- [ ] Security headers are set

### Security Headers

Configure in `next.config.ts`:

```typescript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

