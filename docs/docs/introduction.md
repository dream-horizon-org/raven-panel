---
sidebar_position: 0
title: Introduction
---

# Introduction to Raven

Raven is a complete customer engagement platform that enables you to build intelligent, event-driven user experiences through personalized engagement formats. The platform consists of three integrated components working together to deliver contextual user guidance at scale.

## What is Raven?

Raven helps you enhance user experience by providing timely and relevant guidance to end-users through in-app engagements such as bottom sheets, popups, and tooltips. These engagements are dynamically triggered by specific events, ensuring users receive the right prompts precisely when they need them.

### Core Philosophy

Raven is built on the principle that great user experiences are contextual, timely, and non-intrusive. Instead of overwhelming users with information, Raven delivers the right message at the right moment, guiding them naturally through your application.

## Platform Overview

Raven consists of three integrated components:

### 1. **Raven Panel** (Web Dashboard)
A powerful Next.js web application for creating, managing, and orchestrating customer engagement journeys through an intuitive visual interface.

**Key Capabilities:**
- Visual journey builder with drag-and-drop interface
- Journey configuration and management
- Cohort targeting and frequency control
- Scheduling and automation
- Analytics and engagement tracking

### 2. **Raven Client** (Mobile SDK)
A React Native SDK that integrates seamlessly into your mobile applications to display engagements, tooltips, and event-driven interactions.

**Key Capabilities:**
- In-app engagement (nudges, bottom sheets)
- Native tooltip system with screen tracking
- Event-driven engagement triggers
- State machine DSL for complex flows
- Cross-platform (iOS & Android)
- Fully customizable UI components
- Fine-grained frequency control
- Behaviour tags for organizing engagements

### 3. **Raven Thunder** (Backend Service)
A high-performance Java 17 + Vert.x backend service that manages all engagement logic, journeys, and data storage.

**Key Capabilities:**
- Reactive architecture with Vert.x
- REST APIs (Admin API + SDK API)
- Aerospike integration for high-performance data access
- Docker-ready with complete setup
- Comprehensive health checks
- Full test coverage
- Real-time updates without app releases

## How It Works

1. **Create Journeys**: Use Raven Panel to visually design user journeys with triggers, conditions, and engagements.

2. **Configure Engagements**: Define what users see—nudges, tooltips, bottom sheets—and when they appear based on events.

3. **Integrate SDK**: Add Raven Client to your mobile app to receive and display engagements in real-time.

4. **Backend Processing**: Raven Thunder processes events, evaluates conditions, and delivers the right engagement at the right time.

5. **Track Performance**: Monitor engagement effectiveness through built-in analytics and insights.

## Use Cases

Raven is perfect for:

- **Onboarding New Users**: Guide first-time users through your app with contextual tooltips and step-by-step nudges
- **Feature Discovery**: Highlight new features and capabilities at the right moment to increase adoption
- **Conversion Optimization**: Reduce cart abandonment and drive conversions with timely prompts and offers
- **User Re-engagement**: Re-engage inactive users with personalized messages and relevant content

## Key Benefits

- **No Code Required**: Product managers and marketers can create engagement campaigns without engineering resources
- **Real-Time Updates**: Update engagements and journeys without releasing new app versions
- **Event-Driven**: Engagements trigger based on user actions, page views, or custom events
- **Fully Customizable**: Match your brand identity with complete control over colors, fonts, and styling
- **Open Source**: All components are open source, giving you full control and transparency

## Next Steps

Ready to get started? Check out the [Getting Started Guide](/docs/getting-started) to set up your first engagement campaign.

Or explore the individual components:
- [Raven Panel Documentation](/docs/raven-panel/intro)
- [Raven Client Documentation](/docs/raven-client/introduction)
- [Raven Thunder Documentation](/docs/raven-thunder/getting-started/overview)

