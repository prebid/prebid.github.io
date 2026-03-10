---
layout: page_v2
title: Prebid Sales Agent - Media Buy Tools
description: Reference for creating, updating, querying, and reporting on media buys.
sidebarType: 10
---

# Prebid Sales Agent - Media Buy Tools
{: .no_toc}

- TOC
{:toc}

## Overview

Media buy tools handle the full lifecycle of an advertising order -- from creation through modification, status queries, and delivery reporting. All four tools require authentication.

See the [Tool Reference](tool-reference.html) for general information about authentication and error handling.

## Media Buy Lifecycle

A media buy moves through the following statuses:

```
                 ┌─────────────────────────────┐
                 │      create_media_buy        │
                 └──────────┬──────────────────┘
                            │
                 ┌──────────▼──────────────────┐
                 │    pending_activation        │
                 │  (needs approval, or missing │
                 │   / unapproved creatives, or │
                 │   future start date)         │
                 └──────────┬──────────────────┘
                            │  approval + creatives ready
                            │  + start date reached
                 ┌──────────▼──────────────────┐
          ┌──────│         active               │◄─────┐
          │      │      (delivering now)        │      │
          │      └──────────┬──────────────────┘      │
          │                 │                          │
   pause  │                 │  end date reached        │ unpause
          │                 │  or budget exhausted     │
          │      ┌──────────▼──────────────────┐      │
          └─────►│         paused               │──────┘
                 └──────────┬──────────────────┘
                            │  end date reached
                 ┌──────────▼──────────────────┐
                 │        completed             │
                 └─────────────────────────────┘
```

<div class="alert alert-info" role="alert">
A media buy enters <code>pending_activation</code> when it requires manual approval (tenant <code>approval_mode</code>), when its creatives are not yet approved, or when the flight start date is in the future. It transitions to <code>active</code> automatically once all conditions are satisfied.
</div>

---

## create_media_buy

Creates a new media buy containing one or more packages. Each package references a product, specifies a budget, and may include targeting overlays and creative assignments.

### Parameters: CreateMediaBuyRequest

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `buyer_ref` | `str` | No | `None` | Buyer's external reference ID for this order. |
| `brand` | `dict` or `None` | No | `None` | Brand context (`name`, `industry`, etc.) for audit and policy checks. |
| `packages` | `list[Package]` | Yes | -- | One or more packages (line items). See Package fields below. |
| `start_time` | `str` (ISO 8601) | No | `None` | Flight start date/time. |
| `end_time` | `str` (ISO 8601) | No | `None` | Flight end date/time. |
| `budget` | `float` or `None` | No | `None` | Total budget for the media buy. Alias: `total_budget`. |
| `total_budget` | `float` or `None` | No | `None` | Alias for `budget`. |
| `po_number` | `str` or `None` | No | `None` | Purchase order number for billing reference. |
{: .table .table-bordered .table-striped }

#### Package Fields

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `product_id` | `str` | Yes | -- | ID of the product to book (from `get_products`). |
| `buyer_ref` | `str` or `None` | No | `None` | Buyer's reference for this individual package. |
| `budget` | `float` | Yes | -- | Budget allocated to this package. |
| `currency` | `str` | No | `"USD"` | ISO 4217 currency code. |
| `targeting_overlay` | `dict` or `None` | No | `None` | Additional targeting to apply on top of the product defaults (geo, device, etc.). |
| `creative_ids` | `list[str]` or `None` | No | `None` | Creative IDs to assign to this package. Creatives must already exist via `sync_creatives`. |
{: .table .table-bordered .table-striped }

### Response: CreateMediaBuySuccess

| Field | Type | Description |
| --- | --- | --- |
| `media_buy_id` | `str` | Server-generated unique identifier. |
| `buyer_ref` | `str` or `None` | Echo of the buyer's external reference. |
| `status` | `str` | Initial status: `pending_activation`, `active`, or `completed`. |
| `packages` | `list[object]` | Created packages with server-generated IDs. |
| `total_budget` | `float` | Confirmed total budget. |
| `currency` | `str` | Currency of the media buy. |
{: .table .table-bordered .table-striped }

### Status Determination

The initial status is set based on these rules:

| Condition | Initial Status |
| --- | --- |
| Tenant requires manual approval (`manual_approval_required`) | `pending_activation` |
| Creatives are missing or not yet approved | `pending_activation` |
| Flight start date is in the future | `pending_activation` |
| Flight has ended (end date in the past) | `completed` |
| None of the above | `active` |
{: .table .table-bordered .table-striped }

### Error Responses

| Error | Cause |
| --- | --- |
| `AdCPValidationError` | Invalid product_id, missing required fields, budget below minimum. |
| `AdCPNotFoundError` | Referenced product or creative does not exist. |
| `AdCPConflictError` | Duplicate buyer_ref, overlapping flights, or business rule violation. |
| `AdCPAuthorizationError` | Principal not authorised to book the referenced product. |
{: .table .table-bordered .table-striped }

### Example

**Request:**

