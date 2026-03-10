---
layout: page_v2
title: Prebid Sales Agent - Buy-Side Integration Guide
description: Guide for AI agent developers to discover inventory and purchase advertising through the Prebid Sales Agent
sidebarType: 10
---

# Prebid Sales Agent - Buy-Side Integration Guide
{: .no_toc}

- TOC
{:toc}

## Overview

This guide is for developers building AI agents that buy advertising. The Prebid Sales Agent exposes publisher inventory through three protocols — MCP, A2A, and REST — so your agent can discover products, create campaigns, upload creatives, and monitor delivery through a standardized interface.

Your agent needs:

1. A **principal token** issued by the publisher (the authentication credential).
2. The **Sales Agent URL** (e.g., `https://publisher.salesagent.example.com`).
3. A client for one of the three supported protocols.

## Authentication

All execution operations require a valid principal token. The publisher creates an advertiser account (principal) for you and provides the token.

Include the token in every request using one of these headers:

```text
x-adcp-auth: your-principal-token
```

or:

```text
Authorization: Bearer your-principal-token
```

Both headers are equivalent. The `x-adcp-auth` header is the AdCP convention; `Authorization: Bearer` is the standard HTTP alternative.

<div class="alert alert-info" role="alert">
  Discovery operations (<code>get_adcp_capabilities</code>, <code>get_products</code>, <code>list_creative_formats</code>, <code>list_authorized_properties</code>) can be called without authentication to browse available inventory. However, execution operations (<code>create_media_buy</code>, <code>sync_creatives</code>, etc.) always require a valid token.
</div>

## Connecting via MCP

The Model Context Protocol (MCP) is the recommended protocol for AI assistants like Claude Desktop, Cursor, and custom LLM-based agents.

### Python Client (FastMCP)

```python
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

transport = StreamableHttpTransport(
    "https://publisher.salesagent.example.com/mcp/",
    headers={"x-adcp-auth": "your-principal-token"}
)

async with Client(transport=transport) as client:
    # Discover available tools
    tools = await client.list_tools()

    # Search for products
    products = await client.call_tool(
        "get_products",
        {"brief": "display ads targeting US tech professionals"}
    )

    # Create a media buy
    media_buy = await client.call_tool(
        "create_media_buy",
        {
            "product_id": "prod-001",
            "name": "Q2 Tech Campaign",
            "start_date": "2026-04-01",
            "end_date": "2026-06-30",
            "budget": 50000,
            "currency": "USD",
            "pricing_model": "cpm"
        }
    )
```

### Claude Desktop Configuration

Add the Sales Agent to Claude Desktop's MCP server configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "publisher-salesagent": {
      "url": "https://publisher.salesagent.example.com/mcp/",
      "headers": {
        "x-adcp-auth": "your-principal-token"
      }
    }
  }
}
```

After restarting Claude Desktop, the Sales Agent's tools become available in conversation.

## Connecting via A2A

The Agent-to-Agent (A2A) protocol is designed for agent-to-agent orchestration using JSON-RPC 2.0.

### AgentCard Discovery

Before sending requests, fetch the AgentCard to discover the agent's capabilities:

```bash
curl https://publisher.salesagent.example.com/.well-known/agent-card.json
```

The AgentCard returns the agent's identity, supported skills (including four auth-optional discovery skills), authentication requirements, and endpoint URLs.

### Sending a Task

```bash
curl -X POST https://publisher.salesagent.example.com/a2a \
  -H "Content-Type: application/json" \
  -H "x-adcp-auth: your-principal-token" \
  -d '{
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
            "text": "Find premium video ad products with at least 80% viewability"
          }
        ]
      }
    }
  }'
```

### Task Lifecycle

A2A tasks follow a state machine:

```text
submitted → working → completed
                   → failed
                   → canceled
