---
sidebar_position: 6
---

# Engagements

Engagements are messages you show to users at specific steps in your journey. They appear when users reach the node they're attached to, triggered by the node's event.

## Engagement Types

Raven offers three types of engagements:

### Tooltip

A small, contextual hint that appears near a specific UI element. Least intrusive, perfect for helpful guidance without disrupting workflow.

| Best For | Not Ideal For | Examples |
|:---------|:--------------|:---------|
| Feature hints, onboarding tips, quick guidance | Critical messages, complex content | "Tap here to create", "This shows notifications" |

### Bottom Sheet

A sheet that slides up from the bottom of the screen. Ideal for actions and information that need attention without blocking the entire interface.

| Best For | Not Ideal For | Examples |
|:---------|:--------------|:---------|
| Promotions, feature announcements, forms | Critical errors, simple notifications | "New feature available", "Upgrade to Premium" |

### Popup

A modal dialog that appears in the center of the screen with a faint background overlay. Most attention-grabbing, designed for important messages requiring immediate user response.

| Best For | Not Ideal For | Examples |
|:---------|:--------------|:---------|
| Critical messages, confirmations, errors, terms acceptance | Casual info, frequent reminders | "Delete confirmation", "Payment failed" |

---

## Adding an Engagement

To add an engagement to a node:

1. Click on the node where you want to add an engagement
2. Select an event first (required before adding engagement)
3. Find the **"In-App Engagements"** section in the configuration panel
4. Click **"Add Engagement"**
5. Choose engagement type (Popup, Tooltip, or Bottom Sheet)
6. Design your message in the visual editor:
   - Configure text, styling, and behavior
   - Add elements (stacks, images, buttons)
   - For tooltips: Set target screen and element ID
7. Click **"Save"** on the node

An Engagement Node (orange) appears connected to your node in the canvas.

---

## Multiple Engagements

You can add multiple engagements to the same journey, but not multiple engagements to the same node. Each node can have only one engagement attached to it.
