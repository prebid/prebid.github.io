---
layout: page_v2
title: Prebid Sales Agent - Developers - Source Code Architecture
description: Deep-dive into the Prebid Sales Agent source code structure, core modules, tools, database layer, services, and key patterns
sidebarType: 10
---

# Source Code Architecture
{: .no_toc}

This page provides a detailed walkthrough of the Prebid Sales Agent source code. It covers the project directory structure, core modules, tool implementations, database layer, services, adapters, and the key architectural patterns that tie everything together.

- TOC
{:toc}

## Project Structure

The source code lives under the `src/` directory, organized by architectural layer:

```text
src/
├── core/                          # Core application logic
│   ├── main.py                    # FastMCP server, route mounting, entry point
│   ├── schemas.py                 # Pydantic request/response models
│   ├── tool_context.py            # ToolContext dependency injection
│   ├── config_loader.py           # Environment variable loading, feature flags
│   ├── audit_logger.py            # Operation logging, security event tracking
│   ├── database/                  # Database layer
│   │   ├── models.py              # SQLAlchemy ORM models
│   │   ├── database.py            # Engine initialization, pool config
│   │   └── database_session.py    # get_db_session() context manager
│   └── tools/                     # MCP tool implementations
│       ├── capabilities.py        # get_adcp_capabilities
│       ├── products.py            # get_products
│       ├── creative_formats.py    # list_creative_formats
│       ├── media_buy_create.py    # create_media_buy
│       ├── media_buy_update.py    # update_media_buy
│       ├── media_buy_delivery.py  # get_media_buy_delivery
│       ├── media_buy_list.py      # get_media_buys
│       ├── properties.py          # list_authorized_properties
│       ├── performance.py         # update_performance_index
│       └── creatives/             # Creative management tools
│           ├── sync_wrappers.py   # sync_creatives
│           └── listing.py         # list_creatives
├── services/                      # Business logic services
│   ├── ai_product_service.py      # Gemini AI product discovery
│   ├── targeting_capabilities.py  # Targeting taxonomy management
│   └── gam_inventory_service.py   # GAM inventory synchronization
├── adapters/                      # Ad server adapters
│   ├── base.py                    # AdServerAdapter abstract base class
│   ├── google_ad_manager.py       # GAM API integration
│   └── mock_ad_server.py          # Mock adapter for testing
└── admin/                         # Admin UI
    ├── app.py                     # Flask application factory
    └── blueprints/                # Flask blueprints
        ├── tenants.py             # Tenant management views
        └── activity_stream.py     # SSE activity feed
```

Supporting directories outside `src/`:

```text
tests/
├── unit/                          # Fast, no-dependency tests
├── integration/                   # Requires PostgreSQL
└── e2e/                           # Full Docker-based tests

alembic/                           # Database migration scripts
docker/                            # Dockerfiles and compose configs
.claude/                           # Claude Code project context
```

## Core Modules

### main.py -- Application Entry Point

`src/core/main.py` is the entry point for the entire application. It creates the FastMCP server instance, mounts the Admin UI as a sub-application, and registers all MCP tools.

```python
from mcp.server.fastmcp import FastMCP

# Create the FastMCP server
mcp = FastMCP("salesagent")

# Mount the Flask admin UI
mcp.mount("/admin", admin_app)

# Tools are registered via @mcp.tool() decorators in the tools/ directory
# The import of tool modules triggers their registration
```

Key responsibilities:

- Creates and configures the `FastMCP` server instance
- Mounts the Admin UI Flask application at `/admin`
- Imports all tool modules, triggering `@mcp.tool()` registration
- Configures HTTP/SSE transport and authentication middleware
- Starts the ASGI server (Uvicorn) when run directly

### schemas.py -- Pydantic Validation Layer

`src/core/schemas.py` defines all request and response models as Pydantic `BaseModel` classes. Every piece of data entering or leaving the system passes through these schemas for validation.

```python
from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional
from datetime import datetime

class PricingModel(str, Enum):
    cpm = "cpm"
    vcpm = "vcpm"
    cpc = "cpc"
    cpcv = "cpcv"
    cpv = "cpv"
    cpp = "cpp"
    flat_rate = "flat_rate"

class Product(BaseModel):
    product_id: str
    name: str
    description: str
    delivery_type: DeliveryType
    format_ids: list[str]
    pricing_options: list[PricingOption]
    estimated_exposures: Optional[ExposureEstimate] = None
    channels: list[str]
    countries: list[str]
```

