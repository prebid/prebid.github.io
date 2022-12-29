---
layout: bidder
title: SmartRTB
description: SmartRTB / smrtb.com Bidder Module
biddercode: smartrtb
gdpr_supported: true
media_types: banner, video
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
pbjs: true
pbs: true
pbs_app_supported: true
enable_download: false
pbjs_version_notes: not ported to 5.x
sidebarType: 1
---

### Registration

Please contact us to create a new Smart RTB Marketplace account, and for any assistance in configuration.
You may email info@smrtb.com for inquiries.

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }

| Name     | Scope    | Description | Example                            | Type     |
|----------|----------|-------------|------------------------------------|----------|
| `zoneId` | required |             | `z_261b6c7e7d4d4985393b293cc903d1` | `string` |
| `forceBid` | optional | Returns test bid | true | `boolean` |

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }

| Name     | Scope    | Description | Example                            | Type     |
|----------|----------|-------------|------------------------------------|----------|
| `pub_id` | required | Publisher ID assigned to you.  | `'siteA'` | `string` |
| `zone_id` | optional | Enables mapping for further settings and reporting in the Marketplace UI. | `'z_261b6c7e7d4d4985393b293cc903d1'` | `string` |
| `force_bid` | optional | If zone ID is mapped, this may be set to always return fake sample bids (banner, video) | true | `boolean` |

### Test Prebid Server Request

This sample request is our global test placement and should always return a branded banner bid.

```
        {
        "id": "abc",
        "site": {
            "page": "prebid.org"
        },
        "imp": [{
                "id": "test",
                "banner": {
                        "format": [{
                                "w": 300,
                                "h": 250
                        }]
                },
                "ext": {
                        "smartrtb": {
			    "pub_id": "test",
			    "zone_id": "N4zTDq3PPEHBIODv7cXK",
			    "force_bid": true
                        }
                }
        }]
    }
```
