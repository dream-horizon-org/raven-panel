---
sidebar_position: 2
---

# Creating a Journey

Creating a journey in Raven involves configuring when, how, and what to show to your users. The journey creation process is streamlined into two main sections: **Content** (what users see) and **Journey Setup** (who sees it and when).

## Overview

The create journey flow has been designed to be intuitive and efficient:

1. **Name Your Journey** - Give your journey a unique identifier
2. **Select Engagement Type** - Choose how the nudge appears (Tooltip, BottomSheet, or Popup)
3. **Design Content** - Configure the visual appearance and messaging
4. **Configure Journey Setup** - Define segments, triggers, scheduling, and frequency
5. **Create Journey** - Save as draft or publish immediately

---

## Getting Started

### Access Create Journey

1. Navigate to the Journeys listing page
2. Click the **"+ Create journey"** button in the top-right corner
3. You'll be taken to the journey creation interface

:::tip Permission Required
You need **Edit Access** permission to create journeys.
:::

---

## Journey Header

At the top of the create journey page, you'll see:

- **Back Arrow** - Return to the journeys listing
- **Journey Icon** - A unique emoji assigned to your journey
- **Journey Name Field** - Enter a unique name for your journey (required)
- **Info Icon** - Helpful tooltips about journey naming

**Best Practices for Naming:**
- Use descriptive names that indicate the purpose
- Include the target audience or event trigger
- Keep it concise but meaningful

Examples:
- ✅ `Welcome Tooltip for New Users`
- ✅ `Contest Reminder Bottom Sheet`
- ❌ `Test Journey 1`

---

## Tabs Overview

The journey creation interface has two main tabs:

### 1. Content Tab

Configure **what users see** - the visual design and user experience of your nudge.

- Select engagement type
- Choose templates
- Customize appearance
- Set up target location

### 2. Journey Setup Tab

Configure **who sees it and when** - targeting, triggers, and scheduling.

- Select user segments
- Configure event triggers
- Set schedule
- Define frequency rules

---

## Content Configuration

The Content tab is where you design the actual nudge that users will see.

### Step 1: Select Engagement Type

Choose from available engagement types:

| Type | Description | Status |
|------|-------------|--------|
| **Tooltip** | Small contextual hints near UI elements | ✅ Available |
| **BottomSheet** | Slide-up panel from bottom of screen | ✅ Available |
| **Popup** | Modal dialog in center of screen | ✅ Available |
| **Picture-in-Picture** | Overlay video or content in corner | 🔜 Coming Soon |
| **Element Spotlight** | Highlight and focus on specific elements | 🔜 Coming Soon |

**Selecting an Engagement Type:**
1. Click on the engagement card you want to use
2. The card will be marked as "Selected"
3. Configure the engagement details in the side panel

:::warning Changing Engagement Types
If you switch to a different engagement type after configuring one, all previous configuration will be lost. A confirmation dialog will appear before making the change.
:::

### Step 2: Configure Engagement

Once you select an engagement type, a configuration panel opens on the right with three tabs:

#### Template Tab

Choose from pre-built template variants:

**For Tooltips:**
- Basic tooltip with title and subtitle
- Position options (top, bottom, left, right)

**For BottomSheet/Popup:**
- Multiple template variants available
- Single or dual button layouts
- Different content arrangements
- Add new templates using the **"+"** button

#### Content Tab

Customize the content properties:

**Text Configuration:**
- **Title** - Main heading text
- **Sub Title** - Supporting text
- **Font Size** - Title and subtitle sizes
- **Font Family** - Typography selection (Roboto, etc.)
- **Font Weight** - Text thickness
- **Color** - Title and subtitle colors (hex codes)
- **Alignment** - Left, center, or right alignment

**Behavior Settings:**
- **Auto Dismiss** - Automatic dismissal time (in milliseconds)
- **Dismiss On Outside Touch** - Toggle to allow closing by tapping outside
- **Trigger Delay** - Delay before showing (in milliseconds)

**Layout & Styling:**
- **Spacing** - Margin and padding (in dp)
  - Top, Right, Bottom, Left for both margin and padding
- **Dimensions** - Corner radius, height, width
- **Background Color** - Set the background color (hex codes)

