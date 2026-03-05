---
layout: page_v2
title: Prebid Sales Agent - Schemas - Database Models
description: SQLAlchemy ORM model reference for the Prebid Sales Agent database schema
sidebarType: 10
---

# Database Models
{: .no_toc}

The Prebid Sales Agent uses PostgreSQL with SQLAlchemy ORM for data persistence. All models enforce tenant isolation through `tenant_id` foreign keys. Schema changes are managed via Alembic migrations.

- TOC
{:toc}

## Entity Relationships

```text
tenants
  ├── users (many)          — composite unique: (tenant_id, email)
  ├── principals (many)     — advertiser/agent accounts
  │     └── media_buys (many)
  │           ├── packages (many)
  │           └── creatives (many)
  ├── products (many)       — advertising inventory
  ├── adapter_config (one)  — ad server configuration
  └── audit_logs (many)     — operation history
```

## Tenant

Represents a publisher entity. Each tenant operates in isolation with its own products, advertisers, and ad server configuration.

{: .table .table-bordered .table-striped }
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | No | Primary key |
| `name` | str | No | Publisher display name |
| `domain` | str | No | Publisher domain |
| `is_active` | bool | No | Whether the tenant is active (soft delete) |
| `adapter_type` | str | Yes | Ad server adapter type (`gam`, `mock`) |
| `created_at` | datetime | No | Creation timestamp |
| `updated_at` | datetime | No | Last update timestamp |

## User

Admin UI user account. Users are scoped to a single tenant via a composite unique constraint.

{: .table .table-bordered .table-striped }
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | No | Primary key |
| `tenant_id` | UUID (FK) | No | References `tenants.id` |
| `email` | str | No | User email (unique within tenant) |
| `name` | str | No | Display name |
| `role` | str | No | User role (`admin`, `viewer`) |
| `is_active` | bool | No | Whether the user is active |

{: .alert.alert-info :}
The composite unique constraint `(tenant_id, email)` allows the same email address to exist independently in different tenants with separate identities.

## Principal

An authenticated entity (AI buying agent or human user) that interacts with the Sales Agent via MCP or A2A.

{: .table .table-bordered .table-striped }
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | No | Primary key |
| `tenant_id` | UUID (FK) | No | References `tenants.id` |
| `name` | str | No | Display name |
| `email` | str | No | Contact email |
| `token_hash` | str | Yes | Hashed authentication token |
| `ad_server_ids` | JSON | Yes | Mapping of ad server type to external advertiser ID |
| `is_active` | bool | No | Whether the principal is active |

## Product

An advertising product in the publisher's catalog. Products are what AI buying agents discover via `get_products` and purchase via `create_media_buy`.

{: .table .table-bordered .table-striped }
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | No | Primary key |
| `tenant_id` | UUID (FK) | No | References `tenants.id` |
| `name` | str | No | Product name |
| `description` | str | No | Description used for AI-powered search matching |
| `delivery_type` | str | No | `guaranteed` or `non_guaranteed` |
| `format_ids` | JSON | No | Compatible creative format identifiers |
| `pricing_options` | JSON | No | Available pricing models with rates |
| `channels` | JSON | No | Delivery channels (`display`, `video`, `audio`, `native`) |
| `countries` | JSON | No | Geographic availability (ISO 3166-1 alpha-2 codes) |
| `is_active` | bool | No | Whether the product is active |

## MediaBuy

A campaign created by a buying agent. Tracks the full lifecycle from submission through delivery.

{: .table .table-bordered .table-striped }
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | No | Primary key |
| `tenant_id` | UUID (FK) | No | References `tenants.id` |
| `principal_id` | UUID (FK) | No | References `principals.id` |
| `campaign_name` | str | No | Human-readable campaign name |
| `buyer_ref` | str | Yes | Buyer-side reference ID for reconciliation |
| `status` | str | No | Lifecycle status (`pending`, `approved`, `active`, `paused`, `completed`, `failed`) |
| `start_date` | date | No | Campaign start date |
| `end_date` | date | No | Campaign end date |
| `created_at` | datetime | No | Creation timestamp |

