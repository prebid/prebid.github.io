---
layout: page_v2
title: Prebid Sales Agent - Schemas - API Schema Reference
description: Complete reference for all Pydantic request/response models, data types, and enums in the Prebid Sales Agent
sidebarType: 10
---

# API Schema Reference
{: .no_toc}

All data entering and leaving the Prebid Sales Agent is validated through Pydantic models defined in `src/core/schemas.py`. This page provides a complete reference for request/response models, core data types, enums, and JSON examples.

- TOC
{:toc}

## Overview

The Sales Agent uses Pydantic `BaseModel` classes as a validation and serialization layer between the protocol servers (MCP/A2A) and the business logic. Every tool request is validated against a request model before processing, and every response is serialized through a response model before being sent to the AI agent.

This approach provides:

- **Type safety** -- All fields are typed and validated at runtime
- **Documentation** -- Models are self-documenting with field descriptions
- **Serialization** -- Automatic conversion to/from JSON for protocol transport
- **Consistency** -- Both MCP and A2A use the same models, ensuring identical behavior

## Request/Response Models by Tool

Each MCP tool has a corresponding request model (for input validation) and response model (for output serialization).

{: .table .table-bordered .table-striped }
| Tool | Request Model | Response Model |
|------|--------------|----------------|
| `get_adcp_capabilities` | `GetAdcpCapabilitiesRequest` | `GetAdcpCapabilitiesResponse` |
| `get_products` | `GetProductsRequest` | `GetProductsResponse` |
| `list_creative_formats` | `ListCreativeFormatsRequest` | `ListCreativeFormatsResponse` |
| `create_media_buy` | `CreateMediaBuyRequest` | `CreateMediaBuyResponse` |
| `update_media_buy` | `UpdateMediaBuyRequest` | `UpdateMediaBuyResponse` |
| `get_media_buys` | `GetMediaBuysRequest` | `GetMediaBuysResponse` |
| `get_media_buy_delivery` | `GetMediaBuyDeliveryRequest` | `GetMediaBuyDeliveryResponse` |
| `sync_creatives` | `SyncCreativesRequest` | `SyncCreativesResponse` |
| `list_creatives` | `ListCreativesRequest` | `ListCreativesResponse` |
| `list_authorized_properties` | `ListAuthorizedPropertiesRequest` | `ListAuthorizedPropertiesResponse` |
| `update_performance_index` | `UpdatePerformanceIndexRequest` | `UpdatePerformanceIndexResponse` |
| `list_tasks` | `ListTasksRequest` | `ListTasksResponse` |
| `get_task` | `GetTaskRequest` | `GetTaskResponse` |
| `complete_task` | `CompleteTaskRequest` | `CompleteTaskResponse` |

## Core Data Models

### Product

Represents an advertising product in the publisher's catalog. Products are what AI buying agents discover and purchase.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | `str` | Yes | Unique product identifier |
| `name` | `str` | Yes | Human-readable product name |
| `description` | `str` | Yes | Detailed description used for AI-powered search matching |
| `delivery_type` | `DeliveryType` | Yes | `guaranteed` or `non_guaranteed` |
| `format_ids` | `list[str]` | Yes | Compatible creative format identifiers |
| `pricing_options` | `list[PricingOption]` | Yes | Available pricing models with rates |
| `estimated_exposures` | `ExposureEstimate` | No | Estimated impression/exposure volumes |
| `channels` | `list[str]` | Yes | Delivery channels (e.g., `display`, `video`, `audio`, `native`) |
| `countries` | `list[str]` | Yes | Geographic availability as ISO 3166-1 alpha-2 codes |

### Creative

Represents an advertising creative asset uploaded by a buying agent.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `creative_id` | `str` | Yes | Unique creative identifier |
| `name` | `str` | Yes | Human-readable creative name |
| `format_id` | `str` | Yes | Creative format identifier (must match a supported format) |
| `assets` | `list[CreativeAsset]` | Yes | Creative asset files (images, video, HTML) |
| `status` | `CreativeStatus` | Yes | Processing status (`pending_review`, `approved`, `rejected`, `processing`) |
| `approval_status` | `str` | Yes | Publisher approval status |
| `created_at` | `datetime` | Yes | Creation timestamp (ISO 8601) |
| `tags` | `list[str]` | No | Optional tags for organization and filtering |

### MediaPackage (Package)

Represents a media buy package -- a bundle of one or more products with targeting and budget.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `package_id` | `str` | Yes | Unique package identifier |
| `product_id` | `str` | Yes | Reference to the purchased product |
| `budget` | `BudgetSpec` | Yes | Budget specification (amount, currency) |
| `targeting` | `Targeting` | No | Targeting criteria for this package |
| `pricing` | `Pricing` | Yes | Negotiated pricing for this package |

### Principal

