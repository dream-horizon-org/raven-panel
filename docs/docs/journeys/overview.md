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

Journeys have different statuses that change as you manage them.

### Standard Flow

<div style={{ display: 'flex', justifyContent: 'center', margin: '3rem 0', width: '100%', overflow: 'visible' }}>

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize': '18px', 'primaryColor': '#8b5cf6', 'primaryTextColor': '#000', 'primaryBorderColor': '#7c3aed', 'lineColor': '#8b5cf6', 'secondaryColor': '#a78bfa', 'tertiaryColor': '#c4b5fd', 'nodeBkgColor': '#fff', 'nodeBorder': '2px', 'clusterBkg': '#fff', 'clusterBorder': '2px', 'defaultLinkColor': '#8b5cf6', 'titleColor': '#000', 'edgeLabelBackground': '#fff', 'mainBkgColor': '#fff', 'secondBkgColor': '#fff', 'tertiaryBkgColor': '#fff', 'edgeLabelBackgroundSize': 'auto', 'edgeLabelFontSize': '12px'}, 'flowchart': { 'nodeSpacing': 80, 'rankSpacing': 100, 'curve': 'basis', 'padding': 20, 'useMaxWidth': false, 'htmlLabels': true, 'defaultRenderer': 'dagre-wrapper'}}}%%
flowchart LR
    A["📝<br/>DRAFT"] -->|Publish| B["🟢<br/>LIVE"]
    B -->|Pause| C["⏸️<br/>PAUSED"]
    C -->|Resume| B
    B -->|Conclude| D["✅<br/>CONCLUDED"]
    B -->|Terminate| E["🛑<br/>TERMINATED"]
    A -->|Terminate| E
    
    style A fill:#94a3b8,stroke:#64748b,stroke-width:4px,color:#000,min-width:120px,min-height:80px
    style B fill:#4ade80,stroke:#22c55e,stroke-width:5px,color:#000,min-width:120px,min-height:80px
    style C fill:#fbbf24,stroke:#f59e0b,stroke-width:4px,color:#000,min-width:120px,min-height:80px
    style D fill:#34d399,stroke:#10b981,stroke-width:4px,color:#000,min-width:120px,min-height:80px
    style E fill:#f87171,stroke:#ef4444,stroke-width:4px,color:#000,min-width:120px,min-height:80px
```

</div>

### Scheduled Flow

<div style={{ display: 'flex', justifyContent: 'center', margin: '3rem 0', width: '100%', overflow: 'visible' }}>

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize': '18px', 'primaryColor': '#8b5cf6', 'primaryTextColor': '#000', 'primaryBorderColor': '#7c3aed', 'lineColor': '#8b5cf6', 'secondaryColor': '#a78bfa', 'tertiaryColor': '#c4b5fd', 'nodeBkgColor': '#fff', 'nodeBorder': '2px', 'clusterBkg': '#fff', 'clusterBorder': '2px', 'defaultLinkColor': '#8b5cf6', 'titleColor': '#000', 'edgeLabelBackground': '#fff', 'mainBkgColor': '#fff', 'secondBkgColor': '#fff', 'tertiaryBkgColor': '#fff'}, 'flowchart': { 'nodeSpacing': 100, 'rankSpacing': 120, 'curve': 'basis', 'padding': 20, 'useMaxWidth': false, 'htmlLabels': true, 'defaultRenderer': 'dagre-wrapper'}}}%%
flowchart LR
    A["📝<br/>DRAFT"] -->|Schedule| B["📅<br/>SCHEDULED"]
    B -->|Auto Start| C["🟢<br/>LIVE"]
    C -->|Pause| D["⏸️<br/>PAUSED"]
    D -->|Resume| C
    C -->|Conclude| E["✅<br/>CONCLUDED"]
    C -->|Terminate| F["🛑<br/>TERMINATED"]
    A -->|Terminate| F
    B -->|Terminate| F
    
    style A fill:#94a3b8,stroke:#64748b,stroke-width:4px,color:#000,min-width:120px,min-height:80px
    style B fill:#60a5fa,stroke:#3b82f6,stroke-width:4px,color:#000,min-width:120px,min-height:80px
    style C fill:#4ade80,stroke:#22c55e,stroke-width:5px,color:#000,min-width:120px,min-height:80px
    style D fill:#fbbf24,stroke:#f59e0b,stroke-width:4px,color:#000,min-width:120px,min-height:80px
    style E fill:#34d399,stroke:#10b981,stroke-width:4px,color:#000,min-width:120px,min-height:80px
    style F fill:#f87171,stroke:#ef4444,stroke-width:4px,color:#000,min-width:120px,min-height:80px
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
- **[Transitions & Rules](./transitions-rules)** - Connect nodes with transitions and rules
- **[Engagements](./engagements)** - Learn about engagement types and how to add them

