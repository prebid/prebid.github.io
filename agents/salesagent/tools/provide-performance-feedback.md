---
layout: page_v2
title: Prebid Sales Agent - Tools - provide_performance_feedback
description: Submits performance feedback for active media buys back to the Sales Agent
sidebarType: 10
---

# provide_performance_feedback
{: .no_toc}

Allows buying agents to submit performance feedback (conversion data, brand lift, ROI metrics) for active media buys back to the Sales Agent, enabling closed-loop optimization.

{: .alert.alert-warning :}
This tool is defined in the AdCP specification but is not yet implemented in the Prebid Sales Agent. It is planned for a future release.

## Expected Behavior

When implemented, `provide_performance_feedback` will accept structured performance data tied to a specific media buy ID. Buying agents can report metrics such as post-click conversions, revenue attributed to the campaign, brand lift survey results, or custom KPIs.

The Sales Agent will store this feedback and make it available to the publisher through the Admin UI and delivery reporting tools. This enables publishers to evaluate campaign effectiveness from the buyer's perspective alongside their own delivery data.

## AdCP Specification

This tool is part of the [AdCP Media Buy Protocol](https://docs.adcontextprotocol.org/docs/media-buy/task-reference/provide_performance_feedback). See the protocol specification for the canonical parameter definitions and expected behavior.

## Related Tools

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete tool catalog
- [get_media_buy_delivery](/agents/salesagent/tools/get-media-buy-delivery.html) -- Retrieve delivery metrics for a media buy
- [update_media_buy](/agents/salesagent/tools/update-media-buy.html) -- Modify an existing media buy
