---
layout: page_v2
title: Prebid Sales Agent - Tools - log_event
description: Logs individual conversion or attribution events for a media buy
sidebarType: 10
---

# log_event
{: .no_toc}

Logs individual conversion or attribution events associated with a media buy, enabling the Sales Agent to track campaign performance and feed data back into optimization loops.

{: .alert.alert-warning :}
This tool is defined in the AdCP specification but is not yet implemented in the Prebid Sales Agent. It is planned for a future release.

## Expected Behavior

When implemented, `log_event` will accept individual event records — each tied to a media buy ID and an event source registered via `sync_event_sources`. Events typically represent conversions (purchases, sign-ups, app installs) or attribution signals (view-through, click-through).

Each event includes a timestamp, event type, and optional metadata such as revenue value or custom dimensions. The Sales Agent will persist these events and make them available in delivery reporting through `get_media_buy_delivery`.

## AdCP Specification

This tool is part of the [AdCP Media Buy Protocol](https://docs.adcontextprotocol.org/docs/media-buy/task-reference/log_event). See the protocol specification for the canonical parameter definitions and expected behavior.

## Related Tools

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog
- [sync_event_sources](/agents/salesagent/tools/sync-event-sources.html) -- Register event sources for conversion tracking
- [get_media_buy_delivery](/agents/salesagent/tools/get-media-buy-delivery.html) -- Retrieve delivery metrics for a media buy
