---
layout: page_v2
title: Prebid Sales Agent - API Schema Reference
description: Complete reference for all Pydantic request/response models used by the Sales Agent tools.
sidebarType: 10
---

# Prebid Sales Agent - API Schema Reference
{: .no_toc}

- TOC
{:toc}

## Overview

All request and response objects in the Sales Agent are defined as Pydantic models in `src/core/schemas/`. This page documents every model and enum, organised by domain. Field types use Python type annotation syntax; `None`-able fields are shown with `| None` and include their default value.

See the [Tool Reference](../tools/tool-reference.html) for usage context and individual tool pages for parameters and responses.

---

## Product Domain

### Product

Represents a purchasable advertising product in the publisher's catalog.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `product_id` | `str` | -- | Unique identifier within the tenant. |
| `name` | `str` | -- | Human-readable product name. |
| `description` | `str` | -- | Detailed product description. |
| `format_ids` | `list[FormatId]` | -- | Creative formats accepted by this product. |
| `delivery_type` | `str` | -- | `"guaranteed"` or `"non_guaranteed"`. See `DeliveryType` enum. |
| `delivery_measurement` | `dict` | -- | How delivery is measured (e.g., `{"type": "impressions"}`). |
| `pricing_options` | `list[PricingOption]` | -- | Available pricing models and rates. |
| `publisher_properties` | `list[str]` or `None` | `None` | Sites/apps where this product serves. |
| `is_custom` | `bool` | `False` | Whether this is a custom product built for a specific buyer. |
{: .table .table-bordered .table-striped }

Additional Product fields:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `property_ids` | `list[str]` or `None` | `None` | AdCP 2.0.0 property authorization by ID. |
| `property_tags` | `list[str]` or `None` | `None` | AdCP 2.0.0 property authorization by tag. |
| `catalog_match` | `dict` or `None` | `None` | AdCP 3.6 catalog matching configuration. |
| `catalog_types` | `list` or `None` | `None` | Catalog type classifications. |
| `conversion_tracking` | `dict` or `None` | `None` | Conversion tracking configuration. |
| `data_provider_signals` | `list` or `None` | `None` | Data provider signal references. |
| `forecast` | `dict` or `None` | `None` | Inventory forecast data. |
| `product_card` | `dict` or `None` | `None` | Visual card for product display. |
| `product_card_detailed` | `dict` or `None` | `None` | Rich product presentation. |
| `placements` | `list[dict]` or `None` | `None` | Ad placement configurations. |
| `reporting_capabilities` | `dict` or `None` | `None` | What reporting dimensions are available. |
| `property_targeting_allowed` | `bool` | `False` | Whether per-property targeting is available. |
| `signal_targeting_allowed` | `bool` or `None` | `None` | Whether signal-based targeting is available. |
| `allowed_principal_ids` | `list[str]` or `None` | `None` | Restrict product visibility to specific principals. |
| `expires_at` | `datetime` or `None` | `None` | Product expiration date. |
{: .table .table-bordered .table-striped }

Internal fields (not returned in API responses but present in the database model):

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `implementation_config` | `dict` or `None` | `None` | Adapter-specific configuration for order/line-item creation. |
| `countries` | `list[str]` or `None` | `None` | Countries where this product is available (ISO 3166-1 alpha-2). |
| `device_types` | `list[str]` or `None` | `None` | Supported device types. |
{: .table .table-bordered .table-striped }

### Dynamic Product Fields

When `is_dynamic` is set to `true`, a product acts as a template that generates targeted variants by querying signals agents. Dynamic products enable automated creation of product variants based on audience signals, contextual data, or other external inputs.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `is_dynamic` | `bool` | `False` | When `true`, this product is a template that generates targeted variants by querying signals agents. |
| `is_dynamic_variant` | `bool` | `False` | When `true`, this product was auto-generated from a dynamic template. |
| `parent_product_id` | `str` or `None` | `None` | Points to the dynamic template product that generated this variant. |
| `signals_agent_ids` | `list[str]` or `None` | `None` | Which signals agents to query for variant generation. `null` = query all configured agents. |
| `max_signals` | `int` | `5` | Maximum number of signal variants to generate per brief. |
| `variant_name_template` | `str` or `None` | `None` | Template for generating variant names. Supports `{signal_name}` and `{parent_name}` placeholders. |
| `variant_description_template` | `str` or `None` | `None` | Template for generating variant descriptions. |
| `activation_key` | `dict` or `None` | `None` | Signal activation configuration. |
| `signal_metadata` | `dict` or `None` | `None` | Metadata from the signals agent that generated this variant. |
| `last_synced_at` | `datetime` or `None` | `None` | When variants were last regenerated. |
| `archived_at` | `datetime` or `None` | `None` | When expired variants were archived. |
| `variant_ttl_days` | `int` or `None` | `None` | Days before a variant expires and is archived. |
{: .table .table-bordered .table-striped }