## Package

A line item within a media buy, bundling a product with targeting and budget.

{: .table .table-bordered .table-striped }
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | No | Primary key |
| `media_buy_id` | UUID (FK) | No | References `media_buys.id` |
| `product_id` | str | No | References a product in the catalog |
| `budget` | float | No | Package budget amount |
| `targeting` | JSON | Yes | Targeting criteria (geo, device, content) |
| `pricing` | JSON | No | Negotiated pricing for this package |

## Creative

A creative asset uploaded by a buying agent.

{: .table .table-bordered .table-striped }
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | No | Primary key |
| `tenant_id` | UUID (FK) | No | References `tenants.id` |
| `name` | str | No | Creative display name |
| `format_id` | str | No | Creative format identifier |
| `status` | str | No | Processing status (`pending_review`, `approved`, `rejected`, `processing`) |
| `assets` | JSON | No | Creative asset files (images, video, HTML) |
| `tags` | JSON | Yes | Optional tags for organization and filtering |

## AdapterConfig

Ad server configuration for a tenant. Connection credentials are encrypted at rest using Fernet.

{: .table .table-bordered .table-striped }
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | No | Primary key |
| `tenant_id` | UUID (FK) | No | References `tenants.id` |
| `adapter_type` | str | No | Adapter identifier (`gam`, `mock`) |
| `connection_config` | encrypted JSON | No | Encrypted adapter connection settings |
| `product_config` | JSON | Yes | Per-product adapter configuration |

## AuditLog

Operation log entry for compliance, debugging, and security analysis.

{: .table .table-bordered .table-striped }
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | No | Primary key |
| `tenant_id` | str | Yes | Tenant context |
| `timestamp` | datetime | No | Event timestamp (UTC) |
| `operation` | str | No | Operation type (e.g., `media_buy.created`) |
| `principal_name` | str | Yes | Name of the acting principal |
| `principal_id` | str | Yes | ID of the acting principal |
| `adapter_id` | str | Yes | Ad server adapter ID |
| `success` | bool | No | Whether the operation succeeded |
| `error_message` | str | Yes | Error message if operation failed |
| `details` | JSONB | Yes | Operation-specific metadata |

## WorkflowStep

Tracks human-in-the-loop approval tasks for media buys and creatives.

{: .table .table-bordered .table-striped }
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | No | Primary key |
| `tenant_id` | str | No | Tenant context |
| `context_id` | str | No | Associated workflow context |
| `status` | str | No | Task status (`pending`, `in_progress`, `completed`, `failed`, `requires_approval`) |
| `type` | str | No | Task type (`media_buy`, `creative`, `product`) |
| `tool_name` | str | No | Name of the MCP tool that created this task |
| `owner` | str | Yes | Assigned owner |
| `request_data` | JSON | Yes | Input data for the task |
| `response_data` | JSON | Yes | Output data from the task |
| `error_message` | str | Yes | Error message if task failed |

## Tenant Isolation

All database queries are automatically scoped by `tenant_id`. This ensures:

- Each tenant's data is isolated from all other tenants
- A user with the same email across multiple tenants has separate, independent identities
- Principal tokens are scoped to a single tenant

## Soft Delete

Tenant deactivation sets `is_active = false` without removing data. All API access is blocked immediately, but data is preserved for potential reactivation by a super admin.

## Further Reading

- [Source Architecture](/agents/salesagent/developers/source-architecture.html) -- Code structure and module map
- [Database Migrations](/agents/salesagent/developers/migrations.html) -- Alembic migration patterns
- [Security Model](/agents/salesagent/operations/security.html) -- Access control and encryption
- [API Schema Reference](/agents/salesagent/schemas/api-schemas.html) -- Pydantic request/response models
