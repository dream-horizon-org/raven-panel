---
sidebar_position: 6
---

# Engagements

Engagements are messages you show to users at specific steps in your journey. They help guide, inform, or prompt users to take action. Engagements appear when users reach the node they're attached to, triggered by the node's event.

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

#### When to Use

| Best For | Not Ideal For | Examples |
|:---------|:--------------|:---------|
| Feature discovery, onboarding, contextual help, quick tips | Critical announcements, complex information | "Tap here to create contest", "This icon shows notifications" |

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

#### When to Use

| Best For | Not Ideal For | Examples |
|:---------|:--------------|:---------|
| CTAs, promotions, feature announcements, upsells, forms | Critical errors, simple one-line messages | "Join contest now and win big!", "Upgrade to Premium for exclusive contests" |

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

#### When to Use

| Best For | Not Ideal For | Examples |
|:---------|:--------------|:---------|
| Critical announcements, confirmations, errors requiring action, terms acceptance | Casual information, frequent reminders, simple notifications | "Contest rules updated - please review", "Are you sure you want to delete?", "Payment failed - try again" |

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

**Quick Decision:**
- **Critical/urgent** → Popup
- **Promotions/CTAs** → Bottom Sheet
- **Hints/help** → Tooltip

---

## Adding an Engagement

To add an engagement to a node:

1. Click on the node where you want to add an engagement
2. **Select an event first** (required before adding engagement)
3. Find the **"In-App Engagements"** section in the configuration panel
4. Click **"Add Engagement"**
5. Choose engagement type (Popup, Tooltip, or Bottom Sheet)
6. Design your message in the visual editor:
   - Configure text (title, subtitle, body)
   - Set styling (colors, fonts, spacing)
   - Configure behavior (auto-dismiss, delays)
   - Add elements (stacks, images, buttons)
   - For tooltips: Set target screen and element ID
7. Use the live preview to see changes
8. Click **"Save"** on the node

An Engagement Node (orange) appears connected to your node in the canvas.

See **[Creating a Journey](./creating-journey)** for detailed step-by-step instructions.

---

## Multiple Engagements

You can add multiple engagements to the same node. Users will see them in the order you add them, one at a time.

**Example:** Show a tooltip first, then a bottom sheet with more details.

**Best Practice:** Limit to 2-3 engagements per node and start with less intrusive types (Tooltip) before more intrusive ones (Popup).

---

## Best Practices

- **Timing** - Show engagements when users are likely to need the information
- **Content** - Keep messages concise with clear call-to-action
- **Frequency** - Don't overuse; configure frequency rules to limit appearances
- **Type selection** - Match engagement type to message importance (Popup for critical, Tooltip for hints)