```

- **submitted**: Your request was received.
- **working**: The Sales Agent is processing the request. For long operations, subscribe to push notifications.
- **completed**: Results are available in the task's `artifacts` array.
- **failed**: An error occurred. Check the task's error details.
- **canceled**: The task was canceled (by your agent or the server).

### Push Notifications

For long-running operations, include a `pushNotification` configuration in your task to receive webhook callbacks when the task state changes:

```json
{
  "jsonrpc": "2.0",
  "id": "req-002",
  "method": "tasks/send",
  "params": {
    "id": "task-002",
    "message": {
      "role": "user",
      "parts": [{"type": "text", "text": "Create a media buy..."}]
    },
    "pushNotification": {
      "url": "https://your-agent.example.com/webhooks/a2a"
    }
  }
}
```

## Connecting via REST API

The REST API provides standard HTTP endpoints for programmatic access.

### Base URL

```text
https://publisher.salesagent.example.com/api/v1
```

### Example: List Products

```bash
curl https://publisher.salesagent.example.com/api/v1/products \
  -H "x-adcp-auth: your-principal-token"
```

### Example: Create a Media Buy

```bash
curl -X POST https://publisher.salesagent.example.com/api/v1/media-buys \
  -H "Content-Type: application/json" \
  -H "x-adcp-auth: your-principal-token" \
  -d '{
    "product_id": "prod-001",
    "name": "Q2 Tech Campaign",
    "start_date": "2026-04-01",
    "end_date": "2026-06-30",
    "budget": 50000,
    "currency": "USD",
    "pricing_model": "cpm"
  }'
```

### Example: Get Delivery Metrics

```bash
curl https://publisher.salesagent.example.com/api/v1/media-buys/mb-001/delivery \
  -H "x-adcp-auth: your-principal-token"
```

### Key REST Endpoints

{: .table .table-bordered .table-striped }
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/capabilities` | Optional | Tenant capabilities and adapter info |
| GET | `/api/v1/products` | Optional | List or search products |
| GET | `/api/v1/creative-formats` | Optional | Supported creative formats |
| GET | `/api/v1/properties` | Optional | Authorized properties |
| POST | `/api/v1/media-buys` | Required | Create a media buy |
| PATCH | `/api/v1/media-buys/{id}` | Required | Update a media buy |
| GET | `/api/v1/media-buys` | Required | List your media buys |
| GET | `/api/v1/media-buys/{id}/delivery` | Required | Delivery metrics |
| POST | `/api/v1/media-buys/{id}/creatives` | Required | Sync creatives |
| GET | `/api/v1/media-buys/{id}/creatives` | Required | List creatives |
| POST | `/api/v1/performance-index` | Required | Update performance index |

## Discovery Workflow

Before buying, your agent should discover what the publisher offers. These four calls can be made without authentication:

### Step 1: Get Capabilities

```python
capabilities = await client.call_tool("get_adcp_capabilities", {})
```

Returns the tenant's supported features, configured adapter, available channels, and targeting capabilities.

### Step 2: Browse Products

```python
products = await client.call_tool("get_products", {
    "brief": "video ads for sports fans aged 18-34"
})
```

Returns matching products ranked by relevance to your brief. Each product includes name, description, pricing options, accepted creative formats, targeting parameters, and delivery type.

### Step 3: Check Creative Formats

```python
formats = await client.call_tool("list_creative_formats", {})
```

Returns the full list of supported creative specifications (dimensions, file types, max file sizes, duration limits for video/audio).

### Step 4: List Properties

```python
properties = await client.call_tool("list_authorized_properties", {})
```

Returns the sites and apps where you can target ads, along with their audience profiles and available inventory.

## Buying Workflow

Once you have discovered the right product, follow this workflow to purchase:

### Step 1: Create a Media Buy

