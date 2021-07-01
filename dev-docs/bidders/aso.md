---
layout: bidder
title: Adserver.Online
description: Prebid Adserver.Online Bidder Adapter
biddercode: aso
gdpr_supported: true
usp_supported: true
media_types: video
safeframes_ok: true
bidder_supports_deals: false
pbjs: true
pbs: false
---
### Note:

For more information about [Adserver.Online](https://adserver.online).

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `zone`        | required | Zone ID               | `73815`   | `integer` |

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
    usePrebidCache: true,
    cache: {
        url: 'https://prebid.adnxs.com/pbc/v1/cache'
    }
});
```