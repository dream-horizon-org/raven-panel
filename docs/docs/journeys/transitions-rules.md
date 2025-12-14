---
sidebar_position: 5
---

# Transitions & Rules

Transitions connect nodes in your journey, defining how users move from one step to another. Rules (also called conditions) add logic to transitions, controlling which users progress based on specific criteria.

## Key Understanding

**Critical Concept:** A transition from Node A (with event "ABC") to Node B happens when event "ABC" is triggered in your app, **NOT** when Node B's event is triggered.

**Once users reach Node B, the next transition will occur when Node B's event happens.**

### Example Flow

```
Entry Node: "User Opens App"
    │
    │ Transition happens when "User Opens App" event occurs
    ▼
Node: "User Clicks Product"
    │
    │ Transition happens when "User Clicks Product" event occurs
    ▼
Node: "User Adds to Cart"
```

**Explanation:**
- Users start at Entry Node
- When "User Opens App" event fires → transition to "User Clicks Product" node
- User is now at "User Clicks Product" node
- When "User Clicks Product" event fires → transition to "User Adds to Cart" node

---

## Understanding Transitions

### When Transitions Happen

**The Rule:**
- A transition from Node A (event "ABC") to Node B occurs when event "ABC" is triggered in your app
- It does **NOT** wait for Node B's event to occur
- Once users reach Node B, they wait for Node B's event before the next transition

**Visual Example:**

```
┌─────────────────────┐
│  Node A             │
│  Event: "ABC"       │
└─────────────────────┘
         │
         │ Transition occurs when
         │ "ABC" event fires
         ▼
┌─────────────────────┐
│  Node B              │
│  Event: "XYZ"        │
└─────────────────────┘
         │
         │ Next transition occurs when
         │ "XYZ" event fires
         ▼
```

### All Rules Must Pass

If you add multiple rules to a transition, **ALL of them must be true** for the transition to happen.

**Example:**
```
Transition: Node A → Node B
Rules:
  - "User is logged in" = true
  - "Product price" > 50
  - "Cart value" > 100
```

**Result:** The transition only occurs if:
- User is logged in **AND**
- Product price is greater than $50 **AND**
- Cart value is greater than $100

If any rule fails, the user stays at Node A.

### Example Rules

Common rules you can add to transitions:

- **"User is logged in"** = true/false
- **"Product price"** > 50
- **"Cart value"** > 100
- **"User has premium subscription"** = true
- **"User age"** >= 18
- **"Page path"** contains "/checkout"
- **"Device type"** = "mobile"

### No Rules

If you don't add any rules to a transition, **everyone moves to the next node** when the current node's event occurs.

**Example:**
```
Entry Node: "User Opens App"
    │
    │ (No rules - all users progress)
    ▼
Node: "User Clicks Product"
```

All users who open the app will progress to the "User Clicks Product" node when they click a product.

---

## Example: E-Commerce Shopping Journey

Here's a complete example showing transitions and rules in action:

```
┌─────────────────────┐
│   Entry Node        │
│  User Opens App     │
└─────────────────────┘
         │
         │ Rule: "User is logged in"
         ▼
┌─────────────────────┐
│  User Clicks Product│
└─────────────────────┘
         │
         │ Rule: "Product price > $50"
         ▼
┌─────────────────────┐
│  User Adds to Cart  │
└─────────────────────┘
         │
         │ Rule: "Cart value > $100"
         ▼
┌─────────────────────┐
│  User Returns to    │
│  Home               │
└─────────────────────┘
         │
         │ (No rules)
         ▼
┌─────────────────────┐
│  Engagement         │
│  Bottom Sheet       │
│  "Checkout          │
│   Suggestion"       │
└─────────────────────┘
```

**How it works:**

1. **Entry → "User Clicks Product":**
   - Transition happens when "User Opens App" event occurs
   - Rule: Only if "User is logged in" = true
   - If user is not logged in, they don't progress

2. **"User Clicks Product" → "User Adds to Cart":**
   - Transition happens when "User Clicks Product" event occurs
   - Rule: Only if "Product price > $50"
   - If product is $50 or less, user doesn't progress

