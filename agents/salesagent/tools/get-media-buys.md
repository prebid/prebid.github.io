---
layout: page_v2
title: get_media_buys
description: Query media buys by ID, status, or date range
sidebarType: 10
---

# get_media_buys
{: .no_toc}

- TOC
{:toc}

## Overview

Retrieves one or more media buys matching the supplied filters. At least one filter should be provided.

**Category:** Media Buy
**Authentication:** Required
**REST equivalent:** `GET /api/v1/media-buys`

## Parameters

{: .table .table-bordered .table-striped }
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `media_buy_ids` | `list[str]` or `None` | No | `None` | Filter by media buy IDs. |
| `buyer_refs` | `list[str]` or `None` | No | `None` | Filter by buyer reference strings. |
| `status` | `str` or `None` | No | `None` | Filter by status: `pending_activation`, `active`, `paused`, `completed`. |
| `start_date` | `str` (ISO 8601) or `None` | No | `None` | Buys with flight start on or after this date. |
| `end_date` | `str` (ISO 8601) or `None` | No | `None` | Buys with flight end on or before this date. |

## Response

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `media_buys` | `list[MediaBuy]` | Matching media buy objects. |
| `errors` | `list[str]` | Non-fatal warnings. |
| `context` | `dict` or `None` | Pagination or query metadata. |

## Example

**Request:**

```json
{
  "status": "active",
  "start_date": "2025-04-01"
}
```

**Response:**

```json
{
  "media_buys": [
    {
      "media_buy_id": "mb_a1b2c3d4",
      "buyer_ref": "acme-sports-q1-2025",
      "status": "active",
      "flight_start_date": "2025-04-01T00:00:00Z",
      "flight_end_date": "2025-04-30T23:59:59Z",
      "budget": 50000,
      "budget_spent": 12340.50,
      "budget_remaining": 37659.50,
      "currency": "USD",
      "packages": []
    }
  ],
  "errors": [],
  "context": null
}
```

## Further Reading

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- All tools
- [get_media_buy_delivery](/agents/salesagent/tools/get-media-buy-delivery.html) -- Delivery metrics for campaigns
- [update_media_buy](/agents/salesagent/tools/update-media-buy.html) -- Modify a campaign
