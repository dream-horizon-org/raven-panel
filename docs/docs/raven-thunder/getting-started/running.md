---
title: Running
---

## Using Docker Scripts

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

## Direct JAR Execution

You can also run the services directly using the fat JARs:

```bash
# Run Thunder API
java -jar thunder-api/target/thunder-api-<VERSION>-fat.jar

# Run Thunder Admin (in another terminal)
java -jar thunder-admin/target/thunder-admin-<VERSION>-fat.jar
```

## Service URLs

When running with Docker, services are available at:

- **Thunder API**: http://localhost:8080
- **Thunder Admin**: http://localhost:8081
- **API Documentation (Scalar)**: http://localhost:8082
- **Health Checks**:
  - API: http://localhost:8080/healthcheck
  - Admin: http://localhost:8081/healthcheck



