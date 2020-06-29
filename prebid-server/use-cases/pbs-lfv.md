---
layout: page_v2
sidebarType: 5
title: Prebid Server | Use Cases | AMP

---

# Use Case: Prebid Server | AMP


```
var videoAdUnit = [{
  code: 'sample-code',
  sizes: [640,480],
  mediaTypes: {
    video: {
      context: 'adpod',
      playerSize: [640, 480],
      adPodDurationSec: 300,
      durationRangeSec: [15, 30],
      requireExactDuration: true
    }
  },
  bids: [
    {
      bidder: 'appnexus',
      params: {
        placementId: 14542875
      }
    }
  ]
}];
```
