---
layout: page_v2
title: get_adcp_capabilities
description: Returns publisher AdCP capabilities, protocols, and targeting dimensions
sidebarType: 10
---

# get_adcp_capabilities
{: .no_toc}

- TOC
{:toc}

## Overview

Returns the publisher's AdCP capabilities including supported protocol versions, portfolio description, feature flags, and available targeting dimensions. This is typically the first tool an agent calls to understand what a publisher offers.

**Category:** Discovery
**Authentication:** Optional
**REST equivalent:** `GET /api/v1/capabilities`

## Parameters

{: .table .table-bordered .table-striped }
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `protocols` | `list[str]` or `None` | No | `None` | Filter to specific protocol names. When `None`, all protocols are returned. Currently the only supported protocol is `media_buy`. |

## Response

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `adcp.major_versions` | `list[int]` | Supported major protocol versions. |
| `supported_protocols` | `list[str]` | Protocol names supported (e.g., `media_buy`). |
| `media_buy.portfolio.description` | `str` | Natural-language description of the publisher's offering. |
| `media_buy.portfolio.primary_channels` | `list[str]` | Primary advertising channels (see Channel enum below). |
| `media_buy.portfolio.publisher_domains` | `list[str]` | Domains where ads serve. |
| `media_buy.portfolio.advertising_policies` | `str` | Summary of advertising policies. |
| `media_buy.features.content_standards` | `bool` | Whether the publisher enforces content standards on creatives. |
| `media_buy.features.inline_creative_management` | `bool` | Whether creatives can be managed inline with media buys. |
| `media_buy.features.property_list_filtering` | `bool` | Whether products can be filtered by property. |
| `media_buy.execution.targeting.geo_countries` | `list[str]` | ISO 3166-1 alpha-2 country codes for geo targeting. |
| `media_buy.execution.targeting.geo_regions` | `list[str]` | Region codes for geo targeting. |
| `media_buy.execution.targeting.geo_metros` | `list[str]` | Metro/DMA codes for geo targeting. |
| `media_buy.execution.targeting.geo_postal_areas` | `list[str]` | Postal code prefixes for geo targeting. |
| `media_buy.execution.targeting.device_platform` | `list[str]` | Device platforms (e.g., `desktop`, `mobile`, `tablet`, `ctv`). |

### Channel Enum

`display`, `olv`, `video`, `social`, `search`, `ctv`, `linear_tv`, `radio`, `streaming_audio`, `audio`, `podcast`, `dooh`, `ooh`, `print`, `cinema`, `email`, `gaming`, `retail_media`, `influencer`, `affiliate`, `product_placement`

## Example

**Request:**

```json
{
  "protocols": ["media_buy"]
}
```

**Response:**

```json
{
  "adcp": {
    "major_versions": [1]
  },
  "supported_protocols": ["media_buy"],
  "media_buy": {
    "portfolio": {
      "description": "Premium sports and entertainment advertising across web and CTV.",
      "primary_channels": ["display", "olv", "ctv"],
      "publisher_domains": ["example.com", "sports.example.com"],
      "advertising_policies": "No tobacco, gambling, or political advertising."
    },
    "features": {
      "content_standards": true,
      "inline_creative_management": true,
      "property_list_filtering": true
    },
    "execution": {
      "targeting": {
        "geo_countries": ["US", "CA", "GB"],
        "geo_regions": ["US-NY", "US-CA"],
        "geo_metros": ["501", "803"],
        "geo_postal_areas": ["100", "900"],
        "device_platform": ["desktop", "mobile", "ctv"]
      }
    }
  }
}
```

## Further Reading

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- All tools
- [get_products](/agents/salesagent/tools/get-products.html) -- Search the product catalog
- [Protocols](/agents/salesagent/protocols.html) -- MCP, A2A, and REST access
