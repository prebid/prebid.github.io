---
layout: page_v2
title: Prebid Sales Agent - Glossary
description: Definitions of key terms used in the Prebid Sales Agent documentation
sidebarType: 10
---

# Glossary
{: .no_toc}

Definitions of key terms used throughout the Prebid Sales Agent documentation, organized into Sales Agent-specific concepts and AdCP protocol terms.

- TOC
{:toc}

## Sales Agent Terms

These terms are specific to the Prebid Sales Agent implementation.

{: .table .table-bordered .table-striped }
| Term | Definition |
|------|------------|
| **ToolContext** | Dependency-injected object providing tenant context, database session, adapter instance, and authentication state to MCP tools. Populated via `Depends(get_tool_context)` on each tool invocation. |
| **Adapter** | Pluggable integration layer connecting the Sales Agent to an ad server. Each adapter translates AdCP operations into platform-specific API calls. Current adapters include Google Ad Manager and a mock adapter for testing. |
| **Tenant** | An isolated publisher instance within a multi-tenant deployment. Each tenant has its own products, advertisers, configuration, and data. Tenant isolation is enforced at the database and authentication layers. |
| **Principal** | An authenticated entity (AI buying agent or human user) that interacts with the Sales Agent via MCP or A2A. Principals are identified by their access token and granted scopes. |
| **Workflow** | Human-in-the-loop approval process for media buys and creatives. When a buying agent creates or modifies a campaign, the operation may be queued for publisher review in the Admin UI before taking effect in the ad server. |
| **Setup Mode** | Initial state of a new deployment before any tenants are configured. The Admin UI presents a guided setup wizard that walks the publisher through tenant creation, adapter configuration, and product catalog setup. |
| **Demo Tenant** | Auto-generated publisher tenant with sample products, advertisers, and configuration. Created when the environment variable `CREATE_DEMO_TENANT=true` is set. Useful for testing and evaluation without manual setup. |

## AdCP Protocol Terms

These terms are defined by the [Ad Context Protocol (AdCP)](https://adcontextprotocol.org) specification. The definitions below are brief summaries; see the [AdCP Glossary](https://docs.adcontextprotocol.org/docs/reference/glossary) for canonical definitions.

{: .table .table-bordered .table-striped }
| Term | Definition |
|------|------------|
| **Brief** | A natural language description of an advertiser's campaign goals, used by buying agents to search for matching products. Passed to `get_products` as the `brief` parameter. See [AdCP Glossary](https://docs.adcontextprotocol.org/docs/reference/glossary). |
| **Product** | An advertising offering from a publisher, including placement details, pricing options, creative format requirements, and targeting capabilities. See [AdCP Glossary](https://docs.adcontextprotocol.org/docs/reference/glossary). |
| **Package** | A bundled collection of products offered as a single purchasable unit, often with combined pricing or volume discounts. See [AdCP Glossary](https://docs.adcontextprotocol.org/docs/reference/glossary). |
| **Media Buy** | A committed purchase of advertising inventory, specifying products, budget, flight dates, and targeting parameters. The central transactional object in AdCP. See [AdCP Glossary](https://docs.adcontextprotocol.org/docs/reference/glossary). |
| **Creative** | An advertising asset (image, video, HTML) that is associated with a media buy and rendered to users. Must conform to the format specifications of the purchased products. See [AdCP Glossary](https://docs.adcontextprotocol.org/docs/reference/glossary). |
| **Format ID** | A standardized identifier for a creative format (e.g., display banner dimensions, video duration). Returned by `list_creative_formats` and referenced in product and creative objects. See [AdCP Glossary](https://docs.adcontextprotocol.org/docs/reference/glossary). |
| **Pricing Option** | A pricing model attached to a product, specifying the rate type (CPM, CPC, flat rate), currency, and amount. Multiple pricing options may be available for a single product. See [AdCP Glossary](https://docs.adcontextprotocol.org/docs/reference/glossary). |
| **Brand Manifest** | A structured description of a brand's identity, category, audience, and compliance requirements. Provided by buying agents to enable personalized product recommendations. See [AdCP Glossary](https://docs.adcontextprotocol.org/docs/reference/glossary). |
| **Targeting Overlay** | Additional targeting constraints applied to a media buy beyond the defaults inherited from the product. Allows buyers to narrow delivery by geography, audience segment, or other dimensions. See [AdCP Glossary](https://docs.adcontextprotocol.org/docs/reference/glossary). |
| **Orchestrator** | A coordinating agent that manages workflows across multiple sales agents on behalf of a buyer. Orchestrators use A2A protocol for multi-agent communication. See [AdCP Glossary](https://docs.adcontextprotocol.org/docs/reference/glossary). |
| **Sales Agent** | A server-side agent representing a publisher that exposes advertising inventory to AI buying agents. The Prebid Sales Agent is the reference implementation. See [AdCP Glossary](https://docs.adcontextprotocol.org/docs/reference/glossary). |

{: .alert.alert-info :}
For the canonical definitions of AdCP protocol terms, see the [AdCP Glossary](https://docs.adcontextprotocol.org/docs/reference/glossary).

## Further Reading

- [Overview](/agents/salesagent/overview.html) -- Introduction to the Prebid Sales Agent
- [Architecture & Protocols](/agents/salesagent/architecture.html) -- System design and protocol details
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete catalog of MCP tools
- [AdCP Introduction](https://docs.adcontextprotocol.org/docs/intro) -- Protocol specification and concepts
