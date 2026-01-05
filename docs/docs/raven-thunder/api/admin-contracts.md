---
title: Admin API Contracts
---

## Admin Contracts

### Create Behaviour Tags
- **Path**: `/thunder/behaviour-tags/`
- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: <string>` (optional, defaults to "default")
  - `user: <string>` (required) - User identifier performing the operation
- **Request Body**:
```json
{
  "behaviourTagName": "string (required)",
  "description": "string (optional)",
  "exposureRule": {
    "session": {
      "limit": "integer (required) - Maximum number of exposures per session"
    },
    "window": {
      "limit": "integer (required) - Maximum number of exposures in the time window",
      "unit": "enum (required) - One of: days, hours, minutes, seconds",
      "value": "integer (required) - Window duration value"
    },
    "lifespan": {
      "limit": "integer (required) - Maximum number of exposures in user's lifetime"
    }
  },
  "ctaRelation": {
    "shownCta": {
      "rule": "enum (required) - One of: ANY, LIST, REST",
      "ctaList": "array<string> (required) - List of CTA IDs"
    },
    "hideCta": {
      "rule": "enum (required) - One of: ANY, LIST, REST",
      "ctaList": "array<string> (required) - List of CTA IDs"
    }
  },
  "linkedCtas": "array<string> (required) - Set of CTA IDs linked to this behaviour tag"
}
```
- **Responses**:
  - **200**: Success response with empty object
  - **400**: Error response
```json
{
  "error": {
    "message": "Duplicate behaviour tag name",
    "code": "CAMPAIGN_DUPLICATE_NAME"
  }
}
```

### Update Behaviour Tag
- **Path**: `/thunder/behaviour-tags/{behaviourTagName}`
- **Method**: PUT
- **Path Parameters**:
  - `behaviourTagName` (required) - Name of the behaviour tag to update
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: <string>` (optional, defaults to "default")
  - `user: <string>` (required) - User identifier performing the operation
- **Request Body**:
```json
{
  "description": "string (optional)",
  "exposureRule": {
    "session": {
      "limit": "integer (required) - Maximum number of exposures per session"
    },
    "window": {
      "limit": "integer (required) - Maximum number of exposures in the time window",
      "unit": "enum (required) - One of: days, hours, minutes, seconds",
      "value": "integer (required) - Window duration value"
    },
    "lifespan": {
      "limit": "integer (required) - Maximum number of exposures in user's lifetime"
    }
  },
  "ctaRelation": {
    "shownCta": {
      "rule": "enum (required) - One of: ANY, LIST, REST",
      "ctaList": "array<string> (required) - List of CTA IDs"
    },
    "hideCta": {
      "rule": "enum (required) - One of: ANY, LIST, REST",
      "ctaList": "array<string> (required) - List of CTA IDs"
    }
  },
  "linkedCtas": "array<string> (required) - Set of CTA IDs linked to this behaviour tag"
}
```
- **Responses**:
  - **200**: Success response with empty object
  - **400**: Error response
```json
{
  "error": {
    "message": "Invalid behaviour tag",
    "code": "CAMPAIGN_INVALID"
  }
}
```

### Get Behaviour Tags
- **Path**: `/thunder/behaviour-tags/`
- **Method**: GET
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: <string>` (optional, defaults to "default")
- **Request**: None
- **Response**: List of behaviour tags
```json
{
  "data": {
    "behaviourTags": [
      {
        "name": "string - Behaviour tag name",
        "description": "string - Description of the behaviour tag",
        "createdAt": "long - Timestamp when created",
        "createdBy": "string - User who created it",
        "lastUpdatedAt": "long - Timestamp when last updated",
        "lastUpdatedBy": "string - User who last updated it",
        "exposureRule": {
          "session": { "limit": "integer" },
          "window": { "limit": "integer", "unit": "enum", "value": "integer" },
          "lifespan": { "limit": "integer" }
        },
        "ctaRelation": {
          "shownCta": { "rule": "enum", "ctaList": "array<string>" },
          "hideCta": { "rule": "enum", "ctaList": "array<string>" }
        },
        "linkedCtas": "array<string> - Set of linked CTA IDs",
        "tenantId": "string - Tenant identifier"
      }
    ]
  }
}
```

### Get list of CTAs
- **Path**: `/thunder/ctas/`
- **Method**: GET
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: <string>` (optional, defaults to "default")
- **Query Parameters**:
  - `name` (optional) - Filter by exact CTA name
  - `searchName` (optional) - Search CTAs by name (partial match)
  - `teams` (optional) - Comma-separated list of teams to filter by
  - `tags` (optional) - Comma-separated list of tags to filter by
  - `status` (optional) - Filter by CTA status (draft, paused, live, scheduled, concluded, terminated)
  - `behaviourTag` (optional) - Filter by behaviour tag name
  - `createdBy` (optional) - Filter by creator email
  - `pageNumber` (optional) - Page number (0-indexed, defaults to 0)
  - `pageSize` (optional) - Items per page (defaults to 10)
