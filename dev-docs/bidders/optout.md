---
layout: bidder
title: Opt Out Advertising
description: Prebid Opt Out Advertising Bidder Adapter
pbjs: true
pbs: true
biddercode: optout
tcfeu_supported: true
gvl_id: 227
sidebarType: 1
---

## Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                 | Example                         | Type     |
|-------------|----------|-----------------------------------------------------------------------------|----------------------------------|----------|
| `publisher` | required | Opt Out publisher ID                                                        | `"4"`                            | `string` |
| `adSlot`    | required | Opt Out ad slot name (inventory key)                                        | `"1Limburg_Web_Sticky - Desktop"`| `string` |
| `id`        | optional | Slot identifier returned by the Opt Out bidder endpoint and used for mapping to the correct Prebid `bidId`. If omitted, the adapter falls back to `adSlot`. | `"div-1"` | `string` |
| `customs`   | optional | Custom targeting / extra parameters forwarded to the Opt Out endpoint       | `{ "foo": "bar" }`               | `object` |

### Notes

- The Opt Out endpoint responds with bids keyed by a slot identifier (e.g. `div-1`, `div-2`).  
  The adapter maps that identifier back to Prebid’s internal `bidId` automatically.
- If you provide `params.id`, ensure it is **unique per ad unit** (e.g. `div-1`, `div-2`) so multi-slot requests map correctly.
- GDPR/TCF: the adapter reads `gdprConsent` from the Prebid bidder request and may route traffic to a different endpoint depending on whether GDPR applies and Purpose 1 consent is present.

## Example

```javascript
pbjs.addAdUnits([{
  code: 'div-1',
  mediaTypes: {
    banner: { sizes: [[300, 600]] }
  },
  bids: [{
    bidder: 'optout',
    params: {
      publisher: '4',
      adSlot: '1Limburg_Web_Sticky - Desktop',
      id: 'div-1',
      customs: { test: true }
    }
  }]
}, {
  code: 'div-2',
  mediaTypes: {
    banner: { sizes: [[300, 600]] }
  },
  bids: [{
    bidder: 'optout',
    params: {
      publisher: '4',
      adSlot: '1Limburg_Web_Sticky - Desktop',
      id: 'div-2'
    }
  }]
}]);
