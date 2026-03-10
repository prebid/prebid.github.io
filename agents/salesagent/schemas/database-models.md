---
layout: page_v2
title: Prebid Sales Agent - Database Models
description: Complete reference for all SQLAlchemy database models, relationships, and tenant isolation patterns.
sidebarType: 10
---

# Prebid Sales Agent - Database Models
{: .no_toc}

- TOC
{:toc}

## Overview

The Sales Agent persists all state in a PostgreSQL database using SQLAlchemy ORM models defined in `src/core/database/models.py`. This page documents every model, its columns, relationships, and the tenant-isolation pattern that governs data access.

## Entity-Relationship Overview

```text
┌──────────┐      1:N      ┌───────────┐      1:N      ┌──────────────┐
│  Tenant   │──────────────►│ Principal  │──────────────►│  MediaBuy    │
└──────────┘               └───────────┘               └──────────────┘
     │                          │                            │
     │ 1:N                      │ 1:N                        │ 1:N
     ▼                          ▼                            ▼
┌──────────┐             ┌───────────┐              ┌──────────────┐
│ Product   │             │ Creative   │              │ WorkflowStep │
└──────────┘             └───────────┘              └──────────────┘
     │                                                      │
     │ 1:N                                                  │
     ▼                                                      │
┌──────────────┐                                            │
│PricingOption  │                                            │
└──────────────┘                                            │
                                                            │
┌──────────────┐    ┌───────────────┐    ┌────────────┐    │
│AdapterConfig  │    │InventoryProfile│    │ AuditLog    │◄──┘
└──────────────┘    └───────────────┘    └────────────┘

┌──────────────┐    ┌───────────────┐    ┌────────────┐
│CreativeAgent  │    │ SignalsAgent   │    │CurrencyLimit│
└──────────────┘    └───────────────┘    └────────────┘

┌────────────────┐   ┌──────────┐
│TenantAuthConfig │   │  User     │
└────────────────┘   └──────────┘
```

## Tenant Isolation

All data is scoped to a tenant. Most models use `tenant_id` as part of a composite primary key or as a required foreign key. This ensures that queries never leak data across tenants.

<div class="alert alert-info" role="alert">
Every database query in the Sales Agent automatically filters by <code>tenant_id</code>. The resolved identity (extracted from the authentication token) provides the tenant context, and the data-access layer applies it as a mandatory WHERE clause.
</div>

## Composite Key Pattern

Several models use composite primary keys that include `tenant_id`:

- **Product**: `(tenant_id, product_id)`
- **PricingOption**: `(tenant_id, product_id, pricing_option_id)`
- **Principal**: `(tenant_id, principal_id)`
- **MediaBuy**: `(tenant_id, media_buy_id)`

This pattern ensures that identifiers like `product_id` and `media_buy_id` only need to be unique within a single tenant, not globally.

---

## Core Models

### Tenant

The root entity representing a publisher or advertising operation.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `tenant_id` | `str` | PK | Unique tenant identifier. |
| `name` | `str` | NOT NULL | Display name for the tenant. |
| `subdomain` | `str` | UNIQUE, NOT NULL | URL subdomain (e.g., `publisher` in `publisher.adcp.example.com`). |
| `virtual_host` | `str` or `None` | -- | Optional virtual host override. |
| `auth_setup_mode` | `str` or `None` | -- | Authentication setup mode. |
| `approval_mode` | `str` or `None` | -- | Media buy approval mode (e.g., `"manual"`, `"auto"`). |
| `human_review_required` | `bool` | Default: `False` | Whether creatives require human review regardless of score. |
| `creative_auto_approve_threshold` | `float` | Default: `0.9` | Content-standards score threshold for automatic creative approval. |
| `creative_auto_reject_threshold` | `float` | Default: `0.1` | Content-standards score threshold for automatic creative rejection. |
| `brand_manifest_policy` | `str` or `None` | -- | Policy for brand manifest validation. |
| `ai_policy` | `JSONB` or `None` | -- | Tenant's AI usage policy (governs provenance requirements). |
| `advertising_policy` | `JSONB` or `None` | -- | Advertising content policy. |
| `ai_config` | `JSONB` or `None` | -- | AI service configuration (Gemini API key, model preferences). |
| `order_name_template` | `str` or `None` | -- | Template for generating ad server order names. |
| `line_item_name_template` | `str` or `None` | -- | Template for generating ad server line item names. |
| `measurement_providers` | `JSONB` or `None` | -- | Configured measurement/verification providers. |
| `slack_webhook_url` | `str` or `None` | -- | Slack webhook for notifications. |
| `favicon_url` | `str` or `None` | -- | Favicon URL for the tenant portal. |
| `product_ranking_prompt` | `str` or `None` | -- | Custom prompt used for AI-powered product ranking in `get_products`. |
{: .table .table-bordered .table-striped }

