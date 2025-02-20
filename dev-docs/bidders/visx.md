---
layout: bidder
title: YOC VIS.X
description: Prebid YOC VIS.X Bidder Adapter
biddercode: visx
tcfeu_supported: true
tcf2_supported: true
gvl_id: 154
schain_supported: true
userIds: all
media_types: banner, video
deals_supported: true
pbjs: true
pbs: true
sidebarType: 1
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

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                                                                                                                              | Example  | Type      |
| ----- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------- |
| `uid` | required | The publisher's ad unit ID in VIS.X. The parameter can be either an `integer` or `string` for Prebid.js, however `integer` is preferred. | `903536` | `integer` |

### Configuration

The YOC VIS.X adapter has the ability to work in different currencies. Currently, this adapter supports `EUR`, `USD`,
`GBP`, `PLN`, `CHF`, `SEK`. Defaults to `EUR`. If your Ad Server uses `EUR`, you don't need any additional currency settings.
If you would like to trade with VIS.X in a currency different from `EUR`, you should implement some additional settings.

1. Download and configure the Prebid.js Currency module

`http://prebid.org/dev-docs/modules/currency.html`

1. Setup the currency in Currency config

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

The YOC VIS.X Prebid.js adapter responds with VAST XML (in the `vastXml` field) and expects client-side caching enabled. To enable it, use the following settings:

```javascript
pbjs.setConfig({
        cache: {
            url: 'https://prebid.adnxs.com/pbc/v1/cache'
        }
});
```

### Requirements

- In Prebid's `bidderSettings`, the `storageAllowed` parameter must be set to **true**. In Prebid v7.0 and later, `storageAllowed` defaults to false, so you will need to explicitly set this value to true.

{% include dev-docs/storageAllowed.md %}

```javascript
        pbjs.bidderSettings = {
            visx: {
                storageAllowed: true
            }
        }
```

### Bid params

{: .table .table-bordered .table-striped }

| Name  | Scope    | Description                                                                                                                              | Example  | Type      |
| ----- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------- |
| `uid` | required | The publisher's ad unit ID in VIS.X. The parameter can be either an `integer` or `string` for Prebid.js, however `integer` is preferred. | `903536` | `integer` |

### Media type Banner object params

{: .table .table-bordered .table-striped }
| Name    | Scope    | Description                        | Example                    | Type                      |
| ------- | -------- | ---------------------------------- | -------------------------- | ------------------------- |
| `sizes` | required | All sizes this ad unit can accept. | `[[300, 250], [300, 600]]` | `array of integer arrays` |

### Media type Video object params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                          | Example                           | Type            |
| ------------ | -------- | -------------------------------------------------------------------- | --------------------------------- | --------------- |
| `context`    | required | The video context, only 'instream' is allowed.                       | `'instream'`                      | `string`        |
| `playerSize` | required | The size (width, height) of the video player on the page, in pixels. | `[640, 480]`                      | `integer array` |
| `mimes`      | optional | Content MIME types supported.                                        | `['video/mp4', 'video/x-ms-wmv']` | `string array`  |

### Example of Banner Ad unit

```javascript
var bannerAdUnit = {
    code: 'bannerAdUnit1',
    mediaTypes: {
        banner: {
            sizes: [[320, 480], [728, 90]]    // required
        }
    },
    bids: [{
        bidder: 'visx',
        params: {
            uid: 903536                     // required
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
            context: 'instream',              // required
            playerSize: [400, 300],           // required
            mimes: ['video/mp4']              // optional, required by Prebid Server
        }
    },
    bids: [{
        bidder: 'visx',
        params: {
            uid: 921068                     // required
        }
    }]
};
```
