---
title: Azerion Edge RTD Provider
display_name: Azerion Edge RTD Provider
description: Client-side contextual cookieless audiences.
page_type: module
module_type: rtd
module_code: azerionedgeRtdProvider
enable_download: true
vendor_specific: true
usp_supported: true
gdpr_supported: true
gvl_id: 253
---

# Azerion Edge RTD Provider

:::warning Disclosure
This module loads external code that is not open source and has not been reviewed by Prebid.org.
:::

Client-side contextual cookieless audiences.

Azerion Edge RTD module helps publishers to capture users' interest audiences on their site,
and attach these into the bid request.

Please contact [edge@azerion.com](mailto:edge@azerion.com) for more information.

Maintainer: [azerion.com](https://www.azerion.com/)

## Integration

* Compile the Azerion Edge RTD module (`azerionedgeRtdProvider`) into your Prebid build,
along with the parent RTD Module (`rtdModule`):

```bash
gulp build --modules=rtdModule,azerionedgeRtdProvider
```

* Set configuration via `pbjs.setConfig`.

```js
pbjs.setConfig(
    ...
    realTimeData: {
        auctionDelay: 1000,
        dataProviders: [
            {
                name: 'azerionedge',
                waitForIt: true,
                params: {
                    key: '',
                    bidders: ['improvedigital'],
                    process: {}
                }
            }
        ]
    }
    ...
}
```

### Parameters


| Name | Type | Description | Notes |
| :--- | :------- | :------------------ | :--------------- |
| name | `String` | RTD sub module name | Always "azerionedge" |
| waitForIt | `Boolean` | Required to ensure that the auction is delayed for the module to respond. | Optional. Defaults to false but recommended to true. |
| params.key | `String` | Publisher partner specific key | Mandatory. The key is required for the module to work. If you haven't received one, please reach [support@improvedigital.com](mailto:support@improvedigital.com) |
| params.bidders | `Array` | Bidders with which to share segment information | Optional. Defaults to "improvedigital". |
| params.process | `Object` | Configuration for the Azerion Edge script. | Optional. Defaults to `{}`. |
