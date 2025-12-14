---
sidebar_position: 6
---

# Engagements

Engagements are messages you show to users at specific steps in your journey. They help guide, inform, or prompt users to take action.

## What are Engagements?

Engagements are the actual messages, prompts, or notifications that users see when they reach certain nodes in your journey. They're the visible part of your journey that communicates with users.

**Key Points:**
- Engagements appear when users reach the node they're attached to
- They're shown when the node's event occurs
- You can add engagements to Entry Nodes, Regular Nodes, or create dedicated Engagement Nodes
- Multiple engagements can be added to the same node

---

## Engagement Types

Raven offers three types of engagements, each suited for different purposes. Choose the right type based on message importance, user context, desired action, and how intrusive you want the engagement to be.

### Tooltip

**Tooltip** is a small, contextual hint that appears near a specific UI element. It's the least intrusive engagement type, perfect for providing helpful guidance without disrupting the user's workflow.

**Visual:**
```
    ┌─────────────┐
    │  Tooltip    │
    │  (Small)    │
    └──────┬──────┘
           │
    [Target Element]
```

#### When to Use Tooltips

✅ **Best for:**
- Feature discovery and onboarding
- Explaining what a button or icon does
- Providing contextual help
- Highlighting new features
- Quick tips and hints

❌ **Not ideal for:**
- Critical announcements
- Actions requiring immediate attention
- Complex information
- Multi-step instructions

#### Characteristics

| Aspect | Details |
|--------|---------|
| **Appearance** | Small popup with arrow pointing to target element |
| **Position** | Near the specific UI element (top, bottom, left, or right) |
| **Size** | Compact - typically shows title and subtitle |
| **Dismissal** | Auto-dismisses after set time or when user interacts |
| **Interruption** | Minimal - doesn't block the screen |
| **Content** | Short, concise messages (1-2 sentences) |

#### Real-World Examples

**Onboarding Flow:**
- "Tap here to create your first contest"
- "This icon shows your notifications"
- "Swipe left to see more options"

**Feature Discovery:**
- "New! Try our quick contest creation"
- "Long press for more options"
- "This badge shows your achievements"

**Contextual Help:**
- "This shows your contest performance"
- "Tap to filter by date range"
- "Drag to reorder your list"

#### Best Practices

1. **Keep it short** - Tooltips work best with 5-10 words
2. **Be specific** - Point to exact elements with clear IDs
3. **Timing matters** - Show tooltips when users are likely to need help
4. **Don't overuse** - Too many tooltips can be overwhelming
5. **Test positioning** - Ensure tooltips don't cover important content

---

### Bottom Sheet

**Bottom Sheet** is a panel that slides up from the bottom of the screen. It's more prominent than a tooltip but less intrusive than a popup, making it perfect for actions and information that need attention without completely blocking the interface.

**Visual:**
```
┌─────────────────────┐
│                     │
│   Bottom Sheet      │
│   (Slide up)        │
│                     │
└─────────────────────┘
```

#### When to Use Bottom Sheets

✅ **Best for:**
- Call-to-action prompts (CTAs)
- Feature announcements
- Contest promotions
- Upsell opportunities
- Quick actions and confirmations
- Forms and surveys
- Product showcases

❌ **Not ideal for:**
- Critical errors or warnings
- Simple one-line messages
- Information that needs immediate blocking attention

#### Characteristics

| Aspect | Details |
|--------|---------|
| **Appearance** | Panel sliding up from bottom of screen |
| **Position** | Anchored to bottom, can be dragged up/down |
| **Size** | Flexible - can be partial or full screen |
| **Dismissal** | Swipe down, tap outside, or close button |
| **Interruption** | Moderate - dims background but doesn't fully block |
| **Content** | Can include images, buttons, forms, and rich content |

#### Real-World Examples

**Contest Promotions:**
- "Join this contest now and win big!"
- "Special offer: 50% off entry fees"
- "New contest starting in 5 minutes"

**Feature Announcements:**
- "Check out our new quick contest feature"
- "We've improved your dashboard experience"
- "New payment methods now available"

**Action Prompts:**
- "Complete your profile to unlock features"
- "Rate your experience with us"
- "Take our quick survey"

