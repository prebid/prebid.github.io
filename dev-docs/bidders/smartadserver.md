---
layout: bidder
title: Smart AdServer
description: Prebid Smart AdServer Bidder Adapter
biddercode: smartadserver
media_types: display, video, native, audio
tcfeu_supported: true
gvl_id: 45
tcfeu_supported: true
multiformat_supported: will-bid-on-any
coppa_supported: true
gpp_supported: true
gpp_sids: tcfca, tcfeu, usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
usp_supported: true
fpd_supported: true
dsa_supported: true
deals_supported: true
safeframes_ok: true
userIds: all
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: false
floors_supported: true
ortb_blocking_supported: true
privacy_sandbox: no
sidebarType: 1
---

## Registration

The Smart AdServer bidder adapter requires setup and approval from the Equativ (former Smart AdServer) service team. Please reach out to your account manager for more information and start using it.

## Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `networkId` | required for Prebid Server | The network identifier you have been provided with | `1234` | `integer` |
| `placementuuid` | optional, Prebid Server only | Placement identifier of the new inventory structure. Preferred way to identify inventory on Prebid Server; forwarded to Equativ as `imp.ext.bidder.plcmtuuid`. When `siteId`/`pageId`/`formatId` are also supplied, all fields are forwarded and Equativ decides which to use. | `'0ac7b8e4-8f35-4d1b-9a3c-2b7c0f7d9e11'` | `string` |
| `siteId` | required for Prebid.js | The placement site ID | `1234` | `integer` |
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

**Note:** On Prebid Server this adapter is also reachable under the bidder code `equativ` (an alias sharing these params). For Prebid.js the site, page and format identifiers have to all be provided. For Prebid Server, `placementuuid` is the preferred way to identify inventory; the site, page and format identifiers are kept for the ramp-up and, if used, have to all be provided or all empty.

<a name="smartadserver-video-object"></a>

### Video Object

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `protocol` | optional | Maximum open RTB video protocol supported | `8` (VAST 4.0 wrapper) | `integer` |
| `startDelay` | optional | Allowed values: 1 (generic pre-roll, default), 2 (generic mid-roll), 3 (generic post-roll) | `1` | `integer` |

## Supported Media Types (Prebid.js)

{: .table .table-bordered .table-striped }
| Type | Support |
| --- | --- |
| `banner` | Supported |
| `video` | Supported |
| `audio` | Supported |
| `native` | Not currently supported |

## Supported Media Types (Prebid Server)

{: .table .table-bordered .table-striped }
| Type | Support |
| --- | --- |
| `banner` | Supported |
| `video` | Supported |
| `audio` | Supported |
| `native` | Supported |

## Coppa support
Coppa is supported by our prebid server adapter but not by our prebid.js adapter.

## Examples

Without site/page/format:

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
        "networkId": 73
      }
    }
  }]
```

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
        "networkId": 73,
        "siteId": 1,
        "pageId": 2,
        "formatId": 3
      }
    }
  }]
```

With placementuuid:

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
        "networkId": 73,
        "placementuuid": "0ac7b8e4-8f35-4d1b-9a3c-2b7c0f7d9e11"
      }
    }
  }]
```
