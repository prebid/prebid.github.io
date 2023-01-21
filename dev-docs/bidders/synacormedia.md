---
layout: bidder
title: Synacor Media
description: Prebid Synacor Media Bidder Adapter
pbjs: true
pbs: true
biddercode: synacormedia
media_types: banner, video
userIds: identityLink, verizonMediaId, pubCommonId
gdpr_supported: false
schain_supported: true
usp_supported: true
pbs_app_supported: true
sidebarType: 1
---

### Note:

The Synacor Media bidder adapter requires setup and approval from Synacor. Please reach out to your account manager for more information and to start using it.

### Configuration

Synacor Media requires that iframe is used for user syncing.

Example configuration:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: '*', // represents all bidders
        filter: 'include'
      }
    }
  }
});
```

### DFP Video Creative
To use video, setup a `VAST redirect` creative within Google AdManager (DFP) with the following VAST tag URL:

```
https://track.technoratimedia.com/openrtb/tags?ID=%%PATTERN:hb_cache_id_synacorm%%&AUCTION_PRICE=%%PATTERN:hb_pb_synacormedia%%
```

### Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `seatId` | required | The seat ID from Synacor Media. This will be the same for all ad units. | `'prebid'` | `string` |
| `tagId` | required | The placement or tag ID from Synacor Media. | `'demo1'` | `string` |
| `bidfloor` | optional | The floor price for the request. | `0.1` | `float` |
| `pos` | optional | The position of the placement on the page, see Open RTB spec v2.5. | `0` | `int` |
| `video` | optional | Optional properties specific to video, see next table | `{ }` | Object |

### Example Ad Unit
```javascript
var adUnits = [{
    "code": "test-div",
    "mediaTypes": {
        "video": {
            "playerSize": [300, 250],
            "context": "instream",
            "minduration": 15,
            "maxduration": 30,
            "startdelay": 1,
            "linearity": 1
        }
    },
    "bids": [{
        "bidder": "synacormedia",
        "params": {
            "seatId": "prebid",
            "tagId": "demo1",
            "bidfloor": 0.20,
            "pos": 1
        }
    }]
}]
```

### Video Parameters (see openrtb 2.5 spec)

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Default | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `minduration` | optional | Minimum ad duration in seconds | `2` | `int` |
| `maxduration` | optional | Maximum ad duration in seconds | `60` | `int` |
| `startdelay` | optional | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements.  | `0` | `int` |
| `placement` | optional | Placement type for the impression. | `null` | `int` |
| `linearity` | optional | Indicates if the impression must be linear, nonlinear, etc. | `1` | `int` |
| `mimes` | optional | Content MIME types supported. | `["video/mp4", "application/javascript"]` | Array(`String`) |
| `protocols` | optional | Array of supported video protocols. | `[1,2,3,4,5,6,7]` | Array(`int`) |
| `api` | optional | List of supported API frameworks for this impression. | `[1,2]` | Array(`int`) |
| `playbackmethod` | optional | Single element array with supported playback methods for this video impression. If multiple values are supplied, first element will be used. | `[1]` | Array(`int`) |
