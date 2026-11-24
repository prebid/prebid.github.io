---
layout: page_v2
page_type: module
title: Module - Takeover
description: Lets one takeover deal win several ad units of the same auction together, a programmatic page takeover or roadblock.
module_code : takeover
display_name : Takeover
enable_download : true
sidebarType : 1
---

# Takeover Module
{:.no_toc}

* TOC
{:toc}

## Overview

This module lets one buyer win several ad units on a page view together through a takeover deal, a programmatic version of a roadblock. Without it, every ad unit is auctioned on its own.

A takeover is a set of ordinary deal bids, one per ad unit, from the same bidder and with the same `dealid`, that carry takeover terms in `ext.prebid.deal.takeover`. The module decides at the end of each auction whether a takeover wins, and if it does, its bids are the only bids left on the ad units it won.

## Takeover Bids

Bidders add the takeover terms to the deal metadata of each bid. Adapters built on the ORTB conversion library, and Prebid Server, normalize them into `bid.meta.deal.takeover`; other adapters can set `meta.deal.takeover` directly.

```json
{
  "impid": "imp-1",
  "dealid": "TKO-ACME-01",
  "price": 18.00,
  "ext": {
    "prebid": {
      "deal": {
        "type": 3,
        "takeover": {
          "mode": "viewport",
          "min_slots": 3,
          "exclusivity": { "adomain": ["competitor.com"], "cat": ["IAB11-4"] }
        }
      }
    }
  }
}
```

{: .table .table-bordered .table-striped }
| ORTB field | `meta.deal.takeover` | Type | Description |
| --- | --- | --- | --- |
| `mode` | `mode` | string | `all`, `max` or `viewport` (see [Modes](#modes)). Defaults to `max` when missing or unknown. |
| `min_slots` | `minSlots` | integer | Minimum number of ad units the takeover must win in `max` and `viewport` modes. |
| `exclusivity.adomain` | `exclusivity.adomain` | array of strings | Advertiser domains to keep out of the page's other ad units. |
| `exclusivity.cat` | `exclusivity.cat` | array of strings | IAB categories to keep out of the page's other ad units. |

The takeover's price is the sum of its bids' prices. The deal's `priority` and `priority_adjusted_cpm` are used as for any [priority bid](/dev-docs/publisher-api-reference/bidderSettings.html#212-allowprioritybids).

## Modes

{: .table .table-bordered .table-striped }
| Mode | Ad units covered |
| --- | --- |
| `all` | Every ad unit in the auction, or none. Rejected if an ad unit already rendered a bid from an earlier auction. |
| `max` | As many ad units as the takeover wins, at least `min_slots` and the publisher's `minSlotsFloor`. |
| `viewport` | Every ad unit at least `viewportPercent` in view when bids are requested, at least `min_slots` of them. |

## How a Takeover Wins

1. Takeovers are ranked against each other first, by priority and then total desirability. At most one takeover wins an auction.
2. On each ad unit, the takeover's bid is compared with the best other bid by priority (lower wins). The takeover takes ad units where its priority is higher and loses those where it is lower.
3. On ad units where the priorities are equal, the takeover wins only if the sum of its bids' desirability is higher than the sum of the best other bids' desirability, plus the publisher's `premium` and the value of any bids its exclusivity keeps off the page.

Bids of takeovers that lose are removed from the auction, so a takeover never wins only part of what it bid for.

## Parameters

{: .table .table-bordered .table-striped }
| Param | Required? | Type | Description | Default |
| --- | --- | --- | --- | --- |
| enabled | Yes | boolean | Turns the module on. | `false` |
| acceptFrom | No | string | Whose takeovers are acted on: `priority` (adapters with [`allowPriorityBids`](/dev-docs/publisher-api-reference/bidderSettings.html#212-allowprioritybids), or bidders listed in `s2sConfig.allowPriorityBids`), `allowlist` (the bidders in `acceptFromBidders`), or `deals` (any bid with a deal ID). | `'priority'` |
| acceptFromBidders | No | array of strings | Bidder codes for `acceptFrom: 'allowlist'`. | `[]` |
| modes | No | array of strings | Takeover modes the publisher accepts. | `['max']` |
| minSlotsFloor | No | integer | Takeovers that would win fewer ad units are ignored. | `2` |
| premium | No | number | Margin, as a fraction, by which a takeover must beat the other bids when priorities are equal. `0.1` = 10%. | `0` |
| excludeAdUnits | No | array of strings | Ad unit codes that are never taken over. | `[]` |
| collapseUnfilled | No | boolean | In `all` mode, leave ad units the takeover has no bid for empty instead of rejecting the takeover. | `false` |
| blockRefresh | No | boolean | Skip `requestBids` for ad units that rendered a takeover bid. | `false` |
| allowExclusivity | No | boolean | Let takeovers keep the advertisers and categories in their `exclusivity` out of the page's other ad units. | `false` |
| exclusivityLabels | No | object | Maps `hb_excl` targeting values to IAB categories, for ad server competitive exclusions. | `{}` |
| viewportPercent | No | number | Percentage of an ad unit's element that must be in view for `viewport` mode. | `50` |

```javascript
pbjs.bidderSettings = {
  exampleBidder: { allowPriorityBids: true }
};

pbjs.setConfig({
  takeover: {
    enabled: true,
    modes: ['all', 'max', 'viewport'],
    minSlotsFloor: 2,
    excludeAdUnits: ['footer'],
    allowExclusivity: true,
    exclusivityLabels: { 'pol-opp': ['IAB11-4'] }
  }
});
```

## Building Prebid.js with the Takeover Module

The Takeover module is not included with Prebid.js by default:

```bash
gulp build --modules=takeover,exampleBidAdapter
```

## Ad Server Setup

* Use GPT single-request mode, so the ad server sees every ad unit at once.
* Target dedicated line items to `hb_tko=1` at a priority above price priority and AdX, so the ad server does not split the takeover.
* If you restrict targeting keys with `targetingControls.allowTargetingKeys`, add `hb_tko`, and `hb_excl` if you use exclusivity labels.

## Analytics

Each winning bid keeps its own CPM, and its `meta.deal.takeover.groupId` ties it to the rest of the takeover. The module emits a `takeoverResult` event for every takeover in an auction:

```javascript
pbjs.onEvent('takeoverResult', ({ groupId, auctionId, bidderCode, dealId, mode, won, reason, adUnitCodes, totalCpm }) => {});
```

`reason` is set when the takeover lost: `outranked`, `notEnoughSlots`, `lostOnValue`, `slotAlreadyRendered` or `nothingInView`.

## Related Topics

* [bidderSettings: allowPriorityBids](/dev-docs/publisher-api-reference/bidderSettings.html#212-allowprioritybids)
* [MultiBid Module](/dev-docs/modules/multibid.html)
