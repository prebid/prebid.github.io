---
layout: page_v2
title: Prebid Sales Agent - Discovery Tools
description: Reference for the four discovery tools that expose publisher capabilities, products, creative formats, and authorized properties.
sidebarType: 10
---

# Prebid Sales Agent - Discovery Tools
{: .no_toc}

- TOC
{:toc}

## Overview

Discovery tools allow an agent to understand what a publisher offers before creating a media buy. All four tools are **auth-optional** -- they return data even without a valid token, though the response may be limited to publicly visible information when no identity is provided.

See the [Tool Reference](tool-reference.html) for general information about authentication and error handling.

---

## get_adcp_capabilities

Returns the publisher's AdCP (Ad Context Protocol) capabilities including supported protocol versions, portfolio description, feature flags, and available targeting dimensions.

### Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `protocols` | `list[str]` or `None` | No | `None` | Filter the response to only the listed protocol names. When `None`, all supported protocols are returned. Currently the only supported protocol is `media_buy`. |
{: .table .table-bordered .table-striped }

### Response: GetAdcpCapabilitiesResponse

| Field | Type | Description |
| --- | --- | --- |
| `adcp` | `object` | Top-level version information. |
| `adcp.major_versions` | `list[int]` | Supported major protocol versions. |
| `supported_protocols` | `list[str]` | Protocol names supported by this endpoint (e.g., `media_buy`). |
| `media_buy` | `object` | Details for the `media_buy` protocol (present when that protocol is supported). |
| `media_buy.portfolio` | `object` | Publisher portfolio metadata. |
| `media_buy.portfolio.description` | `str` | Natural-language description of the publisher's advertising offering. |
| `media_buy.portfolio.primary_channels` | `list[str]` | Primary advertising channels. Values come from the Channel enum (see below). |
| `media_buy.portfolio.publisher_domains` | `list[str]` | Domains where ads will serve. |
| `media_buy.portfolio.advertising_policies` | `str` | Human-readable summary of advertising policies. |
| `media_buy.features` | `object` | Feature flags describing what the publisher supports. |
| `media_buy.features.content_standards` | `bool` | Whether the publisher enforces content standards on creatives. |
| `media_buy.features.inline_creative_management` | `bool` | Whether creatives can be managed inline with media buy creation. |
| `media_buy.features.property_list_filtering` | `bool` | Whether products can be filtered by property. |
| `media_buy.execution` | `object` | Execution-time capabilities. |
| `media_buy.execution.targeting` | `object` | Supported targeting dimensions. |
| `media_buy.execution.targeting.geo_countries` | `list[str]` | ISO 3166-1 alpha-2 country codes available for geo targeting. |
| `media_buy.execution.targeting.geo_regions` | `list[str]` | Region codes available for geo targeting. |
| `media_buy.execution.targeting.geo_metros` | `list[str]` | Metro / DMA codes available for geo targeting. |
| `media_buy.execution.targeting.geo_postal_areas` | `list[str]` | Postal code prefixes available for geo targeting. |
| `media_buy.execution.targeting.device_platform` | `list[str]` | Device platform values (e.g., `desktop`, `mobile`, `tablet`, `ctv`). |
{: .table .table-bordered .table-striped }

### Channel Enum Values

The `primary_channels` field uses the following enum:

`display`, `olv`, `video`, `social`, `search`, `ctv`, `linear_tv`, `radio`, `streaming_audio`, `audio`, `podcast`, `dooh`, `ooh`, `print`, `cinema`, `email`, `gaming`, `retail_media`, `influencer`, `affiliate`, `product_placement`

### Example

**Request:**

```json
{
  "protocols": ["media_buy"]
}
```

**Response (abbreviated):**

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

---

## get_products

Searches the publisher's product catalog. Supports natural-language search via the `brief` parameter, optional brand context, and structured filters. When the tenant has a `product_ranking_prompt` and a Gemini API key configured, products are ranked by an AI model using Pydantic AI.

### Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `brief` | `str` | No | `""` | Natural-language description of what the buyer is looking for. Used for AI-powered relevance ranking when available. |
| `brand` | `dict` or `None` | No | `None` | Brand context to inform product selection. Typically contains `name`, `industry`, and `target_audience` keys. |
| `filters` | `dict` or `None` | No | `None` | Structured filters to narrow results. Supported keys vary by tenant configuration (e.g., `channels`, `countries`, `delivery_type`). |
{: .table .table-bordered .table-striped }

### Response

