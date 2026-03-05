---
layout: page_v2
title: Prebid Sales Agent - Tools - list_creatives
description: List and filter creative assets from the centralized library
sidebarType: 10
---

# list_creatives
{: .no_toc}

List and filter creative assets from the centralized library. Supports both flat parameters and nested objects for filtering, sorting, and pagination.

- TOC
{:toc}

## Description

The `list_creatives` tool provides access to the publisher's creative asset library. It supports filtering by media buy, buyer reference, status, format, tags, and date range, as well as full-text search across creative names and descriptions. Results are paginated and sortable.

When `include_performance` is set to `true`, each creative in the response includes aggregated performance metrics (impressions, clicks, CTR). When `include_assignments` is `true`, the response shows which packages each creative is assigned to. Both options increase response size and latency.

As of AdCP 2.5, the tool accepts `media_buy_ids` and `buyer_refs` as arrays for batch filtering across multiple media buys or buyers in a single call.

Source: `src/core/tools/creatives/listing.py:456`

## Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `media_buy_id` | `str` | No | Filter by single media buy ID. | `None` |
| `media_buy_ids` | `list[str]` | No | Filter by multiple media buy IDs (AdCP 2.5). | `None` |
| `buyer_ref` | `str` | No | Filter by single buyer reference. | `None` |
| `buyer_refs` | `list[str]` | No | Filter by multiple buyer references (AdCP 2.5). | `None` |
| `status` | `str` | No | Filter by creative status (`pending`, `approved`, `rejected`). | `None` |
| `format` | `str` | No | Filter by creative format. | `None` |
| `tags` | `list[str]` | No | Filter by tags. | `None` |
| `created_after` | `str` | No | Filter by creation date (ISO 8601). | `None` |
| `created_before` | `str` | No | Filter by creation date (ISO 8601). | `None` |
| `search` | `str` | No | Search in creative names and descriptions. | `None` |
| `include_performance` | `bool` | No | Include performance metrics per creative. | `false` |
| `include_assignments` | `bool` | No | Include package assignment data per creative. | `false` |
| `page` | `int` | No | Page number for pagination. | `1` |
| `limit` | `int` | No | Results per page (max 1000). | `50` |
| `sort_by` | `str` | No | Sort field (`created_date`, `name`, `status`). | `"created_date"` |
| `sort_order` | `str` | No | Sort order (`asc`, `desc`). | `"desc"` |

## Response

Returns a `ListCreativesResponse` object containing:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `creatives` | `list[Creative]` | List of creative assets matching the filters |
| `query_summary` | `object` | Summary of the applied filters and search terms |
| `pagination` | `PaginationInfo` | Pagination metadata (`page`, `limit`, `total`, `total_pages`) |
| `format_summary` | `object` | Breakdown of results by creative format |
| `status_summary` | `object` | Breakdown of results by creative status |
| `context` | `ContextObject` | Response context metadata |

## Error Codes

{: .table .table-bordered .table-striped }
| Error Code | Description |
|------------|-------------|
| `authentication_required` | Creatives contain sensitive data and require authentication. |
| `no_tenant_context` | No tenant context available. The request must include a valid tenant. |
| `invalid_date_format` | The `created_after` or `created_before` value is not valid ISO 8601. |

## Example

```python
from mcp import ClientSession

async with ClientSession(transport) as session:
    await session.initialize()

    # List all approved creatives for a media buy
    result = await session.call_tool(
        "list_creatives",
        arguments={
            "media_buy_id": "mb_abc123",
            "status": "approved",
        },
    )
    for creative in result.content["creatives"]:
        print(f"{creative['name']} ({creative['format']})")

    # Search creatives with performance data across multiple buyers
    result = await session.call_tool(
        "list_creatives",
        arguments={
            "buyer_refs": ["buyer_001", "buyer_002"],
            "search": "holiday campaign",
            "include_performance": True,
            "sort_by": "name",
            "sort_order": "asc",
            "limit": 25,
        },
    )
    pagination = result.content["pagination"]
    print(f"Page {pagination['page']} of {pagination['total_pages']}")
    for creative in result.content["creatives"]:
        perf = creative.get("performance", {})
        print(f"  {creative['name']}: {perf.get('impressions', 0)} impressions")
```

Example response:

```json
{
  "creatives": [
    {
      "creative_id": "cr_xyz789",
      "name": "Holiday Banner 300x250",
      "format": "display",
      "status": "approved",
      "created_date": "2026-01-15T10:30:00Z",
      "tags": ["holiday", "q4"],
      "performance": {
        "impressions": 120000,
        "clicks": 3600,
        "ctr": 0.03
      }
    }
  ],
  "query_summary": {
    "filters_applied": ["buyer_refs", "search"],
    "search_term": "holiday campaign"
  },
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 1,
    "total_pages": 1
  },
  "format_summary": {"display": 1},
  "status_summary": {"approved": 1}
}
```

## Related Tools

- [sync_creatives](/agents/salesagent/tools/sync-creatives.html) -- Upload or sync creative assets to the library
- [list_creative_formats](/agents/salesagent/tools/list-creative-formats.html) -- Discover supported creative formats
- [get_media_buys](/agents/salesagent/tools/get-media-buys.html) -- Retrieve media buys that reference creatives
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog

## Protocol Specification

{: .alert.alert-info :}
The `list_creatives` tool implements the AdCP `list_creatives` task. See the [AdCP Specification](https://docs.adcontextprotocol.org/docs/intro) for the full protocol definition including creative status lifecycle and performance metric schemas.
