---
layout: bidder
title: SilverMob
description: SilverMob Bidder Adapter
biddercode: silvermob
media_types: banner, video, native
pbjs: true
pbs: true
prebid_member: true
tcfeu_supported: true
gvl_id: 1058
usp_supported: true
coppa_supported: true
schain_supported: true
safeframes_ok: true
deals_supported: true
fpd_supported: false
floors_supported: true
multiformat_supported: will-bid-on-one
sidebarType: 1
---

### Note

The SilverMob Bidding adapter requires setup before beginning. Please contact us at <partners@silvermob.com>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `zoneid`      | required | Placement id         | `'3011'`    | `string` |
| `host`      | optional | Data center location: `us` (default), `eu`, `ru` or `apac` | `'eu'`    | `string` |
| `bidfloor`  | optional | Floor price in `currency`, used when the price floors module gives no value | `0.5` | `number` |
| `currency`  | optional | Request currency, `USD` by default | `'EUR'` | `string` |

Ad units on different zones or data centers are sent as separate requests.

### User Sync

The adapter registers one user sync per data center used in the auction (iframe when enabled, pixel otherwise). Enable iframe syncs to let SilverMob sync with its demand partners in one hop:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ['silvermob'],
        filter: 'include'
      }
    }
  }
});
```
