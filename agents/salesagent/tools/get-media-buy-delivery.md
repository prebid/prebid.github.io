---
layout: page_v2
title: get_media_buy_delivery
description: Delivery metrics, pacing, and performance data for media buys
sidebarType: 10
---

# get_media_buy_delivery
{: .no_toc}

- TOC
{:toc}

## Overview

Returns delivery metrics and performance data for one or more media buys. Supports filtering by date range and optional daily breakdowns at the package level.

**Category:** Media Buy
**Authentication:** Required
**REST equivalent:** `GET /api/v1/media-buys/{id}/delivery`

## Parameters

{: .table .table-bordered .table-striped }
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `media_buy_ids` | `list[str]` or `None` | No | `None` | Filter by media buy IDs. |
| `buyer_refs` | `list[str]` or `None` | No | `None` | Filter by buyer references. |
| `start_date` | `str` (ISO 8601) or `None` | No | `None` | Reporting period start. |
| `end_date` | `str` (ISO 8601) or `None` | No | `None` | Reporting period end. |
| `account` | `str` or `None` | No | `None` | Account identifier for multi-account setups. |
| `reporting_dimensions` | `list[str]` or `None` | No | `None` | Dimensions to break out in reporting. |
| `include_package_daily_breakdown` | `bool` | No | `false` | Include per-package daily delivery data. |
| `attribution_window` | `str` or `None` | No | `None` | Attribution window for conversions (e.g., `7d`, `30d`). |

## Response

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `media_buy_deliveries` | `list[MediaBuyDelivery]` | Delivery data per media buy. |

### MediaBuyDelivery Fields

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `media_buy_id` | `str` | The media buy ID. |
| `buyer_ref` | `str` or `None` | Buyer's external reference. |
| `status` | `str` | `ready`, `active`, `paused`, `completed`, `failed`, or `reporting_delayed`. |
| `totals` | `DeliveryTotals` | Aggregated metrics. |
| `by_package` | `list[PackageDelivery]` | Per-package breakdown. |
| `daily_breakdown` | `list[DailyBreakdown]` or `None` | Daily data (only when `include_package_daily_breakdown` is `true`). |

### DeliveryTotals

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `impressions` | `int` | Total impressions served. |
| `spend` | `float` | Total spend in the buy's currency. |
| `clicks` | `int` | Total clicks. |
| `ctr` | `float` | Click-through rate. |
| `video_completions` | `int` or `None` | Completed video views (video only). |
| `completion_rate` | `float` or `None` | Video completion rate. |
| `conversions` | `int` or `None` | Attributed conversions. |
| `viewability` | `float` or `None` | Viewability rate (0.0 - 1.0). |

### PackageDelivery

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `package_id` | `str` | The package ID. |
| `buyer_ref` | `str` or `None` | Package-level buyer reference. |
| `impressions` | `int` | Impressions for this package. |
| `spend` | `float` | Spend for this package. |
| `pricing_model` | `str` | Pricing model (e.g., `cpm`, `cpc`). |
| `rate` | `float` | Rate being charged. |
| `currency` | `str` | Currency code. |
| `pacing_index` | `float` or `None` | `1.0` = on pace, `> 1.0` = ahead, `< 1.0` = behind. |

### DailyBreakdown

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `date` | `str` (ISO 8601) | Date for this row. |
| `impressions` | `int` | Impressions on this date. |
| `spend` | `float` | Spend on this date. |

## Example

**Request:**

```json
{
  "media_buy_ids": ["mb_a1b2c3d4"],
  "start_date": "2025-04-01",
  "end_date": "2025-04-15",
  "include_package_daily_breakdown": true
}
```

**Response:**

```json
{
  "media_buy_deliveries": [
    {
      "media_buy_id": "mb_a1b2c3d4",
      "buyer_ref": "acme-sports-q1-2025",
      "status": "active",
      "totals": {
        "impressions": 1250000,
        "spend": 12340.50,
        "clicks": 3750,
        "ctr": 0.003,
        "video_completions": 875000,
        "completion_rate": 0.70,
        "conversions": null,
        "viewability": 0.82
      },
      "by_package": [
        {
          "package_id": "pkg_x1y2z3",
          "buyer_ref": null,
          "impressions": 1250000,
          "spend": 12340.50,
          "pricing_model": "cpm",
          "rate": 45.00,
          "currency": "USD",
          "pacing_index": 0.95
        }
      ],
      "daily_breakdown": [
        {"date": "2025-04-01", "impressions": 85000, "spend": 850.00},
        {"date": "2025-04-02", "impressions": 88000, "spend": 880.00}
      ]
    }
  ]
}
```

## Further Reading

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- All tools
- [get_media_buys](/agents/salesagent/tools/get-media-buys.html) -- Query campaigns
- [update_media_buy](/agents/salesagent/tools/update-media-buy.html) -- Adjust budget or pacing