- **Request**: None
- **Response**: Paginated list of CTAs with status counts
```json
{
  "data": {
    "ctas": [
      {
        "id": "long - CTA identifier",
        "name": "string - CTA name",
        "description": "string - CTA description",
        "tags": "array<string> - List of tags",
        "team": "string - Team name",
        "behaviourTags": "array<string> - List of associated behaviour tag names",
        "startTime": "long (nullable) - Start timestamp in milliseconds",
        "endTime": "long (nullable) - End timestamp in milliseconds",
        "ctaStatus": "enum - Current status",
        "rule": { /* Rule object */ },
        "createdAt": "long - Creation timestamp",
        "createdBy": "string - Creator email",
        "lastUpdatedAt": "long (nullable) - Last update timestamp",
        "lastUpdatedBy": "string (nullable) - Last updater email",
        "tenantId": "string - Tenant identifier"
      }
    ],
    "totalEntries": "integer - Total number of CTAs matching filters",
    "totalPages": "integer - Total number of pages",
    "pageNumber": "integer - Current page number (0-indexed)",
    "pageSize": "integer - Items per page",
    "statusWiseCount": {
      "draft": "integer - Count of draft CTAs",
      "paused": "integer - Count of paused CTAs",
      "live": "integer - Count of live CTAs",
      "scheduled": "integer - Count of scheduled CTAs",
      "concluded": "integer - Count of concluded CTAs",
      "terminated": "integer - Count of terminated CTAs"
    }
  }
}
```

### Get details of CTA
- **Path**: `/thunder/ctas/{ctaId}`
- **Method**: GET
- **Path Parameters**:
  - `ctaId` (required) - CTA identifier
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: <string>` (optional, defaults to "default")
- **Request**: None
- **Response**: CTA details
```json
{
  "data": {
    "id": "long - CTA identifier",
    "name": "string - CTA name",
    "description": "string - CTA description",
    "tags": "array<string> - List of tags",
    "team": "string - Team name",
    "behaviourTags": "array<string> - List of associated behaviour tag names",
    "startTime": "long (nullable) - Start timestamp in milliseconds",
    "endTime": "long (nullable) - End timestamp in milliseconds",
    "ctaStatus": "enum - Current status (draft, paused, live, scheduled, concluded, terminated)",
    "rule": {
      "cohortEligibility": {
        "includes": "array<string> (required) - List of cohorts to include",
        "excludes": "array<string> (required) - List of cohorts to exclude"
      },
      "stateToAction": "map<string, string> (required) - Mapping of state names to action names",
      "resetStates": "array<string> (optional) - List of states that trigger reset",
      "resetCTAonFirstLaunch": "boolean (optional) - Whether to reset CTA on first app launch",
      "contextParams": "array<string> (optional) - List of context parameter names",
      "stateTransition": "map<string, map<string, array>> (required) - State transition rules",
      "groupByConfig": {
        "maxActiveStateMachineCount": "integer (optional) - Maximum active state machines per group",
        "groupByKeys": "array<string> (optional) - Keys to group state machines by"
      },
      "priority": "integer (required) - CTA priority (higher number = higher priority)",
      "stateMachineTTL": "long (required) - State machine time-to-live in milliseconds",
      "ctaValidTill": "long (nullable) - CTA validity end time in milliseconds",
      "actions": "array<map<string, object>> (required) - List of action definitions",
      "frequency": {
        "session": {
          "limit": "integer (required) - Maximum exposures per session"
        },
        "window": {
          "limit": "integer (required) - Maximum exposures in time window",
          "unit": "enum (required) - One of: days, hours, minutes, seconds",
          "value": "integer (required) - Window duration value"
        },
        "lifeSpan": {
          "limit": "integer (required) - Maximum exposures in user's lifetime"
        }
      }
    },
    "createdAt": "long - Creation timestamp",
    "createdBy": "string - Creator email",
    "lastUpdatedAt": "long (nullable) - Last update timestamp",
    "lastUpdatedBy": "string (nullable) - Last updater email",
    "tenantId": "string - Tenant identifier"
  }
}
```

### Get Filter Values
- **Path**: `/thunder/filters/`
- **Method**: GET
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: <string>` (optional, defaults to "default")
- **Request**: None
- **Responses**:
  - **200**: Filter metadata
