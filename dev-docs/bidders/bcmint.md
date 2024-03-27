---
layout: bidder
title: BCM International
description: BCM International Bid Adapter
biddercode: bcmint
tcfeu_supported: false
usp_supported: true
media_types: video
safeframes_ok: true
deals_supported: false
pbjs: true
pbs: true
pbs_app_supported: true
floors_supported: true
schain_supported: true
multiformat_supported: will-bid-on-one
userIds: all
sidebarType: 1
aliasCode: aso
---
### Note

The BCM International adapter requires approval and setup. Please reach out to <contact@bcm.ltd> or visit us at [bcm.ltd](https://bcm.ltd) for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description      | Example                     | Type      |
|---------------|----------|------------------|-----------------------------|-----------|
| `server`      | required | Server endpoint  | `https://srv.datacygnal.io` | `String`  |
| `zone`        | required | Zone ID          | `73815`                     | `Integer` |

#### Video Caching

Note that the BCM International adapter expects a client-side Prebid Cache to be enabled for video bidding.

```js
pbjs.setConfig({
    cache: {
        url: 'https://prebid.adnxs.com/pbc/v1/cache'
    }
});
```
