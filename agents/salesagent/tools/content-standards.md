---
layout: page_v2
title: Prebid Sales Agent - Tools - Content Standards Tools
description: Tools for managing publisher brand safety rules and content policies
sidebarType: 10
---

# Content Standards Tools
{: .no_toc}

Four tools for managing publisher brand safety rules and content policies: `get_content_standards`, `create_content_standards`, `update_content_standards`, and `list_content_standards`. These are part of the AdCP Governance protocol and allow buying agents to discover and comply with publisher content requirements before submitting creatives.

{: .alert.alert-warning :}
These tools are defined in the AdCP specification but are not yet implemented in the Prebid Sales Agent. They are planned for a future release.

## Tools in This Group

{: .table .table-bordered .table-striped }
| Tool | Description |
|------|-------------|
| `get_content_standards` | Retrieves a specific content standards document by ID |
| `create_content_standards` | Creates a new set of content standards for a publisher |
| `update_content_standards` | Modifies an existing content standards document |
| `list_content_standards` | Lists all content standards documents for a publisher |

## AdCP Specification

These tools are part of the [AdCP Governance Protocol](https://docs.adcontextprotocol.org/docs/governance/overview). See the protocol specification for the canonical parameter definitions and expected behavior.

## Related Tools

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog
- [get_adcp_capabilities](/agents/salesagent/tools/get-adcp-capabilities.html) -- Discover supported protocols and features
- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Create a campaign (subject to content standards)
