---
layout: bidder
title: Slimcut
description: SlimCut Bidder Adapter
pbjs: true
biddercode: slimcut
media_types: video, banner
gdpr_supported: true
gvl_id: 102
sidebarType: 1
---

### Overview

This documentation covers the parameters for the **SlimCut** bidder adapter. And is intended to be referenced by publishers using prebid 1.0 and later.

### Bid Params

Only **placementId** is required and will be sent to you by your SlimCut account manager.

### Example Ad Unit

```javascript
var adUnit = {
    "code": "scm_outstream",
    "mediaTypes": {
        "video": {
            "playerSize": [640, 480],
            "context": "instream"
        }
    },
    "bids": [{
        "bidder": "slimcut",
        "params": {
            "placementId": 5015
        }
    }]
}
```
