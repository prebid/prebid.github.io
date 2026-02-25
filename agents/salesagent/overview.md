---
layout: page_v2
title: Prebid Sales Agent - Overview
description: Overview of the Prebid Sales Agent, a reference implementation of the AdCP Media Buy protocol for AI-driven advertising
sidebarType: 10
---

# Prebid Sales Agent Overview
{: .no_toc}

The Prebid Sales Agent is a server that exposes advertising inventory to AI agents via the Model Context Protocol (MCP) and Agent-to-Agent (A2A) protocol. It is the reference implementation of the [Ad Context Protocol (AdCP)](https://adcontextprotocol.org).

- TOC
{:toc}

## What is the Prebid Sales Agent?

The Sales Agent sits between AI buying agents and publisher ad servers (such as Google Ad Manager), translating standardized AdCP requests into platform-specific operations. It handles the full campaign lifecycle — from product discovery to delivery reporting.

{: .alert.alert-info :}
For the full source code and latest updates, visit the [prebid/salesagent repository](https://github.com/prebid/salesagent).

### Three-Role Model

AdCP defines three roles in AI-driven advertising:

{: .table .table-bordered .table-striped }
| Role | Description | Example |
|------|-------------|---------|
| **Publisher (Sales Agent)** | Exposes inventory to AI agents, manages campaigns, integrates with ad servers | Prebid Sales Agent |
| **Buyer (Buying Agent)** | Discovers products and executes media buys on behalf of advertisers | Claude, custom AI agents, orchestrators |
| **Orchestrator** | Coordinates multi-agent workflows across multiple sales agents | Scope3, custom platforms |

The Prebid Sales Agent serves the **Publisher** role.

## Key Capabilities

### For AI Agents

- **Product Discovery** — Natural language search for advertising products using AI/RAG
- **Campaign Creation** — Automated media buying with targeting, budget, and flight dates
- **Creative Management** — Upload, sync, and manage creative assets with format validation
- **Performance Monitoring** — Real-time access to campaign delivery metrics and spend

### For Publishers

- **Multi-Tenant System** — Isolated data per publisher with composite identity model
- **Adapter Pattern** — Pluggable ad server integrations (Google Ad Manager, mock, and more)
- **Real-time Dashboard** — Live activity feed powered by Server-Sent Events (SSE)
- **Workflow Management** — Human-in-the-loop approval queue for media buys and creatives
- **Admin Interface** — Web UI with OAuth and role-based access control
- **Audit Logging** — Complete operational history for compliance and debugging

### For Developers

- **MCP Protocol** — FastMCP with HTTP/SSE streamable transport at `/mcp/`
- **A2A Protocol** — JSON-RPC 2.0 agent-to-agent communication at `/a2a`
- **Docker Deployment** — Production-ready containers with bundled PostgreSQL
- **Testing** — Unit, integration, and E2E test suites with mock adapter

## Protocol Support

The Sales Agent exposes identical functionality through two protocols:

**MCP (Model Context Protocol)** — The primary interface for AI assistants. Uses FastMCP with HTTP/SSE streamable transport. Authentication via `x-adcp-auth` header token.

**A2A (Agent-to-Agent Protocol)** — For complex multi-agent workflows. JSON-RPC 2.0 compliant with agent discovery at `/.well-known/agent.json`. Authentication via `Authorization: Bearer` header.

{: .alert.alert-info :}
For details on protocol architecture and comparison, see [Architecture & Protocols](/agents/salesagent/architecture.html).

## Quick Start

Try the Sales Agent locally with Docker:

```bash
git clone https://github.com/prebid/salesagent.git
cd salesagent
docker compose up -d
```

Access services at `http://localhost:8000`:

{: .table .table-bordered .table-striped }
| Service | URL | Notes |
|---------|-----|-------|
| Admin UI | `/admin` | Test credentials: `test123` |
| MCP Server | `/mcp/` | Token auth required |
| A2A Server | `/a2a` | Bearer auth required |
| Health Check | `/health` | No auth needed |

Test the MCP interface:

```bash
uvx adcp http://localhost:8000/mcp/ --auth test-token list_tools
uvx adcp http://localhost:8000/mcp/ --auth test-token get_products '{"brief":"video"}'
```

{: .alert.alert-info :}
For the full setup guide, see [Quick Start](/agents/salesagent/getting-started/quickstart.html).

## Architecture

The project follows a four-layer architecture isolating protocol handling, business logic, and ad server integrations:

```text
┌─────────────────────────────────────────────────────┐
│                  Admin UI (Flask)                    │
└─────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────┐
│               MCP Server (FastMCP)                  │
│              A2A Server (JSON-RPC)                  │
└─────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL   │  │  Ad Server   │  │   Gemini     │
│   Database    │  │  Adapters    │  │   AI API     │
└───────────────┘  └──────────────┘  └──────────────┘
```

{: .alert.alert-info :}
For the full architecture and system design details, see [Architecture & Protocols](/agents/salesagent/architecture.html).

## Further Reading

- [Quick Start](/agents/salesagent/getting-started/quickstart.html) — Get running in 2 minutes with Docker
- [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html) — End-to-end publisher setup guide
- [Buy-Side Integration](/agents/salesagent/getting-started/buy-side-integration.html) — Connect an AI buying agent
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) — Complete catalog of MCP tools
- [AdCP Introduction](https://docs.adcontextprotocol.org/docs/intro) — Protocol specification and concepts
