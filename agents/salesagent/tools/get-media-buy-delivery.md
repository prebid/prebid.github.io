---
layout: page_v2
title: Prebid Sales Agent - Tools - get_media_buy_delivery
description: Retrieve delivery metrics, spend data, and performance breakdowns for media buys
sidebarType: 10
---

# get_media_buy_delivery
{: .no_toc}

Retrieves delivery metrics and performance data for one or more media buys, including impressions, spend, click-through rates, and package-level breakdowns.

- TOC
{:toc}

## Description

The `get_media_buy_delivery` tool provides access to campaign performance data. It supports querying by individual media buy ID, multiple IDs, buyer reference, or date range. Results include aggregate metrics at the media buy level and granular breakdowns at the package level.

This is a **synchronous** tool. Data freshness depends on the ad server adapter's reporting latency -- typically near-real-time for the mock adapter and up to a few hours for production ad servers like Google Ad Manager.

Authentication is **required**. The buyer can only access delivery data for media buys they own or have been granted access to.

## Parameters

All parameters are optional, but at least one identifier (`media_buy_id`, `media_buy_ids`, `buyer_ref`, or `buyer_refs`) must be provided.

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `media_buy_id` | `str` | No | Single media buy identifier to query. | `None` |
| `media_buy_ids` | `list[str]` | No | Multiple media buy identifiers to query in a single request. | `None` |
| `buyer_ref` | `str` | No | Single buyer-side reference ID. Returns delivery for all media buys with this reference. | `None` |
| `buyer_refs` | `list[str]` | No | Multiple buyer-side reference IDs. | `None` |
| `start_date` | `date` | No | Filter delivery data to this start date (ISO 8601, e.g., `"2026-03-01"`). | `None` |
| `end_date` | `date` | No | Filter delivery data to this end date (ISO 8601, e.g., `"2026-03-31"`). | `None` |

### Query Patterns

The tool supports several common query patterns:

- **Single media buy** -- Pass `media_buy_id` for a specific campaign
- **Batch query** -- Pass `media_buy_ids` for multiple campaigns in one request
- **By buyer reference** -- Pass `buyer_ref` or `buyer_refs` to find campaigns by your internal IDs
- **Date-filtered** -- Combine any identifier with `start_date` and `end_date` to scope the reporting window

## Response

Returns a `GetMediaBuyDeliveryResponse` object:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `media_buys` | `list[MediaBuyDelivery]` | Delivery data for each matching media buy |

Each `MediaBuyDelivery` contains:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `media_buy_id` | `str` | Media buy identifier |
| `campaign_name` | `str` | Campaign display name |
| `status` | `str` | Current media buy status |
| `impressions` | `int` | Total impressions delivered |
| `clicks` | `int` | Total clicks recorded |
| `ctr` | `float` | Click-through rate (clicks / impressions) |
| `spend` | `float` | Total spend to date |
| `currency` | `str` | Spend currency (ISO 4217) |
| `budget` | `float` | Total campaign budget |
| `budget_utilization` | `float` | Percentage of budget spent (0.0 to 1.0) |
| `start_date` | `date` | Campaign start date |
| `end_date` | `date` | Campaign end date |
| `packages` | `list[PackageDelivery]` | Package-level delivery breakdowns |

Each `PackageDelivery` contains:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `package_id` | `str` | Package identifier |
| `product_id` | `str` | Associated product identifier |
| `name` | `str` | Package display name |
| `impressions` | `int` | Package-level impressions |
| `clicks` | `int` | Package-level clicks |
| `ctr` | `float` | Package-level click-through rate |
| `spend` | `float` | Package-level spend |
| `budget` | `float` | Package budget |
| `pacing` | `str` | Delivery pacing status: `on_track`, `ahead`, `behind`, `complete` |

## Error Codes

{: .table .table-bordered .table-striped }
| Error Code | Description |
|------------|-------------|
| `unauthorized` | Missing or invalid authentication token |
| `forbidden` | Token lacks permission to access this media buy's data |
| `not_found` | No media buys found matching the provided identifiers |
| `validation_error` | Invalid parameters (e.g., end_date before start_date, no identifiers provided) |
| `internal_error` | Unexpected server error |

## Example

```python
from mcp import ClientSession

async with ClientSession(transport) as session:
    await session.initialize()

    # Get delivery for a single media buy
    result = await session.call_tool(
        "get_media_buy_delivery",
        arguments={"media_buy_id": "mb_xyz789"},
    )
    delivery = result.content["media_buys"][0]
    print(f"Impressions: {delivery['impressions']:,}")
    print(f"Spend: ${delivery['spend']:,.2f} / ${delivery['budget']:,.2f}")
    print(f"CTR: {delivery['ctr']:.2%}")

    # Batch query multiple campaigns
    result = await session.call_tool(
        "get_media_buy_delivery",
        arguments={
            "media_buy_ids": ["mb_xyz789", "mb_abc123", "mb_def456"],
        },
    )

    # Query by buyer reference with date range
    result = await session.call_tool(
        "get_media_buy_delivery",
        arguments={
            "buyer_ref": "luxe-q1-2026-001",
            "start_date": "2026-03-01",
            "end_date": "2026-03-15",
        },
    )

    # Check package-level pacing
    for mb in result.content["media_buys"]:
        for pkg in mb["packages"]:
            if pkg["pacing"] == "behind":
                print(f"WARNING: {pkg['name']} is behind pace")
```

Example response:

```json
{
  "media_buys": [
    {
      "media_buy_id": "mb_xyz789",
      "campaign_name": "Q1 Brand Awareness - Luxe Motors",
      "status": "active",
      "impressions": 850000,
      "clicks": 12750,
      "ctr": 0.015,
      "spend": 21250.00,
      "currency": "USD",
      "budget": 50000.00,
      "budget_utilization": 0.425,
      "start_date": "2026-03-01",
      "end_date": "2026-03-31",
      "packages": [
        {
          "package_id": "pkg_001",
          "product_id": "prod_abc123",
          "name": "Premium Video - US",
          "impressions": 850000,
          "clicks": 12750,
          "ctr": 0.015,
          "spend": 21250.00,
          "budget": 50000.00,
          "pacing": "on_track"
        }
      ]
    }
  ]
}
```

## Related Tools

- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Create campaigns to monitor
- [update_media_buy](/agents/salesagent/tools/update-media-buy.html) -- Adjust campaigns based on delivery data
- [get_products](/agents/salesagent/tools/get-products.html) -- Look up product details for package product_ids
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog

## Protocol Specification

{: .alert.alert-info :}
The `get_media_buy_delivery` tool implements the AdCP `get_media_buy_delivery` operation. See the [AdCP Specification](https://docs.adcontextprotocol.org/docs/intro) for the full protocol definition including delivery metric schemas and reporting granularity options.
