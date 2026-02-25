---
layout: page_v2
title: Prebid Sales Agent - Schemas - AdCP Protocol Types
description: Reference for AdCP types imported from the adcp Python library
sidebarType: 10
---

# AdCP Protocol Types
{: .no_toc}

The Prebid Sales Agent imports protocol-level types from the `adcp` PyPI package (`adcp>=3.2.0`). These types define the canonical schemas for AdCP protocol messages and are used throughout the tool implementations.

- TOC
{:toc}

## Overview

The `adcp` library provides Pydantic models that enforce the AdCP specification at the type level. The Sales Agent uses these types for request validation, response serialization, and interoperability with other AdCP-compliant agents.

```python
# Example import in Sales Agent source
from adcp.types import BrandManifest, Product, Package, PricingOption
```

## Core Types

### BrandManifest

Brand metadata submitted by buying agents with media buy requests. Used for compliance checks and personalization.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `brand_name` | `str` | Yes | Advertiser brand name |
| `brand_url` | `str` | No | Brand website URL |
| `logo_url` | `str` | No | Brand logo URL |
| `brand_category` | `str` | No | IAB brand category |

### Product

Advertising product definition returned by `get_products`.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | `str` | Yes | Unique product identifier |
| `name` | `str` | Yes | Product name |
| `description` | `str` | Yes | Description for AI-powered search |
| `delivery_type` | `DeliveryType` | Yes | `guaranteed` or `non_guaranteed` |
| `pricing_options` | `list[PricingOption]` | Yes | Available pricing configurations |
| `format_ids` | `list[str]` | Yes | Compatible creative format identifiers |
| `channels` | `list[str]` | Yes | Delivery channels |
| `countries` | `list[str]` | Yes | Geographic availability (ISO 3166-1 alpha-2) |

### Package

A line item within a media buy, bundling a product with targeting and budget.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `package_id` | `str` | Yes | Unique package identifier |
| `product_id` | `str` | Yes | Reference to the purchased product |
| `budget` | `TotalBudget` | Yes | Budget specification |
| `targeting` | `TargetingOverlay` | No | Targeting criteria |
| `pricing` | `PricingOption` | Yes | Negotiated pricing |
| `start_date` | `date` | No | Package-level start date |
| `end_date` | `date` | No | Package-level end date |

### PricingOption

Available pricing configuration for a product or package.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | `PricingModel` | Yes | Pricing model type |
| `amount` | `float` | Yes | Price amount |
| `currency` | `str` | Yes | ISO 4217 currency code |
| `minimum_spend` | `float` | No | Minimum spend threshold |

### CreativeAsset

Creative file metadata for uploads via `sync_creatives`.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `format_id` | `str` | Yes | Creative format identifier |
| `name` | `str` | Yes | Creative display name |
| `asset_url` | `str` | Yes | URL to the creative asset file |
| `click_through_url` | `str` | No | Landing page URL |
| `metadata` | `dict` | No | Additional creative metadata |

### CreativeAssignment

Maps creatives to packages within a media buy.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `package_id` | `str` | Yes | Target package identifier |
| `creative_ids` | `list[str]` | Yes | Creative identifiers to assign |

### TargetingOverlay

Targeting criteria applied to packages or media buys.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `geo_countries` | `list[str]` | No | ISO 3166-1 alpha-2 country codes |
| `geo_regions` | `list[str]` | No | Region/state codes |
| `geo_metros` | `list[str]` | No | Metro area / DMA codes |
| `devices` | `list[str]` | No | Device types |
| `content_categories` | `list[str]` | No | IAB content categories |
| `custom_targeting` | `dict[str, list[str]]` | No | Key-value targeting pairs |

### FormatID

Creative format identifier following the AdCP structure.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agent_url` | `str` | Yes | URL of the agent that defined this format |
| `id` | `str` | Yes | Format identifier within that agent |

### TotalBudget

Campaign or package budget specification.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | `float` | Yes | Budget amount |
| `currency` | `str` | Yes | ISO 4217 currency code |

### ReportingWebhook

Webhook configuration for async notifications on campaign status changes.

{: .table .table-bordered .table-striped }
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | `str` | Yes | Webhook endpoint URL |
| `events` | `list[str]` | No | Event types to subscribe to |

## Enums

### PricingModel

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `cpm` | Cost per mille (thousand impressions) |
| `vcpm` | Viewable cost per mille |
| `cpc` | Cost per click |
| `cpcv` | Cost per completed view (video) |
| `cpv` | Cost per view |
| `cpp` | Cost per point (reach-based) |
| `flat_rate` | Fixed cost per time period |

### MediaBuyStatus

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `pending` | Awaiting publisher approval |
| `approved` | Approved, ready to activate |
| `active` | Delivering impressions |
| `paused` | Temporarily stopped |
| `completed` | Campaign finished |
| `failed` | Creation or activation failed |

### CreativeStatus

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `pending_review` | Awaiting publisher review |
| `approved` | Passed review |
| `rejected` | Failed review |
| `processing` | Being processed by the ad server |

### DeliveryType

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `guaranteed` | Reserved inventory with delivery guarantees |
| `non_guaranteed` | Best-effort delivery without guarantees |

### FormatCategory

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `display` | Banner and rich media formats |
| `video` | Video ad formats (pre-roll, mid-roll, etc.) |
| `audio` | Audio ad formats |
| `native` | Native ad formats |

## JSON Schema Validation

The `adcp` library validates request and response data against JSON schemas. Schemas follow semantic versioning:

- Versioned path: `/schemas/2.5.0/`
- Major version alias: `/schemas/v2/`

When the Sales Agent receives a tool call, Pydantic validates the input against these schemas before any business logic executes. Invalid inputs produce a `VALIDATION_ERROR` response.

## Further Reading

- [API Schema Reference](/agents/salesagent/schemas/api-schemas.html) -- Pydantic request/response models
- [Database Models](/agents/salesagent/schemas/database-models.html) -- SQLAlchemy ORM models
- [AdCP Schemas and SDKs](https://docs.adcontextprotocol.org/docs/building/schemas-and-sdks) -- Upstream schema definitions and client libraries
