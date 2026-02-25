---
layout: page_v2
title: Prebid Sales Agent - Getting Started - Quick Start
description: Docker quickstart guide for deploying the Prebid Sales Agent in minutes
sidebarType: 10
---

# Quick Start
{: .no_toc}

Get the Prebid Sales Agent running locally in minutes using Docker. This guide covers two deployment options, first-time setup, and verifying your installation.

- TOC
{:toc}

## Prerequisites

Before you begin, ensure you have the following installed:

{: .table .table-bordered .table-striped }
| Requirement | Minimum Version | Notes |
|-------------|----------------|-------|
| Docker | 20.10+ | [Install Docker](https://docs.docker.com/get-docker/) |
| Docker Compose | 2.0+ | Included with Docker Desktop |

{: .alert.alert-info :}
No Python, Node.js, or other runtime is needed -- everything runs inside Docker containers.

## Option 1: Docker Run (Existing Database)

If you already have a PostgreSQL database, you can run the Sales Agent container directly:

```bash
docker run -d \
  --name salesagent \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/salesagent \
  -e ENCRYPTION_KEY=your-encryption-key \
  -e CREATE_DEMO_TENANT=true \
  -e ADCP_AUTH_TEST_MODE=true \
  ghcr.io/prebid/salesagent:latest
```

{: .alert.alert-warning :}
`ADCP_AUTH_TEST_MODE=true` enables test credentials and should never be used in production. See [Configuration](/agents/salesagent/getting-started/configuration.html) for production settings.

## Option 2: Clone and Run (Includes PostgreSQL)

This is the recommended approach for local development and evaluation. It starts both the Sales Agent and a bundled PostgreSQL database:

```bash
git clone https://github.com/prebid/salesagent.git
cd salesagent
docker compose up -d
```

Docker Compose will start:

- **PostgreSQL** on port 5432 (internal)
- **Sales Agent** on port 8000 (exposed)

Database migrations run automatically on first startup.

## First-Time Setup

### Setup Mode

On first launch with no tenants configured, the Sales Agent enters **Setup Mode**. This provides a guided workflow to create your first publisher tenant.

1. Navigate to `http://localhost:8000/admin`
2. The setup wizard will walk you through creating your first tenant
3. Configure your publisher name and domain

### Test Credentials

When `ADCP_AUTH_TEST_MODE=true` is set, the following test credentials are available:

{: .table .table-bordered .table-striped }
| Credential | Value | Purpose |
|------------|-------|---------|
| Admin UI password | `test123` | Access the admin dashboard |
| MCP auth token | `test-token` | Authenticate MCP tool calls |
| A2A bearer token | `test-token` | Authenticate A2A requests |

### Local Testing with Demo Tenant

For quick evaluation, set `CREATE_DEMO_TENANT=true` to automatically create a demo publisher tenant with sample products and advertisers:

```bash
CREATE_DEMO_TENANT=true docker compose up -d
```

This populates the system with realistic demo data so you can immediately test the MCP and A2A interfaces without manual configuration.

## Verify Your Installation

After startup, verify that all services are running:

{: .table .table-bordered .table-striped }
| Service | URL | Expected Result |
|---------|-----|-----------------|
| Admin UI | `http://localhost:8000/admin` | Login page or setup wizard |
| MCP Server | `http://localhost:8000/mcp/` | MCP endpoint (requires auth) |
| A2A Server | `http://localhost:8000/a2a` | A2A endpoint (requires auth) |
| Health Check | `http://localhost:8000/health` | `{"status": "ok"}` |
| Agent Card | `http://localhost:8000/.well-known/agent.json` | JSON agent descriptor |

### Test with CLI Commands

Use the `adcp` CLI tool to verify MCP connectivity:

```bash
# List available tools
uvx adcp http://localhost:8000/mcp/ --auth test-token list_tools

# Search for products
uvx adcp http://localhost:8000/mcp/ --auth test-token get_products '{"brief":"video"}'

# Check capabilities
uvx adcp http://localhost:8000/mcp/ --auth test-token get_adcp_capabilities
```

## Connecting an AI Agent

Once your Sales Agent is running, you can connect an AI buying agent using the MCP Python client:

```python
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

transport = StreamableHttpTransport(
    "http://localhost:8000/mcp/",
    headers={"x-adcp-auth": "test-token"}
)

async with Client(transport) as client:
    # Discover available tools
    tools = await client.list_tools()
    print(f"Available tools: {[t.name for t in tools]}")

    # Get products
    result = await client.call_tool("get_products", {"brief": "homepage banner"})
    print(result)
```

{: .alert.alert-info :}
For complete buy-side integration details, see [Buy-Side Integration](/agents/salesagent/getting-started/buy-side-integration.html).

## Common Docker Commands

{: .table .table-bordered .table-striped }
| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start all services in background |
| `docker compose down` | Stop all services |
| `docker compose logs -f` | Follow live logs |
| `docker compose logs salesagent` | View Sales Agent logs only |
| `docker compose restart salesagent` | Restart the Sales Agent |
| `docker compose down -v` | Stop and remove all data volumes |
| `docker compose pull` | Pull latest images |

## Troubleshooting

### Container fails to start

Check the logs for error details:

```bash
docker compose logs salesagent
```

Common issues:

- **Database connection refused** -- Ensure PostgreSQL is running and `DATABASE_URL` is correct
- **Port 8000 already in use** -- Stop the conflicting service or change the port mapping in `docker-compose.yml`
- **Migration errors** -- Try removing volumes and restarting: `docker compose down -v && docker compose up -d`

### MCP endpoint returns 401

Ensure you are passing the auth token in the correct header:

- MCP: `x-adcp-auth: test-token`
- A2A: `Authorization: Bearer test-token`

### Health check returns unhealthy

The health endpoint checks database connectivity. Verify your PostgreSQL instance is accessible:

```bash
docker compose exec salesagent python -c "from app.database import engine; print('DB OK')"
```

{: .alert.alert-danger :}
If you encounter persistent issues, check the [GitHub Issues](https://github.com/prebid/salesagent/issues) page or open a new issue with your Docker logs.

## Next Steps

- [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html) -- Configure SSO, products, and advertisers
- [Configuration Reference](/agents/salesagent/getting-started/configuration.html) -- Full environment variable reference
- [Deployment Guide](/agents/salesagent/deployment/single-tenant.html) -- Production deployment with Nginx and HTTPS