| Field | Type | Description |
| --- | --- | --- |
| `products` | `list[Product]` | Matching products. See [Product schema](../schemas/api-schemas.html#product) for field details. |
| `portfolio_description` | `str` or `None` | Publisher's portfolio description (same as in `get_adcp_capabilities`). |
| `errors` | `list[str]` | Non-fatal warnings (e.g., AI ranking unavailable, falling back to keyword search). |
| `context` | `dict` or `None` | Additional metadata about the search (e.g., ranking method used). |
{: .table .table-bordered .table-striped }

Each `Product` in the response includes:

| Field | Type | Description |
| --- | --- | --- |
| `product_id` | `str` | Unique product identifier within the tenant. |
| `name` | `str` | Human-readable product name. |
| `description` | `str` | Detailed description of the product. |
| `format_ids` | `list[FormatId]` | Creative formats accepted by this product. Each `FormatId` has `agent_url` (str) and `id` (str). |
| `delivery_type` | `str` | `guaranteed` or `non_guaranteed`. |
| `delivery_measurement` | `dict` | How delivery is measured (e.g., impressions, completed views). |
| `pricing_options` | `list[PricingOption]` | Available pricing models. See [PricingOption schema](../schemas/api-schemas.html#pricingoption). |
| `publisher_properties` | `list[str]` or `None` | Properties / sites where this product runs. |
{: .table .table-bordered .table-striped }

### Example

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

**Response (abbreviated):**

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

---

## list_creative_formats

Returns creative format specifications from all registered creative agents for the tenant. Each format describes the dimensions, type, and requirements for creative assets that can be submitted via `sync_creatives`.

### Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `req` | `ListCreativeFormatsRequest` or `None` | No | `None` | Optional request object for filtering. When `None`, all formats are returned. |
{: .table .table-bordered .table-striped }

### Response

| Field | Type | Description |
| --- | --- | --- |
| `creative_formats` | `list[CreativeFormat]` | Available creative format specifications. |
{: .table .table-bordered .table-striped }

Each `CreativeFormat` includes:

| Field | Type | Description |
| --- | --- | --- |
| `id` | `str` | Format identifier (referenced by `FormatId.id` in products). |
| `name` | `str` | Human-readable format name. |
| `type` | `str` | Format category (e.g., `display`, `video`, `native`). |
| `dimensions` | `dict` or `None` | Size specifications (e.g., `{"width": 300, "height": 250}`). |
| `requirements` | `dict` or `None` | Asset requirements such as file types, max file size, duration, aspect ratio. |
{: .table .table-bordered .table-striped }

### Example

**Request:**

```json
{}
```

**Response:**

```json
{
  "creative_formats": [
    {
      "id": "display_300x250",
      "name": "Medium Rectangle",
      "type": "display",
      "dimensions": {"width": 300, "height": 250},
      "requirements": {"file_types": ["jpg", "png", "gif", "html5"], "max_file_size_kb": 150}
    },
    {
      "id": "video_30s",
      "name": "Standard Video 30s",
      "type": "video",
      "dimensions": {"width": 1920, "height": 1080},
      "requirements": {"file_types": ["mp4", "webm"], "max_duration_seconds": 30, "min_bitrate_kbps": 2000}
    }
  ]
}
```

---

## list_authorized_properties

Returns the list of publisher domains, advertising policies, and portfolio description visible to the caller. This is useful for agents that need to understand which properties (sites/apps) they are authorised to target before building a media buy.

### Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `req` | `ListAuthorizedPropertiesRequest` or `None` | No | `None` | Optional request object for filtering. When `None`, all authorised properties are returned. |
{: .table .table-bordered .table-striped }

### Response

| Field | Type | Description |
| --- | --- | --- |
| `publisher_domains` | `list[str]` | Domains where the caller is authorised to serve ads. |
| `advertising_policies` | `str` or `None` | Publisher's advertising policies. |
| `portfolio_description` | `str` or `None` | Natural-language description of the publisher portfolio. |
| `context` | `dict` or `None` | Additional metadata. |
{: .table .table-bordered .table-striped }

### Example

**Request:**

```json
{}
```

**Response:**

```json
{
  "publisher_domains": ["example.com", "sports.example.com", "news.example.com"],
  "advertising_policies": "No tobacco, gambling, or political advertising. All creatives must comply with IAB content taxonomy v3.",
  "portfolio_description": "Premium sports and entertainment content across web, mobile, and CTV.",
  "context": null
}
```

## Related Pages

- [Tool Reference](tool-reference.html) -- Overview of all tools, authentication, and error handling
- [Media Buy Tools](media-buy-tools.html) -- Create, update, and query media buys
- [API Schema Reference](../schemas/api-schemas.html) -- Full Pydantic model definitions
