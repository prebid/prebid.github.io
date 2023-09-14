---
layout: bidder
title: Bidgency Group
description: Bidgency Group Bid Adapter
biddercode: bidgency
tcfeu_supported: false
usp_supported: true
media_types: video
safeframes_ok: true
deals_supported: false
pbjs: true
pbs: false
floors_supported: true
schain_supported: true
multiformat_supported: will-bid-on-one
userIds: all
sidebarType: 1
aliasCode: aso
---
### Note

The Bidgency Group adapter requires approval and setup. Please reach out to <aso@bidgency.com> or visit us at [bidgency.com](https://bidgency.com) for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description      | Example                     | Type      |
|---------------|----------|------------------|-----------------------------|-----------|
| `server`      | required | Server endpoint  | `https://srv.bidgx.com`     | `String`  |
| `zone`        | required | Zone ID          | `73815`                     | `Integer` |

#### Video Caching

Note that the Bidgency Group adapter expects a client-side Prebid Cache to be enabled for video bidding.

```js
pbjs.setConfig({
    usePrebidCache: true,
    cache: {
        url: 'https://prebid.adnxs.com/pbc/v1/cache'
    }
});
```
