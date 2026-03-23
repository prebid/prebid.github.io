---
layout: page_v2
title: Prebid Sales Agent - Architecture
description: System architecture and protocol design
sidebarType: 10
---

# Architecture
{: .no_toc}

- TOC
{:toc}

## System Architecture

The Sales Agent is a single-process FastAPI application behind an nginx reverse proxy. It serves MCP, A2A, and REST protocols through a shared business logic layer.

{: .alert.alert-info :}
As of v1.5.0, the application uses a unified process model. The previous multi-process architecture (separate MCP, A2A, and Admin processes on ports 8001/8091) was replaced by a single FastAPI app on port 8080.

```text
                    ┌───────────────────────────┐
                    │      AI Buying Agents      │
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
          │  /mcp/   → FastMCP (StreamableHTTP)          │
          │  /a2a    → A2A Server (JSON-RPC 2.0)         │
          │  /admin  → Flask Admin UI (OIDC SSO)         │
          │  /api/v1 → REST API (FastAPI)                │
          ├──────────────────────────────────────────────┤
          │         Auth & Identity Resolution            │
          │    UnifiedAuthMiddleware (ASGI)               │
          │    Token → AuthContext → ResolvedIdentity     │
          ├──────────────────────────────────────────────┤
          │         Business Logic (_impl functions)      │
          │    Transport-agnostic implementation          │
          ├──────────────────────────────────────────────┤
          │         Adapter Layer                         │
          │    GAM │ Kevel │ Triton │ Broadstreet │ Mock  │
          └──────────────────────┬─────────────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │    Ad Server APIs          │
                    │  + PostgreSQL 17            │
                    └───────────────────────────┘
```

### Request Lifecycle

1. An AI agent sends a request to `http://host:8000/{protocol-path}`.
2. nginx proxies to the FastAPI app on port 8080.
3. FastAPI routes to the correct sub-application based on URL prefix.
4. `UnifiedAuthMiddleware` extracts the token from `x-adcp-auth` or `Authorization: Bearer`.
5. The middleware creates an `AuthContext` and stores it in the ASGI scope.
6. The transport layer resolves `AuthContext` into a `ResolvedIdentity` (tenant + principal).
7. The transport layer calls the `_impl` function with the `ResolvedIdentity`.
8. The `_impl` function executes business logic via the database and ad server adapter.
9. The response is serialized back through the transport layer.

### Transport Parity

All three protocols call the same `_impl` business logic functions. This ensures identical behavior regardless of protocol. Seven structural test guards enforce this:

- No transport-specific imports in `_impl` modules
- All `_impl` functions accept `ResolvedIdentity` (not transport-specific contexts)
- `_impl` functions raise `AdCPError` (not transport-specific errors like `ToolError`)

## Protocol Comparison

{: .table .table-bordered .table-striped }
| Aspect | MCP | A2A | REST |
|--------|-----|-----|------|
| Transport | StreamableHTTP | JSON-RPC 2.0 | HTTP JSON |
| Library | FastMCP >= 3.0.2 | a2a-sdk >= 0.3.19 | FastAPI |
| Path | `/mcp/` | `/a2a` | `/api/v1` |
| Auth | `x-adcp-auth` or `Bearer` | Same | Same |
| Discovery | MCP `list_tools` | Agent card at `/.well-known/agent-card.json` | `GET /api/v1/capabilities` |
| Streaming | SSE for updates | Push notifications via webhook | Polling |
| Best for | AI assistants (Claude, Cursor) | Agent-to-agent orchestration | Scripts, traditional integrations |

## Registered Tools

The Sales Agent registers 11 tools, accessible identically via MCP, A2A, and REST:

{: .table .table-bordered .table-striped }
| Tool | Category | Auth | Description |
|------|----------|------|-------------|
| `get_adcp_capabilities` | Discovery | Optional | Tenant capabilities, formats, targeting |
| `get_products` | Discovery | Optional | Product catalog search |
| `list_creative_formats` | Discovery | Optional | Creative format specs |
| `list_authorized_properties` | Discovery | Optional | Publisher domains and policies |
| `create_media_buy` | Media Buy | Required | Create a campaign |
| `update_media_buy` | Media Buy | Required | Modify an existing campaign |
| `get_media_buys` | Media Buy | Required | Query campaigns |
| `get_media_buy_delivery` | Media Buy | Required | Delivery metrics |
| `sync_creatives` | Creative | Required | Upload/update creatives |
| `list_creatives` | Creative | Required | List creatives by status/format |
| `update_performance_index` | Performance | Required | AI performance feedback |

{: .alert.alert-warning :}
Signal tools (`get_signals`, `activate_signal`) are not part of the Sales Agent. These are handled by dedicated signals agents in the AdCP ecosystem.

## Multi-Tenancy

All tenant-scoped entities use composite primary keys `(tenant_id, entity_id)`. Every database query is scoped to the current tenant via the `ResolvedIdentity`.

{: .table .table-bordered .table-striped }
| Mode | Routing | Use Case |
|------|---------|----------|
| Single-Tenant (default) | Path-based | Single publisher, development |
| Multi-Tenant | Subdomain (`pub1.salesagent.example.com`) | SaaS deployment |

## Database

PostgreSQL 17 with SQLAlchemy 2.0 and Alembic (156 migration files).

{: .table .table-bordered .table-striped }
| Table | Purpose |
|-------|---------|
| `tenants` | Publisher accounts with configuration |
| `principals` | Advertiser accounts with auth tokens |
| `products` | Advertising product catalog |
| `pricing_options` | Pricing models for products |
| `media_buys` | Campaign proposals and orders |
| `creatives` | Creative assets with approval status |
| `workflow_steps` | Approval tasks |
| `audit_logs` | Operational history |
| `adapter_config` | Per-tenant ad server configuration |
| `users` | Admin UI accounts |
| `creative_agents` | Creative agent registrations |
| `signals_agents` | Signals agent registrations |