### FormatId

Reference to a creative format specification served by a creative agent.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `agent_url` | `str` | -- | Base URL of the creative agent that owns this format. |
| `id` | `str` | -- | Format identifier (matches `CreativeFormat.id` returned by the agent). |
{: .table .table-bordered .table-striped }

### PricingOption

A pricing model available for a product.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `pricing_option_id` | `str` | -- | Unique identifier within the product. |
| `pricing_model` | `str` | -- | Pricing model. See `PricingModel` enum. |
| `is_fixed` | `bool` | `False` | Whether the rate is fixed (`True`) or a floor/guide (`False`). |
| `rate` | `float` | -- | Price per unit in the specified currency. |
| `currency` | `str` | `"USD"` | ISO 4217 currency code. |
| `min_budget` | `float` or `None` | `None` | Minimum budget required for this pricing option. |
| `max_budget` | `float` or `None` | `None` | Maximum budget allowed for this pricing option. |
| `metadata` | `dict` or `None` | `None` | Additional pricing metadata (e.g., volume discounts, frequency caps). |
{: .table .table-bordered .table-striped }

---

## Media Buy Domain

### CreateMediaBuyRequest

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `buyer_ref` | `str` or `None` | `None` | Buyer's external reference ID. |
| `brand` | `dict` or `None` | `None` | Brand context for audit and policy checks. |
| `packages` | `list[Package]` | -- | One or more packages (required). |
| `start_time` | `str` (ISO 8601) or `None` | `None` | Flight start. |
| `end_time` | `str` (ISO 8601) or `None` | `None` | Flight end. |
| `budget` | `float` or `None` | `None` | Total budget. |
| `total_budget` | `float` or `None` | `None` | Alias for `budget`. |
| `po_number` | `str` or `None` | `None` | Purchase order number. |
{: .table .table-bordered .table-striped }

### Package

A single line item within a media buy.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `product_id` | `str` | -- | Product to book. |
| `buyer_ref` | `str` or `None` | `None` | Package-level buyer reference. |
| `budget` | `float` | -- | Package budget. |
| `currency` | `str` | `"USD"` | ISO 4217 currency code. |
| `targeting_overlay` | `dict` or `None` | `None` | Additional targeting on top of product defaults. |
| `creative_ids` | `list[str]` or `None` | `None` | Creatives to assign. |
{: .table .table-bordered .table-striped }

### CreateMediaBuySuccess

| Field | Type | Description |
| --- | --- | --- |
| `media_buy_id` | `str` | Server-generated ID. |
| `buyer_ref` | `str` or `None` | Echo of buyer reference. |
| `status` | `str` | Initial status (`pending_activation`, `active`, `completed`). |
| `packages` | `list[object]` | Created packages with server IDs. |
| `total_budget` | `float` | Confirmed budget. |
| `currency` | `str` | Currency code. |
{: .table .table-bordered .table-striped }

### UpdateMediaBuyRequest

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `paused` | `bool` or `None` | `None` | Pause (`True`) or resume (`False`) delivery. |
| `budget` | `float` or `None` | `None` | New total budget. |
| `start_time` | `str` (ISO 8601) or `None` | `None` | New flight start. |
| `end_time` | `str` (ISO 8601) or `None` | `None` | New flight end. |
| `packages` | `list[PackageUpdate]` or `None` | `None` | Package-level updates. |
{: .table .table-bordered .table-striped }

### GetMediaBuyDeliveryRequest

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `media_buy_ids` | `list[str]` or `None` | `None` | Filter by media buy IDs. |
| `buyer_refs` | `list[str]` or `None` | `None` | Filter by buyer references. |
| `start_date` | `str` (ISO 8601) or `None` | `None` | Reporting period start. |
| `end_date` | `str` (ISO 8601) or `None` | `None` | Reporting period end. |
| `account` | `str` or `None` | `None` | Account identifier. |
| `reporting_dimensions` | `list[str]` or `None` | `None` | Breakout dimensions. |
| `include_package_daily_breakdown` | `bool` | `False` | Include per-package daily data. |
| `attribution_window` | `str` or `None` | `None` | Attribution window (e.g., `"7d"`, `"30d"`). |
{: .table .table-bordered .table-striped }

