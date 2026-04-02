---
layout: page_v2
title: update_media_buy
description: Modify an existing media buy's budget, dates, or pause state
sidebarType: 10
---

# update_media_buy
{: .no_toc}

- TOC
{:toc}

## Overview

Modifies an existing media buy. The authenticated principal must own the media buy. Supports pausing/unpausing, budget changes, flight date adjustments, and package updates.

**Category:** Media Buy
**Authentication:** Required
**REST equivalent:** `PATCH /api/v1/media-buys/{id}`

## Parameters

{: .table .table-bordered .table-striped }
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `media_buy_id` | `str` | Yes | -- | ID of the media buy to update. |
| `paused` | `bool` or `None` | No | `None` | `true` to pause delivery, `false` to resume. |
| `budget` | `float` or `None` | No | `None` | New total budget. |
| `start_time` | `str` (ISO 8601) or `None` | No | `None` | New flight start date. |
| `end_time` | `str` (ISO 8601) or `None` | No | `None` | New flight end date. |
| `packages` | `list[PackageUpdate]` or `None` | No | `None` | Package-level updates. Each entry must include a `package_id`. |

## Response

Returns the full updated media buy object with the same structure as [create_media_buy](/agents/salesagent/tools/create-media-buy.html) response, reflecting all changes.

## Errors

{: .table .table-bordered .table-striped }
| Error | Cause |
|-------|-------|
| `AdCPNotFoundError` (404) | Media buy does not exist or is not owned by the caller. |
| `AdCPAuthorizationError` (403) | Principal does not own this media buy. |
| `AdCPValidationError` (400) | Invalid update (e.g., reducing budget below spend, past end date). |
| `AdCPConflictError` (409) | State conflict (e.g., unpausing a completed buy). |

## Example

**Request:**

```json
{
  "media_buy_id": "mb_a1b2c3d4",
  "paused": true
}
```

**Response:**

```json
{
  "media_buy_id": "mb_a1b2c3d4",
  "buyer_ref": "acme-sports-q1-2025",
  "status": "paused",
  "packages": [
    {
      "package_id": "pkg_x1y2z3",
      "product_id": "prod_ctv_sports_30s",
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
- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Create a new campaign
- [get_media_buys](/agents/salesagent/tools/get-media-buys.html) -- Query existing campaigns