**Upsell Opportunities:**
- "Upgrade to Premium for exclusive contests"
- "Get 10% cashback on your next contest"
- "Join our VIP program today"

#### Best Practices

1. **Clear value proposition** - Users should immediately understand the benefit
2. **Strong CTA** - Include prominent action buttons
3. **Visual appeal** - Use images and colors to make it engaging
4. **Easy dismissal** - Always allow users to close easily
5. **Mobile-optimized** - Design for thumb-friendly interactions
6. **Timing** - Show at moments when users are likely to engage

---

### Popup

**Popup** is a modal dialog that appears in the center of the screen with a darkened background overlay. It's the most attention-grabbing engagement type, designed for important messages that require immediate user response.

**Visual:**
```
┌─────────────────────┐
│   Popup Modal       │
│   (Centered)        │
│                     │
│   [Close Button]    │
└─────────────────────┘
```

#### When to Use Popups

✅ **Best for:**
- Critical announcements
- Important confirmations
- Error messages requiring action
- Mandatory updates or changes
- Terms and conditions acceptance
- Account verification
- Security alerts

❌ **Not ideal for:**
- Casual information
- Frequent reminders
- Non-critical updates
- Simple notifications

#### Characteristics

| Aspect | Details |
|--------|---------|
| **Appearance** | Centered modal with darkened background overlay |
| **Position** | Center of screen |
| **Size** | Medium to large - can be responsive |
| **Dismissal** | Close button, tap outside (if enabled), or action button |
| **Interruption** | High - blocks interaction with background |
| **Content** | Can include rich content, forms, images, and multiple buttons |

#### Real-World Examples

**Critical Announcements:**
- "Important: Contest rules have been updated"
- "Your account verification is required"
- "New terms and conditions - please review"

**Confirmations:**
- "Are you sure you want to delete this contest?"
- "Confirm your payment details"
- "Accept the new privacy policy"

**Error Handling:**
- "Payment failed - please try again"
- "Network error - check your connection"
- "Session expired - please log in again"

**Mandatory Actions:**
- "Update required to continue using the app"
- "Please complete your KYC verification"
- "Accept terms to proceed"

#### Best Practices

1. **Use sparingly** - Popups are disruptive, so use only when necessary
2. **Clear messaging** - Users should immediately understand what's needed
3. **Action clarity** - Make it obvious what users should do
4. **Easy exit** - Always provide a way to close (unless truly mandatory)
5. **Mobile-friendly** - Ensure buttons and text are easily tappable
6. **Frequency control** - Limit how often popups appear to avoid annoyance

---

## Comparison Guide

### Quick Decision Matrix

| Scenario | Tooltip | BottomSheet | Popup |
|----------|---------|-------------|-------|
| **Feature discovery** | ✅ Best | ⚠️ Okay | ❌ Too much |
| **Contest promotion** | ❌ Too small | ✅ Best | ⚠️ Too intrusive |
| **Critical error** | ❌ Not visible | ⚠️ Okay | ✅ Best |
| **Quick tip** | ✅ Best | ❌ Overkill | ❌ Overkill |
| **Form submission** | ❌ Not suitable | ✅ Good | ✅ Good |
| **Terms acceptance** | ❌ Not suitable | ⚠️ Okay | ✅ Best |
| **Upsell offer** | ❌ Too small | ✅ Best | ⚠️ Too aggressive |

### Interruption Level

```
Tooltip        ████░░░░░░  (Low - 40%)
BottomSheet    ████████░░  (Medium - 80%)
Popup          ██████████  (High - 100%)
```

### Content Capacity

- **Tooltip**: 1-2 sentences, minimal formatting
- **BottomSheet**: Multiple paragraphs, images, buttons, forms
- **Popup**: Rich content, complex layouts, multiple CTAs

### User Control

- **Tooltip**: Auto-dismisses, minimal user action needed
- **BottomSheet**: User can swipe away or interact
- **Popup**: Requires explicit user action to dismiss

### Choosing the Right Type

**Decision Flow:**

1. **Is this critical information that requires immediate action?**
   - Yes → Use **Popup**
   - No → Continue

