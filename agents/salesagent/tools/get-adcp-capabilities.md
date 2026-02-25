---
layout: page_v2
title: Prebid Sales Agent - Tools - get_adcp_capabilities
description: Discover agent capabilities, supported protocols, and publisher metadata
sidebarType: 10
---

# get_adcp_capabilities
{: .no_toc}

Discovers the Sales Agent's capabilities, supported protocols, authorized publisher domains, and available tools. This is typically the first tool a buying agent calls to understand what the Sales Agent can do.

- TOC
{:toc}

## Description

The `get_adcp_capabilities` tool returns a full snapshot of the Sales Agent's current state and capabilities. It reports the agent's identity, supported AdCP protocol versions, available tools and skills, geo targeting systems, and portfolio information. When called with authentication, it also returns publisher-specific data such as authorized domains and custom targeting taxonomies.

This tool is **idempotent** and safe to call repeatedly. Response times are typically under 1 second.

## Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `protocols` | `list[str]` | No | Filter capabilities to specific protocols (e.g., `["adcp"]`). When omitted, all supported protocols are returned. | `None` |

## Response

Returns a `GetAdcpCapabilitiesResponse` object containing the following key fields:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `agent_name` | `str` | Display name of the Sales Agent instance |
| `agent_version` | `str` | Semantic version of the Sales Agent |
| `adcp_versions` | `list[str]` | Supported AdCP protocol versions |
| `supported_tools` | `list[ToolDescriptor]` | List of available tools with their names, descriptions, and parameter schemas |
| `supported_skills` | `list[str]` | High-level capabilities (e.g., `product_discovery`, `media_buying`) |
| `authorized_domains` | `list[str]` | Publisher domains this agent is authorized to sell inventory for (requires auth) |
| `geo_targeting_systems` | `list[str]` | Supported geographic targeting taxonomies (e.g., `geonames`, `iso3166`) |
| `portfolio` | `PortfolioInfo` | Summary of the publisher's inventory portfolio |
| `creative_formats` | `list[str]` | Supported creative format categories |

## Error Codes

{: .table .table-bordered .table-striped }
| Error Code | Description |
|------------|-------------|
| `internal_error` | Unexpected server error during capability resolution |

This tool does not require authentication and does not produce authorization errors.

## Example

```python
from mcp import ClientSession

async with ClientSession(transport) as session:
    await session.initialize()

    # Discover all capabilities
    result = await session.call_tool("get_adcp_capabilities")
    print(result)

    # Filter to AdCP protocol only
    result = await session.call_tool(
        "get_adcp_capabilities",
        arguments={"protocols": ["adcp"]},
    )
    capabilities = result.content
    print(f"Agent: {capabilities['agent_name']}")
    print(f"AdCP versions: {capabilities['adcp_versions']}")
    print(f"Tools: {[t['name'] for t in capabilities['supported_tools']]}")
```

Example response:

```json
{
  "agent_name": "Prebid Sales Agent",
  "agent_version": "1.0.0",
  "adcp_versions": ["1.0.0"],
  "supported_tools": [
    {
      "name": "get_products",
      "description": "AI-powered product search"
    }
  ],
  "supported_skills": ["product_discovery", "media_buying", "creative_management"],
  "authorized_domains": ["publisher.example.com"],
  "geo_targeting_systems": ["geonames", "iso3166"],
  "portfolio": {
    "total_products": 42,
    "channels": ["display", "video", "audio"]
  },
  "creative_formats": ["display", "video", "audio", "native"]
}
```

## Related Tools

- [get_products](/agents/salesagent/tools/get-products.html) -- Search advertising products after discovering capabilities
- [list_creative_formats](/agents/salesagent/tools/list-creative-formats.html) -- Get detailed format specifications
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog

## Protocol Specification

{: .alert.alert-info :}
The `get_adcp_capabilities` tool implements the AdCP capability discovery flow. See the [AdCP Specification](https://docs.adcontextprotocol.org/docs/intro) for the full protocol definition of agent capability negotiation.
