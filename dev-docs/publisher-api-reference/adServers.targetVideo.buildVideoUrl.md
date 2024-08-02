---
layout: api_prebidjs
title: pbjs.adServers.targetVideo.buildVideoUrl(options)
description: adServers.targetVideo.buildVideoUrl API
sidebarType: 1
---


{: .alert.alert-info :}
TargetVideo Ad Server implementation of this function requires including the `targetVideoAdServerVideo` module in your Prebid.js build.

This method combines publisher-provided parameters with Prebid.js targeting parameters to build a TargetVideo Ad Server video ad tag URL that can be used by a video player.

#### Argument Reference

##### The `options` object

{: .table .table-bordered .table-striped }
| Field    | Type   | Description                                                                                                                                                                        |
|----------+--------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `adUnit` | object | *Optional*. The Prebid ad unit to which the returned URL will map.                                                                                                                 |
| `params` | object | *Required*. Querystring parameters that will be used to construct the TargetVideo Ad Server video ad tag URL. See below for fields. |
| `bid`    | object | *Optional*. The Prebid bid for which targeting will be set. If this is not defined, Prebid will use the bid with the highest CPM for the adUnit.                                   |

{: .alert.alert-warning :}
One or both of options.adUnit and options.bid is required. In other words, you may pass in one, the other, or both, but not neither.

##### The `options.params` object

{: .table .table-bordered .table-striped }
| Field             | Type   | Description                                                                                                                 | Example                                         |
|-------------------+--------+-----------------------------------------------------------------------------------------------------------------------------+-------------------------------------------------|
| `iu`              | string | *Required*. TargetVideo Ad Server ad unit ID or link.                                                                                                 | `/19968336/prebid_cache_video_adunit`           |
| `cust_params`     | object | *Optional*. Key-value pairs merged with Prebid's targeting values and sent to TargetVideo Ad Server on the video ad tag URL.                  | `{section: "blog", anotherKey: "anotherValue"}` |

#### Examples

There are several different ways to build up your video URL, as shown in the examples below:

Using `options.params.iu` as ad unit id:

```javascript
pbjs.requestBids({
    bidsBackHandler: function(bids) {
        var videoUrl = pbjs.adServers.targetVideo.buildVideoUrl({
            adUnit: videoAdUnit,
            params: {
                iu: "/19968336/prebid_cache_video_adunit",
                cust_params: {
                    section: "blog",
                    anotherKey: "anotherValue"
                },
            }
        });
        invokeVideoPlayer(videoUrl);
    }
});
```

Using `options.params.iu` as ad link:

```javascript
pbjs.requestBids({
    bidsBackHandler: function(bids) {
        var videoUrl = pbjs.adServers.targetVideo.buildVideoUrl({
            adUnit: videoAdUnit,
            params: {
                iu: "https://vid.tvserve.io/ads/bid?iu=/19968336/prebid_cache_video_adunit",
                cust_params: {
                    section: "blog",
                    anotherKey: "anotherValue"
                },
            }
        });
        invokeVideoPlayer(videoUrl);
    }
});
```

<a name="module_pbjs.requestBids"></a>