**Relationships**: One-to-many with Principal, Product, MediaBuy, AdapterConfig, InventoryProfile, CreativeAgent, SignalsAgent, CurrencyLimit, TenantAuthConfig, User.

---

### Principal

An authenticated entity (buying agent, human buyer, etc.) that can create media buys and manage creatives within a tenant.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `tenant_id` | `str` | PK, FK → Tenant | Tenant scope. |
| `principal_id` | `str` | PK | Unique identifier within the tenant. |
| `name` | `str` | NOT NULL | Display name. |
| `contact_email` | `str` or `None` | -- | Contact email address. |
| `adapter_mappings` | `JSONB` or `None` | -- | Mappings to ad server entities (advertiser IDs, etc.). |
| `brand_manifest` | `JSONB` or `None` | -- | Brand safety manifest for this principal. |
| `auth_token` | `str` or `None` | -- | Hashed authentication token. |
| `auth_token_expires_at` | `datetime` or `None` | -- | Token expiration time. |
{: .table .table-bordered .table-striped }

**Primary key**: Composite `(tenant_id, principal_id)`.

**Relationships**: One-to-many with MediaBuy, Creative.

---

### Product

An advertising product available for purchase.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `tenant_id` | `str` | PK, FK → Tenant | Tenant scope. |
| `product_id` | `str` | PK | Unique identifier within the tenant. |
| `name` | `str` | NOT NULL | Product name. |
| `description` | `str` or `None` | -- | Product description. |
| `format_ids` | `list` | -- | Accepted creative format identifiers (list of FormatId objects). |
| `targeting_template` | `JSONB` or `None` | -- | Default targeting configuration for this product. |
| `delivery_type` | `str` or `None` | -- | `"guaranteed"` or `"non_guaranteed"`. |
| `delivery_measurement` | `JSONB` or `None` | -- | How delivery is measured. |
| `creative_policy` | `JSONB` or `None` | -- | Product-specific creative requirements. |
| `is_custom` | `bool` | Default: `False` | Custom product for a specific buyer. |
| `countries` | `list[str]` or `None` | -- | Available countries (ISO 3166-1 alpha-2). |
| `channels` | `list[str]` or `None` | -- | Advertising channels (Channel enum values). |
| `implementation_config` | `JSONB` or `None` | -- | Adapter-specific configuration. |
| `properties` | `list[str]` or `None` | -- | Publisher properties / domains. |
| `property_ids` | `list[str]` or `None` | -- | Property identifiers. |
| `property_tags` | `list[str]` or `None` | -- | Property classification tags. |
| `inventory_profile_id` | `str` or `None` | FK → InventoryProfile | Link to inventory profile. |
| `is_dynamic` | `bool` | Default: `False` | Whether this product is dynamically generated. |
| `is_dynamic_variant` | `bool` | Default: `False` | Whether this is a variant of a dynamic product. |
| `parent_product_id` | `str` or `None` | -- | Parent product ID for dynamic variants. |
| `signals_agent_ids` | `list[str]` or `None` | -- | Signals agents configured for this product. |
| `allowed_principal_ids` | `list[str]` or `None` | -- | Restrict access to specific principals. |
| `expires_at` | `datetime` or `None` | -- | Product expiration date. |
{: .table .table-bordered .table-striped }

**Primary key**: Composite `(tenant_id, product_id)`.

**Relationships**: One-to-many with PricingOption. Many-to-one with InventoryProfile.

---

### PricingOption