```json
{}
```
or
```json
{
  "data": {
    "names": "array<string> - List of unique CTA names",
    "teams": "array<string> - List of unique team names",
    "tags": "array<string> - List of unique tag values",
    "createdBy": "array<string> - List of unique creator emails"
  }
}
```

### Create CTA
- **Path**: `/thunder/ctas/`
- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: <string>` (optional, defaults to "default")
  - `user: <string>` (required) - User identifier performing the operation
- **Request Body**:
```json
{
  "name": "string (required) - Unique CTA name",
  "tags": "array<string> (required) - List of tags for categorization",
  "description": "string (optional) - CTA description",
  "team": "string (required) - Team name",
  "startTime": "long (optional) - Start timestamp in milliseconds (must be within allowed time window from current time)",
  "endTime": "long (optional) - End timestamp in milliseconds (must be within allowed time window from current time and after startTime)",
  "rule": {
    "cohortEligibility": {
      "includes": "array<string> (required, non-empty) - List of cohorts to include",
      "excludes": "array<string> (required) - List of cohorts to exclude"
    },
    "stateToAction": "map<string, string> (required, non-empty) - Mapping of state names to action names",
    "resetStates": "array<string> (optional) - List of state names that trigger reset",
    "resetCTAonFirstLaunch": "boolean (optional) - Whether to reset CTA state on first app launch",
    "contextParams": "array<string> (optional) - List of context parameter names",
    "stateTransition": "map<string, map<string, array<StateTransitionCondition>>> (required) - State transition rules",
    "groupByConfig": {
      "maxActiveStateMachineCount": "integer (optional) - Maximum number of active state machines per group",
      "groupByKeys": "array<string> (optional) - Keys to group state machines by"
    },
    "priority": "integer (required) - CTA priority (higher number = higher priority)",
    "stateMachineTTL": "long (required) - State machine time-to-live in milliseconds",
    "actions": "array<map<string, object>> (required) - List of action definitions",
    "frequency": {
      "session": {
        "limit": "integer (required) - Maximum number of exposures per session"
      },
      "window": {
        "limit": "integer (required) - Maximum number of exposures in the time window",
        "unit": "enum (required) - One of: days, hours, minutes, seconds",
        "value": "integer (required) - Window duration value"
      },
      "lifeSpan": {
        "limit": "integer (required) - Maximum number of exposures in user's lifetime"
      }
    }
  }
}
```

**StateTransitionCondition structure**:
```json
{
  "transitionTo": "string (required) - Target state name",
  "filters": {
    "operator": "string (required) - Filter operator (e.g., 'AND', 'OR')",
    "filter": "array<object> (required) - List of filter conditions"
  }
}
```

- **Responses**:
  - **200**: Success response with created CTA ID
```json
{
  "data": "long - Generated CTA ID"
}
```
  - **400**: Error response
```json
{
  "error": {
    "message": "Duplicate cta name",
    "code": "CTA_DUPLICATE_NAME"
  }
}
```

### Update CTA
- **Path**: `/thunder/ctas/{ctaId}`
- **Method**: PUT
- **Path Parameters**:
  - `ctaId` (required) - CTA identifier to update
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: <string>` (optional, defaults to "default")
  - `user: <string>` (required) - User identifier performing the operation
