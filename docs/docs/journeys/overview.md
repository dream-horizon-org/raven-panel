---
sidebar_position: 1
---

# Journeys Overview

## What is a Journey?

A **journey** is a visual flow that maps user behavior through a series of steps (nodes) connected by transitions. Each journey represents a user's path through your application, from entry points to specific events, with optional rules and conditions that determine progression, ultimately leading to engagement moments where users receive targeted messages.


## Example Journey

Here's an example of an E-Commerce Shopping Journey:

<div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>

```mermaid
flowchart TD
    A[🚀 User Opens App] -->|User is logged in| B[🛍️ User Clicks Product]
    B -->|Product price > $50| C[🛒 User Adds to Cart]
    C -->|Cart value > $100| D[🏠 User Returns to Home]
    D --> E[📱 Bottom Sheet<br/>Checkout Suggestion]
    
    style A fill:#4ade80,stroke:#22c55e,stroke-width:3px,color:#000
    style B fill:#60a5fa,stroke:#3b82f6,stroke-width:2px,color:#000
    style C fill:#60a5fa,stroke:#3b82f6,stroke-width:2px,color:#000
    style D fill:#60a5fa,stroke:#3b82f6,stroke-width:2px,color:#000
    style E fill:#fbbf24,stroke:#f59e0b,stroke-width:3px,color:#000
```

</div>

**Let's follow a user through this journey:**

Imagine Sarah is shopping on your app:

1. **Sarah opens the app** → The journey starts tracking her
2. **Is Sarah logged in?** → Yes! She moves to the next step
3. **Sarah clicks on a product** → The product costs $75 (over $50), so she moves forward
4. **Sarah adds it to her cart** → Her cart total is now $120 (over $100), so she continues
5. **Sarah goes back to the home page** → A Bottom Sheet pops up suggesting she checkout

**What happens behind the scenes:**
- When Sarah opens the app, the journey starts
- The journey waits for her to click a product (and checks if she's logged in)
- Once she clicks a product, the journey waits for her to add it to cart (and checks the price)
- Once she adds to cart, the journey waits for her to return home (and checks the cart value)
- When she returns home, the Bottom Sheet appears

Think of it like a path: Sarah walks along it, and at each step, the journey checks if she meets the conditions before letting her continue.

:::note Important
All user actions in this example (opening the app, clicking a product, adding to cart, returning home) must have corresponding events associated with them in your application.
:::



## Journey Lifecycle

Journeys have different statuses that change as you manage them. The following diagram shows all possible state transitions for a Journey:

<div style={{ display: 'flex', justifyContent: 'center', margin: '3rem 0', width: '100%', overflow: 'visible' }}>

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize': '18px', 'fontFamily': 'system-ui, -apple-system, sans-serif', 'primaryColor': '#8b5cf6', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#6b7280', 'secondaryColor': '#a78bfa', 'tertiaryColor': '#c4b5fd', 'nodeBkgColor': '#fff', 'nodeBorder': '3px', 'clusterBkg': '#fff', 'clusterBorder': '2px', 'defaultLinkColor': '#4b5563', 'titleColor': '#1f2937', 'edgeLabelBackground': '#ffffff', 'mainBkgColor': '#fff', 'secondBkgColor': '#fff', 'tertiaryBkgColor': '#fff', 'edgeLabelBackgroundSize': 'auto', 'edgeLabelFontSize': '14px', 'edgeLabelFontWeight': '600'}, 'flowchart': { 'nodeSpacing': 70, 'rankSpacing': 90, 'curve': 'basis', 'padding': 25, 'useMaxWidth': false, 'htmlLabels': true, 'defaultRenderer': 'dagre-wrapper'}}}%%
flowchart TD
    Start([Journey Created]) --> DRAFT["<b>DRAFT</b><br/><span style='font-size:14px;color:#475569'>Being created/edited</span>"]
    DRAFT -->|"<b>Schedule for future</b>"| SCHEDULED["<b>SCHEDULED</b><br/><span style='font-size:14px;color:#475569'>Will become active</span>"]
    DRAFT -->|"<b>Activate immediately</b>"| LIVE["<b>LIVE</b><br/><span style='font-size:14px;color:#475569'>Active and responding</span>"]
    SCHEDULED -->|"<b>Start time reached</b>"| LIVE
    LIVE -->|"<b>Pause</b>"| PAUSED["<b>PAUSED</b><br/><span style='font-size:14px;color:#475569'>Temporarily stopped</span>"]
    LIVE -->|"<b>Complete naturally</b>"| CONCLUDED["<b>CONCLUDED</b><br/><span style='font-size:14px;color:#475569'>Completed purpose</span>"]
    LIVE -->|"<b>Terminate</b>"| TERMINATED["<b>TERMINATED</b><br/><span style='font-size:14px;color:#475569'>Manually stopped</span>"]
    PAUSED -->|"<b>Resume</b>"| LIVE
    PAUSED -->|"<b>Terminate</b>"| TERMINATED
    CONCLUDED --> End1([End])
    TERMINATED --> End2([End])
    
    style Start fill:#f1f5f9,stroke:#64748b,stroke-width:4px,color:#1e293b,font-weight:bold
    style DRAFT fill:#dbeafe,stroke:#2563eb,stroke-width:4px,color:#1e40af,font-weight:bold
    style SCHEDULED fill:#fed7aa,stroke:#f97316,stroke-width:4px,color:#c2410c,font-weight:bold
    style LIVE fill:#dcfce7,stroke:#16a34a,stroke-width:4px,color:#166534,font-weight:bold
    style PAUSED fill:#fce7f3,stroke:#db2777,stroke-width:4px,color:#9f1239,font-weight:bold
    style CONCLUDED fill:#f3e8ff,stroke:#9333ea,stroke-width:4px,color:#6b21a8,font-weight:bold
    style TERMINATED fill:#fee2e2,stroke:#dc2626,stroke-width:4px,color:#991b1b,font-weight:bold
    style End1 fill:#f1f5f9,stroke:#64748b,stroke-width:4px,color:#1e293b,font-weight:bold
    style End2 fill:#f1f5f9,stroke:#64748b,stroke-width:4px,color:#1e293b,font-weight:bold
```

</div>

### Status Definitions

| Status | Description | Available Actions |
|:-------|:------------|:------------------|
| **Draft** | Journey is being created or edited, not visible to users | Edit, Clone, Make Live, Schedule, Terminate |
| **Live** | Journey is published and actively reaching users | Pause, Conclude, Terminate |
| **Scheduled** | Journey is set to go live at a future date/time | Edit, Terminate |
| **Paused** | Journey is temporarily stopped, can be resumed | Edit, Make Live, Terminate |
| **Concluded** | Journey has completed its run as intended | Clone |
| **Terminated** | Journey is permanently stopped | Clone |

## Next Steps

- **[Creating a Journey](./creating-journey)** - Step-by-step guide to build your first journey
- **[Transitions & Conditions](./transitions-rules)** - Connect nodes with transitions and conditions
- **[Engagements](./engagements)** - Learn about engagement types and how to add them

