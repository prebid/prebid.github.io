---
layout: page_v2
title: Prebid Sales Agent - Protocols
description: MCP and A2A protocol comparison
sidebarType: 10
---

# Protocols: MCP vs A2A
{: .no_toc}

- TOC
{:toc}

## Overview

The Sales Agent exposes 11 tools through two AI agent protocols. Both call identical `_impl` business logic functions, so behavior is the same regardless of protocol. A REST API is also available for non-agent integrations.

## Protocol Comparison

{: .table .table-bordered .table-striped }
| Feature | MCP | A2A |
|---------|-----|-----|
| Transport | StreamableHTTP | JSON-RPC 2.0 |
| Library | FastMCP >= 3.0.2 | a2a-sdk >= 0.3.19 |
| Endpoint | `/mcp/` | `/a2a` |
| Discovery | `list_tools` via MCP protocol | Agent card at `/.well-known/agent-card.json` |
| Auth | `x-adcp-auth` or `Authorization: Bearer` | Same |
| Push notifications | Not supported | Supported (webhook) |
| Best for | AI assistants (Claude, Cursor, GPT) | Agent-to-agent orchestration |

## MCP (Model Context Protocol)

The MCP interface uses [FastMCP](https://github.com/jlowin/fastmcp) with StreamableHTTP transport.

### Connecting via CLI

```bash
# List all tools
uvx adcp http://localhost:8000/mcp/ --auth test-token list_tools

# Call a tool
uvx adcp http://localhost:8000/mcp/ --auth test-token get_products
```

### Connecting via Python

```python
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

transport = StreamableHttpTransport(
    "http://localhost:8000/mcp/",
    headers={"x-adcp-auth": "YOUR_TOKEN"}
)
async with Client(transport=transport) as client:
    tools = await client.list_tools()
    result = await client.call_tool("get_products", {"brief": "video ads"})
```

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "salesagent": {
      "url": "http://localhost:8000/mcp/",
      "headers": {
        "x-adcp-auth": "YOUR_TOKEN"
      }
    }
  }
}
```

## A2A (Agent-to-Agent Protocol)

The A2A interface uses the [a2a-sdk](https://google.github.io/A2A/) with JSON-RPC 2.0 transport.

### Agent Card

The agent card at `/.well-known/agent-card.json` describes the agent's identity, skills, and auth requirements. AI orchestrators fetch this before sending requests.

### Task Lifecycle

A2A operations follow a task lifecycle:

```text
submitted → working → completed
                   → failed
                   → canceled
```

### Push Notifications

The A2A server supports push notifications for async task updates. When a task transitions state, the server POSTs a notification to a webhook URL provided in the original request.

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
          "text": "Find video ad products targeting US sports fans"
        }
      ]
    }
  }
}
```

## Authentication

Both protocols use the same authentication mechanism:

1. Token via `x-adcp-auth` header (preferred) or `Authorization: Bearer`
2. `UnifiedAuthMiddleware` extracts the token and resolves a `ResolvedIdentity`
3. `x-adcp-auth` takes precedence if both headers are present

{: .alert.alert-warning :}
Discovery tools (`get_adcp_capabilities`, `get_products`, `list_creative_formats`, `list_authorized_properties`) may work without authentication depending on tenant configuration. All other tools require a valid token.

## REST API

A standard REST API at `/api/v1` provides HTTP access to all tools for traditional integrations and scripts.

{: .table .table-bordered .table-striped }
| Method | Path | Auth | Maps to |
|--------|------|------|---------|
| GET | `/api/v1/capabilities` | Optional | get_adcp_capabilities |
| GET | `/api/v1/products` | Optional | get_products |
| GET | `/api/v1/creative-formats` | Optional | list_creative_formats |
| GET | `/api/v1/properties` | Optional | list_authorized_properties |
| POST | `/api/v1/media-buys` | Required | create_media_buy |
| PATCH | `/api/v1/media-buys/{id}` | Required | update_media_buy |
| GET | `/api/v1/media-buys` | Required | get_media_buys |
| GET | `/api/v1/media-buys/{id}/delivery` | Required | get_media_buy_delivery |
| POST | `/api/v1/media-buys/{id}/creatives` | Required | sync_creatives |
| GET | `/api/v1/media-buys/{id}/creatives` | Required | list_creatives |

## When to Use Which Protocol

- **MCP**: Use when integrating directly with an AI assistant (Claude Desktop, Cursor, custom chatbot). Simplest setup.
- **A2A**: Use when building agent-to-agent workflows where push notifications and task lifecycle management matter.
- **REST**: Use for scripts, dashboards, or any non-agent integration.

## Further Reading

- [Architecture](/agents/salesagent/architecture.html) -- Transport parity design
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- All tools
- [Security](/agents/salesagent/operations/security.html) -- Authentication details
