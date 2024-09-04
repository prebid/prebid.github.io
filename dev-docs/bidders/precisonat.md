---
layout: bidder
title: Precisonat
description: Prebid Precisonat Bid Adapter
gdpr_supported: true
gvl_id: 874
media_types: native
gdpr_supported: true
usp_supported: true
pbjs: true
pbs: false
biddercode: precisonat
prebid_member: true
floors_supported: true
safeframes_ok: true
schain_supported: true
userIds: sharedId
deals_supported: false
coppa_supported: true
multiformat_supported: will-not-bid
ortb_blocking_supported: true
sidebarType: 1
---

### Modules

SharedID: We need you to include the [SharedID module](/dev-docs/modules/userid-submodules/sharedid.html) in order to bid effectively on your inventory.

### Registration

The precisonat Bidding adapter requires setup before beginning. Please contact us at [tech@preciso.net]

#### OpenRTB Parameters
The following table contains currently supported parameters we parse.

{: .table .table-bordered .table-striped }

| Name               | Scope    | Description                                                   | Example           | Type           |
|--------------------|----------|---------------------------------------------------------------|-------------------|----------------|
| `bcat`             | optional | List of blocked advertiser categories (IAB)                   | `['IAB1-1']`      | `string array` |
| `badv`             | optional | Blocked Advertiser Domains                                    | `['example.com']` | `string array` |
| `wlang`            | optional | Allow List of languages for creatives using ISO-639-1-alpha-2 | `['fr', 'en']`    | `string array` |

Example configuration:

```javascript

pbjs.setConfig({
    ortb2: {
      bcat: ['IAB1-1'],
      badv: ['example.com'],
      wlang: ['fr', 'en']
    }
});
```

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description         | Example       | Type     |
|---------------|----------|---------------------|---------------|----------|
| `publisherId` | required | Numeric Publisher ID <br>(as provided by Preciso)  | `'123AB123'`    | `string` |
| `region`      | optional,recommended | 3 letter country code     | `'USA'` | `string` |
| `bidFloor`    | optional,recommended | Minimum bid for this impression expressed in CPM (USD)  | `0.01`        | `float`  |
| `pageType`    | optional, recommended  | Kind of content present in the page   | `'homepage'`          | `String`     |
| `currency`    | optional, recommended  | type of currencies   |  `['USD']`   |  `string array`  |
| `bcat`        | optional | List of blocked advertiser categories (IAB)   | `['IAB1-1']`          | `string array`    |
| `badv`        | optional | Blocked Advertiser Domains| `'example.com'`   | `string array`| 

Notes:

- Preferred to provide the `bcat` and `badv` within the first party data (above). When both methods are provided, first party data values will be prioritized.

### Example Ad Unit

``````javascript

  var adUnits = [
                {
                    code: 'placementId_0',
                    mediaTypes: {
                        native: {
                             ortb: {
                                assets: [
                                   {
                                        id: 3,
                                        required: 1,
                                        img: {
                                            type: 3,
                                            w: 300,
                                            h: 250
                                        }
                                    },
                                {
                                    id: 1,
                                    required: 1,
                                    title: {
                                        len: 800
                                    }
                                },
                                {
                                    id: 4,
                                    required: 0,
                                    data: {
                                        type: 1
                                    }
                                }
                            ]
                        } 
                        }
                    },
                    bids: [
                        {
                            bidder: 'precisonat',
                            params: {
                                publisherId: 'PRECISO_TEST00001',
                                traffic: 'native',
                                bidFloor: 0.12,
                                currency: ['USD'],
                                region: 'USA'
                            }
                        }
                    ]
                },
            ]; 
``````
