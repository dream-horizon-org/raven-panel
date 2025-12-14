---
sidebar_position: 1
---

# Journeys Overview

## What is a Journey?

A **journey** is a visual flow that maps user behavior through a series of steps (nodes) connected by transitions. Each journey represents a user's path through your application, from entry points to specific events, with optional rules and conditions that determine progression, ultimately leading to engagement moments where users receive targeted messages.

Journeys are the core of Raven, allowing you to create, manage, and monitor user engagement flows that deliver contextual nudges at the right moments based on user actions and behaviors.

## Example Journey

Here's an example of an E-Commerce Shopping Journey:

```
┌─────────────────────┐
│   Entry Node        │
│  User Opens App     │
└─────────────────────┘
         │
         │ Transition: "User is logged in"
         ▼
┌─────────────────────┐
│  Event Node         │
│  User Clicks Product│
└─────────────────────┘
         │
         │ Transition: "Product price > $50"
         ▼
┌─────────────────────┐
│  Event Node         │
│  User Adds to Cart  │
└─────────────────────┘
         │
         │ Transition: "Cart value > $100"
         ▼
┌─────────────────────┐
│  Event Node         │
│  User Returns to    │
│  Home               │
└─────────────────────┘
         │
         │ Transition
         ▼
┌─────────────────────┐
│  Engagement Node    │
│  Bottom Sheet       │
│  "Checkout          │
│   Suggestion"       │
└─────────────────────┘
```

**How it works:**
- A user opens the app (Entry Node)
- If the user is logged in, they progress to the "User Clicks Product" node
- When they click a product, if the product price is greater than $50, they move to "User Adds to Cart"
- When they add to cart, if the cart value exceeds $100, they move to "User Returns to Home"
- Finally, when they return home, they see a Bottom Sheet engagement suggesting checkout

**Key insight:** A transition from Node A to Node B occurs when Node A's event happens (not Node B's event). Once at Node B, the next transition will be triggered when Node B's event occurs.

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

Understanding these fundamental concepts is essential for building effective journeys:

### Node & Event

A **node** represents a step in a journey. Each node is identified by an event name, such as "User Opens App" or "User Clicks Product". 

**Important:** Conceptually, a node and its event are the same thing - the node is named after the event that triggers it. When that event occurs in your application, the user progresses to that node in the journey.

**Examples:**
- Entry Node: "User Opens App"
- Event Node: "User Clicks Product"
- Event Node: "User Adds to Cart"

### Transition

A **transition** is the act of moving from one node to another in the journey flow.

**Critical Understanding:** A transition from Node A (associated with event "ABC") to Node B occurs specifically when event "ABC" happens in the application, **not** when Node B's event occurs.

**Example:**
- If you have a transition from "User Clicks Product" (Node A) to "User Adds to Cart" (Node B)
- The transition happens when the "User Clicks Product" event fires
- Once the user is at Node B ("User Adds to Cart"), the subsequent transition will be triggered when the "User Adds to Cart" event occurs

### Rule/Condition

**Rules** (also called **conditions**) are optional checks that can be added to transitions. They appear visually on the arrows between nodes in the journey diagram.

For a transition to occur, **all specified rules must pass**. If any rule fails, the user remains at the current node.

**Examples:**
- "User is logged in"
- "Product price > $50"
- "Cart value > $100"
- "User has premium subscription"

Rules allow you to create conditional flows where users only progress if certain criteria are met.

### Engagement

An **engagement** is a message shown to users when they reach a specific node in the journey. Engagements are the actual nudges that users see and interact with.

**Engagement Types:**
- **Popup** - Modal dialogs for critical messages
- **Tooltip** - Small contextual hints for feature discovery
- **Bottom Sheet** - Slide-up panels for promotions and CTAs

Engagements are displayed to users when they reach the engagement node, making it the perfect place to deliver targeted messages based on their journey progress.

---

## Journey Components

### Engagement Types

Journeys can use three types of nudges:
- **Tooltip** - Small contextual hints for feature discovery
- **BottomSheet** - Slide-up panels for promotions and CTAs
- **Popup** - Modal dialogs for critical messages

See **[Engagements](./engagements)** for detailed guidance.

### User Segments

Target specific user groups using cohorts:
- Import cohorts from analytics platforms
- Target all users or specific segments
- Combine multiple segments for precise targeting

### Event Triggers

Journeys activate based on:
- Page views
- Button clicks
- Custom events
- Scheduled times

### Content Configuration

Design your nudges with:
- Custom text, colors, and styling
- Images and visual elements
- Interactive buttons and CTAs
- Live preview while editing

See **[Engagements](./engagements)** for detailed design options.

### Scheduling & Frequency

Control when and how often journeys appear:
- Set start and end dates
- Configure frequency rules (lifetime, session, period-based)
- Schedule future activations

## Next Steps

- **[Creating a Journey](./creating-journey)** - Step-by-step guide to build your first journey
- **[Transitions & Rules](./transitions-rules)** - Connect nodes with transitions and rules
- **[Engagements](./engagements)** - Learn about engagement types and how to add them

