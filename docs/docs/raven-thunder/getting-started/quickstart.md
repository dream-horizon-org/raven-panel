---
title: Quickstart
---

## Requirements

- [Docker](https://www.docker.com/) & Docker Compose

## Quick Start

```bash
./quick-start.sh
```

This will automatically:
- Build the application (inside Docker)
- Start all required services (Aerospike, Thunder API, Thunder Admin, Scalar API docs, CORS proxy)
- Run database migrations and seed data
- Display service URLs and health check endpoints

Alternatively, you can use the Docker scripts directly:
```bash
./scripts/docker/start.sh
```

## Running

### Using Docker Scripts

The easiest way to run Thunder is using the provided Docker scripts:

```bash
# Start Thunder
./scripts/docker/start.sh

# View logs (default: API and Admin)
./scripts/docker/logs.sh

# View logs for specific service
./scripts/docker/logs.sh api      # Thunder API logs
./scripts/docker/logs.sh admin    # Thunder Admin logs
./scripts/docker/logs.sh aerospike # Aerospike logs
./scripts/docker/logs.sh all      # All services

# Stop Thunder
./scripts/docker/stop.sh

# Restart Thunder
./scripts/docker/restart.sh
```

### Direct JAR Execution

You can also run the services directly using the fat JARs:

```bash
# Run Thunder API
java -jar thunder-api/target/thunder-api-<VERSION>-fat.jar

# Run Thunder Admin (in another terminal)
java -jar thunder-admin/target/thunder-admin-<VERSION>-fat.jar
```

### Service URLs

When running with Docker, services are available at:

- **Thunder API**: http://localhost:8080
- **Thunder Admin**: http://localhost:8081
- **API Documentation (Scalar)**: http://localhost:8082
- **Health Checks**:
  - API: http://localhost:8080/healthcheck
  - Admin: http://localhost:8081/healthcheck

## Modules

Thunder consists of three main modules:

- **thunder-core**: Shared models, clients, utilities
- **thunder-api**: SDK + Debug REST APIs (port 8080)
- **thunder-admin**: Admin REST APIs (port 8081)

## Configuration

### Local Development

- `thunder-default.conf` with sensible defaults
- Override via `thunder.conf`

### Docker

- `AEROSPIKE_HOST` env var sets `aerospike.host`
- `aerospike.conf` is used for the DB container



