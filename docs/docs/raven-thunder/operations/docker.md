---
title: Docker and Compose
---

## Quick Start

The easiest way to run Thunder is using the provided scripts:

```bash
# Start all services
./scripts/docker/start.sh

# Stop all services
./scripts/docker/stop.sh

# View logs
./scripts/docker/logs.sh
```

## Manual Docker Commands

### Using Docker Compose

Start all services:
```bash
docker-compose up -d --build
```

Stop all services:
```bash
docker-compose down
```

View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f thunder-api
docker-compose logs -f thunder-admin
```

### Building Individual Images

The Dockerfile supports building specific modules via build arguments:

```bash
# Build Thunder API
docker build --build-arg MODULE=thunder-api -t thunder-api:latest .

# Build Thunder Admin
docker build --build-arg MODULE=thunder-admin -t thunder-admin:latest .
```

## Services

When running with Docker Compose, the following services are available:

- **thunder-api**: Thunder API service (port 8080)
- **thunder-admin**: Thunder Admin service (port 8081)
- **aerospike**: Aerospike database
- **scalar**: API documentation viewer (port 8082)
- **cors-proxy**: CORS proxy for API access



