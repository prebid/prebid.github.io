---
layout: bidder
title: Smart AdServer
description: Prebid Smart AdServer Bidder Adaptor
hide: true
biddercode: smartadserver
media_types: display, video
gdpr_supported: true
schain_supported: true
tcf2_supported: true
usp_supported: true
---

### Note:
The Smart AdServer bidder adaptor requires setup and approval from the Smart AdServer Service team. Please reach out to your account manager for more information and start using it.

### Bid params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                                                    | Example                                                              | Type      |
|------------|----------|----------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|-----------|
| `siteId`   | required | The placement site ID                                                                                          | `1234`                                                               | `integer` |
| `pageId`   | required | The placement page ID                                                                                          | `1234`                                                               | `integer` |
| `formatId` | required | The placement format ID                                                                                        | `1234`                                                               | `integer` |
| `domain`   | optional | The network domain (default see example)                                                                       | `'http://prg.smartadserver.com', 'https://prg.smartadserver.com'`    | `string`  |
| `target`   | optional | The keyword targeting                                                                                          | `'sport=tennis'`                                                     | `string`  |
| `currency` | optional | Override the default currency code (ISO 4217) of the ad request. (Default: `'USD'`)                            | `'EUR'`                                                              | `string`  |
| `bidfloor` | optional | Bid floor for this placement in USD or in the currency specified by the `currency` parameter. (Default: `0.0`) | `0.42`                                                               | `float`   |
| `appName`  | optional | Mobile application name                                                                                        | `'Smart AdServer Preview'`                                           | `string`  |
| `buId`     | optional | Mobile application bundle ID                                                                                   | `'com.smartadserver.android.dashboard'`                              | `string`  |
| `ckId`     | optional | Unique Smart AdServer user ID                                                                                  | `1234567890123456789`                                                | `integer` |
| `video`    | optional | Parameter object for instream video. See [video Object](#smartadserver-video-object)                           | `{}`                                                                 | `object`  |
| `schain`   | optional | Supply Chain                                                                                                   | `'1.0,1!exchange1.com,1234,1,bid-request-1,publisher,publisher.com'` | `string`  |


<a name="smartadserver-video-object" />

#### Video Object

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                                                                             | Example                | Type      |
|--------------|----------|-------------------------------------------------------------------------------------------------------------------------|------------------------|-----------|
| `protocol`   | optional | Maximum open RTB video protocol supported                                                                               | `8` (VAST 4.0 wrapper) | `integer` |
| `startDelay` | optional | Allowed values: 1 (generic pre-roll), 2 (generic mid-roll), 3 (generic post-roll), 0 (all positions, default)           | `1`                    | `integer` |
