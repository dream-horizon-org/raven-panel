---
title: Core Entities
sidebar_position: 2
---

Understanding Thunder's core entities is essential for effectively using the platform. This guide explains CTA Journeys, Behaviour, and Nudges in detail.

## CTA Journeys (Call-to-Actions)

A **CTA Journey (Call-to-Action)** is a user journey or campaign that guides users through a specific flow or action. CTA Journeys are the primary entities in Thunder that define what actions users should take.

### Key Features

- **State Machine**: Each CTA Journey uses a state machine to track user progress through different states
- **Rules & Eligibility**: CTA Journeys define who can see them (cohort eligibility) and when they should be shown
- **Frequency Control**: Limits how often a CTA Journey can be shown to users (per session, time window, or lifetime)
- **Status Management**: CTA Journeys have lifecycle statuses: `DRAFT`, `SCHEDULED`, `LIVE`, `PAUSED`, `CONCLUDED`, `TERMINATED`

### CTA Journey Components

1. **Basic Information**
   - Name (unique identifier)
   - Description
   - Tags (for categorization)
   - Team (ownership)

2. **Schedule**
   - Start time (optional)
   - End time (optional)

3. **Rules**
   - **Cohort Eligibility**: Define which user cohorts should see this CTA Journey
   - **State Transitions**: Define how users move between states based on events
   - **Actions**: Define what happens at each state
   - **Frequency**: Control exposure limits (session, window, lifetime)
   - **Priority**: Higher priority CTA Journeys take precedence

4. **State Machine**
   - Tracks user's current state in the CTA Journey
   - Supports multiple active state machines per user (grouped by context)
   - Can be reset based on configured conditions

### CTA Journey Lifecycle

```
DRAFT → SCHEDULED → LIVE → PAUSED/CONCLUDED/TERMINATED
```

- **DRAFT**: Being created/edited, not active
- **SCHEDULED**: Will become active at a future time
- **LIVE**: Currently active and shown to eligible users
- **PAUSED**: Temporarily stopped, can be resumed
- **CONCLUDED**: Completed its purpose, naturally ended
- **TERMINATED**: Manually stopped, cannot be resumed

---

## Behaviour

**Behaviour** enables you to establish relationships between user journeys (CTA Journeys). They allow you to group one or more CTA Journeys under the same behavior and control their overall frequency and visibility.

### Purpose

Behaviour helps you:
- **Group Related CTA Journeys**: Link multiple CTA Journeys that are part of the same user journey or campaign
- **Control Overall Frequency**: Set frequency limits across all linked CTA Journeys
- **Manage CTA Journey Relationships**: Define rules for when certain CTA Journeys should be shown or hidden based on other CTA Journeys

### Creating a Behaviour

When creating a Behaviour, you need to configure three main sections:

#### 1. Behaviour Details

**Name** (Mandatory)
- Add a unique name for your behavior
- This name will be used to identify and reference the behaviour

**Description** (Optional)
- Add a description to explain the purpose of this behaviour
- Helps team members understand the behaviour's intent

**Select Journeys (CTA Journeys)**
- All active CTA Journeys will be visible in the dropdown
- CTA Journeys that are already selected by another behaviour will be marked as **disabled**
- You can select one or more CTA Journeys to link to this behaviour

#### 2. Behavior Frequency

The frequency settings for Behaviour work similarly to CTA Journey frequency settings. You can control:

- **Session Frequency**: Maximum number of times the behaviour (across all linked CTA Journeys) can be shown per user session
- **Window Frequency**: Maximum number of times within a specific time window (e.g., per day, per week)
- **Lifespan Frequency**: Maximum number of times in the user's lifetime

This ensures that even if multiple CTA Journeys are linked to a behaviour, the overall exposure is controlled.

#### 3. Journey Validation Rule (CTA Journey Relation)

This section allows you to define relationships between CTA Journeys:

**Show CTA Journey Rules**
- Define when certain CTA Journeys should be shown
- Options:
  - **ANY**: Show if any of the specified CTA Journeys meet conditions
  - **LIST**: Show only if specific CTA Journeys from the list meet conditions
  - **REST**: Show if CTA Journeys not in the specified list meet conditions

**Hide CTA Journey Rules**
- Define when certain CTA Journeys should be hidden
- Uses the same rule types (ANY, LIST, REST)
- Helps prevent conflicting or overlapping CTA Journeys from showing simultaneously

### Example Use Case

Imagine you have a "New User Onboarding" behaviour:

1. **Linked CTA Journeys**: 
   - "Welcome Screen"
   - "Tutorial Guide"
   - "First Action Prompt"

2. **Frequency**: 
   - Session limit: 3 (total across all three CTA Journeys)
   - Window limit: 5 per day

3. **CTA Journey Relations**:
   - Show "Tutorial Guide" only if "Welcome Screen" was shown
   - Hide "First Action Prompt" if "Tutorial Guide" is active

This ensures a cohesive onboarding experience with controlled frequency.

---

## Nudges

A **Nudge** is a subtle prompt or suggestion aimed at influencing user behaviour without being forceful or intrusive. In the context of Thunder and Dream11, a nudge refers to a gentle in-app prompt aimed at guiding users to take specific actions, such as joining contests, updating their teams, or completing their profiles.

