---
layout: bidder
title: Adserver.Online
description: Prebid Adserver.Online Bidder Adapter
biddercode: aso
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
---
### Note

For more information about [Adserver.Online](https://adserver.online), please contact <support@adsrv.org>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description             | Example                  | Type      |
|---------------|----------|-------------------------|--------------------------|-----------|
| `zone`        | required | Zone ID                 | `73815`                  | `Integer` |
| `server`      | optional | Custom bidder endpoint  | `https://endpoint.url`   | `String`  |

### Test Parameters

```js
 var adUnit = {
    code: 'unit1',
    mediaTypes: {
        banner: {
            sizes: [[300, 250]]
        }
    },
    bids: [
        {
            bidder: 'aso',
            params: {
                zone: 73815,
            }
        }
    ]
}
```

#### Video Caching

Note that the Adserver.Online adapter expects a client-side Prebid Cache to be enabled for video bidding.

```js
pbjs.setConfig({
    cache: {
        url: 'https://prebid.adnxs.com/pbc/v1/cache'
    }
});
```
