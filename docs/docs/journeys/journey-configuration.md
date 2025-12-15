---
sidebar_position: 3
---

# Journey Configuration

Configure who sees your journey, when it runs, and how often engagements appear in the **"Journey Setup"** tab.

## Cohorts

Target specific user groups or all users.

### Options

- **All Users** - Journey applies to everyone
- **Specific Segment** - Choose a cohort from the dropdown

**Note:** Segments are created in your analytics platform and synced to Raven Panel.

### Cohort Types

| Type | Description | Example |
|------|-------------|---------|
| **Static** | Fixed user list | "Users who signed up in January 2024" |
| **Dynamic** | Auto-updates based on criteria | "Active users in last 7 days" |

---

## Frequency

Control how often users see engagements to prevent over-messaging.

### Frequency Types

| Type | Description | Example |
|------|-------------|---------|
| **Lifetime** | Maximum times ever | `1 lifetime` - Show once, ever |
| **Session** | Maximum per session | `2 session` - Show twice per session |
| **Period** | Maximum within timeframe | `1 per day` - Show once daily |

### Common Patterns

| Use Case | Lifetime | Session | Period |
|----------|----------|---------|--------|
| Welcome message | 1 | 1 | 1 per day |
| Feature discovery | 3 | 1 | 1 per day |
| Promotion | 20 | 2 | 5 per week |
| Critical alert | 1 | 1 | 1 per day |

**How it works:** All frequency rules work together. A user sees an engagement only if all limits (lifetime, session, and period) haven't been reached.

---

## Scheduling

Set when your journey is active.

### Schedule Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Immediate** | Starts when published | Ongoing campaigns |
| **Scheduled** | Starts at specific date/time | Time-limited campaigns |

### Configuration

1. Find the "Scheduling" section in the Journey Setup tab
2. Choose start type:
   - **As soon as published** - Immediate start
   - **At specific date/time** - Set future start
3. Optionally set end date/time

**Examples:**

**Ongoing Journey:**
- Start: As soon as published
- End: None

**Time-Limited Campaign:**
- Start: Nov 29, 2024 12:00 AM
- End: Dec 2, 2024 11:59 PM

---

## Pre-Publish Checklist

Before publishing your journey, ensure:

- ✅ Cohort selected
- ✅ Frequency rules configured
- ✅ Schedule set
- ✅ All nodes saved
- ✅ At least one engagement configured (recommended)