```python
media_buy = await client.call_tool("create_media_buy", {
    "product_id": "prod-001",
    "name": "Q2 Sports Video Campaign",
    "start_date": "2026-04-01",
    "end_date": "2026-06-30",
    "budget": 50000,
    "currency": "USD",
    "pricing_model": "cpm",
    "targeting": {
        "geo": ["US"],
        "audience": ["sports-enthusiasts"],
        "age_range": "18-34"
    }
})
media_buy_id = media_buy["media_buy_id"]
```

### Step 2: Upload Creatives

```python
creatives = await client.call_tool("sync_creatives", {
    "media_buy_id": media_buy_id,
    "creatives": [
        {
            "name": "Sports Hero Video 30s",
            "format_id": "video-preroll-30s",
            "asset_url": "https://cdn.example.com/ads/sports-hero-30s.mp4",
            "click_through_url": "https://advertiser.example.com/landing"
        }
    ]
})
```

### Step 3: Monitor Delivery

```python
delivery = await client.call_tool("get_media_buy_delivery", {
    "media_buy_id": media_buy_id
})
# Returns: impressions, clicks, spend, CTR, viewability, pacing data
```

## Handling Approval Workflows

Publishers may configure human-in-the-loop approval for media buys and creatives. When approval is required, the media buy enters `pending_activation` status and publishers review it through the Admin UI or Slack notifications.

### Waiting for Publisher Approval

Your agent should poll the media buy status periodically:

```python
import asyncio

while True:
    media_buy = await client.call_tool("get_media_buys", {
        "media_buy_id": media_buy_id
    })
    status = media_buy["status"]
    if status in ("approved", "active", "delivering"):
        print("Media buy approved!")
        break
    elif status in ("rejected", "canceled"):
        print(f"Media buy {status}.")
        break
    await asyncio.sleep(60)  # Poll every minute
```

## Complete Example

This Python example demonstrates the full workflow from discovery through delivery monitoring:

```python
import asyncio
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

SALES_AGENT_URL = "https://publisher.salesagent.example.com/mcp/"
AUTH_TOKEN = "your-principal-token"

async def run_campaign():
    transport = StreamableHttpTransport(
        SALES_AGENT_URL,
        headers={"x-adcp-auth": AUTH_TOKEN}
    )

    async with Client(transport=transport) as client:

        # --- Step 1: Discovery ---
        print("Discovering capabilities...")
        capabilities = await client.call_tool("get_adcp_capabilities", {})
        print(f"Adapter: {capabilities}")

        # --- Step 2: Find Products ---
        print("Searching for products...")
        products = await client.call_tool("get_products", {
            "brief": "premium video ads for US sports fans, $50k budget"
        })
        if not products:
            print("No matching products found.")
            return

        # Select the top-ranked product
        product = products[0]
        product_id = product["id"]
        print(f"Selected product: {product['name']}")

        # --- Step 3: Check Creative Requirements ---
        formats = await client.call_tool("list_creative_formats", {})
        print(f"Supported formats: {[f['name'] for f in formats]}")

        # --- Step 4: Create Media Buy ---
        print("Creating media buy...")
        media_buy = await client.call_tool("create_media_buy", {
            "product_id": product_id,
            "name": "Q2 Sports Video Campaign",
            "start_date": "2026-04-01",
            "end_date": "2026-06-30",
            "budget": 50000,
            "currency": "USD",
            "pricing_model": "cpm"
        })
        media_buy_id = media_buy["media_buy_id"]
        print(f"Media buy created: {media_buy_id}")

        # --- Step 5: Upload Creatives ---
        print("Uploading creatives...")
        await client.call_tool("sync_creatives", {
            "media_buy_id": media_buy_id,
            "creatives": [
                {
                    "name": "Sports Hero Video 30s",
                    "format_id": "video-preroll-30s",
                    "asset_url": "https://cdn.example.com/ads/sports-30s.mp4",
                    "click_through_url": "https://advertiser.example.com/sports"
                }
            ]
        })
        print("Creatives uploaded.")

        # --- Step 6: Wait for Approval ---
        print("Waiting for publisher approval...")
        while True:
            buys = await client.call_tool("get_media_buys", {})
            current = next(
                (b for b in buys if b["media_buy_id"] == media_buy_id),
                None
            )
            if current and current["status"] in (
                "approved", "active", "delivering"
            ):
                print(f"Status: {current['status']}")
                break
            elif current and current["status"] in ("rejected", "canceled"):
                print(f"Media buy {current['status']}.")
                return
            await asyncio.sleep(30)

        # --- Step 7: Monitor Delivery ---
        print("Monitoring delivery...")
        delivery = await client.call_tool("get_media_buy_delivery", {
            "media_buy_id": media_buy_id
        })
        print(f"Impressions: {delivery.get('impressions', 0)}")
        print(f"Spend: ${delivery.get('spend', 0):.2f}")
        print(f"CTR: {delivery.get('ctr', 0):.2%}")
        print(f"Pacing: {delivery.get('pacing', 'N/A')}")

asyncio.run(run_campaign())
```

