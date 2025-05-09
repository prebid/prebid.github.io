---
layout: bidder
title: Bridgeupp
description: Bridgeupp Bidder Adapter
biddercode: sonarads
tcfeu_supported: true
usp_supported: true
gvl_id: 1300
coppa_supported: true
schain_supported: true
media_types: banner
pbjs: true
pbs_app_supported: true
sidebarType: 1
multiformat_supported: will-bid-on-any
safeframes_ok: false
deals_supported: false
floors_supported: true
fpd_supported: false
pbs: false
---

### Note

The Bridgeupp Prebid adapter requires a setup to create a Site IDs. Please contact your Bridgeupp partner manager for setup assistance.
For queries, write to us at <support@bridgeupp.com>

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description          | Example  | Type     |
|---------------|----------|----------------------|----------|----------|
| `siteId`      | required | Placement ID         | `'1234'` | `string` |
| `bidfloor`    | optional | Minimum price in USD | `'1.50'` | `float`  |

### First Party Data

Bridgeupp supports both `ortb2` and `ortb2Imp` methods to set [First Party Data](https://docs.prebid.org/features/firstPartyData.html).
Propertis like :

| Name              | Scope    | Description                                                                                     | Example           | Type           |
|-------------------|----------|-------------------------------------------------------------------------------------------------|-------------------|----------------|
| `ortb2.site`      | optional | Information about the publisher's website provided through an OpenRTB Site object.              | N/A               | `object`       |
| `ortb2.user`      | optional | Information about the advertising device's human user, provided through an OpenRTB User object. | N/A               | `object`       |
| `ortb2.device`    | optional | Information about the user's device provided through an OpenRTB device object.                  | N/A               | `object`       |
| `ortb2.bcat`      | optional | Blocked advertiser categories using the IAB content categories.                                 | `[ "IAB25" ]`     | `string array` |
| `ortb2.badv`      | optional | Block list of advertisers by their domains                                                      | `[ "ford.com" ]`  | `string array` |

### Example Ad-Units

#### Banner

```javascript
    var adUnits = [{
        code: 'test-div',
        mediaTypes: {
            banner: {
                sizes: [[300, 250], [336, 336]]
            }
        },
        bids: [{
            bidder: 'sonarads',
            params: {
                siteId: 'site-id-example-132', // siteId provided by Bridgeupp
                bidfloor: 0.01
            }
        }]
    }];
```
