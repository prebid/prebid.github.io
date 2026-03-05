---
layout: page_v2
title: Prebid Sales Agent - Tools - Tool Reference
description: Complete catalog of MCP tools exposed by the Prebid Sales Agent
sidebarType: 10
---

# Tool Reference
{: .no_toc}

The Prebid Sales Agent exposes 14 tools through both MCP and A2A protocols. Each tool maps to an AdCP operation and follows a consistent registration, authentication, and error-handling pattern.

- TOC
{:toc}

## Tool Registration

Every tool is registered with the FastMCP server using the `@mcp.tool()` decorator. This decorator maps a Python function to an MCP tool name, making it callable by any connected AI agent.

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("salesagent")

@mcp.tool()
async def get_adcp_capabilities(
    protocols: list[str] | None = None,
    ctx: ToolContext = Depends(get_tool_context),
) -> GetAdcpCapabilitiesResponse:
    """Discover agent capabilities and supported protocols."""
    ...
```

### ToolContext Dependency Injection

Tools that need access to the database, ad server adapter, or authentication state receive a `ToolContext` object through FastAPI-style dependency injection (`Depends(get_tool_context)`). The `ToolContext` carries:

- **`publisher`** -- The resolved publisher identity for multi-tenant isolation
- **`auth`** -- Authentication state including token scopes and buyer identity
- **`db`** -- Database session for queries and persistence
- **`adapter`** -- The ad server adapter instance (e.g., Google Ad Manager, mock)
- **`config`** -- Server configuration and feature flags

Tools that do not require authentication (marked "Optional" below) can still receive a `ToolContext` when a token is provided, providing access to additional publisher-specific data.

## Tool Categories

Tools are organized into five categories based on their role in the advertising workflow:

- **Discovery** -- Read-only tools for exploring inventory, formats, and agent capabilities
- **Execution** -- Tools that create or modify media buys (campaigns)
- **Creative** -- Tools for managing creative assets and format validation
- **Performance** -- Tools for delivery metrics and performance data
- **Workflow** -- Tools for human-in-the-loop task management
- **Governance** -- Tools for authorization and publisher domain management

## Tool Summary

{: .table .table-bordered .table-striped }
| Tool | Category | Sync/Async | Auth Required | Description |
|------|----------|------------|---------------|-------------|
| [get_adcp_capabilities](/agents/salesagent/tools/get-adcp-capabilities.html) | Discovery | Async | Optional | Protocol capability discovery |
| [get_products](/agents/salesagent/tools/get-products.html) | Discovery | Async | Optional | AI-powered product search |
| [list_creative_formats](/agents/salesagent/tools/list-creative-formats.html) | Discovery | Sync | Optional | Creative format specifications |
| [create_media_buy](/agents/salesagent/tools/create-media-buy.html) | Execution | Async | Required | Campaign creation |
| [update_media_buy](/agents/salesagent/tools/update-media-buy.html) | Execution | Async | Required | Campaign modification |
| get_media_buys | Execution | Sync | Required | Query media buys |
| [get_media_buy_delivery](/agents/salesagent/tools/get-media-buy-delivery.html) | Performance | Sync | Required | Delivery metrics |
| [sync_creatives](/agents/salesagent/tools/sync-creatives.html) | Creative | Async | Required | Upload and manage creatives |
| list_creatives | Creative | Sync | Required | Search creative library |
| list_authorized_properties | Governance | Sync | Optional | Publisher domains |
| update_performance_index | Performance | Sync | Required | Package performance data |
| list_tasks | Workflow | Sync | Required | List workflow tasks |
| get_task | Workflow | Sync | Required | Get task details |
| complete_task | Workflow | Sync | Required | Complete or fail a task |

## Authentication

Tools marked **Auth Required** expect a valid token in the `x-adcp-auth` header (MCP) or `Authorization: Bearer` header (A2A). Without a valid token, these tools return a `401 Unauthorized` error.

Tools marked **Auth Optional** work without authentication but return richer, publisher-specific data when a token is provided.

## Error Handling

All tools follow a consistent error pattern. Errors are returned as structured objects with machine-readable `error_code` fields and human-readable `message` fields. Common error codes include:

{: .table .table-bordered .table-striped }
| Error Code | HTTP Equivalent | Description |
|------------|-----------------|-------------|
| `unauthorized` | 401 | Missing or invalid authentication token |
| `forbidden` | 403 | Token lacks required scopes |
| `not_found` | 404 | Requested resource does not exist |
| `validation_error` | 422 | Invalid parameters |
| `conflict` | 409 | Operation conflicts with current state |
| `internal_error` | 500 | Unexpected server error |

## AdCP Media Buy Protocol

The tools in this reference implement the [AdCP Media Buy Protocol](https://docs.adcontextprotocol.org/docs/intro), which defines the standard operations for AI-driven advertising. Each tool page includes a cross-reference to the relevant section of the protocol specification.

{: .alert.alert-info :}
For the full AdCP specification, see [docs.adcontextprotocol.org](https://docs.adcontextprotocol.org). For protocol architecture details, see [Architecture & Protocols](/agents/salesagent/architecture.html).

## Further Reading

- [Architecture & Protocols](/agents/salesagent/architecture.html) -- MCP and A2A transport details
- [Quick Start](/agents/salesagent/getting-started/quickstart.html) -- Try the tools locally
- [Buy-Side Integration](/agents/salesagent/getting-started/buy-side-integration.html) -- Connect an AI buying agent
