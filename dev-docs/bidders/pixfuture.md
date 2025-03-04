---
layout: bidder
title: PixFuture
description: Prebid PixFuture Bidder Adapter
biddercode: pixfuture
media_types: banner
gvl_id: 839
tcfeu_supported: true
prebid_member: false
coppa_supported: true
usp_supported: true
userIds: criteoId, unifiedId, id5Id, sharedId, identityLink, liveIntentId, fabrickId
pbs: true
pbjs: true
sidebarType: 1
---

### Overview

The PixFuture Bidder Adapter connects publishers to PixFuture’s demand via Prebid.js and Prebid Server, supporting banner media types. To use this adapter, your PixFuture account must be approved for Prebid integration. Contact <support@pixfuture.com> to request activation or for setup assistance.

#### Solution

To download the PixFuture adapter for Prebid.js, visit [https://docs.prebid.org/download.html](https://docs.prebid.org/download.html) and select the `pixfuture` bidder from the list, along with other bidders you wish to include in your build. For Prebid Server, ensure your server instance includes the `pixfuture` bidder (consult your Prebid Server host for setup details).

**Important:** The `pixfuture` adapter requires account approval from PixFuture. To enable this integration, email <support@pixfuture.com>.

---

### Bid Parameters

| Name       | Scope    | Description                                                        | Example       | Type     |
|------------|----------|--------------------------------------------------------------------|---------------|----------|
| `pix_id`   | required | A unique ID for your site’s ad placement. Corresponds to each ad size. | `"12312345"`    | `string` |

These bid parameters are supported by both the Prebid.js and Prebid Server pixfuture adapter.

The `pix_id` is a unique identifier provided by PixFuture and must be specified for each ad placement/size combination. This parameter is consistent across both Prebid.js and Prebid Server.

---

### Prebid.js Integration

#### Basic Prebid.js Example

Below is an example of configuring ad units for PixFuture in Prebid.js:

```javascript
var adUnits = [
    {
        code: 'test-div-300x250',
        mediaTypes: {
            banner: {
                sizes: [[300, 250]]
            }
        },
        bids: [
            {
                bidder: 'pixfuture',
                params: {
                    pix_id: "11234567890"
                }
            }
        ]
    },
    {
        code: 'test-div2-728x90',
        mediaTypes: {
            banner: {
                sizes: [[728, 90]]
            }
        },
        bids: [
            {
                bidder: 'pixfuture',
                params: {
                    pix_id: "0987654321"
                }
            }
        ]
    }
];