{: .alert.alert-info :}
Migrations run automatically on startup unless `SKIP_MIGRATIONS=true` is set. Back up your database before upgrading versions.

## Adapter Pattern

The `AdServerAdapter` base class (`src/adapters/base.py`) defines the interface all adapters implement.

{: .table .table-bordered .table-striped }
| Adapter | Module | Channels | Status |
|---------|--------|----------|--------|
| [Google Ad Manager](/agents/salesagent/integrations/gam.html) | `src/adapters/gam/` | display, olv, social | Production |
| [Kevel](/agents/salesagent/integrations/kevel.html) | `src/adapters/kevel.py` | display | Implemented |
| [Triton Digital](/agents/salesagent/integrations/triton-digital.html) | `src/adapters/triton_digital.py` | audio | Implemented |
| [Broadstreet](/agents/salesagent/integrations/broadstreet.html) | `src/adapters/broadstreet/` | display | In development |
| [Mock](/agents/salesagent/integrations/mock-adapter.html) | `src/adapters/mock_ad_server.py` | all | Testing |

Xandr (`src/adapters/xandr.py`) exists in the codebase but is incomplete.

## Authentication

Four levels of authentication:

1. **Super Admin** -- Unrestricted access. Identified by `SUPER_ADMIN_EMAILS` or `SUPER_ADMIN_DOMAINS` env vars.
2. **OIDC SSO** -- Admin UI users authenticate via per-tenant OIDC (Google, Microsoft, Okta, Auth0, Keycloak).
3. **Tenant Admin** -- Manages a single publisher's configuration.
4. **Principal Token** -- AI agents authenticate via `x-adcp-auth` or `Bearer` token, identifying both tenant and advertiser.

{: .alert.alert-warning :}
Per-tenant SSO configured through the Admin UI is the recommended authentication method. Global OAuth via environment variables (`GOOGLE_CLIENT_ID`, etc.) is deprecated.

## AI Integration

The Sales Agent uses [Pydantic AI](https://ai.pydantic.dev/) (>= 0.3.0) for AI features, configured per-tenant through the Admin UI.

{: .table .table-bordered .table-striped }
| Agent | Path | Purpose |
|-------|------|---------|
| Naming | `src/services/ai/agents/naming_agent.py` | Order/line item name generation |
| Review | `src/services/ai/agents/review_agent.py` | Creative policy compliance scoring |
| Ranking | `src/services/ai/agents/ranking_agent.py` | Product relevance ranking for briefs |
| Policy | `src/services/ai/agents/policy_agent.py` | Campaign policy checking |

Supported providers:

{: .table .table-bordered .table-striped }
| Provider | Key | Notes |
|----------|-----|-------|
| Google Gemini | `gemini` | Default provider |
| OpenAI | `openai` | GPT models |
| Anthropic | `anthropic` | Claude models |
| Groq | `groq` | Fast inference |
| AWS Bedrock | `bedrock` | AWS-hosted models |

{: .alert.alert-info :}
Gemini API keys are configured per-tenant through the Admin UI under Settings > AI Configuration. The global `GEMINI_API_KEY` environment variable serves as a fallback default.

## Error Handling

All errors extend `AdCPError` with three fields: `message`, `recovery`, and `details`.

Recovery hints use `RecoveryHint = Literal["transient", "correctable", "terminal"]`:

- **transient** -- Retry after a delay (e.g., adapter timeout, rate limit)
- **correctable** -- Fix the input and retry (e.g., validation error, missing field)
- **terminal** -- Cannot succeed as-is (e.g., insufficient permissions)

See [Error Codes](/agents/salesagent/reference/error-codes.html) for the complete catalog.

## Source Code Organization

```text
src/
  app.py                       — FastAPI entry point (unified app)
  core/
    tools/                     — MCP tool implementations
      discovery.py             — get_adcp_capabilities
      products.py              — get_products
      media_buy.py             — create_media_buy, update_media_buy
      media_buy_list.py        — get_media_buys
      media_buy_delivery.py    — get_media_buy_delivery
      creatives.py             — sync_creatives, list_creatives
      creative_formats.py      — list_creative_formats
      properties.py            — list_authorized_properties
      performance.py           — update_performance_index
    schemas/                   — Pydantic request/response schemas
    database/                  — SQLAlchemy models, Alembic migrations
    auth_middleware.py         — UnifiedAuthMiddleware (ASGI)
    exceptions.py              — AdCPError hierarchy
    resolved_identity.py       — ResolvedIdentity dataclass
  adapters/
    base.py                    — AdServerAdapter abstract base
    gam/                       — Google Ad Manager (production)
    mock_ad_server.py          — Mock adapter (testing)
    kevel.py                   — Kevel adapter
    triton_digital.py          — Triton Digital adapter
    broadstreet/               — Broadstreet adapter (in development)
  a2a_server/                  — A2A protocol implementation
  admin/
    app.py                     — Flask app factory
    blueprints/                — ~26 Flask blueprints
  services/
    ai/
      agents/                  — AI agents (naming, review, ranking, policy)
      config.py                — TenantAIConfig
      factory.py               — AIServiceFactory
  routes/
    api_v1.py                  — REST API endpoints
```

## Further Reading

- [Quick Start](/agents/salesagent/getting-started/quickstart.html) -- Docker setup
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- All MCP tools
- [Error Codes](/agents/salesagent/reference/error-codes.html) -- Error catalog
- [Deployment Overview](/agents/salesagent/deployment/deployment-overview.html) -- Docker, Fly.io, GCP
- [Glossary](/agents/salesagent/glossary.html) -- Key terms
