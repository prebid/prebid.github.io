---
layout: bidder
title: Cordless.co
description: Cordless.co Bid Adapter
biddercode: cordless
tcfeu_supported: false
usp_supported: true
media_types: video, native
safeframes_ok: true
pbjs: true
pbs: true
pbs_app_supported: true
floors_supported: true
schain_supported: true
fpd_supported: true
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
userIds: all
sidebarType: 1
aliasCode: aso
---
### Note

The Cordless.co adapter requires approval and setup. Please reach out to <info@cordless.co> or visit us at [cordless.co](https://cordless.co) for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description      | Example                         | Type      |
|---------------|----------|------------------|---------------------------------|-----------|
| `server`      | required | Server endpoint  | `https://srv.cordlessmedia.com` | `String`  |
| `zone`        | required | Zone ID          | `73815`                         | `Integer` |

#### Video Caching

Note that the Cordless.co adapter expects a client-side Prebid Cache to be enabled for video bidding.

```js
pbjs.setConfig({
    cache: {
        url: 'https://prebid.adnxs.com/pbc/v1/cache'
    }
});
```