```json
{
  "buyer_ref": "acme-sports-q1-2025",
  "brand": {"name": "Acme Sports", "industry": "sporting goods"},
  "packages": [
    {
      "product_id": "prod_ctv_sports_30s",
      "budget": 50000,
      "currency": "USD",
      "targeting_overlay": {
        "geo_countries": ["US"],
        "device_platform": ["ctv"]
      },
      "creative_ids": ["cr_video_001"]
    }
  ],
  "start_time": "2025-04-01T00:00:00Z",
  "end_time": "2025-04-30T23:59:59Z",
  "total_budget": 50000,
  "po_number": "PO-12345"
}
```

**Response:**

```json
{
  "media_buy_id": "mb_a1b2c3d4",
  "buyer_ref": "acme-sports-q1-2025",
  "status": "pending_activation",
  "packages": [
    {
      "package_id": "pkg_x1y2z3",
      "product_id": "prod_ctv_sports_30s",
      "buyer_ref": null,
      "budget": 50000,
      "currency": "USD"
    }
  ],
  "total_budget": 50000,
  "currency": "USD"
}
```

---

## update_media_buy

Modifies an existing media buy. The authenticated principal must own the media buy. Supports pausing/unpausing, budget changes, flight date adjustments, and package updates.

### Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `media_buy_id` | `str` | Yes | -- | ID of the media buy to update (path parameter). |
| `req` | `UpdateMediaBuyRequest` | Yes | -- | Update payload (see fields below). |
{: .table .table-bordered .table-striped }

#### UpdateMediaBuyRequest Fields

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `paused` | `bool` or `None` | No | `None` | Set to `true` to pause delivery, `false` to resume. |
| `budget` | `float` or `None` | No | `None` | New total budget. |
| `start_time` | `str` (ISO 8601) or `None` | No | `None` | New flight start date. |
| `end_time` | `str` (ISO 8601) or `None` | No | `None` | New flight end date. |
| `packages` | `list[PackageUpdate]` or `None` | No | `None` | Package-level updates. Each entry must include a `package_id`. |
{: .table .table-bordered .table-striped }

### Response: UpdateMediaBuySuccess

Returns the full updated media buy object with the same structure as `CreateMediaBuySuccess`, plus any changed fields reflected.

### Error Responses

| Error | Cause |
| --- | --- |
| `AdCPNotFoundError` | Media buy ID does not exist or is not owned by the caller. |
| `AdCPAuthorizationError` | Principal does not own this media buy. |
| `AdCPValidationError` | Invalid update (e.g., reducing budget below spend, setting end date in the past). |
| `AdCPConflictError` | State conflict (e.g., trying to unpause a completed buy). |
{: .table .table-bordered .table-striped }

### Example

**Request:**

```
PUT /media_buy/mb_a1b2c3d4
```

```json
{
  "paused": true
}
```

**Response:**

```json
{
  "media_buy_id": "mb_a1b2c3d4",
  "buyer_ref": "acme-sports-q1-2025",
  "status": "paused",
  "packages": [...],
  "total_budget": 50000,
  "currency": "USD"
}
```

---

## get_media_buys

Retrieves one or more media buys matching the supplied filters. At least one filter should be provided.

### Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `media_buy_ids` | `list[str]` or `None` | No | `None` | Filter by one or more media buy IDs. |
| `buyer_refs` | `list[str]` or `None` | No | `None` | Filter by one or more buyer reference strings. |
| `status` | `str` or `None` | No | `None` | Filter by status: `pending_activation`, `active`, `paused`, or `completed`. |
| `start_date` | `str` (ISO 8601) or `None` | No | `None` | Return buys with flight start on or after this date. |
| `end_date` | `str` (ISO 8601) or `None` | No | `None` | Return buys with flight end on or before this date. |
{: .table .table-bordered .table-striped }

### Response

| Field | Type | Description |
| --- | --- | --- |
| `media_buys` | `list[MediaBuy]` | Matching media buy objects. |
| `errors` | `list[str]` | Non-fatal warnings. |
| `context` | `dict` or `None` | Pagination or query metadata. |
{: .table .table-bordered .table-striped }

### Example

**Request:**

```json
{
  "status": "active",
  "start_date": "2025-04-01"
}
```

**Response:**

```json
{
  "media_buys": [
    {
      "media_buy_id": "mb_a1b2c3d4",
      "buyer_ref": "acme-sports-q1-2025",
      "status": "active",
      "flight_start_date": "2025-04-01T00:00:00Z",
      "flight_end_date": "2025-04-30T23:59:59Z",
      "budget": 50000,
      "budget_spent": 12340.50,
      "budget_remaining": 37659.50,
      "currency": "USD",
      "packages": [...]
    }
  ],
  "errors": [],
  "context": null
}
```

---

## get_media_buy_delivery

Returns delivery metrics and performance data for one or more media buys. Supports filtering by date range and optional daily breakdowns at the package level.

