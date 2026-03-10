---
layout: page_v2
title: Prebid Sales Agent - Tool Reference
description: Index of all Sales Agent MCP tools
sidebarType: 10
---

# Tool Reference
{: .no_toc}

- TOC
{:toc}

## Overview

The Sales Agent exposes 11 tools via MCP, A2A, and REST. Each tool follows a three-layer pattern: MCP wrapper → `_raw` function → `_impl` function. The `_impl` layer is transport-agnostic, ensuring identical behavior across all protocols.

## Tools by Category

### Discovery (auth optional)

{: .table .table-bordered .table-striped }
| Tool | Description |
|------|-------------|
| [get_adcp_capabilities](/agents/salesagent/tools/get-adcp-capabilities.html) | Tenant capabilities, protocols, targeting dimensions |
| [get_products](/agents/salesagent/tools/get-products.html) | Product catalog search with optional AI ranking |
| [list_creative_formats](/agents/salesagent/tools/list-creative-formats.html) | Creative format specifications |
| [list_authorized_properties](/agents/salesagent/tools/list-authorized-properties.html) | Publisher domains and policies |

### Media Buy (auth required)

{: .table .table-bordered .table-striped }
| Tool | Description |
|------|-------------|
| [create_media_buy](/agents/salesagent/tools/create-media-buy.html) | Create a campaign with packages, targeting, budgets |
| [update_media_buy](/agents/salesagent/tools/update-media-buy.html) | Modify an existing campaign |
| [get_media_buys](/agents/salesagent/tools/get-media-buys.html) | Query campaigns by ID, status, date range |
| [get_media_buy_delivery](/agents/salesagent/tools/get-media-buy-delivery.html) | Delivery metrics and pacing data |

### Creative (auth required)

{: .table .table-bordered .table-striped }
| Tool | Description |
|------|-------------|
| [sync_creatives](/agents/salesagent/tools/sync-creatives.html) | Upload, update, or delete creative assets |
| [list_creatives](/agents/salesagent/tools/list-creatives.html) | List creatives by status, format, media buy |

### Performance (auth required)

{: .table .table-bordered .table-striped }
| Tool | Description |
|------|-------------|
| [update_performance_index](/agents/salesagent/tools/update-performance-index.html) | Submit AI performance feedback |

## Authentication

Requests carry identity via one of two headers:

{: .table .table-bordered .table-striped }
| Header | Format | Notes |
|--------|--------|-------|
| `x-adcp-auth` | Raw token | Primary AdCP header. Takes precedence. |
| `Authorization` | `Bearer <token>` | Standard bearer token. |

Tokens are hashed and matched against the `auth_token` column on the `Principal` table. Tokens may have an optional expiry.

{: .alert.alert-warning :}
Discovery tools return limited data without auth. All other tools return `AdCPAuthenticationError` (401) if the token is missing or invalid.

## Error Handling

Every error extends `AdCPError` with `message`, `recovery`, and `details` fields.

{: .table .table-bordered .table-striped }
| Error | Status | Recovery | Typical Cause |
|-------|--------|----------|---------------|
| `AdCPValidationError` | 400 | correctable | Invalid parameters or missing fields |
| `AdCPAuthenticationError` | 401 | correctable | Missing or invalid token |
| `AdCPAuthorizationError` | 403 | terminal | Insufficient permissions |
| `AdCPNotFoundError` | 404 | correctable | Resource does not exist |
| `AdCPConflictError` | 409 | correctable | State conflict (duplicate, overlapping) |
| `AdCPGoneError` | 410 | terminal | Resource permanently removed |
| `AdCPBudgetExhaustedError` | 422 | correctable | Budget limit reached |
| `AdCPRateLimitError` | 429 | transient | Too many requests |
| `AdCPAdapterError` | 502 | transient | Ad server error |
| `AdCPServiceUnavailableError` | 503 | transient | Service temporarily unavailable |

Recovery hints: `transient` (retry after delay), `correctable` (fix input and retry), `terminal` (cannot succeed).

See [Error Codes](/agents/salesagent/reference/error-codes.html) for the complete catalog with MCP/A2A format examples.

## Typical Workflow

```text
Discovery                    Execution                    Reporting
─────────                    ─────────                    ─────────
get_adcp_capabilities   ──►  create_media_buy        ──►  get_media_buys
get_products            ──►  sync_creatives          ──►  get_media_buy_delivery
list_creative_formats   ──►  update_media_buy             list_creatives
list_authorized_properties                                update_performance_index
```

## Further Reading

- [Architecture](/agents/salesagent/architecture.html) -- System design and protocol comparison
- [Error Codes](/agents/salesagent/reference/error-codes.html) -- Full error catalog
- [API Schemas](/agents/salesagent/schemas/api-schemas.html) -- Pydantic request/response models
- [Database Models](/agents/salesagent/schemas/database-models.html) -- SQLAlchemy models
