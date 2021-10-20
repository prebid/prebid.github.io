---
layout: bidder
title: Prebid Server
description: Prebid Server S2S Adaptor
biddercode: prebidServer
pbjs: true
media_types: banner, video
gdpr_supported: true
---

### Overview

The Prebid Server Adapter is a meta-adapter. It's not an actual bidder, but
rather a way to get a batch of bids from other bidders with one request.
A request for the set of auctions is sent to Prebid Server, which performs
all the auctions server side (S2S), responding in time for Prebid.js to
send the results to the ad server. This lightens the performance load on the user's device.

### Bid Params

Bid params are sourced from the adapter configurations set for client side. These do not need to change for Prebid Server.

{: .alert.alert-warning :}
**Errors in bidder parameters will cause Prebid Server to reject the
entire request.** The Prebid Server philosophy is to avoid silent failures --
we assume you will test changes, and that it will be easier to notice a
4xx error coming from the server than a silent failure where it skips just
the bad parameter.

### Configuration
To enable prebid server, set the following configuration.

```
pbjs.setConfig({
    s2sConfig: {
        accountId : '12345',
        bidders : ['appnexus','pubmatic', 'rubicon'],
        defaultVendor: 'appnexus',
        timeout: 300
    }
});
```

To use multiple prebid servers, just define `s2sConfig` as an array. 
The same bidder cannot be set in both configs. For example:

```
pbjs.setConfig({
    s2sConfig: [
    {
        accountId: '12345',
        bidders: ['appnexus','rubicon'],
        defaultVendor: 'appnexus',
        timeout: 300,
    },
    {
        accountId: '678910',
        bidders: ['pubmatic'],
        defaultVendor: 'rubicon',
        timeout: 300,
    },
    ],
});
```
Configuration options

{: .table .table-bordered .table-striped }
| Field        | Type          | Required? | Description                                                              |
|--------------+---------------+-----------+--------------------------------------------------------------------------|
| `accountId`  | String        | yes         | Prebid Server account ID.                                                |
| `bidders`    | Array[String] | yes         | List of bidder codes; must have been enabled during Prebid.js build.     |
| `defaultVendor` | String     | no          | Automatically includes all following options in the config with vendor's default values.  Individual properties can be overridden by including them in the config along with this setting. |
| `enabled`    | Boolean       | no         | Enables S2S; default: `false` (`true` when defaultVendor is set).                                           |
| `endpoint`   | String        | no         | Set the endpoint. For example: `https://prebid.adnxs.com/pbs/v1/openrtb2/auction` |
| `timeout`    | Number        | no         | Bidder timeout, in milliseconds; default: `1000`.                         |
| `syncEndpoint` | String     | no       | Configures the user-sync endpoint. Highly recommended.                    |
| `adapter`    | String        | no        | Adapter code; default: `"prebidServer"`.                                  |
| `secure`     | Integer       | no        | Override Prebid Server's determination of whether the request needs secure assets. Set to `1` to force secure assets on the response, or `0` for non-secure assets. |
| `adapterOptions` | Object       | no        | Arguments will be added to resulting OpenRTB payload to Prebid Server. |
| `extPrebid` | Object       | no        | Arguments will be added to resulting OpenRTB payload to Prebid Server. |

### Examples

**Video (Outstream):**
Note that currently, outstream video rendering must be configured by the publisher. In the adUnit, a `renderer` object must be defined, which includes a `url` pointing to the video rendering script, and a `render` function for creating the video player. See https://prebid.org/dev-docs/show-outstream-video-ads.html for more information.

```javascript
var adUnits = [{
    code: 'div-gpt-ad-1460505748561-0',
    mediaTypes: {
        video: {
            playerSize: [640, 480],
            context: 'outstream',
            mimes: ['video/mp4'],
            protocols: [1, 2, 3, 4, 5, 6, 7, 8],
            playbackmethod: [2],
            skip: 1
        }
    },
    bids: [
        {
            bidder: 'appnexus',
            params: {
                placementId: 13232392
            },

        }
    ],
    renderer: {
        url: 'https://cdn.adnxs.com/renderer/video/ANOutstreamVideo.js',
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