A pricing model available for a product.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `tenant_id` | `str` | PK, FK → Tenant | Tenant scope. |
| `product_id` | `str` | PK, FK → Product | Parent product. |
| `pricing_option_id` | `str` | PK | Unique within the product. |
| `pricing_model` | `str` | NOT NULL | Pricing model (`cpm`, `cpc`, `cpcv`, `cpp`, `cpv`, `flat_rate`, `vcpm`). |
| `is_fixed` | `bool` | Default: `False` | Fixed rate vs. floor/guide. |
| `rate` | `float` | NOT NULL | Price per unit. |
| `currency` | `str` | Default: `"USD"` | ISO 4217 currency code. |
| `min_budget` | `float` or `None` | -- | Minimum budget. |
| `max_budget` | `float` or `None` | -- | Maximum budget. |
| `metadata` | `JSONB` or `None` | -- | Additional pricing data. |
{: .table .table-bordered .table-striped }

**Primary key**: Composite `(tenant_id, product_id, pricing_option_id)`.

---

### MediaBuy

A booked advertising order.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `tenant_id` | `str` | PK, FK → Tenant | Tenant scope. |
| `media_buy_id` | `str` | PK | Server-generated unique identifier. |
| `principal_id` | `str` | FK → Principal | The principal who created this buy. |
| `buyer_ref` | `str` or `None` | -- | Buyer's external reference. |
| `po_number` | `str` or `None` | -- | Purchase order number. |
| `status` | `str` | NOT NULL | Current status (`pending_activation`, `active`, `paused`, `completed`). |
| `flight_start_date` | `datetime` or `None` | -- | Flight start. |
| `flight_end_date` | `datetime` or `None` | -- | Flight end. |
| `budget` | `float` or `None` | -- | Total budget. |
| `budget_spent` | `float` | Default: `0.0` | Amount spent to date. |
| `budget_remaining` | `float` or `None` | -- | Remaining budget. |
| `currency` | `str` | Default: `"USD"` | ISO 4217 currency code. |
| `manual_approval_required` | `bool` | Default: `False` | Whether this buy requires manual approval. |
| `creatives_approved` | `bool` | Default: `False` | Whether all assigned creatives are approved. |
| `order_id` | `str` or `None` | -- | Ad server order ID (set by the adapter). |
| `adapter_name` | `str` or `None` | -- | Name of the ad server adapter handling this buy. |
| `paused` | `bool` | Default: `False` | Whether delivery is paused. |
| `created_at` | `datetime` | Auto-set | Creation timestamp. |
| `updated_at` | `datetime` | Auto-updated | Last modification timestamp. |
{: .table .table-bordered .table-striped }

**Primary key**: Composite `(tenant_id, media_buy_id)`.

**Relationships**: Many-to-one with Principal and Tenant.

---

### Creative

An ad creative with format validation and provenance tracking.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `creative_id` | `str` | PK | Caller-supplied unique identifier. |
| `format_id` | Composite | NOT NULL | Format reference (stored as `agent_url` + `id` fields). |
| `name` | `str` | NOT NULL | Human-readable name. |
| `status` | `str` | NOT NULL | Current status (CreativeStatus enum). |
| `assets` | `JSONB` | NOT NULL | Asset payload. |
| `creative_type` | `str` or `None` | -- | Creative type classification. |
| `provenance` | Composite | -- | Provenance fields stored as individual columns (see below). |
| `principal_id` | `str` | FK → Principal | Owning principal. |
| `created_date` | `datetime` | Auto-set | Creation timestamp. |
| `updated_date` | `datetime` | Auto-updated | Last modification timestamp. |
{: .table .table-bordered .table-striped }

Provenance is stored as individual columns on the Creative model rather than a separate table:

| Column | Type | Description |
| --- | --- | --- |
| `digital_source_type` | `str` or `None` | DigitalSourceType enum value. |
| `ai_tool` | `str` or `None` | AI tool identifier. |
| `human_oversight` | `str` or `None` | Oversight description. |
| `declared_by` | `str` or `None` | Declaring entity. |
| `provenance_created_time` | `datetime` or `None` | Original production time. |
| `c2pa` | `JSONB` or `None` | C2PA manifest. |
| `disclosure` | `str` or `None` | AI disclosure statement. |
| `verification` | `JSONB` or `None` | Verification data. |
{: .table .table-bordered .table-striped }

