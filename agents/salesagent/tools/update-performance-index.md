---
layout: page_v2
title: Prebid Sales Agent - Tools - update_performance_index
description: Update performance index data for a media buy's packages
sidebarType: 10
---

# update_performance_index
{: .no_toc}

Updates performance index data for a media buy's packages. Buying agents use this to provide performance signals that inform optimization.

- TOC
{:toc}

## Description

The `update_performance_index` tool allows buying agents to submit performance signals for packages within a media buy. Each performance data entry maps a `product_id` to a `performance_index` value where `1.0` represents baseline performance. Values above `1.0` indicate above-average performance; values below `1.0` indicate underperformance.

The publisher's Sales Agent uses these signals to optimize delivery — for example, shifting impressions toward higher-performing packages or adjusting pacing. An optional `confidence_score` (0.0 to 1.0) indicates how reliable the performance signal is, allowing the optimization system to weigh signals appropriately.

This tool requires authentication. Only the buying agent that owns the media buy can submit performance data.

Source: `src/core/tools/performance.py:125`

## Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `media_buy_id` | `str` | Yes | ID of the media buy to update. | -- |
| `performance_data` | `list[PerformanceEntry]` | Yes | List of performance data objects (see below). | -- |

### PerformanceEntry

Each object in the `performance_data` array contains:

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `product_id` | `str` | Yes | The product ID within the media buy to report on. |
| `performance_index` | `float` | Yes | Performance index value. `1.0` = baseline performance. |
| `confidence_score` | `float` | No | Confidence in the signal, from `0.0` (low) to `1.0` (high). |

## Response

Returns an `UpdatePerformanceIndexResponse` object containing:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `status` | `str` | Result status: `"success"` or `"failed"` |
| `detail` | `str` | Human-readable message describing the outcome |
| `context` | `ContextObject` | Response context metadata |

## Error Codes

{: .table .table-bordered .table-striped }
| Error Code | Description |
|------------|-------------|
| `principal_id_missing` | No principal ID was found in the request context. Authentication is required. |
| `principal_not_found` | The authenticated principal does not exist in the system. |
| `context_required` | A context object is required for this operation. |
| `validation_error` | Invalid parameters (e.g., missing `media_buy_id`, empty `performance_data`, out-of-range values). |

## Example

```python
from mcp import ClientSession

async with ClientSession(transport) as session:
    await session.initialize()

    # Submit performance signals for two products
    result = await session.call_tool(
        "update_performance_index",
        arguments={
            "media_buy_id": "mb_abc123",
            "performance_data": [
                {
                    "product_id": "prod_video_001",
                    "performance_index": 1.35,
                    "confidence_score": 0.9,
                },
                {
                    "product_id": "prod_display_002",
                    "performance_index": 0.72,
                    "confidence_score": 0.85,
                },
            ],
        },
    )
    print(f"Status: {result.content['status']}")
    print(f"Detail: {result.content['detail']}")
```

Example response:

```json
{
  "status": "success",
  "detail": "Performance index updated for 2 products in media buy mb_abc123."
}
```

## Related Tools

- [get_media_buys](/agents/salesagent/tools/get-media-buys.html) -- Retrieve media buys to identify product IDs for reporting
- [get_media_buy_delivery](/agents/salesagent/tools/get-media-buy-delivery.html) -- View delivery data that informs performance signals
- [update_media_buy](/agents/salesagent/tools/update-media-buy.html) -- Modify media buy parameters based on performance
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog

## Protocol Specification

{: .alert.alert-info :}
The `update_performance_index` tool implements the AdCP `update_performance_index` task. See the [AdCP Specification](https://docs.adcontextprotocol.org/docs/intro) for the full protocol definition including performance index semantics and optimization signal handling.