2. **Do you need to show rich content (images, forms, multiple buttons)?**
   - Yes → Use **BottomSheet** or **Popup**
   - No → Continue

3. **Is this a quick hint or contextual help?**
   - Yes → Use **Tooltip**
   - No → Use **BottomSheet**

**Common Patterns:**

**Onboarding Journey:**
- Start with **Tooltips** for feature discovery
- Use **BottomSheet** for important feature announcements
- Reserve **Popup** for terms acceptance

**Promotional Campaign:**
- Use **BottomSheet** for contest promotions
- Use **Popup** for limited-time critical offers
- Avoid **Tooltips** for promotions (too small)

**Error Handling:**
- Use **Tooltip** for non-critical hints
- Use **BottomSheet** for recoverable errors
- Use **Popup** for critical errors requiring action

---

## Adding an Engagement

Follow these steps to add an engagement to a node in your journey:

### Step 1: Configure Your Node

1. Click on the node where you want to add an engagement
2. Configure the node and **select an event first**
3. The event determines when the engagement will be shown

**Important:** You must select an event for the node before adding an engagement.

### Step 2: Navigate to Engagements Section

1. In the node configuration panel (on the right), scroll down
2. Find the **"In-App Engagements"** section
3. This section contains all engagement options for this node

### Step 3: Add an Engagement

1. Click the **"Add Engagement"** button
2. A new engagement configuration appears

### Step 4: Choose Engagement Type

1. Select the engagement type:
   - **Popup** - For important announcements
   - **Tooltip** - For contextual hints
   - **Bottom Sheet** - For promotions and CTAs

### Step 5: Design Your Message Content

The engagement panel opens with a visual editor where you can design your message.

#### Content Configuration

Configure the text and messaging:

- **Title** - Main heading (e.g., "Welcome!", "Special Offer")
- **Subtitle** - Supporting text or description
- **Body Text** - Additional details (for BottomSheets and Popups)
- **Font Size** - Control text size (14-24px recommended)
- **Font Weight** - Bold or regular text
- **Color** - Text color using hex codes (e.g., `#000000` for black)
- **Alignment** - Left, center, or right align text

#### Styling Options

Make your engagement visually appealing:

- **Background Color** - Set background using hex codes (e.g., `#FFFFFF` for white)
- **Spacing** - Control margins and padding (top, right, bottom, left)
- **Corner Radius** - Rounded corners for a modern look
- **Dimensions** - Set height and width (use `match_parent` or specific values)

#### Behavior Settings

Control how the engagement interacts with users:

- **Auto Dismiss** - Automatically close after a set time (in milliseconds)
  - Example: `5000` = closes after 5 seconds
  - Tooltips: 3-5 seconds, BottomSheets: 5-10 seconds
- **Dismiss On Outside Touch** - Allow users to close by tapping outside the engagement
- **Trigger Delay** - Wait before showing (in milliseconds)
  - Example: `2000` = shows 2 seconds after event trigger

#### Adding Elements

Build complex layouts by adding elements:

1. Click **"Add Element"** button
2. Choose element type:
   - **Vertical Stack** - Arrange elements vertically
   - **Horizontal Stack** - Arrange elements in a row
   - **Text** - Additional text blocks
   - **Image** - Insert images (provide image URL)
   - **Button** - Add action buttons
3. Configure each element's properties
4. Use the **live preview** to see changes in real-time

#### Location Settings (Tooltips Only)

For tooltips, specify where they appear:

- **Target Screen** - The screen/page where tooltip shows
- **Target Element ID** - The specific UI element to attach the tooltip to
- **Position** - Top, bottom, left, or right of the target element

#### Preview

The preview panel shows exactly how your engagement will appear to users. Changes reflect in real-time as you configure properties.

### Step 6: Save the Node

1. Click **"Save"** on the node
2. The engagement is now attached to the node
3. An Engagement Node (orange) appears connected to your node in the canvas

---

## Multiple Engagements

:::tip Pro Tip
You can add multiple engagements to the same step. For example, show a tooltip first, then a popup with more details. Users will see them in the order you add them.
:::

### How Multiple Engagements Work

When you add multiple engagements to a node:

