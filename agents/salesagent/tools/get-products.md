---
layout: page_v2
title: get_products
description: Search the publisher product catalog with optional AI ranking
sidebarType: 10
---

# get_products
{: .no_toc}

- TOC
{:toc}

## Overview

Searches the publisher's product catalog. Supports natural-language search via the `brief` parameter, optional brand context, and structured filters. When the tenant has a `product_ranking_prompt` and a Gemini API key configured, products are ranked by relevance using Pydantic AI.

**Category:** Discovery
**Authentication:** Optional
**REST equivalent:** `GET /api/v1/products`

## Parameters

{: .table .table-bordered .table-striped }
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `brief` | `str` | No | `""` | Natural-language description of what the buyer is looking for. Used for AI relevance ranking when available. |
| `brand` | `dict` or `None` | No | `None` | Brand context (`name`, `industry`, `target_audience`) to inform product selection. |
| `filters` | `dict` or `None` | No | `None` | Structured filters. Supported keys vary by tenant (e.g., `channels`, `countries`, `delivery_type`). |

## Response

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `products` | `list[Product]` | Matching products. |
| `portfolio_description` | `str` or `None` | Publisher's portfolio description. |
| `errors` | `list[str]` | Non-fatal warnings (e.g., AI ranking unavailable). |
| `context` | `dict` or `None` | Metadata about the search (e.g., ranking method used). |

### Product Fields

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `product_id` | `str` | Unique product identifier within the tenant. |
| `name` | `str` | Product name. |
| `description` | `str` | Detailed product description. |
| `format_ids` | `list[FormatId]` | Creative formats accepted. Each has `agent_url` (str) and `id` (str). |
| `delivery_type` | `str` | `guaranteed` or `non_guaranteed`. |
| `delivery_measurement` | `dict` | How delivery is measured (e.g., impressions, completed views). |
| `pricing_options` | `list[PricingOption]` | Available pricing models with rates and budget ranges. |
| `publisher_properties` | `list[str]` or `None` | Properties where this product runs. |

## Example

**Request:**

```json
{
  "brief": "High-impact video ads targeting sports fans in the US",
  "brand": {
    "name": "Acme Sports",
    "industry": "sporting goods"
  },
  "filters": {
    "channels": ["olv", "ctv"],
    "countries": ["US"]
  }
}
```

**Response:**

```json
{
  "products": [
    {
      "product_id": "prod_ctv_sports_30s",
      "name": "CTV Sports - 30s Pre-Roll",
      "description": "30-second pre-roll on live sports streaming.",
      "format_ids": [{"agent_url": "https://creative.example.com", "id": "video_30s"}],
      "delivery_type": "guaranteed",
      "delivery_measurement": {"type": "impressions"},
      "pricing_options": [
        {
          "pricing_option_id": "po_1",
          "pricing_model": "cpm",
          "is_fixed": true,
          "rate": 45.00,
          "currency": "USD",
          "min_budget": 5000,
          "max_budget": 500000
        }
      ],
      "publisher_properties": ["sports.example.com"]
    }
  ],
  "portfolio_description": "Premium sports and entertainment advertising.",
  "errors": [],
  "context": {"ranking_method": "ai"}
}
```

## Further Reading

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- All tools
- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Book products into a campaign
- [list_creative_formats](/agents/salesagent/tools/list-creative-formats.html) -- Format specs for product creatives