### Parameters: GetMediaBuyDeliveryRequest

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `media_buy_ids` | `list[str]` or `None` | No | `None` | Filter by media buy IDs. |
| `buyer_refs` | `list[str]` or `None` | No | `None` | Filter by buyer references. |
| `start_date` | `str` (ISO 8601) or `None` | No | `None` | Reporting period start. |
| `end_date` | `str` (ISO 8601) or `None` | No | `None` | Reporting period end. |
| `account` | `str` or `None` | No | `None` | Account identifier for multi-account setups. |
| `reporting_dimensions` | `list[str]` or `None` | No | `None` | Dimensions to break out in reporting. |
| `include_package_daily_breakdown` | `bool` | No | `False` | When `true`, include per-package daily delivery data. |
| `attribution_window` | `str` or `None` | No | `None` | Attribution window for conversion metrics (e.g., `7d`, `30d`). |
{: .table .table-bordered .table-striped }

### Response

| Field | Type | Description |
| --- | --- | --- |
| `media_buy_deliveries` | `list[MediaBuyDelivery]` | Delivery data per media buy. |
{: .table .table-bordered .table-striped }

#### MediaBuyDelivery Fields

| Field | Type | Description |
| --- | --- | --- |
| `media_buy_id` | `str` | The media buy ID. |
| `buyer_ref` | `str` or `None` | Buyer's external reference. |
| `status` | `str` | Delivery status: `ready`, `active`, `paused`, `completed`, `failed`, or `reporting_delayed`. |
| `totals` | `DeliveryTotals` | Aggregated metrics for the reporting period. |
| `by_package` | `list[PackageDelivery]` | Per-package delivery breakdown. |
| `daily_breakdown` | `list[DailyBreakdown]` or `None` | Daily data (only present when `include_package_daily_breakdown` is `true`). |
{: .table .table-bordered .table-striped }

#### DeliveryTotals Fields

| Field | Type | Description |
| --- | --- | --- |
| `impressions` | `int` | Total impressions served. |
| `spend` | `float` | Total spend in the buy's currency. |
| `clicks` | `int` | Total clicks. |
| `ctr` | `float` | Click-through rate (clicks / impressions). |
| `video_completions` | `int` or `None` | Completed video views (video products only). |
| `completion_rate` | `float` or `None` | Video completion rate. |
| `conversions` | `int` or `None` | Attributed conversions. |
| `viewability` | `float` or `None` | Viewability rate (0.0 - 1.0). |
{: .table .table-bordered .table-striped }

#### PackageDelivery Fields

| Field | Type | Description |
| --- | --- | --- |
| `package_id` | `str` | The package ID. |
| `buyer_ref` | `str` or `None` | Package-level buyer reference. |
| `impressions` | `int` | Impressions for this package. |
| `spend` | `float` | Spend for this package. |
| `pricing_model` | `str` | Pricing model used (e.g., `cpm`, `cpc`). |
| `rate` | `float` | Rate being charged. |
| `currency` | `str` | Currency code. |
| `pacing_index` | `float` or `None` | Pacing index where `1.0` = on pace, `> 1.0` = ahead, `< 1.0` = behind. |
{: .table .table-bordered .table-striped }

#### DailyBreakdown Fields

| Field | Type | Description |
| --- | --- | --- |
| `date` | `str` (ISO 8601 date) | The date for this row. |
| `impressions` | `int` | Impressions on this date. |
| `spend` | `float` | Spend on this date. |
{: .table .table-bordered .table-striped }

### Example

**Request:**

```json
{
  "media_buy_ids": ["mb_a1b2c3d4"],
  "start_date": "2025-04-01",
  "end_date": "2025-04-15",
  "include_package_daily_breakdown": true
}
```

**Response (abbreviated):**

```json
{
  "media_buy_deliveries": [
    {
      "media_buy_id": "mb_a1b2c3d4",
      "buyer_ref": "acme-sports-q1-2025",
      "status": "active",
      "totals": {
        "impressions": 1250000,
        "spend": 12340.50,
        "clicks": 3750,
        "ctr": 0.003,
        "video_completions": 875000,
        "completion_rate": 0.70,
        "conversions": null,
        "viewability": 0.82
      },
      "by_package": [
        {
          "package_id": "pkg_x1y2z3",
          "buyer_ref": null,
          "impressions": 1250000,
          "spend": 12340.50,
          "pricing_model": "cpm",
          "rate": 45.00,
          "currency": "USD",
          "pacing_index": 0.95
        }
      ],
      "daily_breakdown": [
        {"date": "2025-04-01", "impressions": 85000, "spend": 850.00},
        {"date": "2025-04-02", "impressions": 88000, "spend": 880.00}
      ]
    }
  ]
}
```

## Related Pages

- [Tool Reference](tool-reference.html) -- Overview of all tools, authentication, and error handling
- [Discovery Tools](discovery-tools.html) -- Browse products and capabilities before creating a buy
- [Creative Tools](creative-tools.html) -- Upload creatives referenced by media buy packages
- [Workflow Tools](workflow-tools.html) -- Approve pending media buys
- [API Schema Reference](../schemas/api-schemas.html) -- Full Pydantic model definitions