---

## Delivery Domain

### DeliveryTotals

Aggregated delivery metrics.

| Field | Type | Description |
| --- | --- | --- |
| `impressions` | `int` | Total impressions. |
| `spend` | `float` | Total spend. |
| `clicks` | `int` | Total clicks. |
| `ctr` | `float` | Click-through rate. |
| `video_completions` | `int` or `None` | Completed video views. |
| `completion_rate` | `float` or `None` | Video completion rate. |
| `conversions` | `int` or `None` | Attributed conversions. |
| `viewability` | `float` or `None` | Viewability rate (0.0 - 1.0). |
{: .table .table-bordered .table-striped }

### PackageDelivery

Per-package delivery breakdown.

| Field | Type | Description |
| --- | --- | --- |
| `package_id` | `str` | Package identifier. |
| `buyer_ref` | `str` or `None` | Package buyer reference. |
| `impressions` | `int` | Package impressions. |
| `spend` | `float` | Package spend. |
| `pricing_model` | `str` | Pricing model in use. |
| `rate` | `float` | Current rate. |
| `currency` | `str` | Currency code. |
| `pacing_index` | `float` or `None` | Pacing index (1.0 = on pace). |
{: .table .table-bordered .table-striped }

### DailyBreakdown

Daily delivery data point.

| Field | Type | Description |
| --- | --- | --- |
| `date` | `str` (ISO 8601 date) | The date. |
| `impressions` | `int` | Impressions on this date. |
| `spend` | `float` | Spend on this date. |
{: .table .table-bordered .table-striped }

---

## Creative Domain

### Creative

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `creative_id` | `str` | -- | Unique creative identifier. |
| `format_id` | `FormatId` | -- | Format specification reference. |
| `name` | `str` | -- | Human-readable name. |
| `status` | `str` | -- | Current status. See `CreativeStatus` enum. |
| `assets` | `dict` | -- | Asset payload (structure depends on format). |
| `created_date` | `str` (ISO 8601) or `None` | `None` | Creation timestamp. |
| `updated_date` | `str` (ISO 8601) or `None` | `None` | Last update timestamp. |
| `provenance` | `Provenance` or `None` | `None` | Content provenance metadata. |
{: .table .table-bordered .table-striped }

### Provenance

Content origin and AI involvement metadata for EU AI Act compliance.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `digital_source_type` | `str` | -- | How the creative was produced. See `DigitalSourceType` enum. |
| `ai_tool` | `str` or `None` | `None` | AI tool used in production. |
| `human_oversight` | `str` or `None` | `None` | Description of human oversight. |
| `declared_by` | `str` or `None` | `None` | Entity declaring provenance. |
| `created_time` | `str` (ISO 8601) or `None` | `None` | Original production time. |
| `c2pa` | `dict` or `None` | `None` | C2PA manifest data. |
| `disclosure` | `str` or `None` | `None` | Human-readable AI disclosure. |
| `verification` | `dict` or `None` | `None` | Third-party verification data. |
{: .table .table-bordered .table-striped }

### SyncCreativesResponse

| Field | Type | Description |
| --- | --- | --- |
| `created` | `int` | Number of creatives created. |
| `updated` | `int` | Number of creatives updated. |
| `deleted` | `int` | Number of creatives deleted. |
| `results` | `list[object]` | Per-creative results with `creative_id`, `status`, `errors`. |
{: .table .table-bordered .table-striped }

### ListCreativesResponse

| Field | Type | Description |
| --- | --- | --- |
| `creatives` | `list[Creative]` | Matching creatives. |
{: .table .table-bordered .table-striped }

---

## Common Types and Enums

### PricingModel Enum

| Value | Description |
| --- | --- |
| `cpm` | Cost per mille (thousand impressions). |
| `cpc` | Cost per click. |
| `cpcv` | Cost per completed view. |
| `cpp` | Cost per point (GRP-based). |
| `cpv` | Cost per view. |
| `flat_rate` | Fixed price regardless of delivery volume. |
| `vcpm` | Viewable cost per mille. |
{: .table .table-bordered .table-striped }

