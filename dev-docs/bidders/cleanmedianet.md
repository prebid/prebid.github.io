---
layout: bidder
title: Clean Media Net
description: Clean Media Bidder Adapter
biddercode: cleanmedianet
pbjs: true
pbs: true
media_types: banner, video
userIds: all
gvl_id: 644
tcfeu_supported: true
tcf2_supported: true
schain_supported: true
usp_supported: true
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
sidebarType: 1
aliasCode: gamoshi
---

### Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|-------------------|----------|---------------------------------------------------------------|----------------------|----------|
| `supplyPartnerId` or `inventory_id` or `supply_partner_id` | required | ID of the supply partner. This parameter can be either a `string` or `integer` for Prebid.js, however `integer` is preferred |  `12345`  | `integer` |
| `bidfloor`        | optional | Minimum acceptable bid price. Must be a positive number. | `0.5` | `number` |
| `instl`           | optional | Interstitial flag (1 for interstitial, 0 for non-interstitial). | `1` | `integer` |
| `pos`             | optional | Ad position on the page. | `1` | `integer` |
| `video`           | optional | Object containing video targeting parameters. See [Video Object](#video-object) for details. | `video: { playback_method: ['auto_play_sound_off'] }` | `object` |

This adapter only requires you to provide your Inventory Id (Supply partner id), and optionally your RTB endpoint.

#### Video Object

For details on how these video params work with the params set in the adUnit.mediaTypes.video object.

{: .table .table-bordered .table-striped }
| Name              | Description                                                                                                                                                                                                                                  | Type             |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| `minduration` | Integer that defines the minimum video ad duration in seconds. | `integer` |
| `maxduration` | Integer that defines the maximum video ad duration in seconds. | `integer` |
| `protocols`   | Array of integers listing the supported video protocols (VAST versions). | `Array<integer>` |
| `mimes`       | Array of strings listing the supported MIME types for the video creative. | `Array<string>` |
| `pos`         | Ad position on the screen. | `integer` |
| `api`         | Array of integers listing the supported API frameworks. | `Array<integer>` |
| `skip`        | Indicates if the player will allow the video to be skipped (0 = no, 1 = yes). | `integer` |
| `plcmt`       | Video placement type. | `integer` |
| `placement`   | Placement type for the impression. | `integer` |
| `playbackmethod` | Array of integers listing the playback methods. | `Array<integer>` |
| `startdelay`  | Indicates the offset of the ad placement from the start of the video content. | `integer` |
| `context`     | Content context (e.g., 'instream', 'outstream'). | `string` |

### Example Ad Unit Configurations

#### Banner Ad Unit

```javascript
var adUnits = [
    {
        code: 'banner-div',
        mediaTypes: {
            banner: {
                sizes: [[300, 250], [728, 90]]
            }
        },
        bids: [
            {
                bidder: 'cleanmedianet',
                params: {
                    supplyPartnerId: 12345,
                    bidfloor: 0.5,
                    pos: 1
                }
            }
        ]
    }
];
```

#### Video Ad Unit (Instream)

```javascript
var adUnits = [
    {
        code: 'video-div',
        mediaTypes: {
            video: {
                playerSize: [[640, 480]],
                context: 'instream',
                mimes: ['video/mp4', 'video/webm'],
                protocols: [2, 3, 5, 6],
                maxduration: 30,
                api: [1, 2]
            }
        },
        bids: [
            {
                bidder: 'cleanmedianet',
                params: {
                    supplyPartnerId: 12345,
                    video: {
                        minduration: 5,
                        maxduration: 30,
                        protocols: [2, 3, 5, 6],
                        mimes: ['video/mp4', 'video/webm'],
                        playbackmethod: [2],
                        skip: 1,
                        startdelay: 0,
                        api: [1, 2],
                        plcmt: 1
                    }
                }
            }
        ]
    }
];
```

#### Video Ad Unit (Outstream)

```javascript
var adUnits = [
    {
        code: 'outstream-div',
        mediaTypes: {
            video: {
                playerSize: [[640, 480]],
                context: 'outstream',
                mimes: ['video/mp4', 'video/webm']
            }
        },
        bids: [
            {
                bidder: 'cleanmedianet',
                params: {
                    supplyPartnerId: 12345,
                    rendererUrl: 'https://example.com/outstream-renderer.js',
                    video: {
                        minduration: 5,
                        maxduration: 30,
                        protocols: [2, 3, 5, 6],
                        mimes: ['video/mp4', 'video/webm'],
                        playbackmethod: [2],
                        placement: 3,
                        plcmt: 3,
                        context: 'outstream'
                    }
                }
            }
        ]
    }
];
```
