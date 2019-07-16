---
layout: bidder
title: Prebid Server
description: Prebid Server S2S Adaptor
biddercode: prebidServer
biddercode_longer_than_12: true
hide: true
media_types: video
gdpr_supported: true
---

### Sign up

Sign up for account on [prebid.adnxs.com](https://prebid.adnxs.com)

### Bid Params

Bid params are sourced from the adapter configurations set for client side. These do not need to change for Prebid Server.

### Configuration
To enable prebid server, set the following configuration.

```
pbjs.setConfig({
    s2sConfig: {
        accountId : '12345',
        bidders : ['appnexus','pubmatic', 'rubicon'],
        defaultVendor: 'appnexus'
    }
});
```
Configuration options

{: .table .table-bordered .table-striped }
| Field        | Type          | Required? | Description                                                              |
|--------------+---------------+-----------+--------------------------------------------------------------------------|
| `accountId`  | String        | X         | Prebid Server account ID.                                                |
| `bidders`    | Array[String] | X         | List of bidder codes; must have been enabled during Prebid.js build.     |
| `defaultVendor` | String     |           | Automatically includes all following options in the config with vendor's default values.  Individual properties can be overridden by including them in the config along with this setting. |
| `enabled`    | Boolean       | X         | Enables S2S; default: `false`.                                           |
| `endpoint`   | String        | X         | Set the endpoint. For example: `https://prebid.adnxs.com/pbs/v1/openrtb2/auction` |
| `timeout`    | Number        |           | Bidder timeout, in milliseconds; default: `1000`.                         |
| `syncEndpoint` | String     |           | Configures the user-sync endpoint. Highly recommended.                    |
| `adapter`    | String        |           | Adapter code; default: `"prebidServer"`.                                  |
| `secure`     | Integer       |           | Override Prebid Server's determination of whether the request needs secure assets. Set to `1` to force secure assets on the response, or `0` for non-secure assets. |
| `adapterOptions` | Object       |           | Arguments will be added to resulting OpenRTB payload to Prebid Server. |

### Examples

**Video (Outstream):**
Note that currently, outstream video rendering must be configured by the publisher. In the adUnit, a `renderer` object must be defined, which includes a `url` pointing to the video rendering script, and a `render` function for creating the video player. See http://prebid.org/dev-docs/show-outstream-video-ads.html for more information.

```javascript
var adUnits = [{
    code: 'div-gpt-ad-1460505748561-0',
    mediaTypes: {
        video: {
            playerSize: [640, 480],
            context: 'outstream',
            mimes: ['video/mp4']
        }
    },
    bids: [
        {
            bidder: 'appnexus',
            params: {
                placementId: 13232392,
                video: {
                    skippable: true,
                    playback_method: ['auto_play_sound_off']
                }
            },

        }
    ],
    renderer: {
        url: 'http://cdn.adnxs.com/renderer/video/ANOutstreamVideo.js',
        render: function (bid) {
            adResponse = {
                ad: {
                    video: {
                        content: bid.vastXml,
                        player_height: bid.playerHeight,
                        player_width: bid.playerWidth
                    }
                }
            }
            // push to render queue because ANOutstreamVideo may not be loaded yet.
            bid.renderer.push(() => {
                ANOutstreamVideo.renderAd({
                    targetId: bid.adUnitCode, // target div id to render video.
                    adResponse: adResponse
                });
            });
        }
    }
}];
```