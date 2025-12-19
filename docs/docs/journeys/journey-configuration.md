---
sidebar_position: 3
---

# Journey Configuration

Configure who sees your journey, when it runs, and how often engagements appear in the **"Journey Setup"** tab.

## Cohorts

Target specific user groups or all users.

### Options

- **All Users** - Journey applies to everyone
- **Specific Cohort** - Choose a cohort from the dropdown

**Note:** Cohorts are fetched from your cohort service API. Select from available cohorts in the dropdown menu.

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
- End: As specified

**Time-Limited Campaign:**
- Start: Nov 29, 2024 12:00 AM
- End: Dec 2, 2024 11:59 PM


