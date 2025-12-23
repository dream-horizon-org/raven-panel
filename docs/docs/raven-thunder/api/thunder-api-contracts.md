---
title: Thunder API Contracts (SDK Endpoints)
---

## Thunder API Contracts (SDK Endpoints)

### Fetch CTAs (and update delta) - App Launch
- **Path**: `/cta/active/state-machines/`
- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: <string>` (optional, defaults to "default")
  - `auth-userid: <long>` (required) - User identifier
  - `app_version: <string>` (optional) - Application version
  - `codepush_version: <string>` (optional) - CodePush version
  - `package_name: <string>` (optional) - Package name
  - `api_version: <long>` (optional) - API version (must be >= 1, otherwise returns empty response)
- **Request Body**:
```json
{
  "ctas": "array<StateMachineSnapshot> (optional) - Current CTA state machine snapshots from client",
  "behaviourTags": "array<BehaviourTagSnapshot> (optional) - Current behaviour tag snapshots from client"
}
```

**StateMachineSnapshot structure**:
```json
{
  "ctaId": "string (required) - CTA identifier",
  "activeStateMachines": "map<string, StateMachine> (required) - Map of group keys to state machines",
  "resetAt": "array<long> (optional) - List of reset timestamps",
  "actionDoneAt": "array<long> (optional) - List of action completion timestamps"
}
```

**StateMachine structure**:
```json
{
  "currentState": "string (required) - Current state name",
  "lastTransitionAt": "long (required) - Timestamp of last state transition",
  "context": "map<string, object> (optional) - State machine context data",
  "createdAt": "long (required) - State machine creation timestamp",
  "reset": "boolean (optional) - Whether state machine was reset"
}
```

**BehaviourTagSnapshot structure**:
```json
{
  "behaviourTagName": "string (required) - Behaviour tag name",
  "exposureRule": {
    "session": { "limit": "integer" },
    "window": { "limit": "integer", "unit": "enum", "value": "integer" },
    "lifespan": { "limit": "integer" }
  },
  "ctaRelation": {
    "shownCta": {
      "rule": "enum - One of: ANY, LIST, REST",
      "ctaList": "array<string> - List of CTA IDs"
    },
    "hideCta": {
      "rule": "enum - One of: ANY, LIST, REST",
      "ctaList": "array<string> - List of CTA IDs"
    },
    "activeCtas": "array<string> - List of active CTA IDs"
  }
}
```

- **Response**: App launch response with active CTAs and behaviour tags
```json
{
  "data": {
    "ctas": [
      {
        "ctaId": "string - CTA identifier",
        "rule": {
          "stateToAction": "map<string, string> - State to action mapping",
          "resetStates": "array<string> - States that trigger reset",
          "resetCTAonFirstLaunch": "boolean - Reset on first launch flag",
          "contextParams": "array<string> - Context parameter names",
          "stateTransition": "map<string, map<string, array>> - State transition rules",
          "groupByConfig": {
            "maxActiveStateMachineCount": "integer",
            "groupByKeys": "array<string>"
          },
          "priority": "integer - CTA priority",
          "stateMachineTTL": "long - State machine TTL in milliseconds",
          "ctaValidTill": "long (nullable) - CTA validity end time",
          "actions": "array<map<string, object>> - Action definitions",
          "frequency": {
            "session": { "limit": "integer" },
            "window": { "limit": "integer", "unit": "enum", "value": "integer" },
            "lifeSpan": { "limit": "integer" }
          }
        },
        "activeStateMachines": "map<string, StateMachine> - Active state machines by group key",
        "resetAt": "array<long> - Reset timestamps",
        "actionDoneAt": "array<long> - Action completion timestamps",
        "behaviourTagName": "string (nullable) - Associated behaviour tag name"
      }
    ],
    "behaviourTags": "array<BehaviourTagSnapshot> - Active behaviour tags"
  }
}
```

**Note**: If `api_version` is null or < 1, returns empty response:
```json
{
  "data": {
    "ctas": null,
    "behaviourTags": null
  }
}
```

### Update CTA Delta - Snapshot Merge
- **Path**: `/cta/state-machines/snapshot/delta/`
- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: <string>` (optional, defaults to "default")
  - `auth-userid: <long>` (required) - User identifier
  - `app_version: <string>` (optional) - Application version
  - `codepush_version: <string>` (optional) - CodePush version
  - `package_name: <string>` (optional) - Package name
  - `api_version: <long>` (optional) - API version (must be >= 1, otherwise returns false)
- **Request Body**:
```json
{
  "ctas": "array<StateMachineSnapshot> (optional) - CTA state machine snapshots to merge",
  "behaviourTags": "array<BehaviourTagSnapshot> (optional) - Behaviour tag snapshots to merge"
}
```

**StateMachineSnapshot structure** (same as above):
```json
{
  "ctaId": "string (required) - CTA identifier",
  "activeStateMachines": "map<string, StateMachine> (required) - Map of group keys to state machines",
  "resetAt": "array<long> (optional) - List of reset timestamps",
  "actionDoneAt": "array<long> (optional) - List of action completion timestamps"
}
```

**BehaviourTagSnapshot structure** (same as above):
```json
{
  "behaviourTagName": "string (required) - Behaviour tag name",
  "exposureRule": {
    "session": { "limit": "integer" },
    "window": { "limit": "integer", "unit": "enum", "value": "integer" },
    "lifespan": { "limit": "integer" }
  },
  "ctaRelation": {
    "shownCta": {
      "rule": "enum - One of: ANY, LIST, REST",
      "ctaList": "array<string> - List of CTA IDs"
    },
    "hideCta": {
      "rule": "enum - One of: ANY, LIST, REST",
      "ctaList": "array<string> - List of CTA IDs"
    },
    "activeCtas": "array<string> - List of active CTA IDs"
  }
}
```

- **Responses**:
  - **200**: Success response
```json
{
  "data": true
}
```
or
```json
{
  "data": false
}
```
**Note**: If `api_version` is null or < 1, returns `false`.

  - **400**: Error response
```json
{
  "error": {
    "message": "Invalid request",
    "code": "INVALID_REQUEST"
  }
}
```

### Get Nudge Preview
- **Path**: `/cta/nudge/preview/{id}`
- **Method**: GET
- **Path Parameters**:
  - `id` (required) - Nudge preview identifier
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: <string>` (optional, defaults to "default")
- **Request**: None
- **Response**: Nudge preview details
```json
{
  "data": {
    "id": "string - Nudge preview identifier",
    "template": "string - Nudge template/content (HTML, JSON, or template format)",
    "tenantId": "string - Tenant identifier",
    "ttl": "integer (nullable) - Time-to-live in seconds"
  }
}
```
- **Note**: If the nudge preview is not found, returns a 200 response with null data (no error thrown).

