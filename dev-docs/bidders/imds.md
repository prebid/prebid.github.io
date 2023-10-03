---
layout: bidder
title: iMedia Digital Services (iMDS)
description: Prebid iMedia Digital Services Bidder (iMDS) Adapter
pbjs: true
pbs: true
biddercode: imds
tcfeu_supported: false
usp_supported: true
userIds: all
media_types: banner, video
coppa_supported: false
gpp_supported: true
schain_supported: true
dchain_supported: false
safeframes_ok: true
pbs_app_supported: true
deals_supported: false
floors_supported: true
fpd_supported: false
ortb_blocking_supported: false
multiformat_supported: will-bid-on-any
prebid_member: false
gvl_id: none
sidebarType: 1
---

### Note

The iMedia Digital Services bidder adapter requires setup and approval from iMedia Digital Services. Please reach out to your account manager for more information and to start using it.

### Configuration

iMedia Digital Services requires that `iframe` is used for user syncing.

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

### Google Ad Manager Video Creative
To use video, setup a `VAST redirect` creative within Google Ad Manager with the following VAST tag URL:

If using the new `imds` adapter with x8.x or later:

```text
https://track.technoratimedia.com/openrtb/tags?ID=%%PATTERN:hb_uuid_imds%%&AUCTION_PRICE=%%PATTERN:hb_pb_imds%%
```

If using the legacy `synacormedia` adapter with v7.x or earlier:

```text
https://track.technoratimedia.com/openrtb/tags?ID=%%PATTERN:hb_uuid_synacormedia%%&AUCTION_PRICE=%%PATTERN:hb_pb_synacormedia%%
```

### Bid params

| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `seatId` | required | The seat ID from iMedia Digital Services. This will be the same for all ad units. | `'prebid'` | `string` |
| `tagId` | required | The placement ID or tag ID from iMedia Digital Services. | `'demo1'` | `string` |
| `placementId` | optional | Legacy parameter replaced by `tagId` | `'demo1'` | `string` |
| `bidfloor` | optional | Legacy parameter for floor price for the request. Replaced by [Price Floors Module](/dev-docs/modules/floors.html) | `0.1` | `float` |

### Example Ad Unit

```javascript
var adUnits = [{
    "code": "test-div",
    "mediaTypes": {
        "video": {
            "pos": 1,
            "playerSize": [300, 250],
            "context": "instream",
            "mimes": ["video/mp4"],
            "protocols": [2, 3, 5, 6, 7, 8],
            "playbackmethod": [2],
            "skip": 0,
            "minduration": 15,
            "maxduration": 30,
            "startdelay": 0,
            "linearity": 1
        }
    },
    "bids": [{
        "bidder": "imds",
        "params": {
            "seatId": "prebid",
            "tagId": "demo1",
            "bidfloor": 0.20
        }
    }]
}]
```
