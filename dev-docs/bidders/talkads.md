---
layout: bidder
title: Talkads
description: Talkads Prebid Bidder Adapter
biddercode: talkads
gdpr_supported: true
gvl_id: 
usp_supported: false
coppa_supported: false
media_types: banner, native
safeframes_ok: false
pbjs: true
pbs: false
prebid_member: false
pbjs_version_notes: v4.35 and later
---

### Registration

The Talkads Adapter requires setup before beginning. Please contact us at www.natexo.com and register to the publisher side.

### Configuration

#### Prebid.js

The TalkAds adapter does not work without setting the correct tag ID and bidder URL.
These parameters are totally specific to each Publisher, you will receive them when contacting us.

```
pbjs.setConfig({
    talkads: {
        tag_id: <identifier>,
        bidder_url: '<bidder url>',
    }
});
```

#### Native example

```
var adUnits = [
    code: '/19968336/prebid_native_example_1',
    mediaTypes: {
        native: {
        }
    },
    bids: [{
        bidder: 'talkads',
        params: {},
    }]
];
```

#### Banner example
```
var adUnits = [
    code: '/19968336/prebid_display_example_1',
    mediaTypes: {
      banner: {
        sizes: [[300, 250]]
      } 
    },
    bids: [{
        bidder: 'talkads',
        params: {},
    }]
];
```
