---
sidebar_position: 1
slug: /
---

# Raven - Real-Time Nudge Platform

## Introduction

Raven is an innovative tool designed to significantly enhance user experience by providing timely and relevant guidance to end-users through in-app nudges. These nudges are dynamically triggered by specific events and conditions in real-time, ensuring that users receive the right prompts precisely when they need them.

By leveraging real-time data and event-driven triggers, Raven helps users make better decisions, engage more effectively with the application, and ultimately boosts business performance. This tool integrates seamlessly into the user interface, offering subtle yet effective guidance without interrupting the user's workflow, thus creating a more intuitive and supportive user journey.

## What is a Nudge?

A nudge is a subtle prompt or suggestion aimed at influencing user behaviour without being forceful or intrusive. It's commonly used in digital platforms to encourage users to take specific actions, such as completing a task, making a purchase, or engaging with content. Nudges are often triggered by user behaviour or system events and are designed to be timely and relevant.

Nudges are gentle in-app prompts aimed at guiding users to take specific actions, such as joining contests, updating their profiles, or completing important tasks. These nudges are triggered based on user behaviour or key events. The goal is to improve engagement and enhance the user experience by offering timely reminders or suggestions without being intrusive.

## Problem Statement

When there's a need to nudge users to boost business outcomes or provide critical information, this traditionally requires significant development effort across multiple teams (product, design, development). Each requirement goes through the entire Software Development Life Cycle (SDLC) including planning, design, development, testing, and deployment.

**Key Challenges:**
- Significant overhead for developers each time a nudge requirement arises
- Multiple stages and coordination across different teams
- Delays in responding to real-time user behavior
- Missed opportunities due to lack of timely, relevant prompts

## How Raven Solves This

Raven streamlines the nudge creation process by offering:

<table>
<thead>
<tr>
<th>Advantage</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>No/Less Code</strong></td>
<td>Nudges can be created and modified with minimal development effort.</td>
</tr>
<tr>
<td><strong>No Release Required</strong></td>
<td>Updates can be made without a full app release.</td>
</tr>
<tr>
<td><strong>Configurable UI</strong></td>
<td>Nudges are presented in customizable formats.</td>
</tr>
<tr>
<td><strong>Real-Time Triggers</strong></td>
<td>Users receive contextual nudges exactly when needed.</td>
</tr>
</tbody>
</table>

## Features

Raven includes the following capabilities:

- ✅ **[Engagement Types](./features/engagement-types)** - Choose the right nudge format (Tooltip, BottomSheet, Popup)
- ✅ **[Journeys Listing](./features/journeys)** - View, filter, and manage all user journeys
- ✅ **[Create Journey](./features/create-journey)** - Build new journeys with intuitive interface
- ✅ **[User Segments](./features/cohorts)** - Target specific user segments
- ✅ **[Event Triggers](./features/events)** - Configure event-based triggers
- ✅ **[Content Editor](./features/content-editor)** - Design in-app content with live preview
- ✅ **[Scheduling](./features/scheduling)** - Schedule journeys with flexible timing
- ✅ **Status Management** - Manage journey lifecycle (Draft → Live → Paused, etc.)

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library with latest features |
| **Material UI 7** | Component library |
| **TanStack Query** | Server state management |
| **TypeScript** | Type safety |

## Quick Start

Get up and running with Raven in minutes:

```bash
# Clone the repository
git clone https://github.com/dream-horizon-org/raven-panel.git

# Navigate to the project
cd raven-panel

# Install dependencies
yarn install

# Start the development server
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Next Steps

- [Getting Started](./getting-started) - Set up your development environment
- [Journeys](./features/journeys) - Learn about journey management and the listing page
- [Content Editor](./features/content-editor) - Design in-app content
- [Scheduling](./features/scheduling) - Configure journey schedules
