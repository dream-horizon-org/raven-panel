---
sidebar_position: 2
---

# Creating a Journey

Create journeys to show nudges (Tooltips, BottomSheets, or Popups) to users at the right time by building a visual flow of user actions and engagements.

:::tip Permission
You need **Edit Access** to create journeys.
:::

## Step-by-Step: Creating Your First Journey

Follow these steps to create your first journey from start to finish.

### Step 1: Name Your Journey

Give your journey a clear, descriptive name that helps you identify it later.

**Examples:**
- "Welcome New Users"
- "Re-engage Inactive Users"
- "E-Commerce Checkout Flow"
- "Feature Discovery Tooltip"

**Best Practices:**
- Use descriptive names that indicate the journey's purpose
- Include the target audience or use case
- Keep names concise but informative

---

### Step 2: Go to "UI & Content" Tab

Click on the **"UI & Content"** tab to start building your journey flow. You'll see a canvas where you can add steps (nodes) and connect them with transitions.

**What you'll see:**
- A blank canvas ready for your journey flow
- An **Entry Node** (green box) - this is where your journey starts
- Tools to add new nodes and configure your flow

---

### Step 3: Configure the Entry Node

The entry node (green box) is where your journey starts. Click on it to open the configuration panel on the right.

#### Select an Event

Choose what user action starts this journey. This event determines when users enter the journey flow.

**Common Entry Events:**
- "User opens app"
- "User signs up"
- "User logs in"
- "Page view" (specific page)
- "Button click" (specific button)

**How to select:**
1. Click on the Entry Node
2. In the configuration panel, find the "Event" dropdown
3. Select the event that should trigger the journey start
4. Optionally add filters to make the trigger more specific

**Example:**
- Event: "User opens app"
- Filter: "User is logged in" = true

This means the journey starts when a logged-in user opens the app.

---

### Step 4: Add Engagements (Optional)

After selecting an event, you can add engagements like popups, tooltips, or bottom sheets that users will see at this step.

**Engagement Types:**
- **Popup** - Modal dialogs for critical messages
- **Tooltip** - Small contextual hints for feature discovery
- **Bottom Sheet** - Slide-up panels for promotions and CTAs

**How to add:**
1. With the node selected, look for the "Engagement" section in the configuration panel
2. Choose the engagement type
3. Configure the content, styling, and behavior
4. Preview how it will look to users

**Note:** Engagements are optional at any node. You can have nodes that just track events without showing anything to users.

See **[Engagements](./engagements)** for how to add engagements and detailed guidance on when to use each type.

---

### Step 5: Set Up Transitions

Define what happens next in your journey. Transitions determine how users move from one node to another.

#### Select Where Users Go Next

Choose the next step in the journey flow:

- **Another Node** - Select an existing node or create a new one
- **Exit** - End the journey (users exit the flow)

**How to add a transition:**
1. Click on the node you want to transition from
2. In the configuration panel, find the "Transitions" section
3. Click "Add Transition"
4. Select the target node or choose "Exit"

#### Add Rules (Conditions)

Add rules to control which users move forward based on their properties or event data.

**How rules work:**
- Rules are optional checks added to transitions
- All rules must pass for the transition to occur
- If any rule fails, the user stays at the current node

**Example Rules:**
- "User is logged in" = true
- "Product price" > 50
- "Cart value" > 100
- "User has premium subscription" = true

**How to add rules:**
1. When configuring a transition, click "Add Rule"
2. Select the property to check (e.g., "user.is_logged_in", "product.price")
3. Choose the operator (equals, greater than, contains, etc.)
4. Set the value to compare against

**Example:**
```
Transition: Entry Node → "User Clicks Product" Node
Rule: "User is logged in" = true
```
This means only logged-in users will progress to the next node.

See **[Transitions & Rules](./transitions-rules)** for more details.

---

### Step 6: Save and Publish

Once you're happy with your journey flow, save your work and configure who sees it.

#### Save Each Node

1. Click "Save" on each node after configuring it
2. Make sure all nodes are properly connected with transitions
3. Verify your journey flow makes sense

#### Configure Your Journey

After building your journey flow, go to the **"Journey Setup"** tab to configure:

- **Cohorts** - Who sees this journey (all users or specific segments)
- **Frequency** - How often users see engagements
- **Scheduling** - When the journey runs

See **[Journey Configuration](./journey-configuration)** for detailed instructions on configuring cohorts, frequency, and scheduling.

#### Publish Options

- **Save as Draft** - Save without publishing (journey won't be active)
- **Publish** - Make the journey live immediately (requires Publish Access)
- **Schedule** - Set a future publish date (requires Publish Access)

**Journey States:**
- **Draft** - Not visible to users, fully editable
- **Scheduled** - Will go live at set time
- **Live** - Active and reaching users

---

## Common Workflows

### Simple Welcome Flow (10-15 min)

1. **Name:** "Welcome New Users"
2. **UI & Content Tab:**
   - Entry Node: Event "User signs up"
   - Add Engagement: Tooltip with welcome message
   - Add Transition: Exit (journey ends after showing tooltip)
3. **Journey Setup Tab:** Configure cohorts, frequency, and scheduling
   - See **[Journey Configuration](./journey-configuration)** for details
4. **Publish**

### E-Commerce Checkout Flow (20-30 min)

1. **Name:** "Cart Abandonment Reminder"
2. **UI & Content Tab:**
   - Entry Node: Event "User adds to cart"
   - Add Transition to "User returns to home" node
     - Rule: "Cart value" > 100
   - "User returns to home" node: Add Engagement (Bottom Sheet with checkout reminder)
3. **Journey Setup Tab:** Configure cohorts, frequency, and scheduling
   - See **[Journey Configuration](./journey-configuration)** for details
4. **Publish**

### Feature Discovery Journey (15-20 min)

1. **Name:** "New Feature Tooltip"
2. **UI & Content Tab:**
   - Entry Node: Event "User opens app"
     - Rule: "User is logged in" = true
   - Add Engagement: Tooltip pointing to new feature
   - Add Transition: Exit
3. **Journey Setup Tab:** Configure cohorts, frequency, and scheduling
   - See **[Journey Configuration](./journey-configuration)** for details
4. **Publish**

---

## Troubleshooting

**Can't Save a Node:**
- Ensure you've selected an event for the node
- Check that all required fields are filled
- Verify the node configuration panel is properly loaded

**Transitions Not Working:**
- Make sure you've saved the source node before adding transitions
- Verify rules are correctly configured (check operators and values)
- Ensure target nodes exist and are saved

**Engagement Not Showing:**
- Verify the engagement is properly configured on the node
- Check that users are reaching that node in the journey flow
- Ensure frequency rules allow the engagement to show

**Segment Missing:**
- Verify segment exists in your analytics platform
- Wait for sync between analytics platform and Raven Panel
- Check your permissions to access segments

**Journey Not Publishing:**
- Ensure all nodes are saved
- Check that at least one transition is configured
- Verify you have Publish Access permission
- Make sure Journey Setup is configured (cohorts, scheduling, frequency)
- See **[Journey Configuration](./journey-configuration)** for configuration details