### What is Real-Time Nudge?

Real-Time Nudge is an innovative tool designed to significantly enhance user experience by providing timely and relevant guidance to end-users through bottom sheet nudges. These nudges are dynamically triggered by specific events and conditions in real-time, ensuring that users receive the right prompts precisely when they need them.

### Key Characteristics

- **Event-Driven**: Triggered by specific user actions or system events
- **Real-Time**: Delivered based on current user behavior and context
- **Non-Intrusive**: Subtle prompts that don't interrupt user workflow
- **Contextual**: Relevant to the user's current situation and needs
- **Configurable UI**: Customizable bottom sheet presentation

### Problem Statement

In traditional product development, implementing user nudges requires significant effort:

1. **SDLC Overhead**: Each nudge feature goes through the entire Software Development Life Cycle (SDLC)
   - Planning and design phases
   - Development and coding
   - Testing and QA
   - Deployment and release cycles

2. **Cross-Team Coordination**: Requires coordination across multiple teams:
   - Product team for requirements
   - Design team for UI/UX
   - Development team for implementation
   - QA team for testing

3. **Time Delays**: This process can take weeks or months, making it difficult to respond quickly to:
   - Real-time user behavior
   - Changing business needs
   - Market opportunities
   - User feedback

4. **Missed Opportunities**: Users often miss key actions or critical information because:
   - Prompts aren't available when needed
   - Implementation takes too long
   - Context is lost by the time the feature is live

### How Real-Time Nudge Solves This

Real-Time Nudge addresses these challenges by offering:

#### 1. **No/Less Code Required**
- Nudges can be created and modified with minimal development effort
- Configuration-driven approach reduces coding overhead
- Business teams can manage nudges without deep technical knowledge

#### 2. **No Release Required**
- Updates to nudges can be made without full app releases
- Quick adaptation to changing needs and user behavior
- Real-time adjustments based on performance data

#### 3. **Configurable Bottom Sheet UI**
- Customizable bottom sheet presentation
- Easy to tailor design and messaging for specific use cases
- Consistent user experience across different nudges

#### 4. **Real-Time Triggering**
- Nudges are triggered based on:
  - User behavior patterns
  - Specific app events (e.g., match starting, contest deadline approaching)
  - User state (e.g., hasn't joined a contest, needs to make transfers)
- Ensures timely, contextual guidance

### Example Use Cases

**Contest Participation**
- Nudge users who haven't joined a contest before a match starts
- Remind users about upcoming deadlines
- Suggest relevant contests based on user preferences

**Team Management**
- Prompt users to update their teams
- Remind about transfer opportunities
- Suggest optimal team configurations

**Profile Completion**
- Guide users to complete their profiles
- Highlight missing information
- Encourage engagement with key features

### Nudge Preview

Thunder provides a preview feature for nudges, allowing you to:
- Test how nudges will appear to users
- Validate nudge content and styling
- Ensure proper rendering before deployment
- Preview different states and scenarios

### State Machine in Nudges

A **State Machine** is a tool used to model the behavior of a system or feature that moves through a series of predefined stages (or "states") based on specific user actions or events.

**How it Works:**
- Each nudge can have multiple states (e.g., "Not Shown", "Shown", "Dismissed", "Action Taken")
- The system transitions between states based on:
  - User actions (clicks, dismissals, completions)
  - System events (time-based triggers, conditions met)
  - Business rules (frequency limits, eligibility criteria)

**Benefits:**
- Tracks user progress through the nudge flow
- Enables conditional logic (show different content based on state)
- Prevents duplicate or conflicting nudges
- Provides analytics on user engagement at each state

**Example State Flow:**
```
Initial State → Triggered → Shown → User Action → Completed/Dismissed
```

This state-based approach ensures that nudges are delivered at the right time, in the right context, and don't overwhelm users with repetitive prompts.

---

## Relationships Between Entities

```
Behaviour
    ├── Links to multiple CTA Journeys
    ├── Controls overall frequency
    └── Manages CTA Journey visibility rules

CTA Journey
    ├── Can be linked to Behaviour
    ├── Has its own state machine
    └── Defines user journey flow

Nudge
    └── Standalone lightweight prompt
```

## Best Practices

1. **Naming Conventions**
   - Use descriptive, unique names for CTA Journeys and Behaviour
   - Include team or project prefixes for easier filtering

2. **Frequency Management**
   - Set appropriate frequency limits to avoid user fatigue
   - Consider both individual CTA Journey and Behaviour frequencies

3. **CTA Journey Relationships**
   - Use Behaviour to group related CTA Journeys logically
   - Leverage CTA Journey relations to prevent conflicting experiences

4. **Status Management**
   - Keep CTA Journeys in DRAFT while testing
   - Use SCHEDULED for time-based campaigns
   - Monitor LIVE CTA Journeys regularly

5. **Testing**
   - Use preview features before going live
   - Test state transitions and frequency limits
   - Validate cohort eligibility rules

---

## Next Steps

- Learn how to create your first CTA Journey (to be added)
- Understand Behaviour creation (to be added)
- Explore the [API Documentation](/docs/raven-thunder/api/admin-contracts) for integration
- Review [architecture details](/docs/raven-thunder/architecture/modules) for deeper understanding

