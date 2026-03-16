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
ortb_blocking_supported: true
privacy_sandbox: no
---

### Note

The Floxis bidder adapter enables integration with the Floxis programmatic advertising platform via Prebid.js. It supports banner, video, and native formats with OpenRTB 2.x compliance. Please contact Floxis to set up your partner account and obtain the required parameters.

### Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
|------|-------|-------------|---------|------|
| `seat` | required | Seat identifier provided by Floxis | `"testSeat"` | `string` |
| `region` | required | Region identifier for routing | `"us-e"` | `string` |
| `partner` | required | Partner identifier provided by Floxis | `"floxis"` | `string` |

### Floors Support

The Floxis adapter supports the Prebid.js [Floors Module](https://docs.prebid.org/dev-docs/modules/floors.html). Floor values are automatically included in the OpenRTB request as `imp.bidfloor` and `imp.bidfloorcur`.

### Privacy Support

Privacy fields (GDPR, USP, GPP, COPPA) are handled by Prebid.js core and automatically included in the OpenRTB request.

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
            seat: 'testSeat',
            region: 'us-e',
            partner: 'floxis'
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
            seat: 'testSeat',
            region: 'us-e',
            partner: 'floxis'
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
            seat: 'testSeat',
            region: 'us-e',
            partner: 'floxis'
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
                seat: 'testSeat',
                region: 'us-e',
                partner: 'floxis'
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
