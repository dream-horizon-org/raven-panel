---
sidebar_position: 2
---

# Creating a Journey

Create journeys to show nudges (Tooltips, BottomSheets, or Popups) to users at the right time.

## Process Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CREATE JOURNEY                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  1. Name Journey      │
              └───────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │     2. CONTENT TAB               │
        │  (What users see)                │
        ├─────────────────────────────────┤
        │ • Select Engagement Type         │
        │   (Tooltip/BottomSheet/Popup)    │
        │ • Choose Template                │
        │ • Customize:                     │
        │   - Text (Title, Subtitle)      │
        │   - Colors & Styling            │
        │   - Behavior (Auto-dismiss)     │
        │ • Set Location (for Tooltips)    │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │    3. JOURNEY SETUP TAB          │
        │  (Who sees it & when)            │
        ├─────────────────────────────────┤
        │ • Select User Segment            │
        │ • Configure Event Trigger        │
        │ • Set Start/End Date            │
        │ • Configure Frequency Rules      │
        └─────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  4. Save & Publish    │
              │  Draft | Publish      │
              │  | Schedule           │
              └───────────────────────┘
```

## Quick Start

1. Click **"+ Create journey"** from Journeys listing
2. Enter journey name
3. Configure **Content** tab → Design the nudge
4. Configure **Journey Setup** tab → Set targeting & triggers
5. Save as Draft or Publish

:::tip Permission
You need **Edit Access** to create journeys.
:::

---

## Content Tab

### Step 1: Select Engagement Type

| Type | Use Case |
|------|----------|
| **Tooltip** | Quick hints, feature discovery |
| **BottomSheet** | Promotions, CTAs, announcements |
| **Popup** | Critical messages, confirmations |

See **[Engagement Types Guide](./engagement-types)** for details.

### Step 2: Configure Engagement

**Template Tab:**
- Choose pre-built template
- Add new templates with **"+"** button

**Content Tab:**
- **Text:** Title, Subtitle, Font size/weight/color, Alignment
- **Behavior:** Auto-dismiss time, Dismiss on outside touch, Trigger delay
- **Style:** Spacing (margin/padding), Dimensions, Background color
- **Elements:** Add Vertical/Horizontal Stacks, Text, Images

**Location Tab:**
- **Target Screen:** Where nudge appears
- **Target ID:** Element ID (for Tooltips)

---

## Journey Setup Tab

### Segments

Select user segment from dropdown:
- Choose "All Users" or specific segment
- Segments must be created in analytics platform first

### Trigger

1. **Select Event** from dropdown (page views, button clicks, custom events)
2. **Add Filter** (optional) - Set conditions using operators (equals, contains, etc.)

**Examples:**
- `page_view` event → Show tooltip
- `button_click` with `button_id = checkout` → Show bottom sheet

### Schedule

**Start:**
- ☑️ As soon as published (immediate)
- ☑️ At specific date/time (scheduled)

**End:**
- ☑️ At specific date/time (optional)
- Leave unchecked for ongoing journeys

### Frequency

Control how often users see the nudge:

- ☑️ **Lifetime:** Up to X times ever
- ☑️ **Session:** Up to X times per session
- ☑️ **Period:** Up to X times in Y days/hours

**Examples:**
- Welcome tooltip: 1 session, 1 per day, 1 lifetime
- Promo bottom sheet: 2 session, 5 per week, 20 lifetime

---

## Preview & Save

**Preview:** Left panel shows live preview of your nudge

**Save Actions:**
- **Cancel** - Discard changes
- **Save as Draft** - Save without publishing
- **Publish** - Make live immediately (requires Publish Access)
- **Schedule** - Set future publish date (requires Publish Access)

**Journey States:**
- **Draft** - Not visible to users, fully editable
- **Scheduled** - Will go live at set time
- **Live** - Active and reaching users

---

## Common Workflows

### Quick Tooltip (5-10 min)

1. Name journey
2. Content tab → Select Tooltip → Choose template
3. Set title/subtitle → Set location (screen + element ID)
4. Journey Setup → Select segment → Choose event → Set frequency
5. Publish

### BottomSheet Campaign (20-30 min)

1. Name journey
2. Content tab → Select BottomSheet → Choose template
3. Customize: text, colors, buttons, spacing
4. Journey Setup → Segment → Trigger with filters → Schedule → Frequency
5. Publish or Schedule

---

## Troubleshooting

**Can't Save:**
- Check: Journey name, engagement type selected, segment selected, trigger configured, frequency set

**Template Not Updating:**
- Switch tabs and return, or refresh page

**Segment Missing:**
- Verify in analytics platform, wait for sync, check permissions

---

## Next Steps

- **[Engagement Types](./engagement-types)** - When to use each type
- **[Content Editor](./content-editor)** - Content design guide
- **[Scheduling](./scheduling)** - Advanced scheduling
- **[Event Triggers](./event-triggers)** - Event configuration
