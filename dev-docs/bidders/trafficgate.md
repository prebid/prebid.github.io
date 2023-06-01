---
layout: bidder
title: TrafficGate
description: Prebid TrafficGate Bidder Adaptor
pbs: true
pbjs: true
biddercode: trafficgate
media_types: banner, video
gdpr_supported: true
pbs_app_supported: true
multiformat_supported: will-bid-on-any
usp_supported: true
schain_supported: true
coppa_supported: true
dchain_supported: false
deals_supported: true
floors_supported: false
fpd_supported: false
prebid_member: true
sidebarType: 1
ortb_blocking_supported: true
safeframes_ok: true
---

### Note:

The TrafficGate Bidding adapter requires setup before beginning. Please contact us at support@bidscube.com

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description      | Example     | Type     |
|---------------|----------|------------------|-------------|----------|
| `placementId` | required | Placement ID     | `'12345'`   | `string` |
| `host`        | required | Host             | `'example'` | `string` |
| `customFloor` | optional | Custom Bid Floor | `2.55`      | `number` |


### AdUnit Format for Banner
```javascript
var adUnits = [{
    code: 'test-banner-div ',
    mediaTypes: {
        banner: {
            sizes: [[300, 250]],
        }
    },
    bids: [{
        bidder: 'trafficgate',
        params: {
            placementId: '16',
            host: 'example'
        }
    }]
}];
```

#### Video

#### mediaTypes.video

The following video parameters are supported here so publishers may fully declare their video inventory:

{: .table .table-bordered .table-striped }
| Name           | Scope              | Description                                                                                                                                                                                              | Example | Type      |
|----------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------|
| context | required | instream or outstream |"outstream" | string |
| playerSize| required | width, height of the player in pixels | [640,360] - will be translated to w and h in bid request | array<integers> |
| mimes | required | List of content MIME types supported by the player (see openRTB v2.5 for options) | ["video/mp4"]| array<string>|
| protocols | recommended | Supported video bid response protocol values <br />1: VAST 1.0 <br />2: VAST 2.0 <br />3: VAST 3.0 <br />4: VAST 1.0 Wrapper <br />5: VAST 2.0 Wrapper <br />6: VAST 3.0 Wrapper <br />7: VAST 4.0 <br />8: VAST 4.0 Wrapper | [2,3,5,6] | array<integers>|
| api | recommended | Supported API framework values: <br />1: VPAID 1.0 <br />2: VPAID 2.0 <br />3: MRAID-1 <br />4: ORMMA <br />5: MRAID-2 | [2] |  array<integers> |
| linearity | recommended | OpenRTB2 linearity. 1: linear (in-stream ad), 2: non-linear (overlay ad) | 1 | integer |
| maxduration | recommended | Maximum video ad duration in seconds. | 30 | integer |
| minduration | recommended | Minimum video ad duration in seconds | 6 | integer |
| playbackmethod | recommended | Playback methods that may be in use. Only one method is typically used in practice. (see openRTB v2.5 section 5.10 for options)| [2]| array<integers> |
| minbitrate | optional | Minimum bit rate in Kbps. | 300 | integer |
| maxbitrate | optional | Maximum bit rate in Kbps. | 9600 | integer |
| battr | optional | Blocked creative attributes | [13,14] | array<integers>|
| startdelay | recommended | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements.<br /> >0: Mid-Roll (value indicates start delay in second)<br /> 0: Pre-Roll<br />-1: Generic Mid-Roll<br />-2: Generic Post-Roll | 0 | integer |
| placement | recommended | Placement type for the impression. (see openRTB v2.5 section 5.9 for options) | 1 | integer |
| | | | | |


### AdUnit Format for Video
```javascript
var videoAdUnits = [{
    code: 'test-div-video',
    mediaTypes: {
        video: {
            playerSize: [640, 480],               // required
            context: 'instream',                  // required
            mimes: ['video/mp4','video/x-flv'],   // required
            minduration: 5,                       // optional
            maxduration: 30,                      // optional
            startdelay: 5,                        // optional
            playbackmethod: [1,3],                // optional
            api: [ 1, 2 ],                        // optional
            protocols: [ 2, 3 ],                  // optional
            battr: [ 13, 14 ],                    // optional
            linearity: 1,                         // optional
            placement: 2,                         // optional
            minbitrate: 10,                       // optional
            maxbitrate: 10                        // optional
        }
    },
    bids: [{
        bidder: 'trafficgate',
        params: {
            placementId: '10',
            host: 'example'
        }
    }]
}]
```
