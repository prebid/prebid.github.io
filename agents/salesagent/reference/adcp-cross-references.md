---
layout: page_v2
title: Prebid Sales Agent - Reference - AdCP Cross-Reference Index
description: Index of AdCP protocol documentation relevant to the Prebid Sales Agent
sidebarType: 10
---

# AdCP Cross-Reference Index
{: .no_toc}

This page indexes all AdCP protocol documentation relevant to the Prebid Sales Agent. Use it to find the canonical protocol specification for any feature or concept referenced in the Sales Agent documentation.

- TOC
{:toc}

## Media Buy Protocol

The core protocol governing campaign lifecycle operations.

{: .table .table-bordered .table-striped }
| Document | Description |
|----------|-------------|
| [Media Buy Overview](https://docs.adcontextprotocol.org/docs/media-buy) | Protocol specification for the campaign lifecycle |
| [Media Buy Specification](https://docs.adcontextprotocol.org/docs/media-buy/specification) | Detailed technical specification |
| [get_products](https://docs.adcontextprotocol.org/docs/media-buy/task-reference/get_products) | Product discovery task reference |
| [create_media_buy](https://docs.adcontextprotocol.org/docs/media-buy/task-reference/create_media_buy) | Campaign creation task reference |
| [update_media_buy](https://docs.adcontextprotocol.org/docs/media-buy/task-reference/update_media_buy) | Campaign modification task reference |
| [get_media_buy_delivery](https://docs.adcontextprotocol.org/docs/media-buy/task-reference/get_media_buy_delivery) | Delivery reporting task reference |
| [sync_creatives](https://docs.adcontextprotocol.org/docs/media-buy/task-reference/sync_creatives) | Creative management task reference |
| [list_creatives](https://docs.adcontextprotocol.org/docs/media-buy/task-reference/list_creatives) | Creative listing task reference |
| [sync_catalogs](https://docs.adcontextprotocol.org/docs/media-buy/task-reference/sync_catalogs) | Catalog synchronization task reference |
| [provide_performance_feedback](https://docs.adcontextprotocol.org/docs/media-buy/task-reference/provide_performance_feedback) | Performance feedback task reference |
| [sync_event_sources](https://docs.adcontextprotocol.org/docs/media-buy/task-reference/sync_event_sources) | Event source registration task reference |
| [log_event](https://docs.adcontextprotocol.org/docs/media-buy/task-reference/log_event) | Event logging task reference |
| [Advanced Topics](https://docs.adcontextprotocol.org/docs/media-buy/advanced-topics) | Principals, security, and edge cases |

## Creative Protocol

Specifications for creative assets, formats, and delivery.

{: .table .table-bordered .table-striped }
| Document | Description |
|----------|-------------|
| [Creative Protocol](https://docs.adcontextprotocol.org/docs/creative) | Creative asset management overview |
| [Creative Formats](https://docs.adcontextprotocol.org/docs/creative/formats) | Format specifications (dimensions, media types, assets) |
| [Creative Manifests](https://docs.adcontextprotocol.org/docs/creative/creative-manifests) | Asset packaging and manifest structure |

## Governance Protocol

Content policies, property authorization, and brand safety.

{: .table .table-bordered .table-striped }
| Document | Description |
|----------|-------------|
| [Governance Overview](https://docs.adcontextprotocol.org/docs/governance/overview) | Property governance and content standards |

## Signals Protocol

Audience data and contextual signal integration.

{: .table .table-bordered .table-striped }
| Document | Description |
|----------|-------------|
| [Signals Overview](https://docs.adcontextprotocol.org/docs/signals/overview) | Audience signal specification |

## Brand Protocol

Advertiser identity and brand safety information.

{: .table .table-bordered .table-striped }
| Document | Description |
|----------|-------------|
| [Brand Protocol / brand.json](https://docs.adcontextprotocol.org/docs/brand-protocol/brand-json) | Brand identity specification |

## Sponsored Intelligence

Multi-agent orchestration patterns.

{: .table .table-bordered .table-striped }
| Document | Description |
|----------|-------------|
| [Sponsored Intelligence](https://docs.adcontextprotocol.org/docs/sponsored-intelligence/overview) | Orchestration platform integration |

## Building with AdCP

Implementation guides and developer resources.

{: .table .table-bordered .table-striped }
| Document | Description |
|----------|-------------|
| [Protocol Comparison](https://docs.adcontextprotocol.org/docs/building/understanding/protocol-comparison) | MCP vs A2A protocol comparison |
| [Schemas and SDKs](https://docs.adcontextprotocol.org/docs/building/schemas-and-sdks) | Client libraries (`adcp` PyPI, `@adcp/client` npm) |
| [AdCP Quickstart](https://docs.adcontextprotocol.org/docs/quickstart) | Getting started with the protocol |
| [AdCP Introduction](https://docs.adcontextprotocol.org/docs/intro) | Protocol overview and concepts |
| [Deployment Best Practices](https://docs.adcontextprotocol.org/docs/deployment) | Protocol-level deployment guidance |
| [Configuration](https://docs.adcontextprotocol.org/docs/reference/configuration) | Protocol-level configuration options |

## Reference

Glossaries, taxonomies, and version information.

{: .table .table-bordered .table-striped }
| Document | Description |
|----------|-------------|
| [Glossary](https://docs.adcontextprotocol.org/docs/reference/glossary) | Term definitions for the AdCP ecosystem |
| [Media Channel Taxonomy](https://docs.adcontextprotocol.org/docs/reference/media-channel-taxonomy) | Channel classifications (display, video, audio, native) |
| [GMSF](https://docs.adcontextprotocol.org/docs/reference/gmsf) | Global Media Standards Framework |
| [Release Notes](https://docs.adcontextprotocol.org/docs/reference/release-notes) | AdCP version history |
| [Roadmap](https://docs.adcontextprotocol.org/docs/reference/roadmap) | Planned features and timeline |
| [Implementor FAQ](https://docs.adcontextprotocol.org/docs/reference/implementor-faq) | Answers to common implementation questions |

## Version Compatibility

{: .table .table-bordered .table-striped }
| Sales Agent Version | AdCP Spec Version | `adcp` Library | Notes |
|--------------------|-------------------|----------------|-------|
| 1.x | 2.5.0+ | `adcp>=2.5.0` | Initial release |
| 1.x (latest) | 3.2.0+ | `adcp>=3.2.0` | Current |

## Further Reading

- [Overview](/agents/salesagent/overview.html) -- What is the Prebid Sales Agent
- [Glossary](/agents/salesagent/glossary.html) -- Sales Agent-specific term definitions
- [Protocols: MCP vs A2A](/agents/salesagent/protocols.html) -- Protocol comparison
- [AdCP Ecosystem Integration](/agents/salesagent/integrations/adcp-ecosystem.html) -- How the Sales Agent connects to other agents
