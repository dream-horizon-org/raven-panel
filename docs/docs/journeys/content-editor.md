---
sidebar_position: 5
---

# Content Editor

The Content Editor is where you design what users see in your nudges. It's a visual, no-code interface that lets you create engaging content for Tooltips, BottomSheets, and Popups with a live preview.

## Overview

The Content Editor has three main areas:

1. **Preview Panel** (Left) - See your nudge as users will see it
2. **Content Configuration** (Center) - Select templates and add elements
3. **Properties Panel** (Right) - Customize text, colors, spacing, and behavior

## Getting Started

When you create a journey and select an engagement type (Tooltip, BottomSheet, or Popup), the Content Editor opens automatically. You'll work through three tabs:

### Template Tab

Choose from pre-built template designs:

**For Tooltips:**
- Basic tooltip with title and subtitle
- Position options (top, bottom, left, right)

**For BottomSheets:**
- Basic bottom sheet
- Bottom sheet with call-to-action button
- Custom layouts

**For Popups:**
- Basic popup
- Popup with single button
- Popup with multiple buttons

:::tip
Start with a template that's close to what you need, then customize it. You can always add or remove elements later.
:::

### Content Tab

Customize the visual appearance and messaging of your nudge:

#### Text Configuration

- **Title** - Main heading text (e.g., "Welcome to Raven!")
- **Sub Title** - Supporting text or description
- **Font Size** - Control how large the text appears
- **Font Family** - Choose typography (Roboto, etc.)
- **Font Weight** - Make text bold or regular
- **Color** - Set text colors using hex codes
- **Alignment** - Left, center, or right align text

#### Behavior Settings

Control how the nudge interacts with users:

- **Auto Dismiss** - Automatically close after a set time (in milliseconds)
  - Example: `5000` = closes after 5 seconds
- **Dismiss On Outside Touch** - Allow users to close by tapping outside
- **Trigger Delay** - Wait before showing the nudge (in milliseconds)
  - Example: `2000` = shows 2 seconds after trigger

#### Layout & Styling

Make your nudge visually appealing:

- **Spacing** - Control margins and padding
  - Set top, right, bottom, and left spacing individually
  - Measured in dp (density-independent pixels)
- **Dimensions** - Set corner radius, height, and width
- **Background Color** - Choose the background color (hex codes)
  - Example: `#FFFFFF` for white, `#000000` for black

#### Advanced Options

- **Arrow Size** - For tooltips, control the size of the pointing arrow
- **Child Elements** - Add nested elements like:
  - **Vertical Stack** - Arrange elements vertically
  - **Horizontal Stack** - Arrange elements side by side
  - **Text** - Additional text elements
  - **Image** - Add images to your nudge

### Location Tab

Specify where the nudge appears (primarily for Tooltips):

- **Target Screen** - The screen or page where the nudge should appear
- **Target ID** - The specific element ID to attach the tooltip to

## Working with Elements

### Adding Elements

1. Click the **"Add Element"** button
2. Select an element type from the dropdown:
   - **Vertical Stack** - Stack elements vertically
   - **Horizontal Stack** - Arrange elements in a row
   - **Text** - Add text content
   - **Image** - Insert images
3. The element appears in your layout
4. Expand the element to configure its properties

### Configuring Elements

Each element has its own properties:

**Text Elements:**
- Content text
- Font size, weight, color
- Alignment

**Image Elements:**
- Image URL
- Alt text (for accessibility)
- Size and positioning
- Border radius

**Stack Elements:**
- Spacing between items
- Alignment
- Background color

### Removing Elements

Click the delete button (trash icon) on any element to remove it from your nudge.

## Live Preview

The preview panel on the left shows exactly how your nudge will appear to users:

- **Real-time updates** - Changes reflect immediately
- **Device frame** - See how it looks on mobile devices
- **Interactive preview** - Test how elements interact

:::tip
Always check the preview after making changes to ensure everything looks good on mobile devices.
:::

## Best Practices

### Content Design

1. **Keep messages short** - Users have limited attention spans
   - Tooltips: 5-10 words
   - BottomSheets: 1-2 sentences
   - Popups: Clear, concise messaging

2. **One clear action** - Each nudge should have one primary goal
   - Don't overwhelm users with multiple CTAs

3. **Match your brand** - Use colors and fonts consistent with your app
   - Maintain visual consistency across all nudges

4. **Mobile-first** - Design for the smallest screen first
   - Test on actual mobile devices when possible

### Text Guidelines

- **Tooltips**: Be brief and helpful
  - ✅ "Tap to create contest"
  - ❌ "This button allows you to create a new contest by tapping on it"

- **BottomSheets**: Provide context and value
  - ✅ "Join this contest now and win big prizes!"
  - ❌ "Contest"

- **Popups**: Be clear and direct
  - ✅ "Your session has expired. Please log in again."
  - ❌ "Error occurred"

### Visual Design

- **Contrast** - Ensure text is readable against backgrounds
- **Spacing** - Use adequate padding and margins
- **Colors** - Use your brand colors consistently
- **Images** - Optimize images for mobile (small file sizes)

### Behavior Settings

- **Auto dismiss** - Set appropriate times:
  - Tooltips: 3-5 seconds
  - BottomSheets: 5-10 seconds (or let users dismiss)
  - Popups: Usually require user action (no auto-dismiss)

- **Trigger delay** - Give users time to see the screen before showing nudges
  - 1-2 seconds is usually sufficient

## Common Workflows

### Creating a Simple Tooltip

1. Select **Tooltip** engagement type
2. Choose **Basic Tooltip** template
3. In Content tab:
   - Enter title: "New Feature"
   - Enter subtitle: "Tap here to explore"
4. In Location tab:
   - Set target screen
   - Set target element ID
5. Preview and adjust as needed

### Creating a Promotional BottomSheet

1. Select **BottomSheet** engagement type
2. Choose **BottomSheet with CTA** template
3. In Content tab:
   - Enter title: "Special Offer!"
   - Enter subtitle: "Get 50% off your next contest"
   - Customize button text: "Claim Offer"
   - Set background color to match brand
4. Configure behavior:
   - Enable "Dismiss on outside touch"
   - Set auto dismiss to 10 seconds
5. Preview and test

### Creating a Confirmation Popup

1. Select **Popup** engagement type
2. Choose **Popup with Single Button** template
3. In Content tab:
   - Enter title: "Confirm Action"
   - Enter subtitle: "Are you sure you want to proceed?"
   - Customize button text: "Confirm"
4. Configure behavior:
   - Disable auto dismiss (require user action)
   - Disable "Dismiss on outside touch" (if critical)
5. Preview and adjust

## Troubleshooting

### Changes Not Showing in Preview

- Switch tabs and come back
- Check if you're editing the correct element
- Refresh the page if issue persists

### Element Not Appearing

- Verify the element was added successfully
- Check if it's hidden behind other elements
- Ensure spacing isn't pushing it off-screen

### Text Too Small or Large

- Adjust font size in the Content tab
- Check preview on actual device if possible
- Use standard sizes (14-18px for body, 20-24px for titles)

## Next Steps

- **[Engagement Types](./engagement-types)** - Learn when to use each type
- **[Creating a Journey](./creating-journey)** - Complete journey setup
- **[Scheduling](./scheduling)** - Control when nudges appear

