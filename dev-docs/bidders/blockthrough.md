---
layout: bidder
title: Blockthrough
description: Prebid BT Bidder Adapter
biddercode: blockthrough
gvl_id: 815
usp_supported: true
coppa_supported: false
gpp_sids: usp
schain_supported: true
dchain_supported: false
userId: pubProvidedId, id5Id, criteo, sharedId, identityLink, unifiedId, userId
media_types: banner
floors_supported: true
fpd_supported: true
pbjs: true
pbs: true
multiformat_supported: will-not-bid
ortb_blocking_supported: false
sidebarType: 1
---

### Note

The BT Bid Adapter makes requests to the BT Server which supports OpenRTB.

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html). The BT adapter requires setup and approval from the Blockthrough team. Please reach out to [marketing@blockthrough.com](mailto:marketing@blockthrough.com) for more information.

### Prebid JS

#### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| -------- | -------- | --------------------------- | ------- | --------- |
| `bidderCode` | required | Bidder configuration. Could configure several bidders this way. | `bidderA: {publisherId: 55555}` | `object` |

#### Bid Config

Make sure to set required orgID, websiteID values received after approval using `pbjs.setBidderConfig`.

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ----------- | -------- | ---------------------------------- | ------------------ | --------- |
| `orgID` | required | A unique ID for your organization provided by the Blockthrough team. | `4829301576428910` | `string` |
| `websiteID` | required | A unique ID for your site provided by the Blockthrough team. | `5654012389765432` | `string` |

#### Example

```javascript
pbjs.setBidderConfig({
  bidders: ['blockthrough'],
  config: {
    ortb2: {
      site: {
        ext: {
          blockthrough: {
            orgID: '4829301576428910',
            websiteID: '5654012389765432',
          },
        },
      },
    },
  },
});
```

#### AdUnits configuration example

```javascript
var adUnits = [
  {
    code: 'banner-div-1',
    mediaTypes: {
      banner: {
        sizes: [[728, 90]],
      },
    },
    bids: [
      {
        bidder: 'blockthrough',
        params: {
          bidderA: {
            publisherId: 55555,
          },
          bidderB: {
            zoneId: 12,
          },
        },
      },
    ],
  },
];
```
