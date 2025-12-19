---
sidebar_position: 5
---

# Transitions & Conditions

Transitions connect nodes in your journey, defining how users move from one step to another. Conditions add logic to transitions, controlling which users progress based on specific criteria.

## How Transitions Work

**Critical Concept:** A transition from Node A (with event "ABC") to Node B happens when event "ABC" is triggered in your app, **NOT** when Node B's event is triggered.

Once users reach Node B, the next transition will occur when Node B's event happens.

import JourneyAnimation from '@site/src/components/JourneyAnimation';

<JourneyAnimation />

### Conditions

**All Conditions Must Pass**

If you add multiple conditions to a transition, **ALL of them must be true** for the transition to happen.

**Example:**

```
Transition: Node A → Node B
Conditions:
  - "User is logged in" = true
  - "Product price" > 50
  - "Cart value" > 100
```

**Result:** The transition only occurs if the user is logged in **AND** product price > $50 **AND** cart value > $100. If any condition fails, the user stays at Node A.

**No Conditions:** If you don't add any conditions, **everyone moves to the next node** when the current node's event occurs.

---

## Setting Up a Transition

To add a transition:

1. Click on the node you want to transition **from**
2. Find the **"Transitions"** section in the configuration panel
3. Click **"Add Transition"**
4. Select the target node or choose **"Exit"** to end the journey
5. Optionally click **"Add Condition"** to add conditions:
   - Select the property to check
   - Choose the operator
   - Set the value to compare against
6. Click **"Save"** on the node

The transition appears as an arrow in the canvas, with conditions shown as labels.

See **[Creating a Journey](./creating-journey)** for detailed step-by-step instructions.

---

## Condition Operators

Operators available in the panel:

| Operator | Description | Example |
|:---------|:------------|:--------|
| `=` | Equals | `user.status` equals "premium" |
| `≠` | Not equal to | `user.status` not equal to "free" |
| `>` | Greater than | `product.price` greater than 50 |
| `<` | Less than | `cart.value` less than 100 |
| `≥` | Greater than or equal | `user.age` greater than or equal 18 |
| `≤` | Less than or equal | `item.count` less than or equal 5 |


