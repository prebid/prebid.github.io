---
layout: page_v2
title: Prebid Sales Agent - Architecture & Protocols
description: System architecture, protocol design, database schema, and integration patterns for the Prebid Sales Agent
sidebarType: 10
---

# Architecture & Protocols
{: .no_toc}

The Prebid Sales Agent follows a layered architecture that cleanly separates protocol handling, business logic, and ad server integrations. This page describes the system design, protocol comparison, multi-tenancy model, database schema, adapter pattern, and authentication layers.

- TOC
{:toc}

## Four-Layer Architecture

The system is organized into four distinct layers. Each layer has a single responsibility and communicates only with its immediate neighbors.

```text
┌──────────────────────────────────────────────────────────────────┐
│                     Layer 1: Admin UI (Flask)                    │
│          Web dashboard, SSE activity feed, approval queue        │
└──────────────────────────┬───────────────────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────────────┐
│                Layer 2: MCP / A2A Protocol Servers               │
│     FastMCP (HTTP/SSE) at /mcp/  │  JSON-RPC 2.0 at /a2a       │
│     Tool registration & routing  │  Agent card discovery        │
└──────────────────────────┬───────────────────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────────────┐
│                  Layer 3: Service Layer                           │
│   ProductService  │  MediaBuyService  │  CreativeService         │
│   PrincipalService │  ReportingService │  AuditService           │
│                  ToolContext (tenant isolation)                   │
└──────────────┬───────────────────┬───────────────────────────────┘
               │                   │
┌──────────────┴──────┐  ┌────────┴───────────────────────────────┐
│  Layer 4: Adapters  │  │        Layer 4: Database               │
│  GAMAdapter         │  │  PostgreSQL + SQLAlchemy ORM           │
│  MockAdapter        │  │  Alembic auto-migrations               │
│  (future adapters)  │  │  Composite unique constraints          │
└─────────────────────┘  └────────────────────────────────────────┘
```

### Layer Responsibilities

{: .table .table-bordered .table-striped }
| Layer | Component | Responsibility |
|-------|-----------|----------------|
| **1. Admin UI** | Flask web app | Dashboard, approval queue, SSE activity feed, OAuth login |
| **2. Protocol** | FastMCP server | MCP tool registration, HTTP/SSE transport, token auth |
| **2. Protocol** | A2A server | JSON-RPC 2.0 endpoint, agent card at `/.well-known/agent.json` |
| **3. Services** | Business logic | Validation, orchestration, tenant isolation via ToolContext |
| **4. Adapters** | Ad server plugins | Translate service calls into ad server API operations |
| **4. Database** | PostgreSQL | Persistent storage with SQLAlchemy ORM and Alembic migrations |

## Data Flow

Every AI agent request follows the same path through the system, regardless of whether it arrives via MCP or A2A.

```text
AI Agent (Claude, GPT, custom)
    │
    │  HTTP POST with auth token
    ▼
┌─────────────────────────────┐
│  Nginx Reverse Proxy (:8000)│
│  Routes /mcp/ or /a2a       │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  MCP Server (:8080)         │   ┌─────────────────────────────┐
│  or A2A Server              │──▶│  ToolContext                 │
│  (protocol parsing)         │   │  - tenant_id                │
└──────────┬──────────────────┘   │  - principal_id             │
           │                      │  - db_session               │
           ▼                      │  - adapter instance          │
┌─────────────────────────────┐   └─────────────────────────────┘
│  Service Layer              │◀─── uses ToolContext for isolation
│  (business logic)           │
└──────────┬──────────────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌──────────┐ ┌──────────────┐
│ Database │ │  Ad Server   │
│ (CRUD)   │ │  Adapter     │
└──────────┘ │  (GAM, Mock) │
             └──────────────┘
```

### Request Lifecycle

1. **Authentication** -- The protocol layer validates the incoming token (MCP `x-adcp-auth` header or A2A `Authorization: Bearer` header) and resolves it to a principal and tenant.
2. **ToolContext creation** -- A `ToolContext` object is constructed containing the `tenant_id`, `principal_id`, database session, and the correct ad server adapter for that tenant.
3. **Service dispatch** -- The appropriate service method is called with the ToolContext, ensuring all operations are scoped to the authenticated tenant.
4. **Adapter execution** -- When ad server operations are needed (campaign creation, delivery reporting), the service delegates to the tenant's configured adapter.
5. **Response** -- Results flow back through the protocol layer and are serialized as MCP tool results or A2A JSON-RPC responses.

