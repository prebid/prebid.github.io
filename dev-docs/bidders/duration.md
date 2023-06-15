---
layout: bidder
title: Duration Media
description: Prebid Duration Media Bidder Adapter
biddercode: duration
aliasCode: nobid
pbjs: true
pbs: true
media_types: banner, video
gdpr_supported: true
gvl_id: 816
usp_supported: true
schain_supported: true
coppa_supported: true
userId: criteo, unifiedId, id5Id
safeframes_ok: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `siteId` | required | siteId is provided by your Duration Media account manager(s) |         | `integer` |
| `placementId` | optional | placementId is provided by your Duration Media account manager(s). This parameter allows to report on a specific ad unit |         | `integer` |
| `video`| optional | Object containing video targeting parameters. Note that this parameter is not used in Prebid Server.  See [Video Object](#duration-video-object) for details. | `video: { playback_method: ['auto_play_sound_off'] }` | `object`|

### Note

If you are using Google Ad Manager (GAM), it is highly recommended to make sure the “Serve in Safeframe” box in creative settings is unchecked. 
If you absolutely want to run Duration Media in a Saferame creative, please contact your Duration Media repsentative to coordinate this setup.


### Test Parameters

```javascript
var adUnits = [
    {
        code: 'test-div1',
        mediaTypes: {
            banner: {
                sizes: [[300, 250]],  // a display size
            }
        },
        bids: [
            {
                bidder: "duration",
                params: {
                    siteId: 2,
                    placementId: 3
                }
            }
        ]
    },{
        code: 'test-div2',
        mediaTypes: {
            banner: {
                sizes: [[320, 50]],   // a mobile size
            }
        },
        bids: [
            {
                bidder: "duration",
                params: {
                    siteId: 2
                }
            }
        ]
    }
];
```

<a name="duration-video-object"></a>

#### Video Object

{: .table .table-bordered .table-striped }
| Name              | Description                                                                                                                                                                                                                                          | Type             |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| `skippable`       | Boolean which, if `true`, means the user can click a button to skip the video ad. Defaults to `false`.                                                                                                                                               | `boolean`        |
| `playback_method` | Array of strings listing playback methods supported by the publisher. Allowed values: `"auto_play_sound_on"`; `"auto_play_sound_off"`; `"click_to_play"`; `"mouseover"`; `"auto_play_sound_unknown"`; `"viewport_sound_on"`, `"viewport_sound_off"`. | `Array<string>`  |
| `position`        | Array of strings listing video player position supported by the publisher. Allowed values: `"na"`, `"atf"`, `"btf"`, `"head"`, `"foot"`, `"sidebar"`, `"full"`.                                                                                      | `Array<string>`  |
| `mimes`           | Array of strings listing the content MIME types supported, e.g., `["video/x-flv", "video/x-ms-wmv"]`.                                                                                                                                                | `Array<string>`  |
| `minduration`     | Integer that defines the minimum video ad duration in seconds.                                                                                                                                                                                       | `integer`        |
| `maxduration`     | Integer that defines the maximum video ad duration in seconds.                                                                                                                                                                                       | `integer`        |
| `frameworks`      | Array of integers listing API frameworks supported by the publisher. Allowed values: None: `0`; VPAID 1.0: `1`; VPAID 2.0: `2`; MRAID 1.0: `3`; ORMMA: `4`; MRAID 2.0: `5`.                                                                          | `Array<integer>` |
