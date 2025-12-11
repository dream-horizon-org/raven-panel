---
sidebar_position: 6
---

# Scheduling

Control when your journeys are active with flexible scheduling options. Set start and end dates, configure recurring schedules, and manage timezone settings.

## Schedule Types

### Immediate

Journey becomes active as soon as it's published:

```typescript
interface ImmediateSchedule {
  type: 'immediate';
  endDate?: Date; // Optional end date
}
```

### Scheduled

Journey activates at a specific date and time:

```typescript
interface ScheduledSchedule {
  type: 'scheduled';
  startDate: Date;
  endDate?: Date;
  timezone: string; // IANA timezone (e.g., 'America/New_York')
}
```

### Recurring

Journey runs on a repeating pattern:

```typescript
interface RecurringSchedule {
  type: 'recurring';
  startDate: Date;
  endDate?: Date;
  timezone: string;
  pattern: RecurrencePattern;
}

interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number; // Every X days/weeks/months
  daysOfWeek?: number[]; // 0-6 for weekly (Sunday = 0)
  dayOfMonth?: number; // 1-31 for monthly
  activeHours?: TimeRange;
}

interface TimeRange {
  start: string; // HH:mm format
  end: string;
}
```

## Timezone Handling

### Setting Timezone

Always specify timezone for scheduled journeys:

```tsx
<ScheduleSection>
  <DateTimePicker
    label="Start Date"
    value={startDate}
    onChange={setStartDate}
  />
  
  <TimezoneSelect
    value={timezone}
    onChange={setTimezone}
    options={TIMEZONES}
  />
</ScheduleSection>
```

### Common Timezones

| Timezone | Description |
|----------|-------------|
| `UTC` | Coordinated Universal Time |
| `America/New_York` | Eastern Time (US) |
| `America/Los_Angeles` | Pacific Time (US) |
| `Europe/London` | British Time |
| `Asia/Tokyo` | Japan Standard Time |

## Schedule UI Component

```tsx
function ScheduleSection({ value, onChange }) {
  return (
    <div className="schedule-section">
      <RadioGroup
        value={value.type}
        onChange={(type) => onChange({ ...value, type })}
      >
        <RadioButton value="immediate">
          Start immediately when published
        </RadioButton>
        <RadioButton value="scheduled">
          Schedule for later
        </RadioButton>
        <RadioButton value="recurring">
          Set recurring schedule
        </RadioButton>
      </RadioGroup>

      {value.type === 'scheduled' && (
        <ScheduledOptions value={value} onChange={onChange} />
      )}

      {value.type === 'recurring' && (
        <RecurringOptions value={value} onChange={onChange} />
      )}
    </div>
  );
}
```

## Active Hours

Restrict when journeys can trigger during the day:

```typescript
interface ActiveHoursConfig {
  enabled: boolean;
  start: string; // '09:00'
  end: string;   // '17:00'
  timezone: string;
  excludeWeekends: boolean;
}
```

### Example: Business Hours Only

```typescript
const businessHours: ActiveHoursConfig = {
  enabled: true,
  start: '09:00',
  end: '17:00',
  timezone: 'America/New_York',
  excludeWeekends: true,
};
```

## Schedule Examples

### One-Time Campaign

Run a journey for a limited time:

```typescript
const blackFridaySchedule = {
  type: 'scheduled',
  startDate: new Date('2024-11-29T00:00:00'),
  endDate: new Date('2024-12-02T23:59:59'),
  timezone: 'America/New_York',
};
```

### Weekly Newsletter Prompt

Prompt users every Monday:

```typescript
const weeklyPrompt = {
  type: 'recurring',
  startDate: new Date('2024-01-01'),
  timezone: 'UTC',
  pattern: {
    frequency: 'weekly',
    interval: 1,
    daysOfWeek: [1], // Monday
    activeHours: {
      start: '10:00',
      end: '12:00',
    },
  },
};
```

### Daily Engagement

Show content every day during peak hours:

```typescript
const dailyEngagement = {
  type: 'recurring',
  startDate: new Date('2024-01-01'),
  timezone: 'America/Los_Angeles',
  pattern: {
    frequency: 'daily',
    interval: 1,
    activeHours: {
      start: '18:00',
      end: '21:00',
    },
  },
};
```

## Validation

### Schedule Validation Rules

```typescript
function validateSchedule(schedule: JourneySchedule): ValidationResult {
  const errors: string[] = [];

  // Start date must be in the future (for scheduled)
  if (schedule.type === 'scheduled') {
    if (schedule.startDate < new Date()) {
      errors.push('Start date must be in the future');
    }
  }

  // End date must be after start date
  if (schedule.endDate && schedule.startDate) {
    if (schedule.endDate <= schedule.startDate) {
      errors.push('End date must be after start date');
    }
  }

  // Active hours validation
  if (schedule.activeHours) {
    const start = parseTime(schedule.activeHours.start);
    const end = parseTime(schedule.activeHours.end);
    if (end <= start) {
      errors.push('Active hours end must be after start');
    }
  }

  return { valid: errors.length === 0, errors };
}
```

## Best Practices

### Timing Considerations

1. **Know your audience** - Schedule based on user timezone patterns
2. **Avoid off-hours** - Don't trigger journeys at 3 AM
3. **Test timing** - Verify schedules work across timezones
4. **Plan ahead** - Set up scheduled campaigns early

### Common Pitfalls

| Issue | Solution |
|-------|----------|
| Wrong timezone | Always explicitly set timezone |
| DST issues | Use IANA timezone names, not offsets |
| Overlap | Check for conflicting journey schedules |
| Expired schedules | Monitor and clean up old journeys |

