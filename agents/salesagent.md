---
layout: page_v2
title: Prebid Sales Agent
description: Server connecting AI buying agents to ad servers via AdCP
sidebarType: 10
---

# Prebid Sales Agent
{: .no_toc}

- TOC
{:toc}

## Overview

The Prebid Sales Agent is a server that connects AI buying agents to publisher ad servers using the [Ad Context Protocol (AdCP)](https://docs.adcontextprotocol.org/docs/intro). It handles product discovery, campaign creation, creative management, and delivery reporting across multiple ad servers through a single interface.

The Sales Agent supports three transport protocols: MCP (Model Context Protocol), A2A (Agent-to-Agent), and REST. All three call the same business logic layer, so behavior is identical regardless of which protocol an agent uses.

{: .alert.alert-info :}
The Sales Agent is built on AdCP v3.6 and requires Python 3.12+. For the source code and latest updates, see the [prebid/salesagent repository](https://github.com/prebid/salesagent).

## Features

- **Product discovery** -- searches products by relevance to the agent's query using natural language briefs or structured filters.
- **Campaign creation** -- creates media buys with targeting, budgets, and flight dates through a workflow that works across ad servers.
- **Creative management** -- uploads, validates, and tracks approval of creative assets. Supports AI provenance metadata.
- **Delivery reporting** -- provides impression, spend, CTR, viewability, and pacing data from the underlying ad server.
- **Multi-tenant isolation** -- each publisher's data is isolated via composite primary keys and tenant-scoped queries.
- **Ad server adapters** for Google Ad Manager, Kevel, Triton Digital, and Broadstreet, plus a Mock adapter for testing.
- **Admin dashboard** -- web UI with SSE-powered live activity feed, product catalog management, and advertiser configuration.
- **Workflow approvals** -- human-in-the-loop approval for media buys and creatives, with configurable auto-approve thresholds.
- **Authentication** -- per-tenant SSO configuration supporting Google, Microsoft, Okta, Auth0, and Keycloak OIDC providers.
- **Audit logging** -- tracks every tool invocation with tenant, principal, operation, and outcome.
- **Adapter pattern** -- abstract interface for adding new ad server integrations.

## Architecture

The Sales Agent follows a four-layer architecture:

```text
┌─────────────────────────────────────────────────────┐
│  Transport Layer (MCP / A2A / REST)                 │
├─────────────────────────────────────────────────────┤
│  Auth & Identity Resolution                         │
├─────────────────────────────────────────────────────┤
│  Business Logic (_impl functions)                   │
├─────────────────────────────────────────────────────┤
│  Adapter Layer                                      │
│  GAM │ Kevel │ Triton │ Broadstreet │ Mock          │
└─────────────────────────────────────────────────────┘
         │
         ▼
   Ad Server APIs
```

All three transports call the same `_impl` functions, ensuring identical behavior regardless of protocol. This is enforced by structural test guards.

For details on the protocol layer, database schema, and adapter design, see [Architecture](/agents/salesagent/architecture.html).

## Quick Start

```bash
git clone https://github.com/prebid/salesagent.git
cd salesagent
docker compose up -d
```

Access services at `http://localhost:8000`:

{: .table .table-bordered .table-striped }
| Service | URL | Notes |
|---------|-----|-------|
| Admin UI | `/admin` | Test login with `test_super_admin@example.com` / `test123` |
| MCP Server | `/mcp/` | StreamableHTTP endpoint |
| A2A Server | `/a2a` | JSON-RPC 2.0 endpoint |
| Health Check | `/health` | Service readiness |
| Agent Card | `/.well-known/agent-card.json` | A2A discovery |

Test the MCP interface:

```bash
uvx adcp http://localhost:8000/mcp/ --auth test-token list_tools
uvx adcp http://localhost:8000/mcp/ --auth test-token get_products
```

{: .alert.alert-warning :}
The default test credentials are for local development only. Configure per-tenant SSO through the Admin UI before exposing the service externally. See [Security](/agents/salesagent/operations/security.html).

For complete setup instructions, see the [Quick Start Guide](/agents/salesagent/getting-started/quickstart.html).

## The AdContext Protocol (AdCP)

The Sales Agent implements the [Ad Context Protocol (AdCP)](https://docs.adcontextprotocol.org/docs/intro), an open standard that defines how AI agents interact with advertising platforms. AdCP sits on top of MCP and A2A and defines tool semantics for:

- **Product discovery** (`get_products`) -- search for ad products using natural language or structured filters.
- **Media buying** (`create_media_buy`) -- proposal, booking, and management workflow.
- **Creative management** (`sync_creatives`) -- creative upload, validation, and approval tracking.
- **Delivery reporting** (`get_media_buy_delivery`) -- delivery metrics across ad servers.

### Typical Workflow

1. **Discovery**: Agent calls `get_products` with a brief like "video ads targeting US sports fans" and receives matching products with pricing.
2. **Planning**: Agent calls `create_media_buy` with selected products, budget, targeting, and flight dates.
3. **Creative upload**: Agent calls `sync_creatives` to upload ad assets matching the required formats.
4. **Review**: Publisher reviews the proposal (automated or human-in-the-loop depending on configuration).
5. **Execution**: Sales Agent pushes approved orders to the configured ad server.
6. **Monitoring**: Agent polls `get_media_buy_delivery` for impression, spend, and pacing data.

## Limitations

{: .alert.alert-warning :}
The Sales Agent is under active development. Not all ad server adapters have reached production status. Check the [GitHub repository](https://github.com/prebid/salesagent) for the latest supported features and known issues.

- The Broadstreet adapter is in design phase and not yet production-ready.
- Signal tools (audience data discovery and activation) are not part of the Sales Agent. These are handled by dedicated signals agents.
- Some Admin UI configuration workflows require direct config file editing.

## Further Reading

- [Architecture](/agents/salesagent/architecture.html) -- system design, protocol comparison, database schema
- [Quick Start](/agents/salesagent/getting-started/quickstart.html) -- Docker setup in under 5 minutes
- [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html) -- end-to-end publisher setup
- [Buy-Side Integration](/agents/salesagent/getting-started/buy-side-integration.html) -- connect an AI buying agent
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- complete catalog of all MCP tools
- [Deployment Overview](/agents/salesagent/deployment/deployment-overview.html) -- Docker, Fly.io, and GCP options
- [Glossary](/agents/salesagent/glossary.html) -- key terms and definitions
- [Contributing](/agents/salesagent/developers/contributing.html) -- how to contribute to the project
