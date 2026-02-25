---
layout: page_v2
title: Prebid Sales Agent - Tools - list_authorized_properties
description: List publisher properties (domains) this agent is authorized to represent
sidebarType: 10
---

# list_authorized_properties
{: .no_toc}

Lists all publisher properties (domains) this agent is authorized to represent. Authentication is optional — without auth, returns public inventory; with auth, returns publisher-specific property data.

- TOC
{:toc}

## Description

The `list_authorized_properties` tool returns the set of publisher domains and properties that the Sales Agent is authorized to sell inventory for. The response includes domain metadata and, when available, the publisher's advertising policies.

When called without authentication, the tool returns publicly available inventory information. When called with a valid authentication context, it returns the full set of properties specific to the authenticated publisher, including any associated advertising policies and restrictions.

Results can be narrowed using `property_tags` (e.g., `["premium", "sports"]`) or `publisher_domains` (e.g., `["example.com"]`) to retrieve a subset of the authorized properties.

Source: `src/core/tools/properties.py:214`

## Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `property_tags` | `list[str]` | No | Filter to specific property tags. | `None` |
| `publisher_domains` | `list[str]` | No | Filter to specific publisher domains. | `None` |

## Response

Returns a `ListAuthorizedPropertiesResponse` object containing:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `publisher_domains` | `list[PublisherDomain]` | List of authorized publisher domains with metadata |
| `advertising_policies` | `AdvertisingPolicies` | Publisher advertising policies and restrictions (present when authenticated) |
| `context` | `ContextObject` | Response context metadata |

Each `PublisherDomain` in the list contains the domain name, associated tags, and property-level metadata such as content categories and supported ad formats.

## Error Codes

{: .table .table-bordered .table-striped }
| Error Code | Description |
|------------|-------------|
| `TENANT_ERROR` | Unable to resolve the tenant context for this request. |
| `PROPERTIES_ERROR` | Failed to retrieve property data from the underlying service. |

## Example

```python
from mcp import ClientSession

async with ClientSession(transport) as session:
    await session.initialize()

    # List all authorized properties
    result = await session.call_tool("list_authorized_properties")
    for domain in result.content["publisher_domains"]:
        print(f"{domain['domain']}: {domain.get('tags', [])}")

    # Filter by tags and specific domains
    result = await session.call_tool(
        "list_authorized_properties",
        arguments={
            "property_tags": ["premium"],
            "publisher_domains": ["news.example.com"],
        },
    )
    properties = result.content
    if properties.get("advertising_policies"):
        print(f"Policies: {properties['advertising_policies']}")
```

Example response:

```json
{
  "publisher_domains": [
    {
      "domain": "news.example.com",
      "tags": ["premium", "news"],
      "content_categories": ["news", "politics", "business"],
      "supported_formats": ["display", "video", "native"]
    },
    {
      "domain": "sports.example.com",
      "tags": ["premium", "sports"],
      "content_categories": ["sports", "entertainment"],
      "supported_formats": ["display", "video"]
    }
  ],
  "advertising_policies": {
    "blocked_categories": ["gambling", "tobacco"],
    "require_creative_approval": true,
    "max_ad_density": 0.3
  }
}
```

## Related Tools

- [get_adcp_capabilities](/agents/salesagent/tools/get-adcp-capabilities.html) -- Discover agent capabilities including authorized domains
- [get_products](/agents/salesagent/tools/get-products.html) -- Search products available on authorized properties
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog

## Protocol Specification

{: .alert.alert-info :}
The `list_authorized_properties` tool implements the AdCP `list_authorized_properties` task. See the [AdCP Specification](https://docs.adcontextprotocol.org/docs/intro) for the full protocol definition including publisher domain schema and advertising policy format.
