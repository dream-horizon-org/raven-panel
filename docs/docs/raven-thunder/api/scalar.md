---
title: Scalar API Reference
---

## Interactive API Documentation

Thunder provides an interactive API documentation viewer powered by [Scalar](https://scalar.com/) that allows you to explore and test all API endpoints.

## Accessing Scalar

When running Thunder with Docker, Scalar is available at:

**http://localhost:8082**

## Features

- **Interactive API Explorer**: Browse and test all endpoints directly from your browser
- **Multiple API Specs**: Switch between Thunder API and Thunder Admin using the dropdown
  - **Thunder API**: SDK & Debug endpoints (port 8080)
  - **Thunder Admin**: Management endpoints for Journeys, Nudges, and Behaviour (port 8081)
- **Request/Response Examples**: View detailed request and response schemas
- **Try It Out**: Execute API calls directly from the documentation interface

## OpenAPI Specifications

Scalar displays the auto-generated OpenAPI 3.0 specifications:

- `thunder-api-openapi.yaml` - Thunder API (SDK endpoints)
- `thunder-admin-openapi.yaml` - Thunder Admin (Management endpoints)

These specifications are automatically generated during the Docker build process and are located in the `openapi/` directory.

## Usage

1. Start Thunder using Docker: `./scripts/docker/start.sh`
2. Open your browser and navigate to http://localhost:8082
3. Use the dropdown at the top to switch between Thunder API and Thunder Admin
4. Explore endpoints, view schemas, and test API calls directly from the interface

