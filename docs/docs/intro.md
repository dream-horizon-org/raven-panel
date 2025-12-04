---
sidebar_position: 1
slug: /
---

# Welcome to Raven Panel

**Raven Panel** is a powerful customer journey management platform built with Next.js 15, React 19, and Material UI. It enables teams to create, manage, and optimize user engagement journeys with ease.

## What is Raven Panel?

Raven Panel provides a comprehensive suite of tools for managing customer journeys:

- 🚀 **Journey Builder** - Create sophisticated user journeys with an intuitive visual editor
- 👥 **Cohort Management** - Define and target specific user segments
- ⚡ **Event Triggers** - Set up precise event-based triggers for your journeys
- 📝 **Content Editor** - Design engaging in-app content with live preview
- 📅 **Smart Scheduling** - Schedule journeys with flexible timing options
- 🔐 **Multi-tenant Support** - Manage multiple organizations from a single platform

## Quick Start

Get up and running with Raven Panel in minutes:

```bash
# Clone the repository
git clone https://github.com/your-org/raven-panel.git

# Navigate to the project
cd raven-panel

# Install dependencies
yarn install

# Start the development server
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

Raven Panel is built with modern technologies:

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library with latest features |
| **Material UI 7** | Component library |
| **TanStack Query** | Server state management |
| **React Hook Form** | Form handling |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |

## Architecture Overview

```
src/
├── api/           # API service layer
├── app/           # Next.js App Router pages
│   ├── Auth/      # Authentication components
│   ├── dashboard/ # Main dashboard features
│   └── providers/ # React context providers
├── components/    # Shared UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries
└── theme/         # Material UI theme config
```

## Next Steps

- [Getting Started](./getting-started) - Set up your development environment
- [Architecture](./architecture) - Understand the project structure
- [Journeys](./features/journeys) - Learn about journey management
- [API Reference](./api/overview) - Explore the API layer

