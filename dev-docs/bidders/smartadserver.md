---
layout: bidder
title: Smart AdServer
description: Prebid Smart AdServer Bidder Adaptor
hide: true
biddercode: smartadserver
media_types: outstream
gdpr_supported: true
---

### Note:
The Smart AdServer bidder adaptor requires setup and approval from the Smart AdServer Service team. Please reach out to your account manager for more information and start using it.

### Bid params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                                                    | Example                                                           | Type      |
|------------|----------|----------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|-----------|
| `siteId`   | required | The placement site ID                                                                                          | `1234`                                                            | `integer` |
| `pageId`   | required | The placement page ID                                                                                          | `1234`                                                            | `integer` |
| `formatId` | required | The placement format ID                                                                                        | `1234`                                                            | `integer` |
| `domain`   | optional | The network domain (default see example)                                                                                             | `'http://prg.smartadserver.com', 'https://prg.smartadserver.com'` | `string`  |
| `target`   | optional | The keyword targeting                                                                                          | `'sport=tennis'`                                                  | `string`  |
| `currency` | optional | Override the default currency code (ISO 4217) of the ad request. (Default: `'USD'`)                            | `'EUR'`                                                           | `string`  |
| `bidfloor` | optional | Bid floor for this placement in USD or in the currency specified by the `currency` parameter. (Default: `0.0`) | `0.42`                                                            | `float`   |
| `appName`  | optional | Mobile application name                                                                                        | `'Smart AdServer Preview'`                                        | `string`  |
| `buId`     | optional | Mobile application bundle ID                                                                                   | `'com.smartadserver.android.dashboard'`                           | `string`  |
| `ckId`     | optional | Unique Smart AdServer user ID                                                                                           | `1234567890123456789`                                             | `integer` |