## MCP vs A2A Protocol Comparison

The Sales Agent exposes identical business functionality through both protocols. The choice between them depends on your integration pattern.

{: .table .table-bordered .table-striped }
| Aspect | MCP (Model Context Protocol) | A2A (Agent-to-Agent Protocol) |
|--------|------------------------------|-------------------------------|
| **Transport** | HTTP with SSE (Server-Sent Events) | HTTP with JSON-RPC 2.0 |
| **Endpoint** | `/mcp/` | `/a2a` |
| **Authentication** | `x-adcp-auth` header token | `Authorization: Bearer` header |
| **Discovery** | Tool listing via `list_tools` | Agent card at `/.well-known/agent.json` |
| **Streaming** | Native SSE streaming | JSON-RPC response batching |
| **Best for** | AI assistants (Claude, GPT) that natively support MCP | Multi-agent orchestration systems |
| **Agent card** | Not applicable | Published at `/.well-known/agent.json` with capabilities |
| **Library** | FastMCP Python SDK | Custom JSON-RPC handler |

### When to Use MCP

Use MCP when your AI assistant natively supports the Model Context Protocol. This is the primary interface and provides the most natural integration for single-agent workflows:

```bash
# Connect Claude Desktop to the Sales Agent
uvx adcp http://localhost:8000/mcp/ --auth your-token list_tools
```

### When to Use A2A

Use A2A when building multi-agent systems where agents need to discover and communicate with each other programmatically. A2A provides structured agent discovery via the agent card:

```bash
# Discover agent capabilities
curl http://localhost:8000/.well-known/agent.json

# Send a JSON-RPC request
curl -X POST http://localhost:8000/a2a \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"jsonrpc":"2.0","method":"get_products","params":{"brief":"video"},"id":1}'
```

