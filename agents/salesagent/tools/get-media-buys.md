---
layout: page_v2
title: Prebid Sales Agent - Tools - get_media_buys
description: Retrieve media buys with status, creative approval state, and optional delivery snapshots
sidebarType: 10
---

# get_media_buys
{: .no_toc}

Get media buys with status, creative approval state, and optional delivery snapshots. Returns a list of media buys matching the requested filters.

- TOC
{:toc}

## Description

The `get_media_buys` tool retrieves media buys from the publisher's system, returning their current status, associated packages, and creative approval state. When no filters are provided, it returns all active media buys visible to the authenticated principal.

Callers can narrow results by media buy IDs, buyer references, status, or account. Setting `include_snapshot` to `true` attaches near-real-time delivery statistics (impressions, spend, pacing) to each package in the response. This is useful for monitoring active campaigns without calling a separate delivery endpoint.

Source: `src/core/tools/media_buy_list.py:196`

## Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `media_buy_ids` | `list[str]` | No | Array of publisher media buy IDs to retrieve. | `None` |
| `buyer_refs` | `list[str]` | No | Array of buyer reference IDs to retrieve. | `None` |
| `status_filter` | `MediaBuyStatus \| list[MediaBuyStatus]` | No | Filter by status — single status or array of values (`pending`, `approved`, `active`, `paused`, `completed`, `failed`). | `None` |
| `include_snapshot` | `bool` | No | When true, include near-real-time delivery stats per package. | `false` |
| `account_id` | `str` | No | Filter to a specific account. | `None` |
| `context` | `ContextObject` | No | Application level context object. | `None` |

## Response

Returns a `GetMediaBuysResponse` object containing:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `media_buys` | `list[MediaBuy]` | List of matching media buys with status, packages, and optional delivery snapshots |
| `errors` | `list[object]` | Any errors encountered during retrieval |

Each `MediaBuy` in the list contains the media buy's current status, its associated packages with creative assignments, and — when `include_snapshot` is `true` — delivery metrics such as impressions delivered, spend to date, and pacing percentage.

## Error Codes

{: .table .table-bordered .table-striped }
| Error Code | Description |
|------------|-------------|
| `principal_id_missing` | No principal ID was found in the request context. Authentication is required. |
| `principal_not_found` | The authenticated principal does not exist in the system. |
| `account_id_filtering_not_supported` | The `account_id` filter is not supported for this tenant configuration. |

## Example

```python
from mcp import ClientSession

async with ClientSession(transport) as session:
    await session.initialize()

    # Retrieve all active media buys
    result = await session.call_tool(
        "get_media_buys",
        arguments={
            "status_filter": "active",
        },
    )
    for buy in result.content["media_buys"]:
        print(f"{buy['media_buy_id']}: {buy['status']}")

    # Retrieve specific media buys with delivery snapshots
    result = await session.call_tool(
        "get_media_buys",
        arguments={
            "media_buy_ids": ["mb_abc123", "mb_def456"],
            "include_snapshot": True,
        },
    )
    for buy in result.content["media_buys"]:
        for pkg in buy.get("packages", []):
            snapshot = pkg.get("delivery_snapshot", {})
            print(
                f"  {pkg['package_id']}: "
                f"{snapshot.get('impressions_delivered', 0)} impressions"
            )
```

Example response:

```json
{
  "media_buys": [
    {
      "media_buy_id": "mb_abc123",
      "buyer_ref": "buyer_ref_001",
      "status": "active",
      "packages": [
        {
          "package_id": "pkg_001",
          "product_id": "prod_abc123",
          "creative_status": "approved",
          "delivery_snapshot": {
            "impressions_delivered": 45200,
            "spend_to_date": 1130.00,
            "pacing_percentage": 0.72
          }
        }
      ]
    }
  ],
  "errors": []
}
```

## Related Tools

- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Create a new media buy
- [update_media_buy](/agents/salesagent/tools/update-media-buy.html) -- Modify an existing media buy
- [get_media_buy_delivery](/agents/salesagent/tools/get-media-buy-delivery.html) -- Detailed delivery reporting for a single media buy
- [get_products](/agents/salesagent/tools/get-products.html) -- Discover products before creating media buys
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog

## Protocol Specification

{: .alert.alert-info :}
The `get_media_buys` tool implements the AdCP `get_media_buys` task. See the [AdCP Specification](https://docs.adcontextprotocol.org/docs/intro) for the full protocol definition including `MediaBuy` schema, status lifecycle, and delivery snapshot format.