**Advanced:**
- **Arrow Size** - For tooltips (in pixels)
- **Child Elements** - Add and configure nested elements
  - Click **"Add Element"** button to add new elements
  - Select from: Vertical Stack, Horizontal Stack, Text, Image
  - Elements are added in order and can be removed with delete button
  - Expand each element to configure its properties and styles

#### Location Tab

Specify where the nudge should appear:

- **Target Screen** - The screen/page where the nudge appears
- **Target ID** - Specific element ID to attach to (for tooltips)

---

## Journey Setup Configuration

The Journey Setup tab defines who sees your nudge and when.

### Segments

Target specific user segments to control who sees your journey.

**What are Segments?**

Segments are predefined groups of users based on shared characteristics or behaviors. Examples:
- New users (joined in last 7 days)
- Premium subscribers
- Users who haven't completed onboarding
- Active users with high engagement

**Configuration:**

- **User Set Dropdown** - Select from available user segments
  - Choose "All Users" to target everyone
  - Select specific segments to target particular user groups

:::info
Segments must be created in your analytics platform first before they appear in Raven.
:::

### Trigger

Define what user actions or events trigger the journey.

**How Triggers Work:**

Triggers determine when your nudge appears based on real-time user activity.

**Configuration Steps:**

1. **Select Event** - Click the "Event" dropdown and choose from available events in your app
   - Page views
   - Button clicks
   - Custom events
   - System events

2. **Add Filter** (Optional) - Click the "Add Filter" button to add conditions
   - Only show the nudge when specific criteria are met
   - Filter by event properties
   - Use operators like equals, contains, greater than, etc.

**Example Triggers:**
- Show tooltip when `page_view` event fires
- Show bottom sheet when `button_click` event has property `button_id` equals `checkout`
- Show popup when `session_start` event fires for users inactive for 7+ days

:::tip Multiple Filters
Click "Add Filter" multiple times to create complex conditions with AND/OR logic.
:::

### Start date/time

Specify when the journey starts.

**Options:**

☑️ **As soon as journey is published**
- Journey goes live immediately after publishing
- Default option for most journeys
- No date picker needed

☑️ **At specific date/time**
- Schedule journey for future launch
- Opens a date/time picker
- Set exact start time for campaigns

**Use Cases:**
- **Immediate:** Feature announcements, bug fix notifications
- **Scheduled:** Campaign launches, seasonal promotions, timed events

### End date/time

Optionally specify when the journey should stop.

**Configuration:**

☑️ **At specific date/time**
- Set an exact end date and time
- Journey automatically stops at this time
- Useful for time-limited campaigns

**Leave unchecked** for ongoing journeys that run indefinitely until manually paused or terminated.

### Journey Frequency

Control how often users see the nudge to avoid over-communication.

**Frequency Controls:**

You can enable one, two, or all three frequency limits by checking the corresponding boxes:

☑️ **Allow user to enter journey up to [X] time(s) in lifetime**
- Total lifetime limit per user across all sessions
- Input: Number (e.g., 999)
- Example: `5` = show maximum 5 times ever to any user
- Use for: One-time announcements, onboarding flows

☑️ **Allow user to enter journey up to [X] time(s) in a session**
- Limit appearances within a single app session
- Input: Number (e.g., 999)
- Example: `1` = show once per session
- Use for: Contextual tooltips, session reminders

☑️ **Allow user to enter journey up to [X] time(s) in [Y] [duration]**
- Set a cap over a time period
- Inputs:
  - First number: How many times (e.g., 999)
  - Second number: Time value (e.g., 999)
  - Dropdown: Duration unit (days, hours, minutes, seconds)
- Example: `3 times in 7 days`
- Use for: Recurring campaigns, periodic reminders

**Best Practices:**
- **Enable all three** for maximum control
- **Start conservative** - e.g., 1 per session, 3 per week, 10 lifetime
- **Critical messages** can have higher frequency (e.g., 5 per session)
- **Informational nudges** should have lower frequency (e.g., 1 per day)
- **Monitor user feedback** and adjust frequency based on engagement data

**Example Configurations:**

