---
layout: bidder
title: Edge Query X
description: Prebid for Edge Query X Adaptor
pbjs: true
biddercode: edgequeryx 
media_types: display
gdpr_supported: true
schain_supported: true
usp_supported: true
pbjs_version_notes: not in 5.x
---

### Note:
The Edge Query bidder adaptor requires setup and approval from the Edge Query team. Please reach out to your account manager for more information and start using it.

### Bid params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                                                    | Example                                                              | Type      |
|------------|----------|----------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|-----------|
| `accountId`| required | The account ID                                                                                                 | `test`                                                               | `string`  |
| `widgetId` | required | The widget ID                                                                                                  | `test`                                                               | `string`  |
| `domain`   | optional | The network domain (default see example)                                                                       | `'https://deep.edgequery.io'`                                        | `string`  |
| `appName`  | optional | Mobile application name                                                                                        | `'Edge Query Preview'`                                           | `string`  |

