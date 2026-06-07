---
layout: bidder
title: PixFuture
description: Prebid PixFuture Bidder Adapter
biddercode: pixfuture
media_types: banner, video
gvl_id: 839
tcfeu_supported: true
prebid_member: false
coppa_supported: true
usp_supported: true
userIds: criteoId, unifiedId, id5Id, sharedId, identityLink, liveIntentId, fabrickId
pbs: false
pbjs: true
sidebarType: 1
---

## Overview

The PixFuture Bidder Adapter connects publishers to PixFuture’s demand via Prebid.js, supporting **banner and video media types**.

To use this adapter, your PixFuture account must be approved for Prebid integration. Contact <support@pixfuture.com> to request activation or for setup assistance.

### Solution

To download the PixFuture adapter for Prebid.js, visit:

[/download] 

Select the `pixfuture` bidder from the list, along with other bidders you wish to include in your build.

**Important:**  
The `pixfuture` adapter requires account approval from PixFuture.  
To enable this integration, email <support@pixfuture.com>.

### Bid Parameters

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description                                                                               | Example      | Type     |
|----------|----------|-------------------------------------------------------------------------------------------|--------------|----------|
| `pix_id` | required | A unique ID for your site’s ad placement. Corresponds to each ad size or video placement. | `"12312345"` | `string` |

These bid parameters are supported by the Prebid.js PixFuture adapter.

The `pix_id` is a unique identifier provided by PixFuture and must be specified for each ad placement.

# Prebid.js Integration

## Banner Example

Below is an example configuration for banner inventory.

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
                pix_id: "098765"
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
                pix_id: "012345"
            }
        }
    ]
}
];

```

## Video Example

Below is an example configuration for video inventory.

```javascript
var adUnits = [
{
    code: 'video-ad-unit-1',
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [[640, 320]],
            mimes: ['video/mp4'],
            protocols: [2, 3, 5, 6],
            playbackmethod: [2],
            api: [2],
            placement: 1
        }
    },
    bids: [
        {
            bidder: 'pixfuture',
            params: {
                pix_id: '012345'
            }
        }
    ]
}
];

```

This configuration enables the PixFuture adapter to participate in instream video auctions and return VAST responses that can be rendered by VAST-compatible video players (e.g., Google IMA SDK or Video.js).
