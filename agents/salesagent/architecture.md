---
layout: page_v2
title: Prebid Sales Agent - Architecture & Protocols
description: System architecture, protocol comparison, database design, and adapter pattern for the Prebid Sales Agent
sidebarType: 10
---

# Prebid Sales Agent - Architecture & Protocols
{: .no_toc}

- TOC
{:toc}

## System Architecture

The Prebid Sales Agent follows a four-layer architecture with strict separation of concerns. An nginx reverse proxy (port 8000) sits in front of a unified FastAPI application (port 8080) that multiplexes four sub-applications based on URL path.

```text
                    ┌───────────────────────────┐
                    │      AI Buying Agents      │
                    │  Claude / GPT / Custom     │
                    └────────────┬──────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │    nginx (port 8000)       │
                    │    Reverse Proxy / SSL     │
                    └────────────┬──────────────┘
                                 │
          ┌──────────────────────▼──────────────────────┐
          │         FastAPI Unified App (port 8080)      │
          │                                              │
          │  /mcp  → FastMCP Server (SSE transport)      │
          │  /a2a  → A2A Server (JSON-RPC 2.0)           │
          │  /admin → Flask Admin UI (Google OAuth)      │
          │  /api/v1 → REST API (FastAPI)                │
          │  /     → Tenant Landing Pages                │
          ├──────────────────────────────────────────────┤
          │         Auth & Identity Resolution            │
          │    UnifiedAuthMiddleware (ASGI)               │
          │    Token → AuthContext → ResolvedIdentity     │
          ├──────────────────────────────────────────────┤
          │         Business Logic (_impl functions)      │
          │    Transport-agnostic implementation          │
          │    All _impl functions take ResolvedIdentity  │
          ├──────────────────────────────────────────────┤
          │         Adapter Layer                         │
          │    GAM │ Kevel │ Triton │ Broadstreet │ Mock  │
          └──────────────────────┬─────────────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │    Ad Server APIs          │
                    │  + PostgreSQL Database      │
                    └───────────────────────────┘
```

### Request Lifecycle

1. An AI agent sends a request to `http://host:8000/{protocol-path}`.
2. nginx proxies the request to the FastAPI app on port 8080.
3. The FastAPI app routes to the correct sub-application based on the URL prefix (`/mcp`, `/a2a`, `/api/v1`, or `/admin`).
4. `UnifiedAuthMiddleware` (ASGI middleware) extracts the authentication token from the `x-adcp-auth` header or `Authorization: Bearer` header.
5. The middleware creates an `AuthContext` and stores it in the ASGI scope.
6. The transport layer resolves the `AuthContext` into a `ResolvedIdentity` containing `tenant_id`, `principal_id`, and permissions.
7. The transport layer calls the appropriate `_impl` function, passing the `ResolvedIdentity`.
8. The `_impl` function executes business logic, interacting with the database and ad server adapter as needed.
9. The response is serialized back through the transport layer to the agent.

### Transport Parity

A core architectural principle is **transport parity**: all three protocols (MCP, A2A, REST) call the same `_impl` business logic functions. This ensures identical behavior regardless of which protocol an agent uses.

Structural test guards enforce this principle:

- No transport-specific imports are allowed in `_impl` modules.
- All `_impl` functions must accept `ResolvedIdentity` as their identity parameter (not transport-specific contexts).
- `_impl` functions must raise `AdCPError` (not transport-specific error types like `ToolError`).

## Protocol Comparison: MCP vs A2A vs REST

{: .table .table-bordered .table-striped }
| Aspect | MCP | A2A | REST |
|--------|-----|-----|------|
| **Transport** | HTTP + Server-Sent Events (SSE) | HTTP (JSON-RPC 2.0) | HTTP (JSON) |
| **Library** | FastMCP >= 3.0.2 | a2a-sdk >= 0.3.19 | FastAPI |
| **Path Prefix** | `/mcp/` | `/a2a` | `/api/v1` |
| **Auth Header** | `x-adcp-auth` or `Authorization: Bearer` | `x-adcp-auth` or `Authorization: Bearer` | `x-adcp-auth` or `Authorization: Bearer` |
| **Discovery** | `list_tools` via MCP protocol | `GET /.well-known/agent.json` (AgentCard) | `GET /api/v1/capabilities` |
| **Response Format** | MCP tool results (JSON content blocks) | JSON-RPC 2.0 responses with task artifacts | JSON response bodies |
| **Streaming** | SSE for real-time updates | Push notifications via webhook | Polling |
| **Best For** | AI assistants (Claude Desktop, Cursor) | Agent-to-agent orchestration | Traditional integrations, scripts |

