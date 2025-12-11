---
sidebar_position: 3
---

# Deployment

This guide covers deploying Raven Panel to production environments. For most teams, deployment is handled by your DevOps or infrastructure team, but understanding the process helps ensure smooth releases.

## Overview

Raven Panel can be deployed to various platforms depending on your infrastructure setup. The application is built as a Next.js application and can run on:

- **Cloud platforms** (Vercel, AWS, GCP, Azure)
- **Container platforms** (Docker, Kubernetes)
- **Traditional servers** (with Node.js runtime)

## Pre-Deployment Checklist

Before deploying, ensure:

- ✅ All environment variables are configured
- ✅ Google OAuth credentials are set up
- ✅ API endpoints are accessible from production
- ✅ User permissions and access controls are configured
- ✅ Health checks are working

## Environment Configuration

Raven Panel requires the following environment variables:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_ENV` | Environment identifier | `production`, `uat`, or `development` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | `your-google-client-id.apps.googleusercontent.com` |

### How Environment Affects Behavior

The `NEXT_PUBLIC_ENV` variable determines which API endpoints the application connects to:

- **production** → Connects to production APIs (`kong.dream11.com`)
- **uat** → Connects to UAT/staging APIs (`kong-uat.dream11.com`)
- **development** → Uses local development endpoints

## Deployment Platforms

### Cloud Hosting (Recommended)

**Vercel** is the easiest option for Next.js applications:

1. Connect your GitHub repository
2. Configure environment variables in the dashboard
3. Deploy automatically on every push to main branch

**Other Options:**
- AWS Amplify
- Netlify
- Railway
- Render

### Container Deployment

If your organization uses Docker:

1. Build the Docker image
2. Push to your container registry
3. Deploy to your container platform (Kubernetes, ECS, etc.)

The application includes a Dockerfile for containerized deployments.

### Traditional Server

For servers with Node.js installed:

1. Build the application (`yarn build`)
2. Start the production server (`yarn start`)
3. Use a process manager like PM2 for reliability

## Post-Deployment

After deployment:

1. **Verify health** - Check `/healthcheck.txt` endpoint
2. **Test authentication** - Ensure Google OAuth works
3. **Test journey creation** - Create a test journey
4. **Monitor logs** - Watch for any errors
5. **Check permissions** - Verify user access controls

## Monitoring

Monitor these key metrics:

- **Application health** - Uptime and response times
- **User authentication** - Login success rates
- **Journey performance** - Journey creation and publishing
- **Error rates** - Track and resolve issues quickly

## Troubleshooting

### Application Won't Start

- Check environment variables are set correctly
- Verify Node.js version (requires Node 20+)
- Check port 3000 is available

### Authentication Issues

- Verify Google OAuth credentials
- Check redirect URIs are configured
- Ensure environment variables match your OAuth setup

### API Connection Problems

- Verify `NEXT_PUBLIC_ENV` is set correctly
- Check network connectivity to API endpoints
- Review API endpoint URLs in configuration

## Getting Help

If you encounter deployment issues:

1. Check application logs
2. Verify environment configuration
3. Contact your DevOps team
4. Review the [Getting Started](../getting-started) guide

---

:::info For Developers
For detailed technical deployment instructions, configuration files, and advanced setup, contact your development team or refer to internal documentation.
:::

