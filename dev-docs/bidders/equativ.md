---
layout: bidder
title: Equativ
description: Prebid Equativ Bidder Adapter
biddercode: equativ
media_types: display
tcfeu_supported: true
gvl_id: 45
tcfeu_supported: true
gpp_supported: true
schain_supported: true
usp_supported: true
userIds: all
pbjs: true
pbs: false
floors_supported: true
sidebarType: 1
---

### Registration

The Equativ bidder adapter requires setup and approval from the Equativ (former Smart AdServer) service team. Please reach out to your account manager for more information and start using it.

### Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|------|-------|-------------|---------|------|
| `networkId` | required for Prebid Server | The network identifier you have been provided with. **Note**: the `Equativ` bid adapter currently only supports client-side implementations. | `1234` | `integer` |
| `siteId` | required for Prebid.js | The placement site ID |`1234` | `integer` |
| `pageId` | required for Prebid.js | The placement page ID | `1234` | `integer` |
| `formatId` | required for Prebid.js | The placement format ID | `1234` | `integer` |
| `domain` | optional | The network domain (default see example) | `'http://prg.smartadserver.com', 'https://prg.smartadserver.com'` | `string` |
| `target` | optional | The keyword targeting | `'sport=tennis'` | `string` |
| `bidfloor` | optional | Bid floor for this placement in USD or in the currency specified by the `currency` parameter. (Default: `0.0`) | `0.42` | `float` |
| `appName` | optional | Mobile application name | `'Smart AdServer Preview'` | `string` |
| `buId` | optional | Mobile application bundle ID | `'com.smartadserver.android.dashboard'` | `string` |
| `ckId` | optional | Unique Smart AdServer user ID | `1234567890123456789` | `integer` |
| `video` | optional | Parameter object for instream video. See [video Object](#smartadserver-video-object) | `{}` | `object` |
| `schain` | optional | Supply Chain | `'1.0,1!exchange1.com,1234,1,bid-request-1,publisher,publisher.com'` | `string` |

**Note:** The site, page and format identifiers have to all be provided (for Prebid.js).

### Supported Media Types (Prebid.js)

{: .table .table-bordered .table-striped }
| Type | Support |
|---|---|
| `banner` | Supported |
| `video` | Not currently supported |
| `native` | Not currently supported |

### Example

With site/page/format:

```json
  "imp": [{
    "id": "some-impression-id",
    "banner": {
      "format": [{
        "w": 600,
        "h": 500
      }, {
        "w": 300,
        "h": 600
      }]
    },
    "ext": {
      "smartadserver": {
                            "siteId": 1,
                            "pageId": 2,
                            "formatId": 3
      }
    }
  }]
```