Represents an authenticated entity (AI agent or human user) that interacts with the Sales Agent.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `principal_id` | `str` | Yes | Unique principal identifier |
| `name` | `str` | Yes | Display name of the agent or user |
| `type` | `str` | Yes | Principal type (e.g., `agent`, `human`, `service`) |
| `email` | `str` | Yes | Contact email (composite unique with tenant_id) |
| `ad_server_ids` | `dict[str, str]` | No | Mapping of ad server type to external advertiser ID |

### Targeting

Defines geographic and custom targeting criteria for media buys and packages.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `geo_countries` | `list[str]` | No | Target countries (ISO 3166-1 alpha-2 codes, e.g., `["US", "GB"]`) |
| `geo_regions` | `list[str]` | No | Target regions/states (e.g., `["US-CA", "US-NY"]`) |
| `geo_metros` | `list[str]` | No | Target metro areas / DMAs (Nielsen DMA codes) |
| `geo_postal_areas` | `list[str]` | No | Target postal/ZIP codes |
| `custom_targeting` | `dict[str, list[str]]` | No | Key-value targeting pairs (e.g., `{"section": ["sports", "news"]}`) |

### Pricing

Specifies the pricing model and rate for a media buy or package.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pricing_model` | `PricingModel` | Yes | Pricing model enum value (see Enums section) |
| `bid_price` | `float` | Yes | Price amount in the specified currency |
| `currency` | `str` | Yes | ISO 4217 currency code (e.g., `USD`, `EUR`, `GBP`) |

### PricingOption

Represents one available pricing configuration for a product.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | `PricingModel` | Yes | Pricing model type |
| `amount` | `float` | Yes | Price amount |
| `currency` | `str` | Yes | ISO 4217 currency code |
| `minimum_spend` | `float` | No | Minimum spend threshold for this pricing tier |

### ExposureEstimate

Estimated impression or exposure volumes for a product.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `min_impressions` | `int` | Yes | Lower bound of estimated impressions |
| `max_impressions` | `int` | Yes | Upper bound of estimated impressions |
| `period` | `str` | Yes | Time period for the estimate (e.g., `daily`, `weekly`, `monthly`) |

### DeliveryReport

Delivery metrics returned by the ad server adapter.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `impressions` | `int` | Yes | Total impressions delivered |
| `clicks` | `int` | Yes | Total clicks |
| `spend` | `float` | Yes | Total spend in campaign currency |
| `ctr` | `float` | Yes | Click-through rate (clicks / impressions) |
| `start_date` | `datetime` | Yes | Report period start |
| `end_date` | `datetime` | Yes | Report period end |

## Enums

### PricingModel

Defines the available pricing models for advertising products.

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `cpm` | Cost per mille (thousand impressions) |
| `vcpm` | Viewable cost per mille (viewable impressions only) |
| `cpc` | Cost per click |
| `cpcv` | Cost per completed view (video) |
| `cpv` | Cost per view |
| `cpp` | Cost per point (reach-based) |
| `flat_rate` | Fixed cost per time period (day, week, month) |

```python
class PricingModel(str, Enum):
    cpm = "cpm"
    vcpm = "vcpm"
    cpc = "cpc"
    cpcv = "cpcv"
    cpv = "cpv"
    cpp = "cpp"
    flat_rate = "flat_rate"
```

### MediaBuyStatus

Tracks the lifecycle state of a media buy.

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `pending` | Created but awaiting publisher approval |
| `approved` | Approved by publisher, ready to activate |
| `active` | Currently delivering impressions |
| `paused` | Temporarily stopped by buyer or publisher |
| `completed` | Flight dates ended, campaign finished |
| `failed` | Creation or activation failed (see error details) |

```python
class MediaBuyStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    active = "active"
    paused = "paused"
    completed = "completed"
    failed = "failed"
```

### CreativeStatus

Tracks the processing and approval state of a creative asset.

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `pending_review` | Uploaded and awaiting publisher review |
| `approved` | Passed review and ready for delivery |
| `rejected` | Failed review (see rejection reason) |
| `processing` | Being processed by the ad server (transcoding, validation) |

```python
class CreativeStatus(str, Enum):
    pending_review = "pending_review"
    approved = "approved"
    rejected = "rejected"
    processing = "processing"
```

### DeliveryType

Specifies whether a product offers guaranteed or non-guaranteed delivery.

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `guaranteed` | Publisher guarantees delivery of contracted impressions |
| `non_guaranteed` | Best-effort delivery with no volume commitment |

```python
class DeliveryType(str, Enum):
    guaranteed = "guaranteed"
    non_guaranteed = "non_guaranteed"
```

### FormatCategory

Top-level creative format categories.

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `audio` | Audio ad formats (DAAST-compliant) |
| `video` | Video ad formats (VAST-compliant) |
| `display` | Standard IAB display banner formats |
| `native` | Native ad formats with structured content |

```python
class FormatCategory(str, Enum):
    audio = "audio"
    video = "video"
    display = "display"
    native = "native"