---

### WorkflowStep

A single step in a human-in-the-loop workflow.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `step_id` | `str` | PK | Unique step identifier. |
| `context_id` | `str` | FK | Parent workflow context. |
| `status` | `str` | NOT NULL | Step status (`pending`, `in_progress`, `completed`, `failed`, `requires_approval`). |
| `step_type` | `str` | NOT NULL | Type of step (e.g., `media_buy_approval`, `creative_review`). |
| `tool_name` | `str` | NOT NULL | The tool that created this step. |
| `owner` | `str` | NOT NULL | Principal who owns this step. |
| `request_data` | `JSONB` or `None` | -- | Original request payload. |
| `response_data` | `JSONB` or `None` | -- | Response after completion. |
| `error_message` | `str` or `None` | -- | Error details if failed. |
| `created_at` | `datetime` | Auto-set | Creation timestamp. |
| `completed_at` | `datetime` or `None` | -- | Completion timestamp. |
{: .table .table-bordered .table-striped }

---

### AuditLog

Immutable audit trail for all operations.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `log_id` | `str` | PK | Unique log entry identifier. |
| `tenant_id` | `str` | FK → Tenant | Tenant scope. |
| `operation` | `str` | NOT NULL | Operation name (e.g., `create_media_buy`, `sync_creatives`). |
| `principal_id` | `str` or `None` | -- | Acting principal. |
| `principal_name` | `str` or `None` | -- | Principal display name at time of action. |
| `adapter_id` | `str` or `None` | -- | Adapter involved (if any). |
| `success` | `bool` | NOT NULL | Whether the operation succeeded. |
| `details` | `JSONB` or `None` | -- | Structured operation details. |
| `error` | `str` or `None` | -- | Error message if failed. |
| `created_at` | `datetime` | Auto-set | Timestamp. |
| `ip_address` | `str` or `None` | -- | Client IP address. |
{: .table .table-bordered .table-striped }

---

## Configuration Models

### AdapterConfig

Configuration for the ad server adapter connected to a tenant.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `str` | PK | Unique config identifier. |
| `tenant_id` | `str` | UNIQUE, FK → Tenant | One adapter config per tenant. |
| `adapter_type` | `str` | NOT NULL | Adapter type: `"google_ad_manager"`, `"kevel"`, `"triton_digital"`, `"broadstreet"`, or `"mock"`. |
| `config` | `JSONB` | NOT NULL | Adapter-specific configuration (credentials, network IDs, etc.). |
{: .table .table-bordered .table-striped }

---

### InventoryProfile

Reusable ad server inventory configuration templates. Products reference inventory profiles via `inventory_profile_id` FK instead of duplicating inventory configuration.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `str` | PK | Unique profile identifier. |
| `tenant_id` | `str` | FK → Tenant | Tenant scope. |
| `name` | `str` | NOT NULL | Profile name. |
| `format_ids` | `JSONB` (list) | -- | List of FormatId objects (accepted creative formats). |
| `publisher_properties` | `JSONB` (list) or `None` | -- | List of property configurations. |
{: .table .table-bordered .table-striped }

---

### CurrencyLimit

Per-currency budget constraints for a tenant.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `str` | PK | Unique limit identifier. |
| `tenant_id` | `str` | FK → Tenant | Tenant scope. |
| `currency_code` | `str` | NOT NULL | ISO 4217 currency code. |
| `max_daily_budget` | `float` or `None` | -- | Maximum daily spend in this currency. |
| `min_product_spend` | `float` or `None` | -- | Minimum spend per product in this currency. |
{: .table .table-bordered .table-striped }

---

### Strategy

Campaign simulation and testing configuration.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `strategy_id` | `str` | PK | Unique identifier. Prefix `sim_` for simulation strategies. |
| `tenant_id` | `str` | FK → Tenant | Tenant scope. |
| `name` | `str` | NOT NULL | Strategy name. |
| `config` | `JSONB` | -- | Simulation parameters and configuration. |
| `is_simulation` | `bool` | Default: `False` | Whether this is a simulation (vs. production) strategy. |
| `created_at` | `datetime` | Auto-set | Creation timestamp. |
{: .table .table-bordered .table-striped }

