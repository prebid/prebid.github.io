---
layout: bidder
title: VisionForgeX
description: Prebid VisionForgeX Bidder Adapter
biddercode: visionforgex
media_types: banner, video
tcfeu_supported: false
usp_supported: true
gpp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
fpd_supported: true
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
userIds: all
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: false
prebid_member: false
sidebarType: 1
---

## Note

The VisionForgeX bidder adapter connects to the VisionForgeX Exchange, an OpenRTB 2.6 exchange for banner and video. Please reach out to <support@visionforgex.com> for a placement ID before using it.

VisionForgeX is not yet registered on the IAB Europe Global Vendor List. Where GDPR applies, Prebid.js withholds requests to this bidder unless the publisher's consent setup allows it.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                        | Example           | Type     |
|---------------|----------|------------------------------------|-------------------|----------|
| `placementId` | required | The placement ID from VisionForgeX | `'vfx7q2m9k4d1x'` | `string` |

## Test Parameters

The placement IDs `vfx-test-banner` and `vfx-test-video` always answer with a labelled test ad.

```javascript
var adUnits = [{
  code: 'test-div',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  bids: [{
    bidder: 'visionforgex',
    params: {
      placementId: 'vfx-test-banner'
    }
  }]
}];
```

## First Party Data

Publishers should use the `ortb2` method of setting first party data. Site, user, device and imp-level data (`ortb2Imp`) are passed to the exchange as they are.

## Floors

The adapter reads floors from the Prebid floors module (`getFloor`). The exchange may apply a higher floor agreed with the publisher.