3. **"User Adds to Cart" → "User Returns to Home":**
   - Transition happens when "User Adds to Cart" event occurs
   - Rule: Only if "Cart value > $100"
   - If cart value is $100 or less, user doesn't progress

4. **"User Returns to Home" → Engagement:**
   - Transition happens when "User Returns to Home" event occurs
   - No rules - all users who reach this node see the engagement
   - When "User Returns to Home" event occurs, the bottom sheet engagement is shown

---

## Setting Up a Transition

Follow these steps to add a transition between nodes:

### Step 1: Open Node Configuration

1. Click on the node you want to transition **from** (the source node)
2. The configuration panel opens on the right

### Step 2: Navigate to Transitions Section

1. Scroll down in the configuration panel
2. Find the **"Transitions"** section

### Step 3: Add a Transition

1. Click **"Add Transition"** button
2. A new transition configuration appears

### Step 4: Choose Target Node

1. Select **"Target Node"** - where users go next
   - Choose an existing node from the dropdown
   - Or select **"Exit"** to end the journey at this point

### Step 5: Add Rules (Optional)

1. Click **"Add Condition"** or **"Add Rule"** button
2. Configure the rule:
   - **Property:** Select the property to check (e.g., "user.is_logged_in", "product.price")
   - **Operator:** Choose the operator (equals, greater than, contains, etc.)
   - **Value:** Set the value to compare against
3. Add more rules if needed (all must pass)

### Step 6: Save the Node

1. Click **"Save"** on the node
2. The transition appears as an arrow in the canvas
3. Rules appear as labels on the transition arrow

---

## Transition Configuration Checklist

Before saving, ensure:

- ✅ **Target node is selected** (or "Exit" is chosen)
- ✅ **Rules are configured correctly** (if needed)
- ✅ **Property names match your event properties**
- ✅ **Operators and values are correct**
- ✅ **All required fields are filled**

---

## Rule Operators

Common operators you can use in rules:

| Operator | Description | Example |
|----------|-------------|---------|
| **equals** | Exact match | `user.status` equals "premium" |
| **not_equals** | Not equal to | `user.status` not_equals "free" |
| **greater_than** | Greater than | `product.price` greater_than 50 |
| **less_than** | Less than | `cart.value` less_than 100 |
| **greater_than_or_equal** | `>=` | `user.age` greater_than_or_equal 18 |
| **less_than_or_equal** | `<=` | `item.count` less_than_or_equal 5 |
| **contains** | String contains | `page.path` contains "/checkout" |
| **not_contains** | String doesn't contain | `page.path` not_contains "/admin" |
| **in** | Value in list | `user.country` in `["US", "CA", "UK"]` |
| **not_in** | Value not in list | `user.plan` not_in `["free", "trial"]` |
| **exists** | Property exists | `user.email` exists |
| **not_exists** | Property doesn't exist | `user.phone` not_exists |

---

## Best Practices

### Transition Design

- **Keep flows simple** - Don't create overly complex branching
- **Use clear node names** - Make it obvious what each step represents
- **Test transitions** - Verify rules work as expected

### Rule Configuration

- **Use specific rules** - Be precise with conditions
- **Test edge cases** - What happens if rules fail?
- **Combine rules wisely** - Remember all rules must pass
- **Use appropriate operators** - Choose the right operator for the data type

### Common Patterns

**Simple Flow (No Rules):**
```
Entry → Node 1 → Node 2 → Engagement
```
All users follow the same path.

**Conditional Flow (With Rules):**
```
Entry → Node 1 ──[Rule: Premium]──► Node 2 (Premium)
         │
         └──[No Rule]──► Node 3 (Free)
```
Different paths based on user properties.

**Multiple Rules:**
```
Node A ──[Rule 1 AND Rule 2 AND Rule 3]──► Node B
```
All conditions must be met.

---

## Troubleshooting

**Transition Not Happening:**
- Check that the source node's event is firing
- Verify all rules are passing
- Ensure the target node exists and is saved

**Rules Not Working:**
- Verify property names match your event properties
- Check operator and value are correct
- Test with different values to ensure logic is right

**Users Stuck at Node:**
- Check if rules are too restrictive
- Verify events are firing correctly
- Consider adding a fallback path

