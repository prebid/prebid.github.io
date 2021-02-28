---
layout: bidder
title: Smart AdServer
description: Prebid Smart AdServer Bidder Adaptor
biddercode: smartadserver
media_types: display, video
gdpr_supported: true
schain_supported: true
tcf2_supported: true
usp_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
pbjs: true
pbs: true
---

### Registration

The Smart AdServer bidder adaptor requires setup and approval from the Smart AdServer Service team. Please reach out to your account manager for more information and start using it.

### Bid params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                                                    | Example                                                                                                            | Type      |
|------------|----------|----------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|-----------|
| `networkId`   | required for Prebid Server | The network identifier you have been provided with.    | `1234`                                                               | `integer` |
| `siteId`   | required for Prebid.js | The placement site ID                                                                                          | `1234`                                                               | `integer` |
| `pageId`   | required | The placement page ID                                                                                          | `1234`                                                               | `integer` |
| `formatId` | required | The placement format ID                                                                                        | `1234`                                                               | `integer` |
| `domain`   | optional | The network domain (default see example)                                                                       | `'http://prg.smartadserver.com', 'https://prg.smartadserver.com'`    | `string`  |
| `target`   | optional | The keyword targeting                                                                                          | `'sport=tennis'`                                                     | `string`  |
| `bidfloor` | optional | Bid floor for this placement in USD or in the currency specified by the `currency` parameter. (Default: `0.0`) | `0.42`                                                               | `float`   |
| `appName`  | optional | Mobile application name                                                                                        | `'Smart AdServer Preview'`                                           | `string`  |
| `buId`     | optional | Mobile application bundle ID                                                                                   | `'com.smartadserver.android.dashboard'`                              | `string`  |
| `ckId`     | optional | Unique Smart AdServer user ID                                                                                  | `1234567890123456789`                                                | `integer` |
| `video`    | optional | Parameter object for instream video. See [video Object](#smartadserver-video-object)                           | `{}`                                                                 | `object`  |
| `schain`   | optional | Supply Chain                                                                                                   | `'1.0,1!exchange1.com,1234,1,bid-request-1,publisher,publisher.com'` | `string`  |

**Note:** The site, page and format identifiers have to all be provided or all empty.

<a name="smartadserver-video-object" />

#### Video Object

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                                                                             | Example                | Type      |
|--------------|----------|-------------------------------------------------------------------------------------------------------------------------|------------------------|-----------|
| `protocol`   | optional | Maximum open RTB video protocol supported                                                                               | `8` (VAST 4.0 wrapper) | `integer` |
| `startDelay` | optional | Allowed values: 1 (generic pre-roll, default), 2 (generic mid-roll), 3 (generic post-roll)                               | `1`                    | `integer` |

### Examples 

Without site/page/format :
```
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

With site/page/format :

```
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
                            "siteId": 1,
                            "pageId": 2,
                            "formatId": 3
			}
		}
	}]
```
