---
layout: api_prebidjs
title: pbjs.adServers.dfp.buildVideoUrl(options)
description: 
sidebarType: 1
---


{: .alert.alert-info :}
The Google Ad Manager implementation of this function requires including the `dfpAdServerVideo` module in your Prebid.js build.

This method combines publisher-provided parameters with Prebid.js targeting parameters to build a Google Ad Manager video ad tag URL that can be used by a video player.

#### Argument Reference

##### The `options` object

{: .table .table-bordered .table-striped }
| Field    | Type   | Description                                                                                                                                                                        |
|----------+--------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `adUnit` | object | *Required*. The Prebid ad unit to which the returned URL will map.                                                                                                                 |
| `params` | object | *Optional*. Querystring parameters that will be used to construct the Google Ad Manager video ad tag URL. Publisher-supplied values will override values set by Prebid.js. See below for fields. |
| `url`    | string | *Optional*. The video ad server URL. When given alongside params, the parsed URL will be overwritten with any matching components of params.                                       |
| `bid`    | object | *Optional*. The Prebid bid for which targeting will be set. If this is not defined, Prebid will use the bid with the highest CPM for the adUnit.                                   |

{: .alert.alert-warning :}
One or both of options.params and options.url is required. In other words, you may pass in one, the other, or both, but not neither.

##### The `options.params` object

{: .table .table-bordered .table-striped }
| Field             | Type   | Description                                                                                                                 | Example                                         |
|-------------------+--------+-----------------------------------------------------------------------------------------------------------------------------+-------------------------------------------------|
| `iu`              | string | *Required*. Google Ad Manager ad unit ID.                                                                                                 | `/19968336/prebid_cache_video_adunit`           |
| `cust_params`     | object | *Optional*. Key-value pairs merged with Prebid's targeting values and sent to Google Ad Manager on the video ad tag URL.                  | `{section: "blog", anotherKey: "anotherValue"}` |
| `description_url` | string | *Optional*. Describes the video. Required for Ad Exchange. Prebid.js will build this for you unless you pass it explicitly. | `https://www.example.com`                        |

For more information on any of these params, see [the Google Ad Manager video tag documentation](https://support.google.com/admanager/answer/1068325).

#### Examples

There are several different ways to build up your video URL, as shown in the examples below:

Using `options.params` only:

```javascript
pbjs.requestBids({
    bidsBackHandler: function(bids) {
        var videoUrl = pbjs.adServers.dfp.buildVideoUrl({
            adUnit: videoAdUnit,
            params: {
                iu: '/19968336/prebid_cache_video_adunit',
                cust_params: {
                    section: "blog",
                    anotherKey: "anotherValue"
                },
                hl: "en",
                output: "xml_vast2",
                url: "https://www.example.com",
            }
        });
        invokeVideoPlayer(videoUrl);
    }
});
```

Using `options.url` only:

```javascript
var adserverTag = 'https://pubads.g.doubleclick.net/gampad/ads?'
+ 'sz=640x480&iu=/19968336/prebid_cache_video_adunit&impl=s&gdfp_req=1'
+ '&env=vp&output=xml_vast2&unviewed_position_start=1&hl=en&url=https://www.example.com'
+ '&cust_params=section%3Dblog%26anotherKey%3DanotherValue';

var videoUrl = pbjs.adServers.dfp.buildVideoUrl({
    adUnit: videoAdUnit,
    url: adserverTag
});
```

<a name="module_pbjs.requestBids"></a>

{: .alert.alert-warning :}
In the event of collisions, querystring values passed via `options.params` take precedence over those passed via `options.url`.