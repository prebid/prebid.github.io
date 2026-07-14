---
layout: bidder
title: Adquery
description: Prebid Adquery Bidder Adaptor
pbjs: true
pbs: true
biddercode: adquery
tcfeu_supported: true
usp_supported: true
schain_supported: true
gvl_id: 902
userIds: adQuery QiD
sidebarType: 1
media_types: banner, video
---

## Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                 | Example                                                                  | Type      |
|---------------|----------|-----------------------------------------------------------------------------|--------------------------------------------------------------------------|-----------|
| `placementId` | required | Placement ID provided by Adquery (must match the type/format in dashboard)  | `d30f79cf7fef47bd7a5611719f936539bec0d2e9`                               | `string`  |
| `type`        | required | Ad format/type – tells Adquery what kind of creative to return              | `banner`, `video`, `interstitial`, `anchorad`                            | `string`  |

**Notes:**

- `placementId` is always required and should correspond to a placement configured in the Adquery dashboard for the specific `type`.
- `type` is required in bidder params and determines the creative format returned by Adquery.
- For **banner** ads: define sizes in `mediaTypes.banner.sizes`. The adapter automatically parses and sends them.
- For **video** bids: use `type: 'video'` and set `mediaTypes.video.context` to either `outstream` or `instream`.
- For **video** bids, `mediaTypes.video.playerSize` is required.
- For **video** (`outstream`): a renderer or equivalent outstream player integration is required (e.g. InRenderer or similar).
- For **video** (`instream`): a compatible instream video player integration is required to render the returned VAST response.
- For special formats (`interstitial`, `anchorad`): use the placeholder size `[[1, 1]]`.

### Example 1: Standard Banner Ad

```javascript
{
    code: 'banner-div',
    mediaTypes: {
        banner: {
            sizes: [[300, 250], [320, 50], [728, 90]]
        }
    },
    bids: [{
        bidder: 'adquery',
        params: {
            placementId: '9e0a916215d99196f44821dfc348c2843ee5b5a7',
            type: 'banner'
        }
    }]
}
```

### Example 2: Outstream Video Ad (with renderer)

```javascript
{
    code: 'video-outstream-1',
    mediaTypes: {
        video: {
            context: 'outstream',
            playerSize: [[640, 360]],
            mimes: ['video/mp4', 'video/webm'],
            protocols: [2, 3, 5, 6, 7, 8],
            api: [2],
            placement: 1,
            startdelay: 0,
            skip: 1
        }
    },
    renderer: {
        url: 'https://cdn.jsdelivr.net/npm/in-renderer-js@1/dist/in-renderer.umd.min.js',
        render: function(bid) {
            var renderer = new window.InRenderer();
            renderer.render('video-outstream-1', bid);
        }
    },
    bids: [{
        bidder: 'adquery',
        params: {
            placementId: 'd30f79cf7fef47bd7a5611719f936539bec0d2e9',
            type: 'video'
        }
    }]
}
```

### Example 3: Interstitial + Anchor Ad (no sizes)

```javascript
// Interstitial (full-page overlay)
{
    code: 'interstitial-div',
    mediaTypes: {
        banner: {
            sizes: [[1, 1]]
        }
    },
    bids: [{
        bidder: 'adquery',
        params: {
            placementId: 'd30f79cf7fef47bd7a5611719f936539bec0d2e9',
            type: 'interstitial'
        }
    }]
},

// Anchor / fixed bottom bar
{
    code: 'anchor-div',
    mediaTypes: {
        banner: {
            sizes: [[1, 1]]
        }
    },
    bids: [{
        bidder: 'adquery',
        params: {
            placementId: 'd30f79cf7fef47bd7a5611719f936539bec0d2e9',
            type: 'anchorad'
        }
    }]
}
```
