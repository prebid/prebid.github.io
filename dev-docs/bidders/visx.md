---
layout: bidder
title: YOC VIS.X
description: Prebid YOC VIS.X Bidder Adapter
biddercode: visx
gdpr_supported: true
tcf2_supported: true
gvl_id: 154
schain_supported: true
userIds: id5Id, unifiedId
media_types: banner, video
bidder_supports_deals: true
pbjs: true
pbs: true
---

### Note

To be able to use the full bandwidth of VIS.X high impact ad products, we strongly recommend disabling SafeFrames:
- If you are using Google Ad Manager (GAM), make sure the "Serve in Safeframe" box in creative settings is unchecked,
- If you are using AppNexus Seller Tag, make sure the enableSafeFrame parameter is set to False.

If you require SafeFrames to be activated, please reach out to your YOC account manager to obtain further details.

If a single bid request contains more than 20 impression objects, this request will be ignored.

The YOC VIS.X adapter requires setup and approval from your YOC account manager team, even for existing YOC publishers.
Please reach out to your account manager to enable Prebid.js for your account.

### Configuration: Currency

The YOC VIS.X adapter has the ability to work in different currencies. Currently, this adapter supports `EUR`, `USD`,
`GBP`, `PLN`. Defaults to `EUR`. If your Ad Server uses `EUR`, you don't need any additional currency settings.
If you would like to trade with VIS.X in a currency different from `EUR`, you should implement some additional settings.

1. Download and configure the Prebid.js Currency module.

`http://prebid.org/dev-docs/modules/currency.html`

2. Setup the currency in Currency config.

a) If your Ad Server uses the currency from the list of VIS.X supported currencies (e.g. `GBP`), use the following settings:

```javascript
pbjs.setConfig({
    currency: {
        adServerCurrency: 'GBP',
        bidderCurrencyDefault: {
            visx: 'GBP'
        }
    }
});
```

b) If your Ad Server uses an unsupported currency for VIS.X (e.g. `JPY`), use the following settings:

```javascript
pbjs.setConfig({
    currency: {
        adServerCurrency: 'JPY',
        bidderCurrencyDefault: {
            visx: 'EUR'
        }
    }
});
```

Best practices:
- Please make sure that the currency module is set up and configured in order to trade with YOC in a currency that is not supported by the YOC VIS.X bidder.
- You should set `EUR` in `bidderCurrencyDefault` parameter if you use unsupported currencies for VIS.X.
- Feel free to reach out to your contact at YOC if you need additional support setting up Prebid.js and the currency config.

### Configuration: Video

The YOC VIS.X adapter responds with VAST XML (in the 'vastXml' field) and expects client-side caching enabled.

```javascript
pbjs.setConfig({
        cache: {
            url: 'https://prebid.adnxs.com/pbc/v1/cache'
        }
});
```

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                         | Example    | Type     |
|-------|----------|-------------------------------------|------------|----------|
| `uid`   | required | The publisher's Ad unit ID in VIS.X. | `'903536'` | `string` |

### Media type Banner object params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                         | Example    | Type     |
|-------|----------|-------------------------------------|------------|----------|
| `sizes`  | required | All sizes this ad unit can accept. | `[[300, 250], [300, 600]]` | `array of integer arrays` |

### Media type Video object params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                         | Example    | Type     |
|-------|----------|-------------------------------------|------------|----------|
| `context`     | required | The video context, only 'instream' is allowed. | `'instream'` | `string` |
| `playerSize`  | required | The size (width, height) of the video player on the page, in pixels. | `[640, 480]` | `integer array` |
| `mimes`       | required | Content MIME types supported. | `['video/mp4', 'video/x-ms-wmv']` | `string array` |
| `protocols`   | required | Array of supported video protocols. Refer to List 5.8 of IAB OpenRTB 2.5 (e.g., VAST 3.0 Wrapper). | `[2,3,5,6]` | `integer array` |
| `api`         | optional | List of supported API frameworks for this impression. Refer to List 5.6 of IAB OpenRTB 2.5 (e.g., VPAID 2.0). If an API is not explicitly listed, it is assumed not to be supported. | `[2]` | `integer array` |
| `minduration` | optional | Minimum video ad duration in seconds. | `5` | `integer` |
| `maxduration` | optional | Maximum video ad duration in seconds. | `30` | `integer` |
| `skip`        | optional | Indicates if the player will allow the video to be skipped, where 0 = no, 1 = yes. | `1` | `integer` |

### Example of Banner Ad unit

```javascript
var bannerAdUnit = {
    code: 'bannerAdUnit1',
    mediaTypes: {
        banner: {
            sizes: [[320, 480], [728, 90]]             // required
        }
    },
    bids: [{
        bidder: 'visx',
        params: {
            uid: '903536'           // required
        }
    }]
};
```

### Example of Video Ad unit

```javascript
var videoAdUnit = {
    code: 'videoAdUnit1',
    mediaTypes: {
        video: {
            context: 'instream',                       // required
            playerSize: [400, 300],                    // required
            mimes: ['video/mp4', 'video/x-ms-wmv'],    // required
            protocols: [2, 3, 5, 6],                   // required
            api: [2],                                  // optional
            minduration: 5,                            // optional
            maxduration: 30,                           // optional
            skip: 1                                    // optional
        }
    },
    bids: [{
        bidder: 'visx',
        params: {
            uid: '921068'           // required
        }
    }]
};
```
