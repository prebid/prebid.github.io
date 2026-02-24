---
layout: bidder
title: Kobler
description: Kobler Bidder Adapter
biddercode: kobler
pbjs: true
pbs: true
media_types: banner
floors_supported: true
deals_supported: true
sidebarType: 1
---

### Note

The Kobler Bidder Adapter requires setup and approval from Kobler AS.
Please reach out to <bidding-support@kobler.no> for more information.

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                                                                                                                                                                                               | Example                      | Type               |
|---------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|--------------------|
| `test`        | optional | Whether the request is for testing only. When multiple ad units are submitted together, it is enough to set this parameter on the first one. Enables providing a custom URL through config.pageUrl. Defaults to false.                                    | `true`                       | `boolean`          |
| `floorPrice`  | optional | Floor price in CPM and in USD. Can be used as an alternative to the [Floors module](https://docs.prebid.org/dev-docs/modules/floors.html), which is also supported by this adapter. Defaults to 0.                                                        | `5.0`                        | `float`            |
| `dealIds`     | optional | Array of deal IDs.                                                                                                                                                                                                                                        | `['abc328745', 'mxw243253']` | `array of strings` |

### Prebid.js Implicit parameters

Kobler identifies the placement using the combination of the page URL and the allowed sizes. As a result, it's important that the correct sizes are provided in `banner.sizes` in order for Kobler to correctly identify the placement. The main, desired format should be the first element of this array.

### Example

```javascript
  const adUnits = [{
    code: 'div-gpt-ad-1460505748561-1',
    mediaTypes: {
        banner: {
            sizes: [[320, 250], [300, 250]],
        }
    },
    bids: [{
      bidder: 'kobler'
    }]
  }];
```

In order to see a sample bid from Kobler (without a proper setup), you have to also do the following:

- Prebid.js: Set the `test` parameter of Kobler's adapter to `true`. Prebid-server: Set the `test` parameter of the bid request to `1`.
- Prebid.js: Set `config.pageUrl` to `'https://www.tv2.no/mening-og-analyse/14555348/'`. Prebid-server: Set the `site.page` parameter of the bid request to `'https://www.tv2.no/mening-og-analyse/14555348/'`. This is necessary because Kobler only bids on recognized articles. Kobler runs its own test campaign to make sure there is always a bid for this specific page URL.

### Example With Optional Parameters

```javascript
  const adUnits = [{
    code: 'div-gpt-ad-1460505748561-1',
    mediaTypes: {
        banner: {
            sizes: [[320, 250], [300, 250]],
        }
    },
    bids: [{
      bidder: 'kobler',
      params: {
        test: true,
        floorPrice: 5.0,
        dealIds: ['abc328745', 'mxw243253']
      }
    }]
  }];
```
