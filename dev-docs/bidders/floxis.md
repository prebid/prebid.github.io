---
layout: bidder
title: Floxis
description: Prebid Floxis Bidder Adapter
biddercode: floxis
pbjs: true
pbs: false
media_types: banner, video, native
safeframes_ok: true
sidebarType: 1
tcfeu_supported: true
dsa_supported: false
gvl_id: none
usp_supported: true
coppa_supported: true
gpp_supported: true
schain_supported: true
dchain_supported: false
deals_supported: false
floors_supported: yes
fpd_supported: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: partial
privacy_sandbox: no
---

### Note

The Floxis bidder adapter enables integration with the Floxis programmatic advertising platform via Prebid.js. It supports banner, video, and native formats, and is designed for multi-partner, multi-region use. Please contact Floxis to set up your partner account and obtain the required parameters.

### Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
|------|-------|-------------|---------|------|
| `partner` | required | Partner identifier provided by Floxis | `"floxis"` | `string` |
| `placementId` | required | Placement identifier provided by Floxis | `123` | `integer` |

### AdUnit Configuration for Banner

```javascript
var adUnits = [{
    code: 'banner-ad-div',
    mediaTypes: {
        banner: {
            sizes: [[300, 250], [728, 90]]
        }
    },
    bids: [{
        bidder: 'floxis',
        params: {
            partner: 'floxis',
            placementId: 123,
        }
    }]
}];
```

### AdUnit Configuration for Video

```javascript
var adUnits = [{
    code: 'video-ad-div',
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [[640, 480]],
            mimes: ['video/mp4'],
            protocols: [2, 3, 5, 6],
            minduration: 5,
            maxduration: 30
        }
    },
    bids: [{
        bidder: 'floxis',
        params: {
            partner: 'floxis',
            placementId: 456
        }
    }]
}];
```

### AdUnit Configuration for Native

```javascript
var adUnits = [{
    code: 'native-ad-div',
    mediaTypes: {
        native: {
            title: {
                required: true,
                len: 80
            },
            body: {
                required: true
            },
            image: {
                required: true,
                sizes: [150, 50]
            },
            sponsoredBy: {
                required: true
            }
        }
    },
    bids: [{
        bidder: 'floxis',
        params: {
            partner: 'floxis',
            placementId: 789
        }
    }]
}];
```

### Example

```javascript
var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function() {
    pbjs.addAdUnits([{
        code: 'div-gpt-ad-1234567890123-0',
        mediaTypes: {
            banner: {
                sizes: [[300, 250], [320, 50]]
            }
        },
        bids: [{
            bidder: 'floxis',
            params: {
                partner: 'floxis',
                placementId: 123
            }
        }]
    }]);

    pbjs.requestBids({
        timeout: 3000,
        bidsBackHandler: function(bidResponses) {
            // Handle bid responses
            pbjs.setTargetingForGPTAsync();
        }
    });
});
```