See the [API Schema Reference](/agents/salesagent/schemas/api-schemas.html) for the complete model catalog.

### tool_context.py -- Dependency Injection

`src/core/tool_context.py` defines the `ToolContext` class, which is the primary mechanism for dependency injection in MCP tools. Every tool that needs database access, adapter access, or tenant scoping receives a `ToolContext` instance.

```python
class ToolContext:
    tenant_id: int          # Resolved from auth token
    principal_id: int       # The authenticated agent/user
    db_session: Session     # SQLAlchemy session (scoped to tenant)
    adapter: AdServerAdapter  # Tenant's configured ad server adapter
    config: Config          # Server configuration and feature flags
```

The `get_tool_context` dependency resolver:

1. Extracts the auth token from the request headers
2. Looks up the principal and tenant from the database
3. Loads the tenant's adapter configuration
4. Constructs a `ToolContext` with all resolved dependencies
5. Injects it into the tool function via FastAPI-style `Depends()`

### config_loader.py -- Configuration Management

`src/core/config_loader.py` handles loading configuration from environment variables, resolving tenant-specific settings, and managing feature flags.

{: .table .table-bordered .table-striped }
| Responsibility | Description |
|---------------|-------------|
| **Environment loading** | Reads `.env` file and environment variables |
| **Tenant resolution** | Maps hostnames and tokens to tenant configurations |
| **Feature flags** | Controls optional features (AI search, approval workflows) |
| **Validation** | Ensures required variables are set at startup |

### audit_logger.py -- Audit Logging

`src/core/audit_logger.py` records all significant operations for compliance and debugging. Every media buy creation, creative upload, status change, and administrative action is logged with:

- Timestamp
- Tenant ID and principal ID
- Action type and entity references
- Request details and outcome
- Security-relevant events (failed auth, permission denials)

## Tools Directory

The `src/core/tools/` directory contains one file per MCP tool (or group of related tools). Each tool is registered with the FastMCP server via the `@mcp.tool()` decorator.

### Tool Registration Pattern

All tools follow a consistent pattern:

```python
from src.core.main import mcp
from src.core.tool_context import ToolContext, get_tool_context
from fastapi import Depends

@mcp.tool()
async def tool_name(
    param1: str,
    param2: int = 0,
    ctx: ToolContext = Depends(get_tool_context),
) -> ToolResponse:
    """Tool description shown to AI agents."""
    return await _tool_name_impl(param1, param2, ctx)
```

### Tool Catalog

{: .table .table-bordered .table-striped }
| File | Tool(s) | Category | Description |
|------|---------|----------|-------------|
| `capabilities.py` | `get_adcp_capabilities` | Discovery | Protocol capability discovery and agent metadata |
| `products.py` | `get_products` | Discovery | AI-powered product search with Gemini integration |
| `creative_formats.py` | `list_creative_formats` | Discovery | Creative format specifications and constraints |
| `media_buy_create.py` | `create_media_buy` | Execution | Campaign creation with targeting and budget |
| `media_buy_update.py` | `update_media_buy` | Execution | Campaign modification (budget, dates, status) |
| `media_buy_delivery.py` | `get_media_buy_delivery` | Performance | Delivery metrics from the ad server |
| `media_buy_list.py` | `get_media_buys` | Execution | Query and list media buys with filters |
| `creatives/sync_wrappers.py` | `sync_creatives` | Creative | Upload and sync creative assets with the ad server |
| `creatives/listing.py` | `list_creatives` | Creative | Search and filter the creative library |
| `properties.py` | `list_authorized_properties` | Governance | Publisher domain authorization |
| `performance.py` | `update_performance_index` | Performance | Package-level performance data aggregation |

### Error Handling with with_error_logging

Tools use a `with_error_logging` wrapper that provides consistent error handling and audit logging:

```python
@mcp.tool()
async def create_media_buy(
    params: CreateMediaBuyRequest,
    ctx: ToolContext = Depends(get_tool_context),
) -> CreateMediaBuyResponse:
    """Create a new media buy campaign."""
    async with with_error_logging(ctx, "create_media_buy"):
        # Business logic here
        # Errors are caught, logged, and returned as structured error responses
        ...
```

