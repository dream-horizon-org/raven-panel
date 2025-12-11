---
sidebar_position: 1
---

# Journeys Overview

## What is a Journey?

A **journey** is a complete user engagement flow that delivers timely nudges to users through in-app messages. Each journey consists of:

- **Content** - The nudge design (Tooltip, BottomSheet, or Popup) that users see
- **Targeting** - Which users receive the journey (user segments/cohorts)
- **Triggers** - When the journey activates (events, page views, scheduled times)
- **Configuration** - Frequency rules, scheduling, and behavior settings

Journeys are the core of Raven, allowing you to create, manage, and monitor user engagement flows that deliver contextual nudges at the right moments.

## Panel Interface

The Raven Panel provides an intuitive interface for managing journeys.

### Sidebar Navigation

The left sidebar provides access to:
- **Journeys** - Main journey management page
- **Dark Mode Toggle** - Switch between light and dark themes
- **User Profile** - View your account details

### Header Actions

The header contains:
- **Search Bar** - Search journeys by name
- **Create Journey Button** - Start creating a new journey

### Journeys Listing Page

The listing page serves as the main dashboard where you can view, search, filter, and manage all your journeys.

#### Header Section

The header displays:
- **Title**: Shows "Journeys" along with the total count of all journeys
- **Create Journey Button**: Click to navigate to the journey creation flow

#### Search Bar

The search bar allows you to search for a specific journey by name:
- Type to filter journeys in real-time
- Search is debounced (300ms delay) to prevent excessive API calls
- Clear button (X) appears when text is entered to reset search
- Search icon indicates the input purpose

#### Status Tabs

Journeys are organized by their current status. Click any tab to filter the list:

| Status | Description |
|--------|-------------|
| **All** | Shows all journeys regardless of status |
| **Draft** | Journeys being created/edited, not yet live |
| **Live** | Journeys actively reaching users |
| **Scheduled** | Journeys set to go live at a future date |
| **Paused** | Journeys temporarily stopped |
| **Concluded** | Journeys that completed their scheduled run |
| **Terminated** | Journeys permanently stopped |

Each tab displays a count badge showing the number of journeys in that status.

#### Journeys Table

The table displays detailed information about each journey:

| Column | Description |
|--------|-------------|
| **Title** | The name assigned to the journey, displayed with a unique emoji icon for easy identification |
| **Status** | Current status displayed as a colored badge/chip |
| **Created By** | The email/username of the user who created the journey |
| **Created On** | The date when the journey was created (formatted as "Dec 3, 2025") |
| **Actions** | Quick action buttons for the journey |

#### Actions

Each journey row has quick action buttons:

| Action | Icon | Description |
|--------|------|-------------|
| **Edit** | ✏️ Pencil | Open the journey editor to modify the journey |
| **Clone** | 📋 Copy | Create a duplicate of the journey |
| **More Options** | ⋮ Three dots | Opens additional actions menu |

#### More Options Menu

The three-dot menu provides additional actions:

| Action | Description | Permission Required |
|--------|-------------|---------------------|
| **Copy Journey ID** | Copies the journey ID to clipboard | View |
| **Make Live** | Publish a draft journey immediately | Publish |
| **Schedule** | Set a future publish date for the journey | Publish |
| **Pause** | Temporarily stop a live journey | Edit |
| **Terminate** | Permanently stop a journey | Edit |
| **Conclude** | Mark a journey as completed | Edit |

## Journey Lifecycle

Journeys follow a state machine with defined transitions:

```
┌──────────┐   Publish   ┌──────────┐
│  DRAFT   │────────────▶│   LIVE   │
└──────────┘             └──────────┘
     │                        │
     │                        ├───▶ PAUSED ───▶ (can resume to LIVE)
     │                        │
     │                        ├───▶ CONCLUDED (journey completed)
     │                        │
     └────────────────────────┴───▶ TERMINATED (permanently stopped)
```

**Or with scheduling:**

```
┌──────────┐   Schedule  ┌───────────┐   Auto    ┌──────────┐
│  DRAFT   │────────────▶│ SCHEDULED │──────────▶│   LIVE   │
└──────────┘             └───────────┘           └──────────┘
```

### Status Definitions

| Status | Description | Available Actions |
|--------|-------------|-------------------|
| **Draft** | Journey is being created or edited, not visible to users | Edit, Clone, Make Live, Schedule, Terminate |
| **Live** | Journey is published and actively reaching users | Pause, Conclude, Terminate |
| **Scheduled** | Journey is set to go live at a future date/time | Edit, Terminate |
| **Paused** | Journey is temporarily stopped, can be resumed | Resume (Make Live), Terminate |
| **Concluded** | Journey has completed its run as intended | Clone |
| **Terminated** | Journey is permanently stopped | Clone |

## Permissions

Raven implements role-based access control:

| Permission Level | Capabilities |
|------------------|--------------|
| **View Access** | View journeys list, view journey details, copy journey ID |
| **Edit Access** | Create journeys, edit journeys, clone journeys, pause/terminate journeys |
| **Publish Access** | Make journeys live, schedule journeys |

When a user lacks the required permission, the corresponding action buttons are disabled.

## Key Concepts

### Engagement Types

Journeys can use three types of nudges:
- **Tooltip** - Small contextual hints for feature discovery
- **BottomSheet** - Slide-up panels for promotions and CTAs
- **Popup** - Modal dialogs for critical messages

See **[Engagement Types](./engagement-types)** for detailed guidance.

### User Segments

Target specific user groups using cohorts:
- Import cohorts from analytics platforms
- Target all users or specific segments
- Combine multiple segments for precise targeting

See **[User Segments](./user-segments)** for more information.

### Event Triggers

Journeys activate based on:
- Page views
- Button clicks
- Custom events
- Scheduled times

See **[Event Triggers](./event-triggers)** for configuration details.

### Content Configuration

Design your nudges with:
- Custom text, colors, and styling
- Images and visual elements
- Interactive buttons and CTAs
- Live preview while editing

See **[Content Editor](./content-editor)** for design options.

### Scheduling & Frequency

Control when and how often journeys appear:
- Set start and end dates
- Configure frequency rules (lifetime, session, period-based)
- Schedule future activations

See **[Scheduling](./scheduling)** for advanced options.

## Next Steps

- **[Creating a Journey](./creating-journey)** - Step-by-step guide to build your first journey
- **[User Segments](./user-segments)** - Learn about targeting specific user groups
- **[Event Triggers](./event-triggers)** - Configure when journeys activate
- **[Content Editor](./content-editor)** - Design engaging nudge content
- **[Scheduling](./scheduling)** - Set timing and frequency rules

