---
layout: bidder
title: Smart
description: Prebid Smart Bidder Adaptor
hide: true
biddercode: smartadserver
biddercode_longer_than_12: true
media_types: outstream
gdpr_supported: true
---
### "Send All Bids" Ad Server Keys:
(truncated to 20 chars due to [DFP limit](https://support.google.com/dfp_premium/answer/1628457?hl=en#Key-values))

`hb_pb_smartadserver`
`hb_adid_smartadserve`
`hb_size_smartadserve`

### Note:
The Smart bidder adaptor requires setup and approval from the Smart Service team. Please reach out to your account manager for more information and start using it.

### Bid params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                                                    | Example                                                           | Type      |
|------------|----------|----------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|-----------|
| `domain`   | required | The network domain                                                                                             | `'http://prg.smartadserver.com', 'https://prg.smartadserver.com'` | `string`  |
| `siteId`   | required | The placement site ID                                                                                          | `1234`                                                            | `integer` |
| `pageId`   | required | The placement page ID                                                                                          | `1234`                                                            | `integer` |
| `formatId` | required | The placement format ID                                                                                        | `1234`                                                            | `integer` |
| `target`   | optional | The keyword targeting                                                                                          | `'sport=tennis'`                                                  | `string`  |
| `currency` | optional | Override the default currency code (ISO 4217) of the ad request. (Default: `'USD'`)                            | `'EUR'`                                                           | `string`  |
| `bidfloor` | optional | Bid floor for this placement in USD or in the currency specified by the `currency` parameter. (Default: `0.0`) | `0.42`                                                            | `float`   |
| `appName`  | optional | Mobile application name                                                                                        | `'Smart AdServer Preview'`                                        | `string`  |
| `buId`     | optional | Mobile application bundle ID                                                                                   | `'com.smartadserver.android.dashboard'`                           | `string`  |
| `ckId`     | optional | Unique Smart user ID                                                                                           | `1234567890123456789`                                             | `integer` |
