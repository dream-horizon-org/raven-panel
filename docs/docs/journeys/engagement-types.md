---
sidebar_position: 7
---

# Engagement Types

Raven offers three primary engagement types to help you communicate with users in the most effective way. Each type serves different purposes and is designed for specific use cases.

## Overview

Engagement types determine **how** your nudge appears to users. Choose the right type based on:
- **Message importance** - How critical is the information?
- **User context** - What is the user doing?
- **Desired action** - What do you want the user to do?
- **User experience** - How intrusive should it be?

---

## Tooltip

**Tooltip** is a small, contextual hint that appears near a specific UI element. It's the least intrusive engagement type, perfect for providing helpful guidance without disrupting the user's workflow.

### When to Use Tooltips

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

### Characteristics

| Aspect | Details |
|--------|---------|
| **Appearance** | Small popup with arrow pointing to target element |
| **Position** | Near the specific UI element (top, bottom, left, or right) |
| **Size** | Compact - typically shows title and subtitle |
| **Dismissal** | Auto-dismisses after set time or when user interacts |
| **Interruption** | Minimal - doesn't block the screen |
| **Content** | Short, concise messages (1-2 sentences) |

### Real-World Examples

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

### Best Practices

1. **Keep it short** - Tooltips work best with 5-10 words
2. **Be specific** - Point to exact elements with clear IDs
3. **Timing matters** - Show tooltips when users are likely to need help
4. **Don't overuse** - Too many tooltips can be overwhelming
5. **Test positioning** - Ensure tooltips don't cover important content

### Configuration Options

- **Position**: Top, bottom, left, or right of target element
- **Arrow size**: Customize the pointing arrow
- **Auto dismiss**: Set automatic dismissal time
- **Trigger delay**: Wait before showing the tooltip
- **Target element**: Specify exact element ID to attach to

---

## BottomSheet

**BottomSheet** is a slide-up panel that appears from the bottom of the screen. It's more prominent than a tooltip but less intrusive than a popup, making it perfect for actions and information that need attention without completely blocking the interface.

### When to Use BottomSheets

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

### Characteristics

| Aspect | Details |
|--------|---------|
| **Appearance** | Panel sliding up from bottom of screen |
| **Position** | Anchored to bottom, can be dragged up/down |
| **Size** | Flexible - can be partial or full screen |
| **Dismissal** | Swipe down, tap outside, or close button |
| **Interruption** | Moderate - dims background but doesn't fully block |
| **Content** | Can include images, buttons, forms, and rich content |

### Real-World Examples

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

### Best Practices

1. **Clear value proposition** - Users should immediately understand the benefit
2. **Strong CTA** - Include prominent action buttons
3. **Visual appeal** - Use images and colors to make it engaging
4. **Easy dismissal** - Always allow users to close easily
5. **Mobile-optimized** - Design for thumb-friendly interactions
6. **Timing** - Show at moments when users are likely to engage

### Configuration Options

- **Height**: Control how much of the screen it covers
- **Background dimming**: Adjust the overlay darkness
- **Swipe gestures**: Enable/disable swipe to dismiss
- **Corner radius**: Customize the rounded top corners
- **Animation**: Control slide-up speed and easing

---

## Popup

**Popup** is a modal dialog that appears in the center of the screen with a darkened background overlay. It's the most attention-grabbing engagement type, designed for important messages that require immediate user response.

### When to Use Popups

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

### Characteristics

| Aspect | Details |
|--------|---------|
| **Appearance** | Centered modal with darkened background overlay |
| **Position** | Center of screen |
| **Size** | Medium to large - can be responsive |
| **Dismissal** | Close button, tap outside (if enabled), or action button |
| **Interruption** | High - blocks interaction with background |
| **Content** | Can include rich content, forms, images, and multiple buttons |

### Real-World Examples

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

### Best Practices

1. **Use sparingly** - Popups are disruptive, so use only when necessary
2. **Clear messaging** - Users should immediately understand what's needed
3. **Action clarity** - Make it obvious what users should do
4. **Easy exit** - Always provide a way to close (unless truly mandatory)
5. **Mobile-friendly** - Ensure buttons and text are easily tappable
6. **Frequency control** - Limit how often popups appear to avoid annoyance

### Configuration Options

- **Size**: Control width and height of the popup
- **Background overlay**: Adjust darkness and opacity
- **Dismiss on outside touch**: Allow/disable closing by tapping outside
- **Animation**: Control fade-in and scale effects
- **Button layout**: Single or dual button configurations

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

---

## Choosing the Right Type

### Decision Flow

1. **Is this critical information that requires immediate action?**
   - Yes → Use **Popup**
   - No → Continue

2. **Do you need to show rich content (images, forms, multiple buttons)?**
   - Yes → Use **BottomSheet** or **Popup**
   - No → Continue

3. **Is this a quick hint or contextual help?**
   - Yes → Use **Tooltip**
   - No → Use **BottomSheet**

### Common Patterns

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

## Advanced Tips

### Combining Engagement Types

You can create journeys that use multiple engagement types in sequence:

1. **Tooltip** → Points user to a feature
2. **BottomSheet** → Shows detailed information
3. **Popup** → Final confirmation or action

### Frequency Considerations

- **Tooltips**: Can appear more frequently (1-3 times per session)
- **BottomSheets**: Moderate frequency (1-2 times per session)
- **Popups**: Should be rare (1 time per session or less)

### A/B Testing

Test different engagement types for the same message to see which performs better:
- Tooltip vs BottomSheet for feature discovery
- BottomSheet vs Popup for promotions
- Different positioning for tooltips

---

## Next Steps

- **[Creating a Journey](./creating-journey)** - Learn how to set up engagements
- **[Content Editor](./content-editor)** - Design your engagement content
- **[Scheduling](./scheduling)** - Control when engagements appear
- **[Event Triggers](./event-triggers)** - Configure triggers for engagements