## MCP (Model Context Protocol)

The Sales Agent implements the MCP protocol using the [FastMCP](https://github.com/jlowin/fastmcp) library, providing a tool-based interface over Server-Sent Events (SSE).

### Endpoint

```
POST /mcp/
```

### Tool Registration

Tools are registered in `src/core/main.py` using FastMCP decorators. Each tool maps to an `_impl` function:

```python
@mcp.tool()
async def get_products(ctx: Context, brief: str = None) -> list[Product]:
    identity = await resolve_identity(ctx)
    return await get_products_impl(identity, brief=brief)
```

### Context Headers

MCP clients pass two custom headers to identify themselves:

{: .table .table-bordered .table-striped }
| Header | Required | Description |
|--------|----------|-------------|
| `x-adcp-auth` | Yes | Principal authentication token (alternative: `Authorization: Bearer <token>`) |
| `x-context-id` | No | Optional context identifier for session tracking and audit correlation |

### Registered MCP Tools

{: .table .table-bordered .table-striped }
| Tool | Category | Description |
|------|----------|-------------|
| `get_adcp_capabilities` | Discovery | Returns tenant capabilities, supported formats, and adapter info |
| `get_products` | Discovery | Search products by brief or structured filters |
| `list_creative_formats` | Discovery | List supported creative formats and specifications |
| `list_authorized_properties` | Discovery | List properties (sites/apps) the principal can target |
| `create_media_buy` | Execution | Create a new media buy (campaign proposal) |
| `update_media_buy` | Execution | Modify an existing media buy |
| `get_media_buys` | Execution | List media buys for the authenticated principal |
| `get_media_buy_delivery` | Reporting | Get delivery metrics for a media buy |
| `sync_creatives` | Creative | Upload or update creative assets |
| `list_creatives` | Creative | List creatives associated with a media buy |
| `get_signals` | Signal | Discover available audience signals and segments |
| `activate_signal` | Signal | Activate a signal segment for campaign targeting |
| `list_tasks` | Workflow | List pending workflow tasks (approvals, reviews) |
| `get_task` | Workflow | Get details of a specific workflow task |
| `complete_task` | Workflow | Complete a workflow task (approve/reject) |
| `update_performance_index` | Reporting | Update the performance index for optimization |

### Testing with the CLI

```bash
# List all available tools
uvx adcp http://localhost:8000/mcp/ --auth test-token list_tools

# Call a specific tool
uvx adcp http://localhost:8000/mcp/ --auth test-token get_products
```

## A2A (Agent-to-Agent Protocol)

The Sales Agent implements the [A2A protocol](https://google.github.io/A2A/) using the `a2a-sdk` library, exposing an Agent-to-Agent interface via JSON-RPC 2.0.

### Endpoint

```
POST /a2a
```

### AgentCard Discovery

The A2A protocol uses an AgentCard for service discovery. The Sales Agent serves this at the standard well-known path:

```
GET /.well-known/agent.json
```

The AgentCard describes the agent's identity, capabilities, supported skills, and authentication requirements. AI orchestrators fetch this card to understand what the Sales Agent can do before sending requests.

### Task Lifecycle

A2A operations follow a task lifecycle with defined states:

```text
submitted → working → completed
                   → failed
                   → canceled
```

1. **submitted**: The agent sends a JSON-RPC 2.0 request. A task is created in `submitted` state.
2. **working**: The Sales Agent begins processing. For long-running operations, push notifications can be sent to a configured webhook URL.
3. **completed**: The task finishes successfully. Results are returned as task artifacts.
4. **failed**: The task encountered an error. Error details are attached to the task.
5. **canceled**: The task was canceled by the requesting agent.

### Discovery Skills (Auth-Optional)

Four skills are exposed without requiring authentication, allowing agents to discover capabilities before authenticating:

- `get_adcp_capabilities`
- `list_creative_formats`
- `list_authorized_properties`
- `get_products`

### Push Notifications

The A2A server supports push notifications for asynchronous task updates. When a task transitions state, the server can POST a notification to a webhook URL provided by the client in the original request.

### Example JSON-RPC Request

```json
{
  "jsonrpc": "2.0",
  "id": "req-001",
  "method": "tasks/send",
  "params": {
    "id": "task-001",
    "message": {
      "role": "user",
      "parts": [
        {
          "type": "text",
          "text": "Find video ad products targeting US sports fans with a $50,000 budget"
        }
      ]
    }
  }
}
```

## REST API

The Sales Agent also provides a standard REST API built with FastAPI for traditional HTTP integrations.

### Endpoint Prefix

```
/api/v1
```

### Authentication

- **Discovery endpoints** (capabilities, products, formats, properties): Auth-optional — can be called without a token to browse available inventory.
- **Execution endpoints** (media buys, creatives, tasks): Auth-required — must include a valid principal token.

### Key Endpoints

{: .table .table-bordered .table-striped }
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/capabilities` | Optional | Tenant capabilities and adapter info |
| GET | `/api/v1/products` | Optional | List or search products |
| GET | `/api/v1/creative-formats` | Optional | Supported creative formats |
| GET | `/api/v1/properties` | Optional | Authorized properties |
| POST | `/api/v1/media-buys` | Required | Create a media buy |
| PATCH | `/api/v1/media-buys/{id}` | Required | Update a media buy |
| GET | `/api/v1/media-buys` | Required | List media buys |
| GET | `/api/v1/media-buys/{id}/delivery` | Required | Get delivery metrics |
| POST | `/api/v1/media-buys/{id}/creatives` | Required | Sync creatives |
| GET | `/api/v1/media-buys/{id}/creatives` | Required | List creatives |
| GET | `/api/v1/tasks` | Required | List workflow tasks |
| GET | `/api/v1/tasks/{id}` | Required | Get task details |
| POST | `/api/v1/tasks/{id}/complete` | Required | Complete a task |

## Multi-Tenancy Model

The Sales Agent supports complete multi-tenant isolation, allowing a single deployment to serve multiple publishers.

### Composite Primary Keys

All tenant-scoped entities use composite primary keys of the form `(tenant_id, entity_id)`. This ensures that data belonging to one publisher can never leak to another, even in the case of application bugs.

### Tenant Isolation

Every database query is scoped to the current tenant. The `ResolvedIdentity` carries the `tenant_id`, and all service-layer functions filter by it.

### Deployment Modes

{: .table .table-bordered .table-striped }
| Mode | Routing | Use Case |
|------|---------|----------|
| **Single-Tenant** (default) | Path-based routing | Single publisher deployment, development, testing |
| **Multi-Tenant** | Subdomain-based routing (`publisher1.salesagent.example.com`) | SaaS deployment serving multiple publishers |

To enable multi-tenant mode, set:

```bash
ADCP_MULTI_TENANT=true
SALES_AGENT_DOMAIN=salesagent.example.com
BASE_DOMAIN=example.com
```

## Database Architecture

The Sales Agent uses PostgreSQL with SQLAlchemy 2.0 as the ORM and Alembic for schema migrations.

### Core Tables

{: .table .table-bordered .table-striped }
| Table | Purpose |
|-------|---------|
| `tenants` | Publisher accounts with configuration |
| `principals` | Advertiser/buyer accounts with auth tokens |
| `products` | Advertising products in the catalog |
| `pricing_options` | Pricing models attached to products |
| `media_buys` | Campaign proposals and active orders |
| `creatives` | Creative assets with approval status |
| `workflow_steps` | Human-in-the-loop approval tasks |
| `audit_logs` | Complete operational history |
| `adapter_config` | Per-tenant ad server configuration |
| `inventory_profiles` | Inventory categorization and metadata |
| `contexts` | Session and conversation tracking |
| `strategies` | Campaign optimization strategies |
| `currency_limits` | Per-tenant budget and currency constraints |
| `creative_agents` | AI creative review agent configuration |
| `signals_agents` | AI signals agent configuration |
| `auth_config` | Per-tenant SSO/OIDC configuration |
| `users` | Admin UI user accounts |

### Migrations

The project uses Alembic for database schema migrations, with over 150 migration files tracking the full evolution of the schema. Migrations run automatically on startup unless `SKIP_MIGRATIONS=true` is set.

## Adapter Pattern

The Sales Agent uses an abstract adapter pattern to normalize interactions with different ad servers. All ad server operations go through a common interface, making it possible to swap ad servers without changing business logic.

### Abstract Interface

The base class `AdServerAdapter` (defined in `src/adapters/base.py`) requires implementations to provide:

- `create_media_buy()` — Push a media buy to the ad server
- `update_media_buy()` — Modify an existing media buy
- `get_media_buy_delivery()` — Fetch delivery metrics
- `check_media_buy_status()` — Check current status
- `upload_creatives()` — Upload creative assets

Each adapter also declares:

- `adapter_name` — Unique string identifier
- `default_channels` — Default media channels (e.g., display, video, audio)
- `capabilities` — An `AdapterCapabilities` dataclass describing what the adapter supports
- `connection_config_class` — Pydantic model for adapter-specific connection settings

### Available Adapters

{: .table .table-bordered .table-striped }
| Adapter | Module | Channels | Description |
|---------|--------|----------|-------------|
| **[Google Ad Manager](/agents/salesagent/integrations/gam.html)** | `src/adapters/gam/` | Display, Video | Full production integration with GAM API (googleads 49.0.0) |
| **[Kevel](/agents/salesagent/integrations/kevel.html)** | `src/adapters/kevel.py` | Display | Kevel (formerly Adzerk) ad server integration |
| **[Triton Digital](/agents/salesagent/integrations/triton-digital.html)** | `src/adapters/triton_digital.py` | Audio | Audio/podcast advertising via Triton Digital |
| **[Broadstreet](/agents/salesagent/integrations/broadstreet.html)** | `src/adapters/broadstreet/` | Display | Broadstreet direct-sold ad server integration |
| **[Mock Adapter](/agents/salesagent/integrations/mock-adapter.html)** | `src/adapters/mock_ad_server.py` | All | In-memory mock for testing and development |

### Selecting an Adapter

Adapters are configured per-tenant through the Admin UI under **Settings > Ad Server**. The adapter selection determines which ad server receives media buys, creatives, and delivery queries for that publisher.

For integrating a custom ad server, see [Building a Custom Adapter](/agents/salesagent/integrations/custom-adapter.html).

## Authentication Layers

The Sales Agent implements four levels of authentication to support different use cases.

### Level 1: Super Admin

Super admins have unrestricted access to all tenants and system configuration. They are identified by email address configured in the `SUPER_ADMIN_EMAILS` or `SUPER_ADMIN_DOMAINS` environment variables.

### Level 2: OAuth / SSO (Admin UI)

Admin UI users authenticate via OAuth. The default provider is Google OAuth, but each tenant can configure their own OIDC provider (Google, Microsoft, Okta, Auth0, or Keycloak) through the Admin UI.

### Level 3: Tenant Admin

Tenant admins manage a single publisher's configuration including products, pricing, adapters, policies, and advertiser accounts. They are granted access through the Admin UI.

### Level 4: Principal Token (API/MCP/A2A)

AI agents authenticate using principal tokens issued by publishers. These tokens are passed via the `x-adcp-auth` header or `Authorization: Bearer` header and identify both the tenant and the specific advertiser (principal).

### Authentication Middleware

The `UnifiedAuthMiddleware` is an ASGI middleware (`src/core/auth_middleware.py`) that intercepts every request:

1. Extracts the token from `x-adcp-auth` or `Authorization: Bearer` headers.
2. Validates the token against the database.
3. Creates an `AuthContext` containing tenant and principal information.
4. Stores the `AuthContext` in the ASGI scope for downstream use.
5. Transport layers resolve the `AuthContext` into a `ResolvedIdentity`.

## AI Integration

The Sales Agent integrates AI capabilities using [Pydantic AI](https://ai.pydantic.dev/) (pydantic-ai >= 0.3.0) with a multi-provider factory system for structured, type-safe agent interactions. AI features are configurable per-tenant through the Admin UI, including provider, model, and API key.

### AI Agents

{: .table .table-bordered .table-striped }
| Agent | Module | Purpose |
|-------|--------|---------|
| **Naming Agent** | `src/services/ai/agents/naming_agent.py` | Generates human-readable order and line item names from campaign metadata |
| **Review Agent** | `src/services/ai/agents/review_agent.py` | Reviews creative assets for policy compliance with confidence scoring |
| **Ranking Agent** | `src/services/ai/agents/ranking_agent.py` | Ranks products by relevance to a buyer's brief |
| **Policy Agent** | `src/services/ai/agents/policy_agent.py` | Checks campaign content against advertising policies |

#### Naming Agent

The Naming Agent generates human-readable order and line item names from campaign metadata. It accepts campaign details such as advertiser name, product, flight dates, and targeting information, and returns a formatted order name string. A configurable `max_length` parameter controls output length.

#### Review Agent

The Review Agent reviews creative assets for policy compliance. Given creative content, review criteria, and the tenant's advertising policies, it returns a decision of **APPROVE**, **REQUIRE HUMAN APPROVAL**, or **REJECT** along with a confidence score between 0.0 and 1.0. The confidence score is evaluated against the tenant's `creative_auto_approve_threshold` (default 0.9) and `creative_auto_reject_threshold` (default 0.1) to determine whether human review is needed.

#### Ranking Agent

The Ranking Agent ranks products by relevance to a buyer's brief. Given a product catalog and a natural language brief, it returns relevance scores (0.0 to 1.0) per product, sorted by match quality. Tenants can customize ranking behavior through the `product_ranking_prompt` setting in the Admin UI.

#### Policy Agent

The Policy Agent checks campaign content against advertising policies. It takes campaign details and the tenant's `advertising_policy` configuration (blocked categories, tactics, and brands) and returns a status of **allowed**, **restricted**, or **blocked** with supporting reasons.

### AI Configuration System

AI provider configuration is managed by `TenantAIConfig` (`src/services/ai/config.py`) and `AIServiceFactory` (`src/services/ai/factory.py`).

**`TenantAIConfig` dataclass fields:**

{: .table .table-bordered .table-striped }
| Field | Description |
|-------|-------------|
| `provider` | AI provider name (e.g., `"google-gla"`, `"anthropic"`, `"openai"`) |
| `model` | Specific model version (e.g., `"gemini-2.0-flash"`) |
| `api_key` | Provider API key for this tenant |
| `logfire_token` | Optional Logfire token for AI call tracing |
| `settings` | Dict with `temperature`, `max_tokens`, and `timeout` overrides |

**`AIServiceFactory` supported providers:**

{: .table .table-bordered .table-striped }
| Provider | Key | Notes |
|----------|-----|-------|
| Google Gemini | `google-gla` | Default provider; platform-level key via `GEMINI_API_KEY` env var |
| Anthropic Claude | `anthropic` | Claude models |
| OpenAI | `openai` | GPT models |
| Groq | `groq` | Fast inference |
| Mistral | `mistral` | Mistral models |
| Cohere | `cohere` | Cohere models |
| Gateway | `gateway` | Custom gateway providers |

**Configuration hierarchy:**

1. **Platform-level defaults** -- The `GEMINI_API_KEY` environment variable provides a default Google Gemini key for all tenants.
2. **Per-tenant overrides** -- Each tenant's `ai_config` JSONB column on the Tenant model stores provider, model, and API key overrides. Configure these in the Admin UI under **Settings > AI Configuration**.
3. **Logfire observability** -- When a `logfire_token` is configured (at the platform or tenant level), all AI agent calls are traced and visible in the Logfire dashboard for debugging and cost monitoring.

### Per-Tenant Configuration

Each tenant can configure AI independently:

- **Provider**: Choose between AI providers (e.g., Google Gemini, OpenAI).
- **Model**: Select the specific model version.
- **API Key**: Provide the tenant's own API key for cost isolation.
- **Thresholds**: Set confidence score thresholds for auto-approval of creatives and media buys.

## Source Code Organization

```text
src/
  core/
    main.py                  — FastMCP app initialization, tool registration
    auth_middleware.py        — UnifiedAuthMiddleware (ASGI)
    tools/                   — MCP tool implementations
      products.py            — get_products
      media_buy_create.py    — create_media_buy
      media_buy_update.py    — update_media_buy
      media_buy_query.py     — get_media_buys, get_media_buy_delivery
      capabilities.py        — get_adcp_capabilities
      properties.py          — list_authorized_properties
      signals.py             — Signal activation tools
      task_management.py     — list_tasks, get_task, complete_task
      creatives/             — sync_creatives, list_creatives
      performance.py         — update_performance_index
      creative_formats.py    — list_creative_formats
    schemas/                 — Pydantic schemas
      product.py             — Product, PricingOption models
      creative.py            — Creative, CreativeAsset models
      delivery.py            — DeliveryMetrics, PacingData models
      _base.py               — Base schema classes
    database/                — SQLAlchemy models, session management, Alembic migrations
    services/                — Business logic services
    transport_helpers.py     — Identity resolution from FastMCP context
  adapters/
    base.py                  — AdServerAdapter, AdapterCapabilities, TargetingCapabilities
    gam/                     — Google Ad Manager adapter (client, auth, managers/)
    kevel.py                 — Kevel adapter
    triton_digital.py        — Triton Digital adapter
    broadstreet/             — Broadstreet adapter
    mock_ad_server.py        — Mock adapter for testing
  admin/
    app.py                   — Flask app factory
    blueprints/              — ~20 Flask blueprints
      tenants/               — Tenant management
      products/              — Product catalog
      creatives/             — Creative management
      media_buys/            — Media buy management
      principals/            — Advertiser accounts
      adapters/              — Ad server configuration
      settings/              — Tenant settings
      users/                 — User management
      activity_stream/       — Live activity feed (SSE)
      workflows/             — Approval workflows
      signals_agents/        — Signals agent configuration
      creative_agents/       — Creative review agent configuration
    services/                — Dashboard, activity feed, readiness checks
  a2a_server/
    adcp_a2a_server.py       — A2A RequestHandler, JSON-RPC 2.0 implementation
  routes/
    api_v1.py                — REST API endpoint definitions
    health.py                — Health check endpoint
  services/
    ai/                      — AI agent implementations
      naming_agent.py        — Campaign name generation
      review_agent.py        — Creative review with confidence scores
      ranking_agent.py       — Product ranking for briefs
      policy_agent.py        — Policy compliance checking
  landing/                   — Tenant landing pages
scripts/
  deploy/
    run_all_services.py      — Main entrypoint for Docker deployment
tests/
  unit/                      — No-database unit tests
  integration/               — PostgreSQL-required integration tests
  e2e/                       — Docker-required end-to-end tests
  conftest.py                — Shared pytest fixtures
  conftest_db.py             — Database-specific fixtures
  factories/                 — Test data factories
  fixtures/                  — Static test fixtures
  harness/                   — Test harness utilities
```

## Further Reading

- [Quick Start](/agents/salesagent/getting-started/quickstart.html) — Get running in 2 minutes with Docker
- [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html) — Full publisher setup guide
- [Buy-Side Integration](/agents/salesagent/getting-started/buy-side-integration.html) — Connect an AI buying agent
- [Configuration Reference](/agents/salesagent/getting-started/configuration.html) — Environment variables and settings
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) — Complete catalog of MCP tools
- [Signal Tools](/agents/salesagent/tools/signals-tools.html) — Audience signal retrieval and activation
- [Glossary](/agents/salesagent/glossary.html) — Key terms and definitions