```

## JSON Examples

### Product Discovery (get_products)

**Request:**

```json
{
  "brief": "premium video ads targeting sports fans in the US",
  "filters": {
    "channels": ["video"],
    "countries": ["US"]
  }
}
```

**Response:**

```json
{
  "products": [
    {
      "product_id": "prod_abc123",
      "name": "Premium Video - Sports Audience",
      "description": "Pre-roll and mid-roll video inventory across sports content network",
      "delivery_type": "guaranteed",
      "format_ids": ["video_16x9_preroll", "video_16x9_midroll"],
      "pricing_options": [
        {
          "model": "cpm",
          "amount": 25.00,
          "currency": "USD"
        },
        {
          "model": "cpcv",
          "amount": 0.08,
          "currency": "USD"
        }
      ],
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

### Campaign Creation (create_media_buy)

**Request:**

```json
{
  "product_id": "prod_abc123",
  "advertiser_id": "adv_456",
  "name": "Sports Video Campaign - Q2",
  "budget_cents": 250000,
  "start_date": "2025-04-01",
  "end_date": "2025-06-30",
  "targeting": {
    "geo_countries": ["US"],
    "geo_regions": ["US-CA", "US-NY", "US-TX"],
    "custom_targeting": {
      "section": ["sports"],
      "device": ["mobile", "ctv"]
    }
  },
  "pricing": {
    "pricing_model": "cpm",
    "bid_price": 25.00,
    "currency": "USD"
  }
}
```

**Response:**

```json
{
  "media_buy_id": "mb_789xyz",
  "status": "pending",
  "product_id": "prod_abc123",
  "name": "Sports Video Campaign - Q2",
  "budget_cents": 250000,
  "start_date": "2025-04-01",
  "end_date": "2025-06-30",
  "created_at": "2025-03-15T14:30:00Z",
  "ad_server_order_id": "gam_order_12345",
  "approval_required": true
}
```

### Creative Upload (sync_creatives)

**Request:**

```json
{
  "media_buy_id": "mb_789xyz",
  "creatives": [
    {
      "name": "Sports Video 30s - Version A",
      "format_id": "video_16x9_preroll",
      "assets": [
        {
          "type": "video",
          "url": "https://cdn.example.com/creatives/sports_30s_v1.mp4",
          "mime_type": "video/mp4",
          "duration_seconds": 30
        }
      ],
      "tags": ["sports", "q2-campaign", "version-a"]
    }
  ]
}
```

**Response:**

```json
{
  "creatives": [
    {
      "creative_id": "cr_abc123",
      "name": "Sports Video 30s - Version A",
      "format_id": "video_16x9_preroll",
      "status": "processing",
      "approval_status": "pending_review",
      "created_at": "2025-03-15T14:35:00Z",
      "ad_server_creative_id": "gam_creative_67890"
    }
  ],
  "sync_status": "submitted"
}
```

### Delivery Report (get_media_buy_delivery)

**Request:**

```json
{
  "media_buy_id": "mb_789xyz"
}
```

**Response:**

```json
{
  "media_buy_id": "mb_789xyz",
  "status": "active",
  "delivery": {
    "impressions": 47523,
    "clicks": 891,
    "spend": 1188.08,
    "ctr": 0.0188,
    "start_date": "2025-04-01T00:00:00Z",
    "end_date": "2025-04-15T23:59:59Z"
  },
  "budget_remaining_cents": 131192,
  "pacing": "on_track",
  "flight_progress_percent": 16.7
}
```

## Validation Rules

Pydantic enforces the following validation rules across all models:

{: .table .table-bordered .table-striped }
| Rule | Applied To | Description |
|------|-----------|-------------|
| Required fields | All models | Fields without defaults must be provided |
| Type coercion | Numeric fields | Strings are coerced to numbers where possible |
| Enum validation | `PricingModel`, `MediaBuyStatus`, etc. | Values must match defined enum members |
| Date validation | `start_date`, `end_date` | Must be valid ISO 8601 date strings |
| Currency codes | `currency` fields | Should follow ISO 4217 format |
| Country codes | `countries`, `geo_countries` | Should follow ISO 3166-1 alpha-2 format |
| Non-empty strings | `name`, `brief`, `description` | Must contain at least one character |
| Positive amounts | `budget_cents`, `bid_price` | Must be greater than zero |

{: .alert.alert-info :}
Validation errors are returned as structured objects with `error_code: "validation_error"` and a `details` field listing the specific field violations.

## Further Reading

- [Source Architecture](/agents/salesagent/developers/source-architecture.html) -- Where schemas fit in the codebase
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Tool parameters and response types
- [get_products](/agents/salesagent/tools/get-products.html) -- Product discovery with detailed schema examples
- [Architecture & Protocols](/agents/salesagent/architecture.html) -- Data flow through the validation layer
- [AdCP Protocol Types](https://docs.adcontextprotocol.org/docs/reference/types) -- Standard AdCP type definitions
