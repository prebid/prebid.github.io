---
layout: page_v2
title: Prebid Sales Agent - Tools - sync_catalogs
description: Synchronizes product catalog data between buying agents and the Sales Agent
sidebarType: 10
---

# sync_catalogs
{: .no_toc}

Synchronizes product catalog data (product feeds, store information, or inventory) between a buying agent and the Sales Agent. This tool is designed for commerce and retail media use cases where catalog alignment between buyer and seller is required before media buys can be created.

{: .alert.alert-warning :}
This tool is defined in the AdCP specification but is not yet implemented in the Prebid Sales Agent. It is planned for a future release.

## Expected Behavior

When implemented, `sync_catalogs` will accept product feed data from a buying agent and reconcile it with the publisher's internal catalog. This supports retail media scenarios where an advertiser's product catalog (SKUs, prices, availability) must be aligned with the publisher's ad inventory before campaigns can target specific products.

The tool will handle incremental updates, allowing buying agents to sync changed items rather than retransmitting the full catalog on each call.

## AdCP Specification

This tool is part of the [AdCP Media Buy Protocol](https://docs.adcontextprotocol.org/docs/media-buy/task-reference/sync_catalogs). See the protocol specification for the canonical parameter definitions and expected behavior.

## Related Tools

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog
- [get_products](/agents/salesagent/tools/get-products.html) -- Search the publisher's product catalog
- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Create a campaign from discovered products
