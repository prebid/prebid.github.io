---
layout: page_v2
title: Prebid Sales Agent - Getting Started - Buy-Side Integration
description: How to connect an AI buying agent to a Prebid Sales Agent via MCP and A2A protocols
sidebarType: 10
---

# Buy-Side Integration
{: .no_toc}

This guide explains how to connect an AI buying agent to a Prebid Sales Agent instance. Whether you are building a custom agent or configuring Claude Desktop, you can use either the MCP (Model Context Protocol) or A2A (Agent-to-Agent) protocol to discover inventory, create media buys, manage creatives, and monitor delivery.

- TOC
{:toc}

## MCP Integration

The MCP interface is the primary way for AI agents to interact with the Sales Agent. It uses [FastMCP](https://github.com/jlowin/fastmcp) with StreamableHTTP transport.

### Python Client Setup

Install the FastMCP client library:

```bash
pip install fastmcp
```

Connect to the Sales Agent using `StreamableHttpTransport`:

```python
import asyncio
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

# Configure the transport with your Sales Agent URL and auth token
transport = StreamableHttpTransport(
    "http://localhost:8000/mcp/",
    headers={"x-adcp-auth": "your-auth-token"}
)

async def main():
    async with Client(transport) as client:
        # List all available tools
        tools = await client.list_tools()
        for tool in tools:
            print(f"  {tool.name}: {tool.description}")

asyncio.run(main())
```

{: .alert.alert-info :}
The MCP endpoint URL must include the trailing slash: `http://localhost:8000/mcp/`

### Authentication

MCP requests are authenticated via the `x-adcp-auth` header. Each advertiser receives a unique token from the publisher (see [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html)).

```python
transport = StreamableHttpTransport(
    "https://sales.publisher.com/mcp/",
    headers={"x-adcp-auth": "advertiser-api-token"}
)
```

{: .alert.alert-warning :}
In test mode (`ADCP_AUTH_TEST_MODE=true`), the token `test-token` is accepted. Never use test mode in production.

### Calling Tools

Use `client.call_tool()` to invoke any MCP tool:

```python
async with Client(transport) as client:
    # Search products by natural language brief
    products = await client.call_tool("get_products", {
        "brief": "video ads for sports audience"
    })

    # Get full product details
    product = await client.call_tool("get_product_details", {
        "product_id": "prod_abc123"
    })

    # List supported creative formats
    formats = await client.call_tool("list_creative_formats", {})
```

{: .alert.alert-info :}
For the complete tool catalog with parameters and response schemas, see the [Tool Reference](/agents/salesagent/tools/tool-reference.html).

## A2A Integration

The A2A (Agent-to-Agent) protocol provides an alternative interface using JSON-RPC 2.0. It is designed for complex multi-agent workflows and orchestration platforms.

### Agent Discovery

A2A agents discover Sales Agent capabilities via the standard agent card:

```bash
curl https://sales.publisher.com/.well-known/agent.json
```

The agent card returns a JSON descriptor with the agent's name, description, supported capabilities, and endpoint URL:

```json
{
  "name": "Publisher Sales Agent",
  "description": "AI-driven advertising sales for publisher inventory",
  "url": "https://sales.publisher.com/a2a",
  "version": "1.0.0",
  "capabilities": {
    "streaming": false,
    "pushNotifications": false
  },
  "skills": [
    {
      "id": "media-buying",
      "name": "Media Buying",
      "description": "Discover products, create and manage media buys"
    }
  ],
  "authentication": {
    "schemes": ["bearer"]
  }
}
```

### JSON-RPC 2.0 Requests

A2A uses standard JSON-RPC 2.0 over HTTP POST:

```bash
curl -X POST https://sales.publisher.com/a2a \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-auth-token" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tasks/send",
    "params": {
      "id": "task-001",
      "message": {
        "role": "user",
        "parts": [
          {
            "type": "text",
            "text": "Show me available video advertising products"
          }
        ]
      }
    }
  }'
```

### A2A Authentication

A2A requests use standard Bearer token authentication in the `Authorization` header:

```bash
Authorization: Bearer advertiser-api-token
```

## Complete Workflow Example

The following example demonstrates a full media buying workflow from product discovery through delivery monitoring:

```python
import asyncio
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

transport = StreamableHttpTransport(
    "http://localhost:8000/mcp/",
    headers={"x-adcp-auth": "your-auth-token"}
)

async def run_campaign():
    async with Client(transport) as client:

        # 1. Discover capabilities
        capabilities = await client.call_tool("get_adcp_capabilities", {})
        print("Capabilities:", capabilities)

        # 2. Search for products matching the campaign brief
        products = await client.call_tool("get_products", {
            "brief": "homepage banner ads for tech audience"
        })
        print("Found products:", products)

        # 3. Check supported creative formats
        formats = await client.call_tool("list_creative_formats", {})
        print("Creative formats:", formats)

        # 4. Create a media buy
        media_buy = await client.call_tool("create_media_buy", {
            "product_id": "prod_abc123",
            "advertiser_id": "adv_xyz789",
            "name": "Q2 Homepage Takeover",
            "budget_cents": 100000,
            "start_date": "2025-04-01",
            "end_date": "2025-06-30"
        })
        print("Media buy created:", media_buy)
        media_buy_id = media_buy[0].text  # Extract the media buy ID

        # 5. Sync creatives to the media buy
        creative = await client.call_tool("sync_creatives", {
            "media_buy_id": media_buy_id,
            "creatives": [
                {
                    "name": "Spring Sale Banner",
                    "format": "display",
                    "width": 728,
                    "height": 90,
                    "click_url": "https://advertiser.com/spring-sale",
                    "asset_url": "https://cdn.advertiser.com/banners/spring-728x90.jpg"
                }
            ]
        })
        print("Creatives synced:", creative)

        # 6. Monitor delivery
        delivery = await client.call_tool("get_media_buy_delivery", {
            "media_buy_id": media_buy_id
        })
        print("Delivery report:", delivery)

asyncio.run(run_campaign())
```

### Workflow Steps Explained

{: .table .table-bordered .table-striped }
| Step | Tool | Purpose |
|------|------|---------|
| 1 | `get_adcp_capabilities` | Discover what the Sales Agent supports |
| 2 | `get_products` | Search inventory matching a campaign brief |
| 3 | `list_creative_formats` | Check accepted creative formats and specs |
| 4 | `create_media_buy` | Book a campaign with budget and flight dates |
| 5 | `sync_creatives` | Attach creative assets to the media buy |
| 6 | `get_media_buy_delivery` | Monitor impressions, clicks, and spend |

## Claude Desktop Integration

You can connect Claude Desktop directly to a Sales Agent by adding it as an MCP server in your configuration.

Edit your Claude Desktop config file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the Sales Agent as an MCP server:

```json
{
  "mcpServers": {
    "salesagent": {
      "command": "uvx",
      "args": [
        "adcp",
        "http://localhost:8000/mcp/",
        "--auth",
        "your-auth-token"
      ]
    }
  }
}
```

After saving the config, restart Claude Desktop. The Sales Agent tools will appear in Claude's tool list, allowing you to interact with advertising inventory through natural conversation.

{: .alert.alert-info :}
Claude Desktop will show the Sales Agent tools with their descriptions. You can ask Claude to search for products, create campaigns, and check delivery using natural language.

## Error Handling

When integrating with the Sales Agent, handle common error scenarios:

{: .table .table-bordered .table-striped }
| Error | Cause | Resolution |
|-------|-------|------------|
| `401 Unauthorized` | Invalid or missing auth token | Verify the token with the publisher |
| `403 Forbidden` | Token lacks required permissions | Request appropriate access from the publisher |
| `404 Not Found` | Invalid resource ID | Check the ID returned from previous tool calls |
| `422 Validation Error` | Invalid parameters | Review the tool's parameter schema |
| `429 Rate Limited` | Too many requests | Implement exponential backoff |

## Further Reading

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete catalog of MCP tools with parameters
- [Publisher Onboarding](/agents/salesagent/getting-started/publisher-onboarding.html) -- Set up your own Sales Agent
- [AdCP Schemas](https://docs.adcontextprotocol.org/docs/reference/schemas) -- Protocol schema definitions
- [AdCP SDKs](https://docs.adcontextprotocol.org/docs/sdks) -- Official client libraries
