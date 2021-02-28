---
layout: bidder
title: YOC VIS.X
description: Prebid YOC VIS.X Bidder Adapter
pbjs: true
pbs: true
biddercode: visx
gdpr_supported: true
schain_supported: true
tcf2_supported: true
userIds: id5Id, unifiedId
pbs_app_supported: true
---

### Note
To be able to use the full bandwidth of VIS.X high impact ad products, we strongly recommend disabling SafeFrames:
- If you are using Google Ad Manager (GAM), make sure the “Serve in Safeframe” box in creative settings is unchecked,
- If you are using AppNexus Seller Tag, make sure the enableSafeFrame parameter is set to False.

If you require SafeFrames to be activated, please reach out to your YOC account manager to obtain further details.

The YOC VIS.X adapter requires setup and approval from your YOC account manager team, even for existing YOC publishers.
Please reach out to your account manager to enable Prebid.js for your account.

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                         | Example    | Type     |
|-------|----------|-------------------------------------|------------|----------|
| `uid` | required | The publisher's ad unit ID in VIS.X | `'903536'` | `string` |

### Configuration

The YOC VIS.X adapter has the ability to work in different currencies. Currently this adapter supports `EUR`, `USD`,
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
- Please make sure that currency module is set up and configured in order to trade with YOC in a currency that is not supported by YOC VIS.X bidder.
- You should set `EUR` in `bidderCurrencyDefault` parameter if you use unsupported currency for VIS.X.
- Feel free to reach out to your contact at YOC if you need additional support setting up Prebid.js and currency config.
