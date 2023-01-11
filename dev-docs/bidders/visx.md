---
layout: bidder
title: VIS.X
description: Prebid VIS.X Bidder Adaptor
hide: true
biddercode: visx
gdpr_supported: true
---

### Note
To be able to use the full bandwidth of VIS.X high impact ad products, we strongly recommend disabling SafeFrames:
- If you are using Google Ad Manager (GAM), make sure the “Serve in Safeframe” box in creative settings is unchecked,
- If you are using AppNexus Seller Tag, make sure the enableSafeFrame parameter is set to False.

If you require SafeFrames to be activated, please reach out to your YOC account manager to obtain further details.

The YOC VIS.X adaptor requires setup and approval from your YOC account manager team, even for existing YOC publishers.
Please reach out to your account manager to enable Prebid.js for your account.

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                                                                                                                             | Example    | Type                  |
| ----- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| `uid` | required | The publisher's ad unit ID in VIS.X. The parameter can be either a `string` or `integer` for Prebid.js, however `integer` is preferred. | `'903536'` | `integer` or `string` |

### Configuration

The VIS.X adaptor has the ability to work in different currencies. Currently this adaptor supports `EUR`, `USD`,
`GBP`, `PLN`. Defaults to `EUR`. If your Ad Server uses `EUR`, you don't need any additional currency settings.
If you would like to trade with VIS.X in a currency different from `EUR`, you should implement some additional settings.

1. Download and configure the Prebid.js Currency module.

`http://prebid.org/dev-docs/modules/currency.html`

2. Setup the currency in Currency config.

a) If your Ad Server uses the currency from the list of VIS.X supported currencies (e.g. `GPB`), use the following settings:

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
- Please make sure that currency module is set up and configured in order to trade with VIS.X in a currency that is not supported by VIS.X bidder.
- You should set `EUR` in `bidderCurrencyDefault` parameter if you use unsupported currency for VIS.X.
- Feel free to reach out to your contact at VIS.X if you need additional support setting up Prebid.js and currency config.
