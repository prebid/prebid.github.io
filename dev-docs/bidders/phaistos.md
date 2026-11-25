---
layout: bidder
title: Phaistos
description: Prebid Phaistos Bidder Adapter
biddercode: phaistos
pbjs: true
pbs: false
media_types: banner, video
gvl_id: 47
tcfeu_supported: true
gpp_sids: tcfeu
schain_supported: true
deals_supported: true
floors_supported: false
fpd_supported: false
ortb_blocking_supported: false
multiformat_supported: will-bid-on-any
userIds: all
safeframes_ok: true
prebid_member: false
sidebarType: 1
---

### Note

The Phaistos bidder adapter sends OpenRTB auctions to Phaistos expand at
`https://pbs.phaistos.eu`. Contact [prebid@phaistos.eu](mailto:prebid@phaistos.eu)
for publisher onboarding.

Device-storage disclosure (host `uids` cookie via credentialed auction and
iframe user sync):
[phaistos_ads_cookies_disclosure.json](https://static.adman.gr/phaistos_ads_cookies_disclosure.json).

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                      | Type              |
| ----------- | -------- | ------------------------------------------------------------------------------------------------ | ----------------- |
| `id`        | required | ad unit id                                                                                       | `string`/`number` |
| `host`      | optional | the grxchange origin. When omitted, Phaistos prebid server fallbacks to `https://x.grxchange.gr` | `string`          |
| `accountId` | optional | Override for `site.publisher.id`. Defaults to eTLD+1 of the page domain.                         | `string`          |

### First Party Data

This adapter reads first-party data from the standard Prebid locations via
ortbConverter / Prebid Server extensions:

- Request-level OpenRTB from `bidderRequest.ortb2` (e.g. site, user, device, regs, schain)
- Impression-level OpenRTB from `bidRequest.ortb2Imp`

### Configuration

Phaistos recommends enabling iframe-based user sync so mapped SSP seats can
match users on expand:

```javascript
pbjs.setConfig({
    userSync: {
        filterSettings: {
            iframe: {
                bidders: ['phaistos'],
                filter: 'include'
            }
        }
    }
});
```

### Test Parameters
```javascript
var adUnits = [
    {
        code: 'test-banner',
        mediaTypes: {
            banner: {
                sizes: [[300, 250]]
            }
        },
        bids: [{
            bidder: 'phaistos',
            params: {
                id: 42551, // try this on a page hosted on localhost
            }
        }]
    },
    {
        code: 'test-video',
        mediaTypes: {
            video: {
                context: 'instream',
                playerSize: [[640, 360]],
                mimes: ['video/mp4', 'video/webm'],
                protocols: [2, 3, 5, 6],
                api: [1, 2],
                maxduration: 30,
                linearity: 1
            }
        },
        bids: [{
            bidder: 'phaistos',
            params: {
                id: 42552, // try this on a page hosted on localhost
            }
        }]
    }
];
```
