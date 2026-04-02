---
layout: page_v2
title: Prebid Sales Agent - Error Codes
description: Error code reference for the Sales Agent
sidebarType: 10
---

# Error Codes
{: .no_toc}

- TOC
{:toc}

## Overview

All Sales Agent errors extend `AdCPError` and include a status code, error code string, and recovery hint.

## Recovery Hints

{: .table .table-bordered .table-striped }
| Hint | Meaning | Action |
|------|---------|--------|
| `transient` | Temporary failure | Retry after a delay |
| `correctable` | Invalid input or state | Fix the request and retry |
| `terminal` | Cannot be resolved | Do not retry |

## Error Types

{: .table .table-bordered .table-striped }
| Error Class | Status | Code | Recovery | Description |
|-------------|--------|------|----------|-------------|
| AdCPValidationError | 400 | VALIDATION_ERROR | correctable | Invalid parameters or missing required fields |
| AdCPAuthenticationError | 401 | AUTHENTICATION_ERROR | correctable | Missing or invalid auth token |
| AdCPAuthorizationError | 403 | AUTHORIZATION_ERROR | terminal | Valid token but insufficient permissions |
| AdCPNotFoundError | 404 | NOT_FOUND | correctable | Resource does not exist |
| AdCPConflictError | 409 | CONFLICT | correctable | Resource state conflict (duplicate buyer_ref, overlapping flights) |
| AdCPGoneError | 410 | GONE | terminal | Resource permanently removed |
| AdCPBudgetExhaustedError | 422 | BUDGET_EXHAUSTED | correctable | Budget limit reached |
| AdCPRateLimitError | 429 | RATE_LIMIT_EXCEEDED | transient | Too many requests |
| AdCPAdapterError | 502 | ADAPTER_ERROR | transient | Upstream ad server returned an error |
| AdCPServiceUnavailableError | 503 | SERVICE_UNAVAILABLE | transient | Service temporarily unavailable |

## Error Response Formats

### MCP

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'budget' is required for each package",
    "recovery": "correctable",
    "details": {"field": "packages[0].budget"}
  }
}
```

### A2A (JSON-RPC 2.0)

```json
{
  "jsonrpc": "2.0",
  "id": "req-001",
  "error": {
    "code": -32000,
    "message": "VALIDATION_ERROR: Field 'budget' is required for each package",
    "data": {
      "recovery": "correctable",
      "details": {"field": "packages[0].budget"}
    }
  }
}
```

### REST

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Field 'budget' is required for each package",
  "recovery": "correctable",
  "details": {"field": "packages[0].budget"}
}
```

## Troubleshooting

### 401 on discovery tools

Discovery tools are auth-optional, but some tenants require authentication for all tools. Check the tenant's configuration in the Admin UI.

### 502 from GAM adapter

Usually means the GAM API quota is exceeded or the service account is misconfigured. Check the GAM API dashboard and verify the service account has the correct permissions.

### 409 on create_media_buy

A media buy with the same `buyer_ref` already exists for this principal. Use `get_media_buys` to find existing buys, or use a unique `buyer_ref`.

### 422 budget exhausted

The media buy or package budget limit has been reached. Use `get_media_buy_delivery` to check current spend, then `update_media_buy` to increase the budget if needed.

### 429 rate limit

The Sales Agent or the underlying ad server is rate-limiting requests. Implement exponential backoff with a minimum 1-second delay.

## Further Reading

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- All tools with auth requirements
- [Architecture](/agents/salesagent/architecture.html) -- Error handling design
- [Security](/agents/salesagent/operations/security.html) -- Authentication details
