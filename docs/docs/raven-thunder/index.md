---
id: index
title: Thunder Documentation
sidebar_label: Home
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div className="hero">
  <div className="container">
    <h1 className="hero__title">⚡ Thunder ⚡</h1>
    <p className="hero__subtitle">
      A powerful Java 17 + Vert.x platform for managing CTAs (Call-to-Actions), Nudges, and Behaviour Tags
    </p>
    <div className="hero__buttons">
    <a className="button button--primary button--lg" href="/docs/raven-thunder/getting-started/quickstart">
      Get Started
    </a>
    <a className="button button--secondary button--lg" href="/docs/raven-thunder/getting-started/overview">
      Learn More
    </a>
    </div>
  </div>
</div>

## Features

<div className="row">
  <div className="col col--4 margin-bottom--lg">
    <div className="card">
      <div className="card__header">
        <h3>🚀 Multi-Module Architecture</h3>
      </div>
      <div className="card__body">
        <p>
          Clean separation with <code>thunder-core</code>, <code>thunder-api</code>, and <code>thunder-admin</code> modules.
        </p>
      </div>
    </div>
  </div>
  <div className="col col--4 margin-bottom--lg">
    <div className="card">
      <div className="card__header">
        <h3>🔌 REST APIs</h3>
      </div>
      <div className="card__body">
        <p>
          Complete Admin API (19 endpoints) and SDK/Debug APIs (7 endpoints) for managing CTAs and Behaviour Tags.
        </p>
      </div>
    </div>
  </div>
  <div className="col col--4 margin-bottom--lg">
    <div className="card">
      <div className="card__header">
        <h3>💾 Aerospike Integration</h3>
      </div>
      <div className="card__body">
        <p>
          Reactive data access with RxJava3, complete with Docker setup, seed data, and indexes for local development.
        </p>
      </div>
    </div>
  </div>
</div>

<div className="row">
  <div className="col col--4 margin-bottom--lg">
    <div className="card">
      <div className="card__header">
        <h3>🐳 Docker Ready</h3>
      </div>
      <div className="card__body">
        <p>
          Full Docker Compose setup with Aerospike, automatic seed data, and pre-configured indexes.
        </p>
      </div>
    </div>
  </div>
  <div className="col col--4 margin-bottom--lg">
    <div className="card">
      <div className="card__header">
        <h3>✅ Health Checks</h3>
      </div>
      <div className="card__body">
        <p>
          Comprehensive health monitoring for services and Aerospike connectivity.
        </p>
      </div>
    </div>
  </div>
  <div className="col col--4 margin-bottom--lg">
    <div className="card">
      <div className="card__header">
        <h3>🧪 Testing</h3>
      </div>
      <div className="card__body">
        <p>
          CI with unit and integration tests, release as Docker images and fat JARs.
        </p>
      </div>
    </div>
  </div>
</div>

## Quick Start

<Tabs>
  <TabItem value="docker" label="Docker (Recommended)" default>
    ```bash
    # Clone the repository
    git clone https://github.com/dream-horizon-org/thunder.git
    cd thunder

    # Start all services with Docker Compose
    docker-compose up -d

    # Services will be available at:
    # - Admin API: http://localhost:8081
    # - SDK API: http://localhost:8080
    ```
  </TabItem>
  <TabItem value="local" label="Local Development">
    ```bash
    # Build the project
    mvn clean package

    # Run Admin service
    java -jar thunder-admin/target/thunder-admin-1.0.0-SNAPSHOT-fat.jar

    # Run API service (in another terminal)
    java -jar thunder-api/target/thunder-api-1.0.0-SNAPSHOT-fat.jar
    ```
  </TabItem>
</Tabs>

## Documentation Sections

- **[Getting Started](/docs/raven-thunder/getting-started/overview)** - Setup and quickstart guides
- **[Core Entities](/docs/raven-thunder/getting-started/core-entities)** - Understanding CTAs, Behaviour Tags, and Nudges
- **[Architecture](/docs/raven-thunder/architecture/modules)** - System architecture and design
- **[API Documentation](/docs/raven-thunder/api/scalar)** - Interactive API documentation with Scalar
- **[Admin Documentation](/docs/raven-thunder/admin/overview)** - Admin API endpoints and contracts
- **[Operations](/docs/raven-thunder/operations/docker)** - Docker, testing, CI/CD, and releases

## Requirements

- **Java 17** (OpenJDK or equivalent)
- **Maven 3.6+**
- **Docker & Docker Compose** (for Docker setup)
- **Node.js 20** (for documentation development)

---

<div className="margin-top--lg">
  <p>
    <strong>New to Thunder?</strong> Start with understanding the <a href="/docs/raven-thunder/getting-started/core-entities">Core Entities</a> (CTAs, Behaviour Tags, and Nudges), then check out the <a href="/docs/raven-thunder/getting-started/quickstart">Quickstart</a> guide.
  </p>
</div>