## Error Handling

The Sales Agent returns structured errors with codes and recovery classifications.

### Error Types

All errors are subclasses of `AdCPError` and include a `recovery` hint for the calling agent.

{: .table .table-bordered .table-striped }
| Error Class | HTTP Status | Description |
|-------------|-------------|-------------|
| `AdCPAuthenticationError` | 401 | No valid token provided or token expired/revoked |
| `AdCPAuthorizationError` | 403 | Token valid but lacks permission for this operation |
| `AdCPNotFoundError` | 404 | Requested resource does not exist |
| `AdCPValidationError` | 422 | Request parameters failed validation |
| `AdCPPolicyError` | 422 | Request violates publisher advertising policies |
| `AdCPBudgetError` | 422 | Requested budget exceeds configured limits |
| `AdCPAdapterError` | 502 | The underlying ad server returned an error |
| `AdCPConfigurationError` | 500 | Server misconfiguration (e.g., missing adapter) |
| `AdCPRateLimitError` | 429 | Too many requests |
| `AdCPInternalError` | 500 | Unexpected server error |

For the full error catalog with format examples across all protocols, see the [Error Codes Reference](/agents/salesagent/reference/error-codes.html).

### Recovery Classification

Each error carries a `recovery` hint:

{: .table .table-bordered .table-striped }
| Classification | Meaning | Action |
|---------------|---------|--------|
| **terminal** | The request cannot succeed as-is | Do not retry (e.g., authentication failure, authorization denied) |
| **correctable** | The request can succeed with changes | Modify parameters and retry (e.g., validation error, policy violation, budget exceeded) |
| **transient** | Temporary failure | Retry with exponential backoff (e.g., ad server timeout, rate limit, internal error) |

### Example Error Response (MCP)

```json
{
  "isError": true,
  "content": [
    {
      "type": "text",
      "text": "POLICY_VIOLATION: Creative contains content in blocked category 'gambling'. Remove gambling references and resubmit."
    }
  ]
}
```

### Retry Strategy

For transient errors, implement exponential backoff:

```python
import asyncio
import random

async def call_with_retry(client, tool, params, max_retries=3):
    for attempt in range(max_retries):
        try:
            return await client.call_tool(tool, params)
        except Exception as e:
            if "transient" not in str(e) or attempt == max_retries - 1:
                raise
            delay = (2 ** attempt) + random.uniform(0, 1)
            await asyncio.sleep(delay)
```

## Further Reading

- [Architecture & Protocols](/agents/salesagent/architecture.html) — Protocol details, transport parity, database design
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) — Complete catalog of all MCP tools with parameters and examples
- [Quick Start](/agents/salesagent/getting-started/quickstart.html) — Set up a local Sales Agent for testing
- [Configuration Reference](/agents/salesagent/getting-started/configuration.html) — Environment variables and settings
