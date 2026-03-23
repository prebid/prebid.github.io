---
layout: page_v2
title: create_media_buy
description: Create a campaign with packages, targeting, and budgets
sidebarType: 10
---

# create_media_buy
{: .no_toc}

- TOC
{:toc}

## Overview

Creates a new media buy containing one or more packages. Each package references a product, specifies a budget, and may include targeting overlays and creative assignments.

**Category:** Media Buy
**Authentication:** Required
**REST equivalent:** `POST /api/v1/media-buys`

## Parameters

{: .table .table-bordered .table-striped }
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `buyer_ref` | `str` | No | `None` | Buyer's external reference ID for this order. |
| `brand` | `dict` or `None` | No | `None` | Brand context (`name`, `industry`, etc.) for audit and policy checks. |
| `packages` | `list[Package]` | Yes | -- | One or more packages (line items). See below. |
| `start_time` | `str` (ISO 8601) | No | `None` | Flight start date/time. |
| `end_time` | `str` (ISO 8601) | No | `None` | Flight end date/time. |
| `budget` | `float` or `None` | No | `None` | Total budget. Alias: `total_budget`. |
| `total_budget` | `float` or `None` | No | `None` | Alias for `budget`. |
| `po_number` | `str` or `None` | No | `None` | Purchase order number for billing. |

### Package Fields

{: .table .table-bordered .table-striped }
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `product_id` | `str` | Yes | -- | Product ID from [get_products](/agents/salesagent/tools/get-products.html). |
| `buyer_ref` | `str` or `None` | No | `None` | Buyer's reference for this package. |
| `budget` | `float` | Yes | -- | Budget for this package. |
| `currency` | `str` | No | `"USD"` | ISO 4217 currency code. |
| `targeting_overlay` | `dict` or `None` | No | `None` | Additional targeting on top of product defaults (geo, device, etc.). |
| `creative_ids` | `list[str]` or `None` | No | `None` | Creative IDs to assign. Creatives must exist via [sync_creatives](/agents/salesagent/tools/sync-creatives.html). |

## Response

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `media_buy_id` | `str` | Server-generated unique identifier. |
| `buyer_ref` | `str` or `None` | Echo of the buyer's external reference. |
| `status` | `str` | Initial status (see below). |
| `packages` | `list[object]` | Created packages with server-generated IDs. |
| `total_budget` | `float` | Confirmed total budget. |
| `currency` | `str` | Currency of the media buy. |

## Status Determination

{: .table .table-bordered .table-striped }
| Condition | Initial Status |
|-----------|----------------|
| Tenant requires manual approval | `pending_activation` |
| Creatives missing or not yet approved | `pending_activation` |
| Flight start date in the future | `pending_activation` |
| Flight has ended | `completed` |
| None of the above | `active` |

## Media Buy Lifecycle

```text
create_media_buy
       │
       ▼
  pending_activation ──► active ──► completed
                          │  ▲
                   pause  │  │ unpause
                          ▼  │
                        paused
```

{: .alert.alert-info :}
A media buy enters `pending_activation` when it requires manual approval, when its creatives are not yet approved, or when the flight start date is in the future. It transitions to `active` automatically once all conditions are met.

## Errors

{: .table .table-bordered .table-striped }
| Error | Cause |
|-------|-------|
| `AdCPValidationError` (400) | Invalid product_id, missing required fields, budget below minimum. |
| `AdCPNotFoundError` (404) | Referenced product or creative does not exist. |
| `AdCPConflictError` (409) | Duplicate buyer_ref, overlapping flights. |
| `AdCPAuthorizationError` (403) | Principal not authorized to book the referenced product. |

## Example

**Request:**

```json
{
  "buyer_ref": "acme-sports-q1-2025",
  "brand": {"name": "Acme Sports", "industry": "sporting goods"},
  "packages": [
    {
      "product_id": "prod_ctv_sports_30s",
      "budget": 50000,
      "currency": "USD",
      "targeting_overlay": {
        "geo_countries": ["US"],
        "device_platform": ["ctv"]
      },
      "creative_ids": ["cr_video_001"]
    }
  ],
  "start_time": "2025-04-01T00:00:00Z",
  "end_time": "2025-04-30T23:59:59Z",
  "total_budget": 50000,
  "po_number": "PO-12345"
}
```

**Response:**

```json
{
  "media_buy_id": "mb_a1b2c3d4",
  "buyer_ref": "acme-sports-q1-2025",
  "status": "pending_activation",
  "packages": [
    {
      "package_id": "pkg_x1y2z3",
      "product_id": "prod_ctv_sports_30s",
      "buyer_ref": null,
      "budget": 50000,
      "currency": "USD"
    }
  ],
  "total_budget": 50000,
  "currency": "USD"
}
```

## Further Reading

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- All tools
- [update_media_buy](/agents/salesagent/tools/update-media-buy.html) -- Modify an existing campaign
- [get_media_buy_delivery](/agents/salesagent/tools/get-media-buy-delivery.html) -- Delivery metrics
- [sync_creatives](/agents/salesagent/tools/sync-creatives.html) -- Upload creatives before creating a buy
