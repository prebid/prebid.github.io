---
layout: page_v2
title: Prebid Sales Agent - Tools - sync_event_sources
description: Registers event sources with the Sales Agent for conversion tracking and attribution
sidebarType: 10
---

# sync_event_sources
{: .no_toc}

Registers event sources (pixels, server-to-server endpoints) with the Sales Agent for conversion tracking and attribution, enabling buyers to connect their measurement infrastructure to active campaigns.

{: .alert.alert-warning :}
This tool is defined in the AdCP specification but is not yet implemented in the Prebid Sales Agent. It is planned for a future release.

## Expected Behavior

When implemented, `sync_event_sources` will accept event source definitions from a buying agent — such as tracking pixel URLs, server-to-server callback endpoints, or postback configurations — and register them with the Sales Agent for a given media buy.

Once registered, these event sources enable the publisher's ad server to fire conversion signals back to the buyer's measurement system. The `log_event` tool can then be used to send individual events through the registered sources.

## AdCP Specification

This tool is part of the [AdCP Media Buy Protocol](https://docs.adcontextprotocol.org/docs/media-buy/task-reference/sync_event_sources). See the protocol specification for the canonical parameter definitions and expected behavior.

## Related Tools

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog
- [log_event](/agents/salesagent/tools/log-event.html) -- Log individual conversion or attribution events
- [get_media_buy_delivery](/agents/salesagent/tools/get-media-buy-delivery.html) -- Retrieve delivery metrics for a media buy
