---
layout: page_v2
title: Prebid Sales Agent - Tools - create_media_buy
description: Create advertising campaigns with packages, creatives, and targeting
sidebarType: 10
---

# create_media_buy
{: .no_toc}

Creates a new media buy (advertising campaign) with one or more packages, optional creative assets, and targeting configuration.

- TOC
{:toc}

## Description

The `create_media_buy` tool is the primary execution tool for purchasing advertising inventory. It accepts a campaign definition including flight dates, packages (line items), and optional creative assignments, then orchestrates the creation process through the ad server adapter.

This is an **asynchronous** tool. Depending on the publisher's configuration, media buy creation may require human-in-the-loop approval before the campaign goes live. The tool returns immediately with a `media_buy_id` and status, but the campaign may remain in a `pending_approval` state until a publisher administrator approves it through the workflow system.

Authentication is **required**. The buyer's identity is derived from the authentication token.

## Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `campaign_name` | `str` | Yes | Human-readable name for the campaign. | -- |
| `media_buy_start_date` | `date` | Yes | Campaign start date (ISO 8601 format, e.g., `"2026-03-01"`). | -- |
| `media_buy_end_date` | `date` | Yes | Campaign end date (ISO 8601 format, e.g., `"2026-03-31"`). | -- |
| `packages` | `list[PackageRequest]` | Yes | One or more packages (line items) defining the media buy. See PackageRequest below. | -- |
| `brand_manifest` | `BrandManifest` | No | Brand metadata for compliance and personalization. See [get_products](/agents/salesagent/tools/get-products.html) for schema. | `None` |
| `buyer_ref` | `str` | No | Buyer-side reference ID for reconciliation. | `None` |
| `creatives` | `list[CreativeAsset]` | No | Inline creative assets to upload with the media buy. | `None` |
| `creative_ids` | `list[str]` | No | IDs of previously uploaded creatives to attach. | `None` |
| `assignments` | `dict[str, list[str]]` | No | Map of package identifiers to creative ID lists, defining which creatives serve on which packages. | `None` |
| `push_notification_config` | `PushNotificationConfig` | No | Configuration for async push notifications on status changes. | `None` |

### PackageRequest

Each package in the `packages` list defines a line item:

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `product_id` | `str` | Yes | Product identifier from `get_products` |
| `name` | `str` | No | Package display name |
| `budget` | `float` | Yes | Package budget amount |
| `currency` | `str` | No | ISO 4217 currency code (e.g., `"USD"`) |
| `quantity` | `int` | No | Target impression quantity |
| `targeting` | `TargetingSpec` | No | Additional targeting overrides |
| `start_date` | `date` | No | Package-level start date (overrides campaign dates) |
| `end_date` | `date` | No | Package-level end date (overrides campaign dates) |

### CreativeAsset

Inline creatives included with the media buy:

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `format_id` | `str` | Yes | Creative format identifier from `list_creative_formats` |
| `name` | `str` | Yes | Creative display name |
| `asset_url` | `str` | Yes | URL to the creative asset file |
| `click_through_url` | `str` | No | Landing page URL |
| `metadata` | `dict` | No | Additional creative metadata |

## Response

Returns one of two result types:

### CreateMediaBuySuccess

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `media_buy_id` | `str` | Unique identifier for the created media buy |
| `status` | `str` | Current status (e.g., `active`, `pending_approval`, `draft`) |
| `campaign_name` | `str` | Confirmed campaign name |
| `packages` | `list[PackageResult]` | Created packages with assigned IDs |
| `creatives` | `list[CreativeResult]` | Created/attached creative results |
| `created_at` | `datetime` | Creation timestamp |

### CreateMediaBuyError

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `error_code` | `str` | Machine-readable error code |
| `message` | `str` | Human-readable error description |
| `details` | `dict` | Additional error context |

## Error Codes

{: .table .table-bordered .table-striped }
| Error Code | Description |
|------------|-------------|
| `unauthorized` | Missing or invalid authentication token |
| `forbidden` | Token lacks media buy creation scope |
| `validation_error` | Invalid parameters (e.g., end date before start date, missing required fields) |
| `product_not_found` | Referenced product_id does not exist |
| `creative_format_mismatch` | Creative does not match the required format for the package |
| `budget_below_minimum` | Package budget is below the product's minimum |
| `date_out_of_range` | Flight dates outside the product's available window |
| `internal_error` | Unexpected server error |

## Example

```python
from mcp import ClientSession

async with ClientSession(transport) as session:
    await session.initialize()

    # Create a simple media buy with one package
    result = await session.call_tool(
        "create_media_buy",
        arguments={
            "campaign_name": "Q1 Brand Awareness - Luxe Motors",
            "media_buy_start_date": "2026-03-01",
            "media_buy_end_date": "2026-03-31",
            "buyer_ref": "luxe-q1-2026-001",
            "packages": [
                {
                    "product_id": "prod_abc123",
                    "name": "Premium Video - US",
                    "budget": 50000.00,
                    "currency": "USD",
                    "quantity": 2000000,
                }
            ],
        },
    )
    media_buy = result.content
    print(f"Media Buy ID: {media_buy['media_buy_id']}")
    print(f"Status: {media_buy['status']}")

    # Create with inline creatives and assignments
    result = await session.call_tool(
        "create_media_buy",
        arguments={
            "campaign_name": "Spring Campaign",
            "media_buy_start_date": "2026-04-01",
            "media_buy_end_date": "2026-04-30",
            "packages": [
                {
                    "product_id": "prod_def456",
                    "budget": 25000.00,
                }
            ],
            "creatives": [
                {
                    "format_id": "video_16x9_preroll",
                    "name": "Spring 30s Spot",
                    "asset_url": "https://cdn.example.com/spring-30s.mp4",
                    "click_through_url": "https://luxemotors.example.com/spring",
                }
            ],
            "assignments": {
                "prod_def456": ["spring-30s-spot"],
            },
            "brand_manifest": {
                "brand_name": "Luxe Motors",
                "category": "automotive",
            },
        },
    )
```

Example success response:

```json
{
  "media_buy_id": "mb_xyz789",
  "status": "pending_approval",
  "campaign_name": "Q1 Brand Awareness - Luxe Motors",
  "packages": [
    {
      "package_id": "pkg_001",
      "product_id": "prod_abc123",
      "name": "Premium Video - US",
      "budget": 50000.00,
      "status": "pending"
    }
  ],
  "creatives": [],
  "created_at": "2026-02-25T10:30:00Z"
}
```

## Related Tools

- [get_products](/agents/salesagent/tools/get-products.html) -- Discover products before creating a media buy
- [update_media_buy](/agents/salesagent/tools/update-media-buy.html) -- Modify an existing media buy
- [sync_creatives](/agents/salesagent/tools/sync-creatives.html) -- Upload creatives separately before or after creation
- [get_media_buy_delivery](/agents/salesagent/tools/get-media-buy-delivery.html) -- Monitor delivery after creation
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog

## Protocol Specification

{: .alert.alert-info :}
The `create_media_buy` tool implements the AdCP `create_media_buy` task. See the [AdCP Specification](https://docs.adcontextprotocol.org/docs/intro) for the full protocol definition including `PackageRequest` schema, `BrandManifest` requirements, and the human-in-the-loop approval flow.
