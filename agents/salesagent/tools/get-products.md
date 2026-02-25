---
layout: page_v2
title: Prebid Sales Agent - Tools - get_products
description: AI-powered product discovery with natural language search and filtering
sidebarType: 10
---

# get_products
{: .no_toc}

Searches the publisher's advertising product catalog using AI-powered retrieval, returning products that match a natural language brief and optional structured filters.

- TOC
{:toc}

## Description

The `get_products` tool is the primary entry point for product discovery. It accepts a natural language `brief` describing what the buyer is looking for (e.g., "premium video inventory targeting sports fans in the US") and uses AI/RAG (Retrieval-Augmented Generation) to find matching products from the publisher's catalog.

Results include pricing options, available creative formats, estimated exposure volumes, supported channels, and geographic availability. When a `brand_manifest` is provided, the agent can further tailor recommendations to the brand's category, audience, and compliance requirements.

Response times are typically a few seconds due to the AI-powered search pipeline.

## Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `brief` | `str` | Yes | Natural language description of desired advertising products. The AI search engine interprets this to find relevant matches. | -- |
| `brand_manifest` | `BrandManifest` | No | Brand metadata including category, audience profile, and compliance requirements. Enables personalized product recommendations. | `None` |
| `adcp_version` | `str` | No | AdCP protocol version for response formatting. | `"1.0.0"` |
| `filters` | `ProductFilters` | No | Structured filters to narrow results (see below). | `None` |
| `push_notification_config` | `PushNotificationConfig` | No | Configuration for async push notifications when results are ready. | `None` |
| `context` | `ContextObject` | No | Additional context about the buying agent's session and preferences. | `None` |

### ProductFilters

The `filters` parameter accepts a `ProductFilters` object with the following fields:

{: .table .table-bordered .table-striped }
| Name | Type | Description |
|------|------|-------------|
| `channels` | `list[str]` | Filter by channel (e.g., `["display", "video"]`) |
| `countries` | `list[str]` | Filter by country code (ISO 3166-1 alpha-2) |
| `format_ids` | `list[str]` | Filter by creative format identifiers |
| `min_budget` | `float` | Minimum budget threshold |
| `max_budget` | `float` | Maximum budget threshold |

### BrandManifest

The `brand_manifest` parameter accepts a `BrandManifest` object that describes the advertiser:

{: .table .table-bordered .table-striped }
| Name | Type | Description |
|------|------|-------------|
| `brand_name` | `str` | Name of the advertising brand |
| `category` | `str` | Industry category (e.g., "automotive", "retail") |
| `audience` | `AudienceProfile` | Target audience demographics and interests |
| `compliance` | `ComplianceRequirements` | Regulatory and brand safety requirements |

## Response

Returns a `GetProductsResponse` object containing a list of matching products:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `products` | `list[Product]` | Matching products ranked by relevance |
| `total_results` | `int` | Total number of matching products |
| `search_metadata` | `SearchMetadata` | Information about the search execution |

Each `Product` in the list contains:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `product_id` | `str` | Unique product identifier |
| `name` | `str` | Human-readable product name |
| `description` | `str` | Detailed product description |
| `pricing_options` | `list[PricingOption]` | Available pricing models (CPM, CPC, flat rate, etc.) |
| `format_ids` | `list[str]` | Compatible creative format identifiers |
| `estimated_exposures` | `ExposureEstimate` | Estimated impression/exposure volumes |
| `channels` | `list[str]` | Delivery channels (display, video, audio, native) |
| `countries` | `list[str]` | Geographic availability (ISO 3166-1 alpha-2 codes) |

## Error Codes

{: .table .table-bordered .table-striped }
| Error Code | Description |
|------------|-------------|
| `validation_error` | Invalid parameters (e.g., empty brief) |
| `internal_error` | AI search pipeline failure |

## Example

```python
from mcp import ClientSession

async with ClientSession(transport) as session:
    await session.initialize()

    # Simple natural language search
    result = await session.call_tool(
        "get_products",
        arguments={
            "brief": "premium video ads targeting tech professionals in the US"
        },
    )
    products = result.content
    for product in products["products"]:
        print(f"{product['name']}: {product['pricing_options']}")

    # Search with brand context and filters
    result = await session.call_tool(
        "get_products",
        arguments={
            "brief": "high-impact display placements for luxury automotive",
            "brand_manifest": {
                "brand_name": "Luxe Motors",
                "category": "automotive",
            },
            "filters": {
                "channels": ["display"],
                "countries": ["US", "GB"],
            },
        },
    )
```

Example response:

```json
{
  "products": [
    {
      "product_id": "prod_abc123",
      "name": "Premium Video - Tech Audience",
      "description": "Pre-roll and mid-roll video inventory across tech publisher network",
      "pricing_options": [
        {"model": "CPM", "amount": 25.00, "currency": "USD"}
      ],
      "format_ids": ["video_16x9_preroll", "video_16x9_midroll"],
      "estimated_exposures": {
        "min_impressions": 100000,
        "max_impressions": 500000,
        "period": "monthly"
      },
      "channels": ["video"],
      "countries": ["US"]
    }
  ],
  "total_results": 1
}
```

## Related Tools

- [get_adcp_capabilities](/agents/salesagent/tools/get-adcp-capabilities.html) -- Discover capabilities before searching products
- [list_creative_formats](/agents/salesagent/tools/list-creative-formats.html) -- Get details on format_ids returned in products
- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Buy a discovered product
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog

## Protocol Specification

{: .alert.alert-info :}
The `get_products` tool implements the AdCP `get_products` task. See the [AdCP Specification](https://docs.adcontextprotocol.org/docs/intro) for the full protocol definition including `BrandManifest` schema and product response format.
