---
layout: page_v2
title: Prebid Sales Agent - Quick Start
description: Get the Prebid Sales Agent running locally with Docker in under 5 minutes
sidebarType: 10
---

# Prebid Sales Agent - Quick Start
{: .no_toc}

- TOC
{:toc}

## Prerequisites

Before you begin, ensure you have the following installed:

{: .table .table-bordered .table-striped }
| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| Docker | 20.10+ | `docker --version` |
| Docker Compose | 2.0+ | `docker compose version` |
| git | Any recent version | `git --version` |

<div class="alert alert-info" role="alert">
  The Sales Agent runs entirely in Docker containers. You do not need Python, PostgreSQL, or nginx installed on your host machine.
</div>

## Clone and Start

```bash
git clone https://github.com/prebid/salesagent.git
cd salesagent
docker compose up -d
```

Docker Compose will start the following containers:

- **salesagent** — The unified FastAPI application (nginx + app)
- **postgres** — PostgreSQL database
- Alembic migrations run automatically on first startup

The first build may take a few minutes while Docker downloads base images and installs dependencies.

## Verify Installation

Once the containers are running, verify that all services are accessible at `http://localhost:8000`:

{: .table .table-bordered .table-striped }
| Service | URL | Purpose |
|---------|-----|---------|
| Admin UI | [http://localhost:8000/admin](http://localhost:8000/admin) | Publisher administration dashboard |
| MCP Server | [http://localhost:8000/mcp/](http://localhost:8000/mcp/) | FastMCP StreamableHTTP endpoint for AI agents |
| A2A Server | [http://localhost:8000/a2a](http://localhost:8000/a2a) | JSON-RPC 2.0 Agent-to-Agent endpoint |
| Health Check | [http://localhost:8000/health](http://localhost:8000/health) | Service readiness status |
| Agent Card | [http://localhost:8000/.well-known/agent-card.json](http://localhost:8000/.well-known/agent-card.json) | A2A discovery document |

## Test Credentials

The development environment comes pre-configured with test credentials:

{: .table .table-bordered .table-striped }
| Interface | Credential | Value |
|-----------|------------|-------|
| Admin UI | Email | `test_super_admin@example.com` |
| Admin UI | Password | `test123` |
| MCP / A2A / REST | Auth Token | `test-token` |

<div class="alert alert-info" role="alert">
  Test credentials are only available when <code>ADCP_AUTH_TEST_MODE=true</code> (the default in Docker Compose). Never use test mode in production.
</div>

## Your First MCP Call

The easiest way to interact with the Sales Agent is through the `adcp` CLI tool, which communicates over the MCP protocol.

### List Available Tools

```bash
uvx adcp http://localhost:8000/mcp/ --auth test-token list_tools
```

This returns the 11 registered MCP tools: `get_adcp_capabilities`, `get_products`, `list_creative_formats`, `list_authorized_properties`, `create_media_buy`, `update_media_buy`, `get_media_buys`, `get_media_buy_delivery`, `sync_creatives`, `list_creatives`, and `update_performance_index`.

### Browse Products

```bash
uvx adcp http://localhost:8000/mcp/ --auth test-token get_products
```

This returns the product catalog configured for the demo tenant, including product names, descriptions, pricing options, creative formats, and targeting parameters.

### Search with a Brief

```bash
uvx adcp http://localhost:8000/mcp/ --auth test-token get_products \
  --brief "video ads targeting US sports fans with a $25,000 monthly budget"
```

When a `brief` parameter is provided, the AI ranking agent scores and ranks products by relevance to the buyer's intent.

## Your First Campaign

Create a media buy by calling `create_media_buy` with the required parameters:

```bash
uvx adcp http://localhost:8000/mcp/ --auth test-token create_media_buy \
  --product_id "demo-product-001" \
  --name "Q1 Sports Campaign" \
  --start_date "2026-04-01" \
  --end_date "2026-04-30" \
  --budget 25000 \
  --currency "USD" \
  --pricing_model "cpm"
```

The response includes:

- A `media_buy_id` for tracking the campaign
- Current `status` (typically `pending_activation` until publisher approval)
- Any `workflow_tasks` that require completion (e.g., publisher review)

## Connecting an AI Agent

### Python Client (FastMCP)

Use the FastMCP Python client to connect programmatically:

```python
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

transport = StreamableHttpTransport(
    "http://localhost:8000/mcp/",
    headers={"x-adcp-auth": "test-token"}
)

async with Client(transport=transport) as client:
    # List available tools
    tools = await client.list_tools()
    for tool in tools:
        print(f"{tool.name}: {tool.description}")

    # Search for products
    result = await client.call_tool(
        "get_products",
        {"brief": "display ads for tech audience"}
    )
    print(result)
```

### A2A Client (curl)

```bash
curl -X POST http://localhost:8000/a2a \
  -H "Content-Type: application/json" \
  -H "x-adcp-auth: test-token" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tasks/send",
    "params": {
      "id": "task-001",
      "message": {
        "role": "user",
        "parts": [{"type": "text", "text": "List available products"}]
      }
    }
  }'
```

## Claude Desktop Integration

Add the Sales Agent as an MCP server in your Claude Desktop configuration file.

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "salesagent": {
      "url": "http://localhost:8000/mcp/",
      "headers": {
        "x-adcp-auth": "test-token"
      }
    }
  }
}
```

After saving the configuration and restarting Claude Desktop, you can interact with the Sales Agent directly in conversation:

> "Show me the available advertising products."
>
> "Create a display campaign for $10,000 targeting US tech audiences starting next month."
>
> "What's the delivery status of my active campaigns?"

## Common Docker Commands

{: .table .table-bordered .table-striped }
| Action | Command |
|--------|---------|
| View logs (all services) | `docker compose logs -f` |
| View logs (app only) | `docker compose logs -f salesagent` |
| Restart all services | `docker compose restart` |
| Stop all services | `docker compose down` |
| Stop and remove volumes | `docker compose down -v` |
| Rebuild after code changes | `docker compose up -d --build` |
| Run database migrations | `docker compose exec salesagent alembic upgrade head` |
| Open a shell in the container | `docker compose exec salesagent bash` |
| Check container status | `docker compose ps` |

## Troubleshooting

### Port 8000 Already in Use

If port 8000 is occupied by another service, either stop the conflicting service or change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "9000:8000"  # Map to port 9000 instead
```

Then access services at `http://localhost:9000`.

### Database Connection Errors

If you see database connection errors on startup:

1. Check that the PostgreSQL container is running: `docker compose ps`
2. View PostgreSQL logs: `docker compose logs postgres`
3. If the database is corrupt, reset it: `docker compose down -v && docker compose up -d`

### Migration Failures

If Alembic migrations fail on startup:

1. Check migration logs: `docker compose logs salesagent | grep -i alembic`
2. Ensure you are on the latest version: `git pull && docker compose up -d --build`
3. For a clean start, remove the database volume: `docker compose down -v && docker compose up -d`

### Container Won't Start

If the `salesagent` container exits immediately:

1. Check exit logs: `docker compose logs salesagent`
2. Verify Docker has sufficient resources (at least 2 GB RAM recommended)
3. Try rebuilding: `docker compose build --no-cache && docker compose up -d`

### MCP Connection Refused

If `uvx adcp` returns a connection error:

1. Verify the container is running: `docker compose ps`
2. Check that nginx is proxying correctly: `curl http://localhost:8000/health`
3. Ensure you include the trailing slash on the MCP URL: `/mcp/` (not `/mcp`)

## Next Steps

- [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html) — Configure your products, pricing, and ad server
- [Buy-Side Integration](/agents/salesagent/getting-started/buy-side-integration.html) — Build an AI agent that buys media
- [Configuration Reference](/agents/salesagent/getting-started/configuration.html) — Environment variables and advanced settings
- [Architecture & Protocols](/agents/salesagent/architecture.html) — Deep dive into the system design
- [Deployment Overview](/agents/salesagent/deployment/deployment-overview.html) — Production deployment on Fly.io or Google Cloud Run