{: .alert.alert-info :}
Both protocols expose the same set of tools and return identical data structures. See the [Tool Reference](/agents/salesagent/tools/tool-reference.html) for the complete catalog of available operations. For a deeper comparison of protocol design philosophies, see the [AdCP Protocol Comparison](https://docs.adcontextprotocol.org/docs/building/understanding/protocol-comparison).

## Multi-Tenancy Model

The Sales Agent is designed for multi-tenant operation, where each publisher operates in complete isolation from others.

### Tenant Isolation via ToolContext

Every incoming request is resolved to a specific tenant. The `ToolContext` object carries this tenant scope through the entire request lifecycle:

```python
class ToolContext:
    tenant_id: int          # Resolved from auth token
    principal_id: int       # The authenticated agent/user
    db_session: Session     # SQLAlchemy session
    adapter: AdServerAdapter  # Tenant's configured ad server adapter
```

All database queries are automatically scoped by `tenant_id`. A principal (AI agent or human user) in Tenant A can never see or modify data belonging to Tenant B.

### Composite Identity Model

Principals (agents and users) are identified by a composite unique constraint of `(tenant_id, email)`. This means the same email address can exist as separate principals in different tenants, each with independent permissions and audit histories.

```text
┌──────────────────────────────────────────────────────┐
│                    Tenants                            │
│                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  Publisher A │  │  Publisher B │  │  Publisher C │  │
│  │             │  │             │  │             │  │
│  │  Principals │  │  Principals │  │  Principals │  │
│  │  Products   │  │  Products   │  │  Products   │  │
│  │  Media Buys │  │  Media Buys │  │  Media Buys │  │
│  │  Creatives  │  │  Creatives  │  │  Creatives  │  │
│  │  Audit Logs │  │  Audit Logs │  │  Audit Logs │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                      │
│         Complete data isolation per tenant            │
└──────────────────────────────────────────────────────┘
```

## Database Architecture

The Sales Agent uses PostgreSQL as its primary data store, with SQLAlchemy ORM for data access and Alembic for schema migrations.

### Technology Stack

{: .table .table-bordered .table-striped }
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Database** | PostgreSQL | ACID-compliant relational storage |
| **ORM** | SQLAlchemy 2.x | Python object-relational mapping |
| **Migrations** | Alembic | Auto-generated schema migrations |
| **Connection** | Connection pooling | Managed by SQLAlchemy engine |

### Auto-Migrations

Alembic is configured in auto-generate mode. When SQLAlchemy models change, Alembic detects the differences and creates migration scripts automatically:

```bash
# Generate a new migration after model changes
alembic revision --autogenerate -m "add new column"

# Apply pending migrations
alembic upgrade head
```

Migrations run automatically on container startup in Docker deployments.

### Core Tables

{: .table .table-bordered .table-striped }
| Table | Purpose | Key Fields |
|-------|---------|------------|
| **tenants** | Publisher accounts | `id`, `name`, `slug`, `ad_server_type`, `config` |
| **principals** | AI agents and human users | `id`, `tenant_id`, `email`, `name`, `token_hash`, `role` |
| **products** | Advertising inventory items | `id`, `tenant_id`, `name`, `description`, `pricing`, `targeting` |
| **media_buys** | Campaign orders from buyers | `id`, `tenant_id`, `principal_id`, `product_id`, `budget`, `status`, `flight_dates` |
| **creatives** | Ad creative assets | `id`, `tenant_id`, `media_buy_id`, `format`, `content`, `approval_status` |
| **audit_logs** | Complete operational history | `id`, `tenant_id`, `principal_id`, `action`, `entity_type`, `entity_id`, `details`, `timestamp` |

### Entity Relationships

```text
tenants
  │
  ├── principals (many)     ── composite unique: (tenant_id, email)
  │     │
  │     └── media_buys (many)
  │           │
  │           └── creatives (many)
  │
  ├── products (many)
  │     │
  │     └── media_buys (many)  ── references product_id
  │
  └── audit_logs (many)       ── references principal_id, entity_type, entity_id
```

All tables include `tenant_id` as a foreign key to enforce data isolation at the database level.

## Adapter Pattern

The Sales Agent uses the adapter pattern to support multiple ad server backends. Each adapter implements the `AdServerAdapter` abstract base class, providing a uniform interface regardless of the underlying ad server.

### AdServerAdapter Interface

```python
class AdServerAdapter(ABC):
    """Abstract base class for ad server integrations."""

    @abstractmethod
    async def create_order(self, media_buy: MediaBuy) -> str:
        """Create an order in the ad server. Returns external order ID."""

    @abstractmethod
    async def create_line_item(self, media_buy: MediaBuy, order_id: str) -> str:
        """Create a line item under an order. Returns external line item ID."""

    @abstractmethod
    async def upload_creative(self, creative: Creative) -> str:
        """Upload a creative asset. Returns external creative ID."""

    @abstractmethod
    async def get_delivery_report(self, order_id: str) -> DeliveryReport:
        """Fetch delivery metrics for an order."""

    @abstractmethod
    async def sync_creative(self, creative: Creative) -> str:
        """Sync creative status from the ad server."""
```

### Available Adapters

{: .table .table-bordered .table-striped }
| Adapter | Class | Purpose |
|---------|-------|---------|
| **Google Ad Manager** | `GAMAdapter` | Production integration with Google Ad Manager API |
| **Mock** | `MockAdapter` | Development and testing with simulated responses |

### Adding a New Adapter

To support a new ad server, create a class that implements `AdServerAdapter`:

1. Create a new file in the adapters directory (e.g., `xandr_adapter.py`).
2. Implement all abstract methods from `AdServerAdapter`.
3. Register the adapter type in the tenant configuration.
4. Tenants select their adapter via the `ad_server_type` field.

{: .alert.alert-info :}
For detailed source code organization and module-level documentation, see [Source Architecture](/agents/salesagent/developers/source-architecture.html).

## Port Allocation

The Docker deployment exposes services on the following ports:

{: .table .table-bordered .table-striped }
| Port | Service | Description |
|------|---------|-------------|
| **8000** | Nginx reverse proxy | Public entry point; routes to internal services |
| **8080** | MCP Server (FastMCP) | Primary AI agent interface via HTTP/SSE |
| **8001** | Admin UI (Flask) | Web dashboard and approval workflows |
| **8091** | A2A Server (alternate) | Direct A2A access when not using the proxy |

In production, all traffic enters through the Nginx proxy on port 8000, which routes requests based on path:

```text
http://localhost:8000
    │
    ├── /mcp/*    ──▶  MCP Server (:8080)
    ├── /a2a      ──▶  A2A Server (:8080)
    ├── /admin/*  ──▶  Admin UI (:8001)
    ├── /health   ──▶  Health endpoint
    └── /.well-known/agent.json  ──▶  A2A agent card
```

{: .alert.alert-info :}
For local development without Docker, services can be started individually on their native ports. See the [Quick Start](/agents/salesagent/getting-started/quickstart.html) guide for details.

## Authentication Layers

The Sales Agent implements multiple authentication mechanisms depending on the access context.

### Authentication Methods

{: .table .table-bordered .table-striped }
| Layer | Method | Scope | Use Case |
|-------|--------|-------|----------|
| **Super Admin** | `SUPER_ADMIN_TOKEN` env var | System-wide | Tenant provisioning, system configuration |
| **OAuth** | Google OAuth 2.0 | Admin UI | Human publishers accessing the dashboard |
| **Tenant Admin** | Token-based | Per-tenant | Publisher admin operations via API |
| **Principal Token** | `x-adcp-auth` or `Bearer` header | Per-tenant | AI agent authentication for MCP/A2A |

### Token Resolution Flow

```text
Incoming Request
    │
    ├── Has x-adcp-auth header?
    │   └── Yes ──▶ Look up principal by token hash
    │               └── Resolve tenant_id, principal_id
    │
    ├── Has Authorization: Bearer header?
    │   └── Yes ──▶ Check if super admin token
    │               ├── Yes ──▶ Super admin context
    │               └── No  ──▶ Look up principal by token hash
    │                           └── Resolve tenant_id, principal_id
    │
    └── Has OAuth session cookie?
        └── Yes ──▶ Resolve from session
                    └── Admin UI context
```

Principal tokens are stored as hashed values in the database. The raw token is only shown once at creation time. Each principal can have multiple tokens for rotation without downtime.

{: .alert.alert-info :}
For complete security documentation, including credential management, network isolation, and production hardening, see [Security & Operations](/agents/salesagent/operations/security.html).

## AI Integration

The Sales Agent integrates Google Gemini for intelligent product discovery, enabling AI agents to search advertising inventory using natural language.

### Product Discovery with Gemini

When an AI agent calls `get_products` with a natural language query, the service uses Gemini to match the query against the tenant's product catalog:

```text
AI Agent: "Find video advertising products for sports content"
    │
    ▼
┌─────────────────────────────┐
│  ProductService.get_products│
│                             │
│  1. Load tenant's products  │
│  2. Send to Gemini with     │
│     query context           │
│  3. Gemini ranks and        │
│     filters matches         │
│  4. Return scored results   │
└─────────────────────────────┘
    │
    ▼
Matched products with relevance scores
```

### Configuration

Gemini integration requires a Google AI API key set in the environment:

```yaml
# docker-compose.yml excerpt
environment:
  - GEMINI_API_KEY=your-api-key
```

When no API key is configured, product discovery falls back to keyword-based matching against product names and descriptions.

{: .alert.alert-info :}
Product discovery is one of several tools available to AI agents. See the [Tool Reference](/agents/salesagent/tools/tool-reference.html) for the complete list of operations including media buy management, creative handling, and reporting.

## Further Reading

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete catalog of MCP/A2A tools
- [Security & Operations](/agents/salesagent/operations/security.html) -- Authentication, credential management, and production hardening
- [Source Architecture](/agents/salesagent/developers/source-architecture.html) -- Codebase organization and module documentation
- [AdCP Protocol Comparison](https://docs.adcontextprotocol.org/docs/building/understanding/protocol-comparison) -- MCP vs A2A design philosophy
- [AdCP Media Buy Protocol](https://docs.adcontextprotocol.org/docs/media-buy) -- Standard media buy lifecycle specification
