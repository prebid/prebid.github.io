---
layout: page_v2
title: Prebid Sales Agent - Integrations - AdCP Ecosystem Integration
description: How the Prebid Sales Agent interacts with other AdCP agents and protocols
sidebarType: 10
---

# AdCP Ecosystem Integration
{: .no_toc}

The Ad Context Protocol defines multiple agent types that work together in AI-driven advertising workflows. This page describes how the Prebid Sales Agent (Publisher role) interacts with buying agents, signal agents, creative agents, governance agents, and orchestration platforms.

- TOC
{:toc}

## Agent Interaction Model

```text
                    ┌─────────────────────┐
                    │  Orchestration       │
                    │  Platform            │
                    └──────────┬──────────┘
                               │ A2A
          ┌────────────────────┼────────────────────┐
          │                    │                     │
┌─────────▼─────────┐  ┌──────▼──────────┐  ┌──────▼──────────┐
│  Signal Agent      │  │  Buying Agent   │  │  Creative Agent  │
│  (audiences)       │  │  (media buys)   │  │  (assets)        │
└─────────┬─────────┘  └──────┬──────────┘  └──────┬──────────┘
          │                    │ MCP / A2A           │
          │            ┌───────▼───────┐             │
          └───────────▶│  Sales Agent  │◀────────────┘
                       │  (Publisher)  │
                       └───────┬───────┘
                               │
                       ┌───────▼───────┐
                       │  Ad Server    │
                       │  (GAM, etc.)  │
                       └───────────────┘
```

## Buying Agents

Buying agents discover inventory and execute media buys on behalf of advertisers. This is the primary interaction pattern for the Sales Agent.

**Interaction flow:**

1. `get_adcp_capabilities` -- Discover what the Sales Agent supports
2. `get_products` -- Search inventory with a natural language brief
3. `list_creative_formats` -- Check format requirements
4. `create_media_buy` -- Submit a campaign
5. `sync_creatives` -- Upload creative assets
6. `get_media_buy_delivery` -- Monitor performance

Buying agents connect via MCP (for direct AI assistant integration) or A2A (for multi-agent workflows). Both protocols expose identical tool functionality.

{: .alert.alert-info :}
For a step-by-step integration guide, see [Buy-Side Integration](/agents/salesagent/getting-started/buy-side-integration.html).

## Signal Agents

Signal agents provide audience data and contextual signals that enrich product discovery and targeting.

**How signals interact with the Sales Agent:**

- Audience signals are passed as targeting parameters in `get_products` and `create_media_buy`
- The Sales Agent's AI-powered product search (via Gemini) uses these signals to improve matching
- Signal data does not flow through the Sales Agent directly -- buying agents aggregate signals before making requests

{: .alert.alert-info :}
See the [Signals Protocol](https://docs.adcontextprotocol.org/docs/signals/overview) for the signal data specification.

## Creative Agents

Creative agents generate, optimize, and manage advertising assets. They interact with the Sales Agent through format negotiation and creative delivery.

**Integration points:**

- `list_creative_formats` -- Creative agents query format specifications (dimensions, file types, asset requirements) to generate compliant assets
- `sync_creatives` -- Deliver generated assets to the Sales Agent for trafficking to the ad server
- `list_creatives` -- Check the status of uploaded creatives (pending review, approved, rejected)

The Sales Agent validates creative assets against format specifications before forwarding them to the ad server adapter.

{: .alert.alert-info :}
See the [Creative Protocol](https://docs.adcontextprotocol.org/docs/creative) and [Creative Formats](https://docs.adcontextprotocol.org/docs/creative/formats) for format specifications and manifest structure.

## Governance Agents

Governance agents enforce content policies, brand safety rules, and property authorization across the advertising ecosystem.

**Integration points:**

- `get_adcp_capabilities` -- Returns content policy information when available
- `create_media_buy` -- Brand manifest validation against publisher content standards
- Content standards tools (planned) -- `get_content_standards`, `create_content_standards`, `update_content_standards`, `list_content_standards`

{: .alert.alert-warning :}
Content standards tools are defined in the AdCP specification but not yet implemented in the Prebid Sales Agent. See [Content Standards Tools](/agents/salesagent/tools/content-standards.html) for status.

{: .alert.alert-info :}
See the [Governance Protocol](https://docs.adcontextprotocol.org/docs/governance/overview) for content governance specifications.

## Orchestration Platforms

Orchestration platforms coordinate multi-agent workflows across multiple sales agents. They use the A2A protocol for agent-to-agent communication.

**How orchestration works:**

1. The orchestrator discovers sales agents via `/.well-known/agent.json`
2. It queries multiple sales agents' capabilities and inventory
3. It coordinates buying decisions across publishers
4. It manages the lifecycle of media buys across agents

**A2A discovery:** The Sales Agent publishes an agent card at `/.well-known/agent.json` containing its identity, supported protocols, available tools, and authentication requirements. Orchestrators use this for automated discovery.

{: .alert.alert-info :}
See the [Sponsored Intelligence](https://docs.adcontextprotocol.org/docs/sponsored-intelligence/overview) documentation for orchestration patterns.

## Brand Protocol

The Brand Protocol defines how advertiser identity and brand safety information flow through the AdCP ecosystem.

**How it works with the Sales Agent:**

- Buying agents include a `BrandManifest` in `create_media_buy` requests
- The manifest contains brand name, URL, logo, and category
- The Sales Agent uses this for compliance checks against publisher content standards
- Ad server adapters may use brand data for order naming and trafficking

{: .alert.alert-info :}
See the [Brand Protocol / brand.json](https://docs.adcontextprotocol.org/docs/brand-protocol/brand-json) specification.

## Further Reading

- [Overview](/agents/salesagent/overview.html) -- Sales Agent role in the AdCP architecture
- [Protocols: MCP vs A2A](/agents/salesagent/protocols.html) -- Protocol comparison and usage guidance
- [AdCP Cross-Reference Index](/agents/salesagent/reference/adcp-cross-references.html) -- Links to all AdCP protocol documentation
- [AdCP Introduction](https://docs.adcontextprotocol.org/docs/intro) -- Protocol overview and concepts
