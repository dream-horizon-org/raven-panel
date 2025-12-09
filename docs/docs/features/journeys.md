---
sidebar_position: 1
---

# Journeys

The Journeys feature is the core of Raven. It allows you to create, manage, and monitor user engagement journeys that deliver timely nudges to your users.

## Listing Page

The listing page provides an overview of all journeys created in Raven. It serves as the main dashboard where panel users can view, search, filter, and manage their journeys.

### Header Section

The header displays:
- **Title**: Shows "Journeys" along with the total count of all journeys
- **Create Journey Button**: Click to navigate to the journey creation flow

### Search Bar

The search bar allows users to search for a specific journey by name:

- Type to filter journeys in real-time
- Search is debounced (300ms delay) to prevent excessive API calls
- Clear button (X) appears when text is entered to reset search
- Search icon indicates the input purpose

### Status Tabs

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

### Journeys Table

The table displays detailed information about each journey:

| Column | Description |
|--------|-------------|
| **Title** | The name assigned to the journey, displayed with a unique emoji icon for easy identification |
| **Status** | Current status displayed as a colored badge/chip |
| **Created By** | The email/username of the user who created the journey |
| **Created On** | The date when the journey was created (formatted as "Dec 3, 2025") |
| **Actions** | Quick action buttons for the journey |

#### Bulk Selection

The table supports selecting multiple journeys using checkboxes:
- **Header checkbox**: Select/deselect all journeys on the current page
- **Row checkboxes**: Select individual journeys
- **Indeterminate state**: Shows when some (but not all) journeys are selected

### Actions

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

### Pagination

Navigate through large lists of journeys using:

- **Previous button** (←): Go to the previous page
- **Next button** (→): Go to the next page  
- **Page numbers**: Click to jump to a specific page
- **Page size selector**: Choose how many journeys to display per page (10, 20, 50, or 100)

### Empty State

When no journeys exist or match the current filters, a friendly empty state is shown with:
- An illustration (paper airplane being designed)
- Message: "All quiet on the journeys front."
- Subtext: "You don't have any journeys yet. Create a new journey to get started."

### Loading States

- **Initial load**: Shows a centered loading spinner
- **Fetching/filtering**: Shows a semi-transparent overlay with spinner while maintaining table visibility
- **Error state**: Displays error message if journey loading fails

---

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

---

## Permissions

Raven implements role-based access control:

| Permission Level | Capabilities |
|------------------|--------------|
| **View Access** | View journeys list, view journey details, copy journey ID |
| **Edit Access** | Create journeys, edit journeys, clone journeys, pause/terminate journeys |
| **Publish Access** | Make journeys live, schedule journeys |

When a user lacks the required permission, the corresponding action buttons are disabled.

---

## Creating a Journey

Click the **"+ Create journey"** button to start building a new journey. The button is disabled if you don't have edit permissions.

The create journey flow is organized into two main tabs:

1. **Content** - Design the nudge (Tooltip, BottomSheet, or Popup)
   - Select engagement type
   - Choose template variant
   - Customize appearance and content
   - Set target location

2. **Journey Setup** - Configure targeting and behavior
   - Select user segments (target audience)
   - Configure event triggers
   - Set schedule (start/end dates)
   - Define frequency rules

See **[Creating a Journey](./create-journey)** for a complete step-by-step guide.

---

## Dark Mode Support

The journeys listing page fully supports dark mode:
- Toggle available in the sidebar
- All components adapt to the selected theme
- Status badges, icons, and table styling adjust automatically