- **Request Body**:
```json
{
  "tags": "array<string> (required) - List of tags for categorization",
  "description": "string (optional) - CTA description",
  "team": "string (required) - Team name",
  "startTime": "long (optional) - Start timestamp in milliseconds (must be within allowed time window from current time)",
  "endTime": "long (optional) - End timestamp in milliseconds (must be within allowed time window from current time and after startTime)",
  "rule": {
    "cohortEligibility": {
      "includes": "array<string> (required, non-empty) - List of cohorts to include",
      "excludes": "array<string> (required) - List of cohorts to exclude"
    },
    "stateToAction": "map<string, string> (required, non-empty) - Mapping of state names to action names",
    "resetStates": "array<string> (optional) - List of state names that trigger reset",
    "resetCTAonFirstLaunch": "boolean (optional) - Whether to reset CTA state on first app launch",
    "contextParams": "array<string> (optional) - List of context parameter names",
    "stateTransition": "map<string, map<string, array<StateTransitionCondition>>> (required) - State transition rules",
    "groupByConfig": {
      "maxActiveStateMachineCount": "integer (optional) - Maximum number of active state machines per group",
      "groupByKeys": "array<string> (optional) - Keys to group state machines by"
    },
    "priority": "integer (required) - CTA priority (higher number = higher priority)",
    "stateMachineTTL": "long (required) - State machine time-to-live in milliseconds",
    "actions": "array<map<string, object>> (required) - List of action definitions",
    "frequency": {
      "session": {
        "limit": "integer (required) - Maximum number of exposures per session"
      },
      "window": {
        "limit": "integer (required) - Maximum number of exposures in the time window",
        "unit": "enum (required) - One of: days, hours, minutes, seconds",
        "value": "integer (required) - Window duration value"
      },
      "lifeSpan": {
        "limit": "integer (required) - Maximum number of exposures in user's lifetime"
      }
    }
  }
}
```
- **Responses**:
  - **200**: Success response with empty object
  - **400**: Error response
```json
{
  "error": {
    "message": "Invalid cta id",
    "code": "CTA_ID_INVALID"
  }
}
```

### Update CTA status
- **Paths**:
  - `/thunder/ctas/{ctaId}/live` - Set CTA status to live
  - `/thunder/ctas/{ctaId}/pause` - Set CTA status to paused
  - `/thunder/ctas/{ctaId}/schedule` - Set CTA status to scheduled
  - `/thunder/ctas/{ctaId}/conclude` - Set CTA status to concluded
  - `/thunder/ctas/{ctaId}/terminate` - Set CTA status to terminated
- **Method**: PUT
- **Path Parameters**:
  - `ctaId` (required) - CTA identifier
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: <string>` (optional, defaults to "default")
- **Request**: None (empty body)
- **Responses**:
  - **200**: Success response with empty object
  - **400 (invalid id)**:
```json
{
  "error": {
    "message": "Invalid cta id",
    "code": "CTA_ID_INVALID"
  }
}
```
  - **400 (invalid status)**:
```json
{
  "error": {
    "message": "Invalid status",
    "code": "CTA_STATUS_INVALID"
  }
}
```
  - **400 (invalid status change)**:
```json
{
  "error": {
    "message": "Invalid status change",
    "code": "CTA_STATUS_UPDATE_INVALID"
  }
}
```

### Create or Update Nudge Preview
- **Path**: `/thunder/nudge/preview/`
- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
  - `x-tenant-id: <string>` (optional, defaults to "default")
- **Request Body**:
```json
{
  "id": "string (required) - Unique identifier for the nudge preview",
  "template": "string (required) - Nudge template/content (HTML, JSON, or template format)",
  "ttl": "integer (optional) - Time-to-live in seconds (defaults to 3600 if not provided)"
}
```
- **Responses**:
  - **200**: Success response with empty object
```json
{
  "data": null
}
```
  - **400**: Error response
```json
{
  "error": {
    "message": "id cannot be null or empty",
    "code": "NUDGE_PREVIEW_TEMPLATE_NOT_FOUND_EXCEPTION"
  }
}
```
or
```json
{
  "error": {
    "message": "template cannot be null or empty",
    "code": "NUDGE_PREVIEW_TEMPLATE_NOT_FOUND_EXCEPTION"
  }
}
```