1. **Order matters** - Engagements are shown in the order you add them
2. **Sequential display** - Users see one engagement at a time
3. **Dismissal triggers next** - When one engagement is dismissed, the next one appears (if configured)

### Example Use Case

**Node: "User Clicks Product"**

1. **First Engagement:** Tooltip - "Click to view details"
2. **Second Engagement:** Bottom Sheet - "Special offer: 20% off this product!"

**Result:** User clicks product → Tooltip appears → User dismisses tooltip → Bottom Sheet appears

### Best Practices for Multiple Engagements

- **Don't overwhelm** - Limit to 2-3 engagements per node
- **Logical sequence** - Start with less intrusive (Tooltip) → more intrusive (Popup)
- **Clear purpose** - Each engagement should have a distinct purpose
- **Test the flow** - Ensure the sequence makes sense to users

### Combining Engagement Types

You can create journeys that use multiple engagement types in sequence:

1. **Tooltip** → Points user to a feature
2. **BottomSheet** → Shows detailed information
3. **Popup** → Final confirmation or action

### Frequency Considerations

- **Tooltips**: Can appear more frequently (1-3 times per session)
- **BottomSheets**: Moderate frequency (1-2 times per session)
- **Popups**: Should be rare (1 time per session or less)

---

## Engagement vs Engagement Node

**Engagement:**
- The actual message/content (Popup, Tooltip, Bottom Sheet)
- Configured in the node's "In-App Engagements" section
- Shown to users when the node's event occurs

**Engagement Node:**
- Visual representation in the canvas (orange box)
- Appears automatically when you add an engagement to a node
- Shows the engagement type and name
- Connected to the node it's attached to

**Visual Representation:**
```
┌─────────────────────┐
│  Regular Node       │
│  "User Clicks..."   │
└─────────────────────┘
         │
         │ (Connected)
         ▼
┌─────────────────────┐
│  Engagement Node     │
│  Bottom Sheet        │
│  "Checkout..."       │
└─────────────────────┘
```

---

## When to Add Engagements

### Add Engagement When:

- ✅ You want to communicate with users at a specific step
- ✅ You need to guide users through a feature
- ✅ You want to show promotions or offers
- ✅ You need to collect user input or confirmation
- ✅ You want to provide contextual help

### Don't Add Engagement When:

- ❌ The node is just tracking an event (no user communication needed)
- ❌ You want a silent transition between steps
- ❌ The information is better shown in-app (not as a nudge)
- ❌ You're creating a complex multi-step flow (consider splitting)

---

## Best Practices

### Engagement Timing

- **Show at the right moment** - When users are likely to need the information
- **Don't interrupt critical flows** - Avoid engagements during important actions
- **Respect user context** - Consider what the user is doing

### Engagement Content

- **Keep it concise** - Users should understand quickly
- **Clear call-to-action** - If you want action, make it obvious
- **Match engagement type to message** - Use Popup for critical, Tooltip for hints

### Engagement Frequency

- **Don't overuse** - Too many engagements can annoy users
- **Use frequency rules** - Configure how often engagements appear
- **Test with real users** - Ensure engagements add value

---

## Engagement Configuration Checklist

Before saving a node with an engagement, ensure:

- ✅ **Node event is selected** - Engagement needs an event to trigger
- ✅ **Engagement type is chosen** - Popup, Tooltip, or Bottom Sheet
- ✅ **Content is configured** - At minimum, add title or message
- ✅ **Target element is set** - For Tooltips, specify which element to point to
- ✅ **Behavior is configured** - Auto-dismiss, delays, etc.
- ✅ **Node is saved** - Click "Save" to attach the engagement

---

## Troubleshooting

**Engagement Not Showing:**
- Verify the node's event is firing correctly
- Check that the engagement is properly configured
- Ensure frequency rules allow the engagement to show
- Verify users are reaching that node in the journey

**Engagement Showing at Wrong Time:**
- Check the node's event configuration
- Verify transition rules are correct
- Ensure the event fires when expected

**Multiple Engagements Not Working:**
- Check the order of engagements
- Verify each engagement is properly configured
- Ensure dismissal behavior is set correctly

**Tooltip Not Positioning Correctly:**
- Verify target element ID is correct
- Check element exists on the page
- Test positioning on different screen sizes