---

### CreativeAgent

External creative format provider configuration. When `list_creative_formats` is called, the system queries all enabled creative agents and aggregates format specs.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `str` | PK | Unique agent identifier. |
| `tenant_id` | `str` | FK → Tenant | Tenant scope. |
| `agent_name` | `str` | NOT NULL | Identifier for the creative agent. |
| `endpoint` | `str` | NOT NULL | URL for the creative agent API. |
| `enabled` | `bool` | Default: `True` | Whether this agent is active. |
{: .table .table-bordered .table-striped }

---

### SignalsAgent

External audience signal provider configuration. When dynamic products request signal data, the system queries all enabled signals agents.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `str` | PK | Unique agent identifier. |
| `tenant_id` | `str` | FK → Tenant | Tenant scope. |
| `agent_name` | `str` | NOT NULL | Identifier for the signals agent. |
| `endpoint` | `str` | NOT NULL | URL for the signals agent API. |
| `enabled` | `bool` | Default: `True` | Whether this agent is active. |
{: .table .table-bordered .table-striped }

---

### TenantAuthConfig

OAuth / SAML authentication configuration for a tenant.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `str` | PK | Unique config identifier. |
| `tenant_id` | `str` | UNIQUE, FK → Tenant | One auth config per tenant. |
| `oauth_provider` | `str` or `None` | -- | OAuth provider name (e.g., `"google"`, `"azure_ad"`). |
| `oauth_config` | `JSONB` or `None` | -- | OAuth configuration (client ID, secret, scopes). |
| `saml_config` | `JSONB` or `None` | -- | SAML configuration (IdP URL, certificate). |
{: .table .table-bordered .table-striped }

---

### User

A human user of the tenant's management portal.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `str` | PK | Unique user identifier. |
| `tenant_id` | `str` | FK → Tenant | Tenant scope. |
| `email` | `str` | UNIQUE per tenant | User email address. |
| `name` | `str` | NOT NULL | Display name. |
| `role` | `str` | NOT NULL | Role: `admin`, `editor`, or `viewer`. |
| `external_id` | `str` or `None` | -- | External identity provider ID. |
| `last_login_at` | `datetime` or `None` | -- | Last login timestamp. |
{: .table .table-bordered .table-striped }

---

## JSONB Column Patterns

Several columns use PostgreSQL `JSONB` for flexible structured data:

| Column | Model | Typical Structure |
| --- | --- | --- |
| `adapter_mappings` | Principal | `{"advertiser_id": "12345", "network_id": "67890"}` |
| `brand_manifest` | Principal | `{"blocked_categories": ["IAB25"], "blocked_domains": ["competitor.com"]}` |
| `ai_policy` | Tenant | `{"require_provenance": true, "max_ai_content_pct": 0.5}` |
| `advertising_policy` | Tenant | `{"blocked_categories": [...], "required_disclosures": [...]}` |
| `ai_config` | Tenant | `{"gemini_api_key": "...", "model": "gemini-pro", "ranking_enabled": true}` |
| `targeting_template` | Product | `{"geo_countries": ["US"], "device_platform": ["desktop", "mobile"]}` |
| `implementation_config` | Product | `{"order_type": "sponsorship", "priority": 12, "rate_type": "CPM"}` |
| `config` | AdapterConfig | `{"network_code": "12345", "api_version": "v202402"}` |
| `request_data` | WorkflowStep | Full request payload that triggered the workflow. |
| `response_data` | WorkflowStep | Result payload after task completion. |
| `details` | AuditLog | `{"media_buy_id": "mb_123", "action": "pause", "previous_status": "active"}` |
| `measurement_providers` | Tenant | `[{"name": "moat", "config": {...}}, {"name": "ias", "config": {...}}]` |
{: .table .table-bordered .table-striped }

## Related Pages

- [API Schema Reference](api-schemas.html) -- Pydantic models that map to these database models
- [Tool Reference](../tools/tool-reference.html) -- Tools that read and write these models
- [Architecture](../architecture.html) -- Workflow approval design
