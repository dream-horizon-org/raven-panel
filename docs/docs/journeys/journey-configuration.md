---
sidebar_position: 3
---

# Journey Configuration

Configure who sees your journey, when it runs, and how often engagements appear in the **"Journey Setup"** tab.

## Configuration Components

| Component | Purpose |
|-----------|---------|
| **Cohorts** | Define which users see the journey |
| **Frequency** | Control how often users see engagements |
| **Scheduling** | Set when the journey is active |

---

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

### Best Practices

- Use specific segments for targeted campaigns
- Use "All Users" for general announcements
- Check user counts before publishing

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

### How It Works

Frequency rules work together using **AND** logic:

```
User sees engagement IF:
  Lifetime limit NOT reached AND
  Session limit NOT reached AND
  Period limit NOT reached
```

**Example:** If set to `5 lifetime`, `2 session`, `1 per day`:
- User can't see it more than 5 times ever
- User can't see it more than twice in current session
- User can't see it more than once today

---

## Scheduling

Set when your journey is active.

### Schedule Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Immediate** | Starts when published | Ongoing campaigns |
| **Scheduled** | Starts at specific date/time | Time-limited campaigns |

### Configuration

1. Go to "Journey Setup" tab
2. Find "Scheduling" section
3. Choose start type:
   - **As soon as published** - Immediate start
   - **At specific date/time** - Set future start
4. Optionally set end date/time
5. Select timezone (for scheduled journeys)

### Examples

**Ongoing Journey:**
- Start: As soon as published
- End: None

**Campaign:**
- Start: Nov 29, 2024 12:00 AM
- End: Dec 2, 2024 11:59 PM
- Timezone: America/New_York

### Timezone Guidelines

- Always specify timezone for scheduled journeys
- Use IANA names: `America/New_York`, `Europe/London`, `Asia/Tokyo`
- Consider your audience's timezone
- Account for daylight saving time

---

## Configuration Workflow

### Steps

1. Build journey flow in "UI & Content" tab
2. Save all nodes
3. Go to "Journey Setup" tab
4. Configure:
   - Select cohort
   - Set frequency rules
   - Configure scheduling
5. Publish or schedule

### Pre-Publish Checklist

- ✅ Cohort selected
- ✅ Frequency rules configured
- ✅ Schedule set
- ✅ All nodes saved
- ✅ At least one engagement configured (recommended)

### Quick Configurations

**Immediate Launch:**
```
Cohort: All Users
Frequency: 1 lifetime, 1 session
Schedule: Immediate, no end
```

**Targeted Campaign:**
```
Cohort: Premium Users
Frequency: 3 lifetime, 1 per day
Schedule: Immediate, ends in 30 days
```

**Scheduled Announcement:**
```
Cohort: All Users
Frequency: 1 lifetime
Schedule: Specific date, ends after 1 week
```
