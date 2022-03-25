---
layout: bidder
title: YIELDONE
description: Prebid YIELDONE Bidder Adaptor
biddercode: yieldone
media_types: banner, video
userIds: identityLink, imuid
pbjs: true
pbs: true

---

### Note:

THE YIELDONE adapter requires setup and approval from the YIELDONE team.<br/>
Please reach out to your account team or y1s@platform-one.co.jp for more information.


### Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                      | Example      | Type              |
|-----------------|----------|----------------------------------|--------------|-------------------|
| `placementId`   | required | The placement ID                 | `"36891"`    | `string`          |
| `playerSize`    | optional | Video Resolution Size<br/>(This field is mandatory if mediaTypes.video.playerSize is [1, 1]) | `[640, 360]` | `array of number` |
| `playerParams`  | optional | Video Player Params (see below)  | `{}`         | `object` |
| `playerParams.wrapperWidth`  | optional | Video Player Width  | `"320px"`    | `string` |
| `playerParams.wrapperHeight` | optional | Video Player Height | `"180px"`    | `string` |


### Multi-Format Ad Units

If you use Multi-Format Ad Units, "video" bid object should be placed before "banner" bid object.<br/>
And if Bid Params contains playerParams, it will request a "video" media type ad.<br/>
If it does not, it will request a "banner" media type ad.


### AdUnit Format Example

#### AdUnit Format for Banner
```javascript
var bannerAdUnits = [{
    code: "test-div-banner",
    mediaTypes: {
        banner: {
            sizes: [
                [300, 250],
                [1, 1]
            ]
        },
    },
    bids: [{
        bidder: "yieldone",
        params: {
            placementId: "36891" // required
        }
    }]
}]
```


#### AdUnit Format for Video
```javascript
var videoAdUnits = [{
    code: "test-div-video",
    mediaTypes: {
        video: {
            playerSize: [640, 360],
            context: "outstream"
        }
    },
    bids: [{
        bidder: "yieldone",
        params: {
            placementId: "36892",       // required
            playerParams: {             // optional
                wrapperWidth: "320px",  // optional
                wrapperHeight: "180px"  // optional
            },
        }
    }]
}]
```


#### AdUnit Format for Multi Ads
```javascript
var multiAdUnits = [{
    code: "test-div-multi",
    mediaTypes: {
        banner: {
            sizes: [
                [300, 250],
                [1, 1]
            ]
        },
        video: {
            playerSize: [640, 360],
            context: "outstream"
        }
    },
    bids: [{
        // * "video" bid object should be placed before "banner" bid object.
        // This bid will request a "video" media type ad.
        bidder: "yieldone",
        params: {
            placementId: "36892",       // required
            playerParams: {             // required
                wrapperWidth: "320px",  // optional
                wrapperHeight: "180px"  // optional
            },
        }
    },
    {
        // This bid will request a "banner" media type ad.
        bidder: "yieldone",
        params: {
            placementId: "36891"        // required
        }
    }]
}];
```


#### AdUnit Format for Video (mediaTypes.video.playerSize: [1,1])
```javascript
var videoAdUnits = [{
    code: "test-div-video",
    mediaTypes: {
        video: {
            playerSize: [1, 1],
            context: "outstream"
        }
    },
    bids: [{
        bidder: "yieldone",
        params: {
            placementId: "36892",       // required
            playerSize: [640, 360],     // required
            playerParams: {             // optional
                wrapperWidth: "320px",  // optional
                wrapperHeight: "180px"  // optional
            },
        }
    }]
}]
```


#### AdUnit Format for Multi Ads (mediaTypes.video.playerSize: [1,1])
```javascript
var multiAdUnits = [{
    code: "test-div-multi",
    mediaTypes: {
        banner: {
            sizes: [
                [300, 250],
                [1, 1]
            ]
        },
        video: {
            playerSize: [1, 1],
            context: "outstream"
        }
    },
    bids: [{
        // * "video" bid object should be placed before "banner" bid object.
        // This bid will request a "video" media type ad.
        bidder: "yieldone",
        params: {
            placementId: "36892",       // required
            playerSize: [640, 360],     // required
            playerParams: {             // required
                wrapperWidth: "320px",  // optional
                wrapperHeight: "180px"  // optional
            },
        }
    },
    {
        // This bid will request a "banner" media type ad.
        bidder: "yieldone",
        params: {
            placementId: "36891"        // required
        }
    }]
}];
```
