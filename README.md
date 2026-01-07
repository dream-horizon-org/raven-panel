# Raven

[![Documentation](https://img.shields.io/badge/docs-live-brightgreen)](https://raven.dreamhorizon.org/)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)

Raven is a complete customer engagement platform that enables you to build intelligent, event-driven user experiences through in-app nudges, tooltips, and personalized engagements. The platform consists of three integrated components working together to deliver contextual user guidance at scale.

## 🌟 Overview

Raven helps you enhance user experience by providing timely and relevant guidance to end-users through in-app nudges such as bottom sheets, popups, and tooltips. These engagements are dynamically triggered by specific events, ensuring users receive the right prompts precisely when they need them.

### What is a Nudge?

A nudge is a subtle, non-intrusive prompt designed to guide users toward specific actions. These contextual in-app prompts are triggered by user actions, page views, or custom events, appearing at optimal moments for maximum effectiveness. Common examples include:

- Welcoming new users with onboarding tips
- Highlighting special offers during checkout
- Reminding users about abandoned shopping carts
- Celebrating milestone achievements

## 🏗️ Platform Components

Raven consists of three integrated components:

### 1. **Raven Panel** (Web Dashboard)
A powerful Next.js web application for creating, managing, and orchestrating customer engagement journeys through an intuitive visual interface.

**Key Features:**
- 🎨 Visual journey builder with drag-and-drop interface
- 📊 Journey configuration and management
- 🎯 Cohort targeting and frequency control
- ⏰ Scheduling and automation
- 📈 Analytics and engagement tracking

**📖 [Raven Panel Documentation →](https://raven.dreamhorizon.org/docs/raven-panel/intro)**

### 2. **Raven Client** (Mobile SDK)
A React Native SDK that integrates seamlessly into your mobile applications to display nudges, tooltips, and event-driven engagements.

**Key Features:**
- 🎯 In-app engagement (nudges, bottom sheets)
- 💬 Native tooltip system with screen tracking
- 📊 Event-driven engagement triggers
- 🔄 State machine DSL for complex flows
- 📱 Cross-platform (iOS & Android)
- 🎨 Fully customizable UI components
- ⏱️ Fine-grained frequency control
- 🏷️ Behaviour tags for organizing engagements

**📖 [Raven Client Documentation →](https://raven.dreamhorizon.org/docs/raven-client/introduction)**

### 3. **Raven Thunder** (Backend Service)
A high-performance Java 17 + Vert.x backend service that manages all engagement logic, journeys, and data storage.

**Key Features:**
- ⚡ Reactive architecture with Vert.x
- 🔌 REST APIs (Admin API + SDK API)
- 💾 Aerospike integration for high-performance data access
- 🐳 Docker-ready with complete setup
- ✅ Comprehensive health checks
- 🧪 Full test coverage
- 📱 Real-time updates without app releases

**📖 [Raven Thunder Documentation →](https://raven.dreamhorizon.org/docs/raven-thunder/getting-started/overview)**

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0
- **Java 17** (OpenJDK or equivalent)
- **Maven** 3.6+
- **Docker** and **Docker Compose** (for backend services)
- **React Native** >= 0.70 (for mobile app development)

### Complete Platform Setup

For a complete setup guide covering all three components, see the [Getting Started Guide](https://raven.dreamhorizon.org/docs/getting-started).

#### Step 1: Set Up Raven Panel (Web Dashboard)

```bash
# Navigate to panel directory
cd raven-panel

# Install dependencies
yarn install

# Configure environment
cp .env.template .env
# Edit .env with your configuration

# Start development server
yarn dev
```

Access the panel at: **http://localhost:3000**

**📖 [Panel Getting Started →](https://raven.dreamhorizon.org/docs/raven-panel/development/getting-started)**

#### Step 2: Set Up Raven Thunder (Backend)

```bash
# Clone the repository
git clone https://github.com/dream-horizon-org/raven-thunder.git
cd raven-thunder

# Start with Docker (Recommended)
docker-compose up -d --build

# Verify services
curl http://localhost:8081/healthcheck  # Admin API
curl http://localhost:8080/healthcheck  # SDK API
```

**📖 [Thunder Quick Start →](https://raven.dreamhorizon.org/docs/raven-thunder/getting-started/quickstart)**

#### Step 3: Set Up Raven Client (Mobile SDK)

```bash
# Install the package
npm install @dreamhorizonorg/raven-client
# or
yarn add @dreamhorizonorg/raven-client

# Install peer dependencies
npm install @react-navigation/native react-native-gesture-handler @gorhom/bottom-sheet

# iOS Setup
cd ios && pod install && cd ..
```

**📖 [Client Installation →](https://raven.dreamhorizon.org/docs/raven-client/getting-started/installation)**

## 📚 Documentation

Comprehensive documentation is available on our [Documentation Site](https://raven.dreamhorizon.org/docs/introduction).

### Documentation Sections

- **[Getting Started](https://raven.dreamhorizon.org/docs/getting-started)** - Complete platform setup guide
- **[Raven Panel](https://raven.dreamhorizon.org/docs/raven-panel/intro)** - Web dashboard documentation
- **[Raven Client](https://raven.dreamhorizon.org/docs/raven-client/introduction)** - Mobile SDK documentation
- **[Raven Thunder](https://raven.dreamhorizon.org/docs/raven-thunder/getting-started/overview)** - Backend service documentation

## 🔍 Core Concepts

### Journeys

A journey is a visual flow that maps user behavior through a series of steps (nodes) connected by transitions. Each journey represents a user's path through your application, from entry points to specific events, with optional rules and conditions that determine progression.

**Learn more:**
- [Journey Overview](https://raven.dreamhorizon.org/docs/raven-panel/journeys/overview)
- [Creating a Journey](https://raven.dreamhorizon.org/docs/raven-panel/journeys/creating-journey)
- [Journey Configuration](https://raven.dreamhorizon.org/docs/raven-panel/journeys/journey-configuration)

### State Machine DSL

Raven Client includes a powerful State Machine DSL that allows you to define complex user flows with conditional transitions, filters, and actions.

**Learn more:**
- [State Machine Overview](https://raven.dreamhorizon.org/docs/raven-client/state-machine-dsl/overview)
- [State Transitions](https://raven.dreamhorizon.org/docs/raven-client/state-machine-dsl/state-transitions)
- [Filters & Actions](https://raven.dreamhorizon.org/docs/raven-client/state-machine-dsl/filters)

### Engagements

Engagements are the actual prompts shown to users - nudges, tooltips, bottom sheets, and popups. They can be configured with custom content, styling, and behavior.

**Learn more:**
- [Nudges](https://raven.dreamhorizon.org/docs/raven-client/features/nudges)
- [Tooltips](https://raven.dreamhorizon.org/docs/raven-client/features/tooltips)
- [Engagement System](https://raven.dreamhorizon.org/docs/raven-client/core-concepts/cta-system)

## 🛠️ Development

### Raven Panel Development

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Run production server
yarn start
```

**📖 [Development Guide](https://raven.dreamhorizon.org/docs/raven-panel/development/getting-started)**

### Running Documentation Locally

```bash
cd docs
yarn install
yarn start
# Open http://localhost:3000
```

## 🚢 Deployment

Raven includes production-ready Dockerfiles and deployment configurations for all components.

### Raven Panel Deployment

```bash
# Build Docker image
docker build -t raven-panel:latest .

# Or use Docker Compose
docker-compose up -d --build
```

**📖 [Deployment Guide](https://raven.dreamhorizon.org/docs/raven-panel/development/deployment)**

### Raven Thunder Deployment

```bash
cd raven-thunder
docker-compose up -d --build
```

**📖 [Thunder Operations](https://raven.dreamhorizon.org/docs/raven-thunder/operations/docker)**

## 🧪 Testing

### Raven Panel

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch
```

**📖 [Testing Guide](https://raven.dreamhorizon.org/docs/raven-panel/development/testing)**

### Raven Thunder

```bash
cd raven-thunder
# Run all tests
mvn test

# Run integration tests
mvn verify
```

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

Copyright © 2025 Dream Horizon.

## 🔗 Related Repositories

- **[Raven Client](https://github.com/dream-horizon-org/raven-client)** - React Native SDK
- **[Raven Thunder](https://github.com/dream-horizon-org/raven-thunder)** - Backend service

## 📞 Support

- 📖 [Full Documentation](https://raven.dreamhorizon.org/)
- 🐛 [Report Bugs](https://github.com/dream-horizon-org/raven-panel/issues)
- 💬 [GitHub Discussions](https://github.com/dream-horizon-org/raven-panel/discussions)
- 💬 [Discord Community](https://discord.gg/NryqGzJU)
