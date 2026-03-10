---
layout: page_v2
title: Prebid Sales Agent
description: Reference implementation of the AdCP Media Buy protocol enabling AI agents to discover and purchase advertising inventory
sidebarType: 10
---

# Prebid Sales Agent
{: .no_toc}

- TOC
{:toc}

## What Is the Sales Agent

The Prebid Sales Agent is a reference implementation server that exposes publisher advertising inventory to AI agents through the [Ad Context Protocol (AdCP)](https://docs.adcontextprotocol.org/docs/intro). It acts as the bridge between AI buying agents and ad servers like Google Ad Manager, Kevel, Triton Digital, and Broadstreet.

The Sales Agent supports three transport protocols — MCP (Model Context Protocol), A2A (Agent-to-Agent), and REST — so AI agents can discover products, create campaigns, upload creatives, and monitor delivery through a standardized interface regardless of the underlying ad server.

<div class="alert alert-info" role="alert">
  For the full source code and latest updates, visit the <a href="https://github.com/prebid/salesagent">prebid/salesagent repository</a>.
</div>

## Key Features

### For AI Agents

- **Product Discovery**: Search for advertising products using natural language briefs or structured filters. AI-powered ranking matches agent intent to publisher inventory.
- **Campaign Creation**: Create media buys with targeting, budgets, and flight dates through a normalized workflow that works across any ad server.
- **Creative Management**: Upload, validate, and track approval of creative assets. Supports AI provenance metadata for EU AI Act compliance.
- **Performance Monitoring**: Access real-time delivery metrics including impressions, spend, CTR, viewability, and pacing data.
- **Signal Activation**: Leverage audience signals from external data providers to improve campaign targeting.

### For Publishers

- **Multi-Tenant System**: Complete data isolation per publisher with composite primary keys and tenant-scoped database queries.
- **Five Ad Server Adapters**: Production integrations with Google Ad Manager, Kevel, Triton Digital, Broadstreet, and a Mock adapter for testing.
- **Admin Dashboard**: Full-featured web UI with SSE-powered live activity feed, product catalog management, and advertiser configuration.
- **Workflow Management**: Human-in-the-loop approval system for media buys and creatives with configurable auto-approve thresholds.
- **Flexible Authentication**: Per-tenant SSO configuration supporting Google, Microsoft, Okta, Auth0, and Keycloak OIDC providers.
- **Audit Logging**: Complete operational history tracking every tool invocation with tenant, principal, operation, and outcome details.

### For Developers

- **MCP Protocol**: FastMCP-based tool interface for direct integration with AI assistants like Claude Desktop.
- **A2A Protocol**: JSON-RPC 2.0 Agent-to-Agent protocol with AgentCard discovery and task lifecycle management.
- **REST API**: Standard HTTP endpoints for programmatic access to all tools.
- **Docker Deployment**: Single-command setup for local development; guides for Fly.io and Google Cloud Run production deployments.
- **Adapter Pattern**: Clean abstract interface for adding new ad server integrations.

## Architecture at a Glance

The Sales Agent follows a four-layer architecture with strict separation of concerns:

```text
┌─────────────────────────────────────────────────────┐
│  Transport Layer (MCP / A2A / REST)                 │
│  FastMCP SSE │ JSON-RPC 2.0 │ FastAPI               │
├─────────────────────────────────────────────────────┤
│  Auth & Identity Resolution                         │
│  Token extraction → ResolvedIdentity                │
├─────────────────────────────────────────────────────┤
│  Business Logic (_impl functions)                   │
│  Transport-agnostic │ Takes ResolvedIdentity        │
├─────────────────────────────────────────────────────┤
│  Adapter Layer                                      │
│  GAM │ Kevel │ Triton │ Broadstreet │ Mock          │
└─────────────────────────────────────────────────────┘
         │
         ▼
   Ad Server APIs
```

All three transports call the same `_impl` business logic functions, ensuring identical behavior regardless of protocol. This is enforced by structural test guards.

For full details, see [Architecture & Protocols](/agents/salesagent/architecture.html).

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
| MCP Server | `/mcp/` | FastMCP SSE endpoint |
| A2A Server | `/a2a` | JSON-RPC 2.0 endpoint |
| Health Check | `/health` | Service readiness |
| Agent Card | `/.well-known/agent.json` | A2A discovery |

Test the MCP interface:

```bash
uvx adcp http://localhost:8000/mcp/ --auth test-token list_tools
uvx adcp http://localhost:8000/mcp/ --auth test-token get_products
```

For complete setup instructions, see the [Quick Start Guide](/agents/salesagent/getting-started/quickstart.html).

## The AdContext Protocol (AdCP)

The Sales Agent is built on the **Ad Context Protocol (AdCP)**, an open standard that normalizes how AI agents interact with advertising platforms. AdCP sits on top of standard AI interaction protocols (MCP and A2A) and defines:

- **Product Discovery** (`get_products`): Search for ad products using natural language or structured filters.
- **Media Buying** (`create_media_buy`): Normalized proposal, booking, and management workflow.
- **Creative Management** (`sync_creatives`): Standardized creative upload, validation, and approval.
- **Signal Activation** (`get_signals`, `activate_signal`): Audience data integration for better targeting.
- **Performance Reporting** (`get_media_buy_delivery`): Unified delivery metrics across ad servers.

<div class="alert alert-info" role="alert">
  For the complete AdCP specification, visit <a href="https://docs.adcontextprotocol.org/docs/intro">docs.adcontextprotocol.org</a>.
</div>

### Typical Campaign Workflow

1. **Discovery**: Agent calls `get_products` with a brief like "video ads targeting US sports fans" and receives matching products with pricing.
2. **Planning**: Agent calls `create_media_buy` with selected products, budget, targeting, and flight dates.
3. **Creative Upload**: Agent calls `sync_creatives` to upload ad assets matching the required formats.
4. **Review**: Publisher reviews the proposal (automated or human-in-the-loop depending on configuration).
5. **Execution**: Sales Agent pushes approved orders to the configured ad server.
6. **Monitoring**: Agent polls `get_media_buy_delivery` for impression, spend, and pacing data.

## Further Reading

- [Architecture & Protocols](/agents/salesagent/architecture.html) — System design, protocol comparison, database schema
- [Quick Start](/agents/salesagent/getting-started/quickstart.html) — Docker setup in 2 minutes
- [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html) — End-to-end publisher setup
- [Buy-Side Integration](/agents/salesagent/getting-started/buy-side-integration.html) — Connect an AI buying agent
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) — Complete catalog of all MCP tools
- [Signal Tools](/agents/salesagent/tools/signals-tools.html) — Audience signal discovery and activation
- [Deployment Overview](/agents/salesagent/deployment/deployment-overview.html) — Docker, Fly.io, and GCP options
- [Glossary](/agents/salesagent/glossary.html) — Key terms and definitions
- [Contributing](/agents/salesagent/developers/contributing.html) — How to contribute to the project