| Journey Type | Session | Period | Lifetime |
|--------------|---------|--------|----------|
| Welcome Tooltip | 1 | 1 in 1 day | 1 |
| Feature Announcement | 2 | 5 in 7 days | 10 |
| Cart Reminder | 3 | 10 in 1 day | 999 |
| Survey Request | 1 | 1 in 30 days | 3 |

---

## Preview & Testing

### Real-Time Preview

The left panel shows a live preview of your nudge:

- **Device Frame** - See how it looks on a mobile device
- **Live Updates** - Changes reflect immediately
- **Template Visualization** - Preview different templates

### Testing Before Launch

Before publishing your journey:

1. ✅ Verify all required fields are filled
2. ✅ Preview the nudge appearance
3. ✅ Check trigger conditions are correct
4. ✅ Confirm targeting is appropriate
5. ✅ Test with a small cohort first (if possible)

---

## Saving & Publishing

### Save Actions

At the bottom of the page, you'll find action buttons:

| Button | Action |
|--------|--------|
| **Cancel** | Discard changes and return to listing |
| **Save as Draft** | Save journey without publishing |
| **Publish** | Make journey live immediately (requires Publish Access) |
| **Schedule** | Set future publish date (requires Publish Access) |

### Journey States After Creation

- **Draft** - Saved but not visible to users
  - Can edit all sections
  - Can delete without impact
  
- **Scheduled** - Set to go live at future date
  - Can edit before go-live time
  - Automatically becomes Live at scheduled time

- **Live** - Active and reaching users
  - Can pause or terminate
  - Limited editing (depends on configuration)

---

## Common Workflows

### Workflow 1: Quick Tooltip Creation

1. Enter journey name in the header
2. Click **Content** tab
3. Select **Tooltip** engagement type
4. Choose basic template variant
5. Update title and subtitle in Content tab
6. Set target screen and element ID in Location tab
7. Click **Journey Setup** tab
8. Select user segment from dropdown
9. Choose event trigger from Event dropdown
10. Check frequency options (e.g., 1 per session, 10 lifetime)
11. Keep "As soon as journey is published" checked
12. Click **Create Journey**

**Time Estimate:** 5-10 minutes

### Workflow 2: Complex BottomSheet Campaign

1. Enter journey name in the header
2. Click **Content** tab
3. Select **BottomSheet** engagement type
4. Choose template with multiple buttons
5. In Content tab, customize:
   - Title and subtitle text
   - Colors (background, text)
   - Font sizes and families
   - Button labels
   - Spacing and dimensions
6. Add child elements (images, stacks) if needed
7. Set target screen in Location tab
8. Click **Journey Setup** tab
9. Select appropriate user segment
10. Choose event trigger with filters
11. Check "At specific date/time" for start date
12. Set campaign launch date/time
13. Check "At specific date/time" for end date (optional)
14. Configure all three frequency options:
    - 2 times in a session
    - 5 times in 7 days
    - 20 times in lifetime
15. Click **Create Journey**

**Time Estimate:** 20-30 minutes

---

## Troubleshooting

### Can't Save Journey

**Problem:** "Create Journey" button is disabled or save fails

**Solutions:**
- ✅ Ensure journey name is filled in the header
- ✅ Verify an engagement type is selected
- ✅ Check that a user segment is selected
- ✅ Confirm at least one event trigger is configured
- ✅ Verify at least one frequency option is checked

### Template Not Updating

**Problem:** Changes in Content tab don't reflect in preview

**Solutions:**
- Switch tabs and come back
- Check if you're editing the correct element
- Refresh the page if issue persists

### Can't Find My Segment

**Problem:** User segment doesn't appear in the dropdown

**Solutions:**
- Check segment naming in your analytics platform
- Verify segment sync is working
- Wait a few minutes for cache refresh
- Contact admin if segment was just created
- Ensure you have proper permissions to access the segment

---

## Next Steps

- **[Learn about Scheduling](./scheduling)** - Advanced scheduling options
- **[Content Editor Deep Dive](./content-editor)** - Master the content editor
- **[Cohort Management](./cohorts)** - Understanding cohorts
- **[Event Triggers](./events)** - Advanced event configuration

