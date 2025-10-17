---
layout: api_prebidjs
title: pbjs.adServers.gam.getVastXml(options)
description: adServers.gam.getVastXml API
sidebarType: 1
---


{: .alert.alert-info :}
The Google Ad Manager implementation of this function requires including the dfpAdServerVideo module in your Prebid.js build.

This method extends the behavior of `buildVideoUrl` by not only constructing the Google Ad Manager video ad tag URL, but also fetching and processing the resulting VAST wrapper returned by GAM.

If the `cache.useLocal` flag is set to true, the function scans the received GAM VAST wrapper for the bid’s cached asset URL that corresponds to a locally stored blob in Prebid.js. When such a match is found, it replaces the contents of the GAM wrapper with the contents of the locally cached VAST XML blob, effectively inlining the ad markup instead of referencing it remotely.

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

#### Example

```javascript
pbjs.requestBids({
    bidsBackHandler: async function(bidResponses) {
        const bidResponse = bidResponses['div-gpt-ad-51545-0'];
        if (!bidResponse) {
          return;
        }
        const bid = bidResponse.bids[0];
        const vastXml = await pbjs.adServers.gam.getVastXml({
          bid,
          adUnit: 'div-gpt-ad-51545-0',
          params: {
            iu: '/41758329/localcache',
            url: "https://pubads.g.doubleclick.net/gampad/ads?iu=/41758329/localcache&sz=640x480&gdfp_req=1&output=vast&env=vp",
          }                
        });
        jwplayer("player").setup({
          playlist: "https://cdn.jwplayer.com/v2/media/hWF9vG66",
          autostart: "viewable",
          advertising: {
              client: "vast",
              schedule: [
                { 
                  vastxml: vastXml,
                  offset: 'pre'
                }
              ]
          }
        });
    }
});
```
