---
sidebar_position: 1
title: Getting Started
---

# Getting Started

Welcome to Raven! This guide will help you set up and run the complete Raven platform, including the backend (Thunder), web dashboard (Dashboard), and mobile SDK (Client).

## Overview

Raven is a complete customer engagement platform consisting of three integrated components:

- **Raven Thunder** - High-performance backend service for managing CTAs, nudges, and behavior tags
- **Raven Dashboard** - Visual journey builder and web dashboard for orchestrating customer engagement flows
- **Raven Client** - React Native SDK for in-app messaging, nudges, tooltips, and event-driven engagements

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** >= 18.0
- **Java 17** (OpenJDK or equivalent)
- **Maven** 3.6+
- **Docker** and **Docker Compose** (for backend services)
- **React Native** >= 0.70 (for mobile app development)
- **npm**, **yarn**, or **pnpm** package manager

### Platform Requirements

- **iOS Development**: Xcode 14+ (for iOS apps)
- **Android Development**: Android Studio with Android SDK (for Android apps)

## Quick Start

Follow these steps to get the complete Raven platform running:

### Step 1: Set Up Raven Thunder (Backend)

Raven Thunder is the backend service that manages all engagement logic and data.

#### Option A: Using Docker (Recommended)

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/dream-horizon-org/raven-thunder.git
   cd raven-thunder
   ```

2. **Start all services with Docker Compose**:
   ```bash
   docker-compose up -d --build
   ```

3. **Verify services are running**:
   - Admin API: http://localhost:8081
   - SDK API: http://localhost:8080
   - Aerospike: localhost:3000

#### Option B: Local Development

1. **Build the project**:
   ```bash
   mvn clean package
   ```

2. **Run Admin service**:
   ```bash
   java -jar thunder-admin/target/thunder-admin-1.0.0-SNAPSHOT-fat.jar
   ```

3. **Run API service** (in another terminal):
   ```bash
   java -jar thunder-api/target/thunder-api-1.0.0-SNAPSHOT-fat.jar
   ```

For detailed setup instructions, see the [Raven Thunder Getting Started Guide](/docs/raven-thunder/getting-started/quickstart).

### Step 2: Set Up Raven Dashboard (Web Dashboard)

Raven Dashboard is the web interface for creating and managing customer journeys.

1. **Navigate to the panel directory**:
   ```bash
   cd raven-panel
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.template .env
   # Edit .env and configure your settings
   ```

4. **Start the development server**:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. **Access the panel**:
   - Open http://localhost:3000 in your browser
   - Log in with your credentials

For detailed setup instructions, see the [Raven Dashboard Development Guide](/docs/raven-panel/development/getting-started).

### Step 3: Set Up Raven Client (Mobile SDK)

Raven Client is the React Native SDK that integrates into your mobile app.

1. **Install the package**:
   ```bash
   npm install @dreamhorizonorg/raven-client
   # or
   yarn add @dreamhorizonorg/raven-client
   ```

2. **Install peer dependencies**:
   ```bash
   npm install @react-navigation/native react-native-gesture-handler @gorhom/bottom-sheet
   ```

3. **iOS Setup**:
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Initialize the SDK** in your app:
   ```typescript
   import { nudgeClient } from '@dreamhorizonorg/raven-client';

   // Initialize with your configuration
   await nudgeClient.initialize({
     apiUrl: 'http://localhost:8080', // Your Thunder API URL
     // ... other configuration
   });
   ```

For detailed setup instructions, see the [Raven Client Installation Guide](/docs/raven-client/getting-started/installation).

## Configuration

### Environment Variables

#### Raven Thunder

Create a `.env` file in the `raven-thunder` directory:

```env
# Database Configuration
AEROSPIKE_HOST=localhost
AEROSPIKE_PORT=3000

# API Configuration
ADMIN_API_PORT=8081
SDK_API_PORT=8080
```

#### Raven Dashboard

Create a `.env` file in the `raven-panel` directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8081

# Database Configuration
DATABASE_URL=your_database_url

# Authentication
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

#### Raven Client

Configure in your React Native app:

```typescript
const config = {
  apiUrl: 'http://localhost:8080', // Thunder SDK API
  appId: 'your-app-id',
  userId: 'user-id',
  // ... other configuration
};
```

## Testing the Complete Setup

### 1. Verify Backend is Running

```bash
# Check Thunder Admin API
curl http://localhost:8081/health

# Check Thunder SDK API
curl http://localhost:8080/health
```

### 2. Verify Panel is Accessible

- Open http://localhost:3000
- You should see the Raven Dashboard login page

### 3. Test Mobile SDK Connection

In your React Native app:

```typescript
import { nudgeClient } from '@dreamhorizonorg/raven-client';

// Test connection
const isConnected = await nudgeClient.checkConnection();
console.log('Connected:', isConnected);
```

## Next Steps

Now that you have the complete platform running:

1. **Create Your First Journey**
   - Open Raven Dashboard
   - Navigate to Journeys
   - Create a new journey with triggers and engagements
   - See [Creating a Journey](/docs/raven-panel/journeys/creating-journey)

2. **Integrate SDK in Your App**
   - Follow the [Quick Start Guide](/docs/raven-client/getting-started/quick-start)
   - Set up event tracking
   - Configure state machines

3. **Learn the Concepts**
   - [Engagement System](/docs/raven-client/core-concepts/cta-system)
   - [State Machine DSL](/docs/raven-client/state-machine-dsl/overview)
   - [Journey Configuration](/docs/raven-panel/journeys/journey-configuration)

## Troubleshooting

### Backend Issues

- **Services not starting**: Check Docker logs with `docker-compose logs`
- **Port conflicts**: Ensure ports 8080, 8081, and 3000 are available
- **Aerospike connection**: Verify Aerospike is running with `docker ps`

### Panel Issues

- **Build errors**: Run `yarn install` again and check Node.js version
- **API connection**: Verify `NEXT_PUBLIC_API_URL` points to correct Thunder API
- **Database errors**: Check database connection string in `.env`

### Client SDK Issues

- **Installation errors**: Ensure React Native version >= 0.70
- **iOS build errors**: Run `pod install` in the `ios` directory
- **Connection errors**: Verify API URL and network connectivity

For more help, see:
- [Raven Client Troubleshooting](/docs/raven-client/troubleshooting)
- [Raven Thunder Operations](/docs/raven-thunder/operations/docker)

## Additional Resources

- **Raven Dashboard Documentation**: [Development Guide](/docs/raven-panel/development/getting-started)
- **Raven Client Documentation**: [Installation Guide](/docs/raven-client/getting-started/installation)
- **Raven Thunder Documentation**: [Quickstart Guide](/docs/raven-thunder/getting-started/quickstart)

## Support

- 📖 Read the [full documentation](/docs)
- 🐛 Report bugs on [GitHub Issues](https://github.com/dream-horizon-org/raven-panel/issues)
- 💬 Ask questions in [GitHub Discussions](https://github.com/dream-horizon-org/raven-panel/discussions)

---

Made with ❤️ by Horizon Engineering

