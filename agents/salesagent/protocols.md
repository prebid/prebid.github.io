---
layout: page_v2
title: Prebid Sales Agent - Protocols - MCP and A2A Compared
description: Comparison of MCP and A2A protocols supported by the Prebid Sales Agent
sidebarType: 10
---

# Protocols: MCP and A2A Compared
{: .no_toc}

The Prebid Sales Agent exposes identical functionality through two protocols: MCP (Model Context Protocol) and A2A (Agent-to-Agent). Both call the same underlying implementation functions and share authentication infrastructure.

- TOC
{:toc}

## Protocol Comparison

{: .table .table-bordered .table-striped }
| Aspect | MCP | A2A |
|--------|-----|-----|
| Protocol | HTTP + tool-call model | JSON-RPC 2.0 |
| Library | `fastmcp` (`EnhancedMCPServer`) | `a2a-sdk` (official SDK) |
| Internal Port | 8080 | 8091 |
| Route | `/mcp/` | `/a2a` |
| Auth Header | `x-adcp-auth` | `x-adcp-auth` |
| Discovery | `tools/list` method | `/.well-known/agent.json` |
| Response Format | Pydantic models (JSON) | A2A Message/Task types |
| Streaming | StreamableHttpTransport (SSE) | A2A spec streaming |
| Best For | Direct AI assistant integration | Multi-agent workflows |

## MCP (Model Context Protocol)

The MCP server is the primary interface for AI assistants. It uses the `fastmcp` library and exposes tools through an `EnhancedMCPServer` instance with `StreamableHttpTransport` for server-sent events.

### Transport and Routing

- **External route:** `/mcp/` (behind nginx proxy on port 8000)
- **Internal port:** 8080
- **Transport:** HTTP with `StreamableHttpTransport` (SSE-capable)

### Tool Registration

Tools are registered with the `@mcp.tool()` decorator. Each tool function receives a `ToolContext` through FastAPI-style dependency injection (`Depends(get_tool_context)`), which provides access to the tenant, principal, database session, adapter instance, and server configuration.

```python
@mcp.tool()
async def get_products(
    brief: str,
    brand_manifest: BrandManifest | None = None,
    ctx: ToolContext = Depends(get_tool_context),
) -> GetProductsResponse:
    return await core_get_products_tool(brief, brand_manifest, ctx)
```

### Context Headers

- **`x-adcp-auth`** — Access token for authentication (required for most tools, optional for discovery)
- **`x-context-id`** — Optional request tracking identifier for correlating related operations

## A2A (Agent-to-Agent Protocol)

The A2A server handles multi-agent workflows using the official `a2a-sdk`. It communicates via JSON-RPC 2.0 over Starlette and supports the full A2A task lifecycle.

### Transport and Routing

- **External route:** `/a2a` (behind nginx proxy on port 8000)
- **Internal port:** 8091
- **Transport:** JSON-RPC 2.0 via Starlette

### Agent Discovery

A2A clients discover the agent by fetching `/.well-known/agent.json`, which returns an agent card describing the agent's capabilities, supported tasks, and endpoint URL.

### Task Lifecycle

A2A operations follow a status progression:

1. **`submitted`** — Task received and queued
2. **`working`** — Task is being processed
3. **`completed`** — Task finished successfully (result in response)
4. **`failed`** — Task encountered an error
5. **`input-required`** — Task needs additional information from the caller

## Shared Implementation

Both protocols call the same core implementation functions. For example, `create_media_buy` in MCP and the equivalent A2A task both invoke `core_create_media_buy_tool()`. This guarantees identical behavior regardless of which protocol a client uses.

Other shared core functions include `core_get_products_tool()`, `core_get_adcp_capabilities_tool()`, `core_sync_creatives_tool()`, and `core_get_media_buy_delivery_tool()`.

{: .alert.alert-info :}
The shared core layer means that any bug fix or feature added to a tool is immediately available through both MCP and A2A without duplicate implementation work.

## Authentication

Both protocols use the same authentication mechanism:

1. The client sends a token in the `x-adcp-auth` header.
2. The server resolves the token to a principal (buyer identity) and tenant (publisher).
3. The `ToolContext` is populated with the authenticated state and passed to the core function.

Token scopes determine which tools the principal can access. Discovery tools (`get_adcp_capabilities`, `get_products`, `list_creative_formats`) work without authentication but return richer data when a token is provided.

## When to Use Each Protocol

### Use MCP When

- Integrating a single AI assistant (e.g., Claude, GPT) with a publisher's inventory
- Building a direct tool-call interface where the assistant invokes tools by name
- Prototyping or testing with the `uvx adcp` CLI
- Streaming responses are needed via SSE

### Use A2A When

- Building multi-agent systems where agents coordinate across publishers
- Using an orchestrator that manages workflows across multiple sales agents
- The client expects JSON-RPC 2.0 semantics and task lifecycle management
- Agent discovery via `/.well-known/agent.json` is part of the integration pattern

## Testing Each Protocol

### Testing MCP

Use the `uvx adcp` CLI to interact with the MCP server directly:

```bash
# List available tools
uvx adcp http://localhost:8000/mcp/ --auth test-token list_tools

# Discover capabilities
uvx adcp http://localhost:8000/mcp/ --auth test-token get_adcp_capabilities

# Search products
uvx adcp http://localhost:8000/mcp/ --auth test-token get_products '{"brief": "video ads"}'
```

### Testing A2A

Use `curl` to send JSON-RPC 2.0 requests to the A2A endpoint:

```bash
# Send a task
curl -X POST http://localhost:8000/a2a \
  -H "Content-Type: application/json" \
  -H "x-adcp-auth: test-token" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tasks/send",
    "id": "1",
    "params": {
      "message": {
        "role": "user",
        "parts": [{"text": "Find video advertising products"}]
      }
    }
  }'
```

```bash
# Fetch agent card
curl http://localhost:8000/.well-known/agent.json
```

## Error Handling Differences

Both protocols surface the same error codes (`unauthorized`, `not_found`, `validation_error`, etc.), but the transport format differs:

{: .table .table-bordered .table-striped }
| Aspect | MCP | A2A |
|--------|-----|-----|
| Error envelope | Tool result with `is_error: true` | JSON-RPC error object or failed task |
| Error fields | `error_code` + `message` in response body | `code` + `message` in JSON-RPC error, or task status `failed` |
| HTTP status | Always 200 (errors in body) | Always 200 (errors in JSON-RPC response) |
| Partial results | Not supported | Possible via `input-required` status |

## Further Reading

- [Architecture & Protocols](/agents/salesagent/architecture.html) -- Full system architecture and layer design
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete catalog of available tools
- [Buy-Side Integration](/agents/salesagent/getting-started/buy-side-integration.html) -- Connect an AI buying agent
- [AdCP Protocol Comparison](https://docs.adcontextprotocol.org/docs/building/understanding/protocol-comparison) -- Canonical protocol comparison in the AdCP specification