This wrapper:

- Logs the tool invocation with parameters
- Catches and classifies exceptions (validation, auth, not found, internal)
- Records the outcome in the audit log
- Returns structured error objects to the AI agent

### raw_functions.py for A2A

Some tools expose their core logic through `raw_functions.py` modules, which provide a plain Python interface without MCP decorators. These are used by the A2A (Agent-to-Agent) JSON-RPC handler to invoke the same business logic through a different protocol.

## Database Layer

The database layer lives in `src/core/database/` and uses SQLAlchemy 2.x with async support.

### models.py -- ORM Models

`src/core/database/models.py` defines SQLAlchemy declarative models for all database tables:

{: .table .table-bordered .table-striped }
| Model | Table | Key Fields | Relationships |
|-------|-------|------------|---------------|
| `Tenant` | `tenants` | `id`, `name`, `slug`, `ad_server_type`, `config` | Has many: principals, products, media_buys, audit_logs |
| `Principal` | `principals` | `id`, `tenant_id`, `email`, `name`, `token_hash`, `role` | Belongs to: tenant. Has many: media_buys |
| `Product` | `products` | `id`, `tenant_id`, `name`, `description`, `pricing`, `targeting` | Belongs to: tenant. Has many: media_buys |
| `MediaBuy` | `media_buys` | `id`, `tenant_id`, `principal_id`, `product_id`, `budget`, `status`, `flight_dates` | Belongs to: tenant, principal, product. Has many: creatives |
| `Creative` | `creatives` | `id`, `tenant_id`, `media_buy_id`, `format`, `content`, `approval_status` | Belongs to: tenant, media_buy |
| `AuditLog` | `audit_logs` | `id`, `tenant_id`, `principal_id`, `action`, `entity_type`, `entity_id`, `details`, `timestamp` | Belongs to: tenant, principal |

All models include `tenant_id` as a foreign key with a composite unique constraint to enforce data isolation.

### database.py -- Engine Initialization

`src/core/database/database.py` creates and configures the SQLAlchemy async engine with connection pooling:

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

engine = create_async_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,
)
```

### database_session.py -- Session Context Manager

`src/core/database/database_session.py` provides the `get_db_session()` context manager, which is the only sanctioned way to obtain a database session:

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def get_db_session():
    async with AsyncSession(engine) as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
```

{: .alert.alert-warning :}
All database access must go through `get_db_session()`. Never create connections manually or use raw connection strings. This ensures proper connection pooling, transaction management, and cleanup.

## Services

The `src/services/` directory contains business logic that is shared across multiple tools.

### ai_product_service.py -- Gemini AI Integration

`src/services/ai_product_service.py` implements the AI-powered product discovery pipeline. When an AI agent calls `get_products` with a natural language brief:

1. Loads the tenant's product catalog from the database
2. Sends the products and search query to the Google Gemini API
3. Gemini ranks products by relevance to the brief
4. Returns scored and filtered results

When no Gemini API key is configured, the service falls back to keyword-based matching against product names and descriptions.

### targeting_capabilities.py -- Targeting Taxonomy

`src/services/targeting_capabilities.py` manages geographic and custom targeting taxonomies. It resolves targeting identifiers (country codes, DMA codes, custom key-values) into ad server-specific targeting criteria.

### gam_inventory_service.py -- GAM Inventory Sync

`src/services/gam_inventory_service.py` synchronizes inventory data between the Sales Agent's local product catalog and GAM. It handles:

- Fetching ad unit hierarchies from GAM
- Mapping GAM placements to local products
- Syncing delivery forecasts and availability data

## Adapters

The `src/adapters/` directory implements the adapter pattern for ad server integrations.

### base.py -- Abstract Interface

`src/adapters/base.py` defines the `AdServerAdapter` abstract base class. All adapters must implement these methods:

```python
class AdServerAdapter(ABC):
    @abstractmethod
    async def create_order(self, media_buy: MediaBuy) -> str: ...

    @abstractmethod
    async def create_line_item(self, media_buy: MediaBuy, order_id: str) -> str: ...

    @abstractmethod
    async def upload_creative(self, creative: Creative) -> str: ...

    @abstractmethod
    async def get_delivery_report(self, order_id: str) -> DeliveryReport: ...

    @abstractmethod
    async def sync_creative(self, creative: Creative) -> str: ...
```

