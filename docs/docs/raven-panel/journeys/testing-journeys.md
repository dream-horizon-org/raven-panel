---
sidebar_position: 4
---

# Testing Journeys

Test your journeys with specific users before publishing to ensure everything works correctly.

## What is a Test Journey?

A **test journey** is a temporary version of your journey that:
- Only visible to specified user IDs
- Automatically expires after a set time
- Allows you to verify journey behavior without affecting production users
- Can be updated with new test users or expiration times

## When to Use Test Journeys

Use test journeys to:
- ✅ Verify journey flow and transitions work correctly
- ✅ Test engagement appearance and behavior
- ✅ Validate rules and conditions

## Creating a Test Journey

### Prerequisites

Before creating a test journey, ensure:
1. Your journey has at least one engagement with a valid template
2. You have the user IDs of test users
3. You're in create mode (not editing an existing journey)

### Steps

1. **Configure Your Journey**
   - Set up your journey flow, nodes, and engagements
   - Ensure all engagement templates are properly configured

2. **Open Test Dialog**
   - Click the **"Test Journey"** button in the journey header
   - The button is only enabled when your journey has valid templates

3. **Enter Test Details**
   - **User IDs**: Enter comma-separated user IDs (e.g., `123, 456, 789`)
     - Supports multiple users for broader testing
     - Whitespace is automatically trimmed
   - **Expiration Time**: Set duration in minutes (default: 30 minutes)
     - Minimum: 1 minute
     - Recommended: 30-60 minutes for quick tests

4. **Create Test Journey**
   - Click **"Create Test Journey"** to create a new test
   - Or **"Update Test Journey"** if updating an existing test

## Test Journey Behavior

### Visibility
- Only users with IDs specified in the test dialog can see the journey
- Test journeys bypass cohort eligibility - visibility is determined solely by the user IDs you specify

### Expiration
- Test journeys automatically expire after the specified time and are no longer visible to test users

### Updates
- If you've created a test journey before, you can update it
- Updating changes the user IDs and/or expiration time
- Previous test journey data is replaced