### MediaBuyStatus Enum

| Value | Description |
| --- | --- |
| `pending_activation` | Awaiting approval, creative readiness, or future flight start. |
| `active` | Currently delivering. |
| `paused` | Delivery suspended by the buyer or operator. |
| `completed` | Flight ended or budget exhausted. |
{: .table .table-bordered .table-striped }

### CreativeStatus Enum

| Value | Description |
| --- | --- |
| `processing` | Upload received, validation in progress. |
| `approved` | Cleared for serving. |
| `rejected` | Failed validation or review. |
| `pending_review` | Awaiting manual or automated review. |
{: .table .table-bordered .table-striped }

### ApprovalStatus Enum

| Value | Description |
| --- | --- |
| `pending_review` | Awaiting review. |
| `approved` | Approved. |
| `rejected` | Rejected. |
| `processing` | Currently being processed. |
{: .table .table-bordered .table-striped }

### DeliveryType Enum

| Value | Description |
| --- | --- |
| `guaranteed` | Delivery volume is contractually guaranteed. |
| `non_guaranteed` | Best-effort delivery. |
{: .table .table-bordered .table-striped }

### DeliveryStatus Enum

| Value | Description |
| --- | --- |
| `delivering` | Actively serving impressions. |
| `not_delivering` | Not currently serving (various reasons). |
| `completed` | Delivery completed successfully. |
| `budget_exhausted` | Budget fully spent. |
| `flight_ended` | Flight end date reached. |
| `goal_met` | Delivery goal achieved. |
{: .table .table-bordered .table-striped }

### DigitalSourceType Enum

| Value | Description |
| --- | --- |
| `digital_capture` | Captured by a digital device. |
| `digital_creation` | Created by a human using digital tools. |
| `composite_capture` | Composite of captured sources. |
| `composite_synthetic` | Composite with fully synthetic elements. |
| `composite_with_trained_model` | Composite incorporating AI model output. |
| `trained_algorithmic_model` | Entirely AI-generated. |
| `algorithmic_media` | Generated by non-ML algorithm. |
| `human_edits` | AI-generated with significant human edits. |
| `minor_human_edits` | AI-generated with minor human edits. |
{: .table .table-bordered .table-striped }

### Channel Enum

| Value | Description |
| --- | --- |
| `display` | Standard display advertising. |
| `olv` | Online video. |
| `video` | General video. |
| `social` | Social media. |
| `search` | Search advertising. |
| `ctv` | Connected TV. |
| `linear_tv` | Traditional linear television. |
| `radio` | Terrestrial radio. |
| `streaming_audio` | Streaming audio platforms. |
| `audio` | General audio. |
| `podcast` | Podcast advertising. |
| `dooh` | Digital out-of-home. |
| `ooh` | Traditional out-of-home. |
| `print` | Print media. |
| `cinema` | Cinema advertising. |
| `email` | Email marketing. |
| `gaming` | In-game advertising. |
| `retail_media` | Retail media networks. |
| `influencer` | Influencer marketing. |
| `affiliate` | Affiliate marketing. |
| `product_placement` | Product placement. |
{: .table .table-bordered .table-striped }

## Validation Rules

Pydantic enforces the following validation rules across all models:

1. **Required fields** -- Fields without a default value must be provided. Omitting them raises `AdCPValidationError`.
2. **Type coercion** -- Pydantic performs strict type checking. Passing a string where a float is expected will raise a validation error.
3. **Enum values** -- Enum fields accept only the documented values. Invalid values raise `AdCPValidationError` listing the allowed options.
4. **Budget constraints** -- When a `PricingOption` specifies `min_budget` or `max_budget`, the package budget must fall within that range.
5. **Date ordering** -- `start_time` must precede `end_time`. Reversed dates raise `AdCPValidationError`.
6. **Currency consistency** -- All packages within a media buy should use the same currency. Mixed currencies raise `AdCPValidationError`.
7. **Format existence** -- `format_id` references are validated against the creative agent. Non-existent formats raise `AdCPNotFoundError`.
8. **Provenance completeness** -- When `provenance` is provided, `digital_source_type` is required. All other provenance fields are optional.

## Related Pages

- [Tool Reference](../tools/tool-reference.html) -- Overview of all tools
- [Database Models](database-models.html) -- SQLAlchemy persistence layer