### google_ad_manager.py -- GAM Adapter

`src/adapters/google_ad_manager.py` implements the `AdServerAdapter` interface for Google Ad Manager. It uses the GAM API client library to translate AdCP operations into GAM API calls. See the [Google Ad Manager Integration](/agents/salesagent/integrations/gam.html) guide for configuration details.

### mock_ad_server.py -- Mock Adapter

`src/adapters/mock_ad_server.py` provides a mock implementation that returns simulated responses. It is used for:

- Local development without GAM credentials
- Unit and integration testing
- Demo and evaluation environments

## Admin UI

The `src/admin/` directory contains a Flask web application that provides the publisher dashboard.

### app.py -- Flask Application

`src/admin/app.py` creates the Flask application, configures session management, and mounts it as a sub-application of the FastMCP server at `/admin`.

### Blueprints

{: .table .table-bordered .table-striped }
| Blueprint | File | Routes | Description |
|-----------|------|--------|-------------|
| **Tenants** | `blueprints/tenants.py` | `/admin/tenants/*` | Tenant management, product CRUD, principal management |
| **Activity Stream** | `blueprints/activity_stream.py` | `/admin/activity/*` | Real-time SSE feed of system events |

The Admin UI supports OAuth login, role-based access control, and a human-in-the-loop approval queue for media buys and creatives.

## Key Patterns

### Pattern 1: @mcp.tool() + with_error_logging

Every MCP tool combines the `@mcp.tool()` decorator for registration with the `with_error_logging` context manager for consistent error handling and audit logging:

```python
@mcp.tool()
async def tool_name(
    params: RequestModel,
    ctx: ToolContext = Depends(get_tool_context),
) -> ResponseModel:
    """Tool description."""
    async with with_error_logging(ctx, "tool_name"):
        # Business logic
        return ResponseModel(...)
```

### Pattern 2: ToolContext Injection

All tenant-scoped operations receive a `ToolContext` via FastAPI-style dependency injection. This ensures every database query, adapter call, and audit log entry is automatically scoped to the correct tenant:

```python
ctx: ToolContext = Depends(get_tool_context)
# ctx.tenant_id, ctx.principal_id, ctx.db, ctx.adapter are all available
```

### Pattern 3: get_db_session() Context Manager

Database access is always mediated by the `get_db_session()` context manager. This enforces connection pooling, transaction boundaries, and automatic rollback on errors.

### Pattern 4: Adapter Pattern

Business logic never calls ad server APIs directly. Instead, it delegates to the adapter instance from `ToolContext`, which implements the `AdServerAdapter` interface. This makes the entire service layer ad-server-agnostic.

### Pattern 5: raw_functions.py for A2A

Tools expose their core logic through plain Python functions (without MCP decorators) in `raw_functions.py` modules. The A2A JSON-RPC handler calls these functions directly, ensuring both protocols execute identical business logic.

## Entry Point Summary

The application starts from `src/core/main.py`:

1. `FastMCP("salesagent")` creates the MCP server instance
2. Tool modules are imported, triggering `@mcp.tool()` registration for all 14 tools
3. The Flask admin app is mounted at `/admin`
4. Authentication middleware is configured for token resolution
5. The ASGI server (Uvicorn) starts and listens for connections

```text
src/core/main.py
    │
    ├── Creates FastMCP server
    ├── Imports src/core/tools/*.py  →  Registers 14 MCP tools
    ├── Mounts src/admin/app.py     →  Admin UI at /admin
    ├── Configures auth middleware   →  Token → ToolContext resolution
    └── Starts Uvicorn               →  HTTP/SSE on :8080
```

## Further Reading

- [API Schema Reference](/agents/salesagent/schemas/api-schemas.html) -- Complete Pydantic model documentation
- [Development Environment Setup](/agents/salesagent/developers/dev-setup.html) -- Local dev setup and testing
- [Google Ad Manager Integration](/agents/salesagent/integrations/gam.html) -- GAM adapter configuration
- [Architecture & Protocols](/agents/salesagent/architecture.html) -- High-level system design
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- MCP tool catalog with parameters and examples
