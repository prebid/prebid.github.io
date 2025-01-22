---
layout: page_v2
title: Show Video Ads with Google Ad Manager
description: Show Video Ads with Google Ad Manager
sidebarType: 4
---

<div class="bs-docs-section" markdown="1">

# Show Video Ads with Google Ad Manager

{: .no_toc}

In this tutorial, we'll show how to set up Prebid to show a video ad
from Google Ad Manager.  We'll use the [Video.js](https://videojs.com/) player and
the AppNexus bidder, but the principles are the same across
different video players and video-enabled bidders.

* TOC
{:toc }

## Prerequisites

The code example below was built using the following libraries:

* [video.js](https://videojs.com/) version 5.9.2
* MailOnline's [videojs-vast-vpaid plugin](https://github.com/MailOnline/videojs-vast-vpaid) version 2.0.2

Also, you need to make sure to build Prebid.js with:

* Support for at least one video-enabled bidder
* Support for the `dfpAdServerVideo` ad server adapter, which will provide the video ad support

For example, to build with the AppNexus bidder adapter and the Google Ad Manager
Video ad server adapter, use the following command:

```bash
gulp build --modules=dfpAdServerVideo,appnexusBidAdapter
```

For more information about how to build with modules, see the [Prebid.js project README](https://github.com/prebid/Prebid.js/blob/master/README.md#build-optimization).

Finally, your ad ops team needs to have set up line items in Google Ad Manager
following the instructions at
[Setting up Prebid Video in Google Ad Manager]({{site.baseurl}}/adops/setting-up-prebid-video-in-dfp.html).

## Implementation

This section will take you through the code you need to write to show
video ads using Prebid.js and Video.js.

### 1. Create a video ad unit

First you need a video ad unit.  It should look something like this.
Don't forget to add your own valid placement ID.

```javascript
var videoAdUnit = {
    code: 'video',
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [640, 480],
            mimes: ['video/mp4'],
            protocols: [1, 2, 3, 4, 5, 6, 7, 8],
            playbackmethod: [2],
            skip: 1
        },
    },
    bids: [{
        bidder: 'appnexus',
        params: {
            placementId: 13232361
        }
    }]
};
```

For full details on video ad unit parameters, see [Ad Unit Reference for Video]({{site.baseurl}}/dev-docs/adunit-reference.html#adunitmediatypesvideo)

### 2. Implement Custom Price Buckets

By default, Prebid.js caps all CPMs at $20.  As a video seller, you may expect to see CPMs over $20.  In order to receive those bids, you'll need to implement custom price buckets setting the [priceGranularity](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Price-Granularity) object in the `setConfig` method.

For instructions and sample code, see [Custom Price Granularity Buckets
](/dev-docs/examples/custom-price-buckets.html).

### 3. Request bids, build video URL

Next, we need to do the standard Prebid "add ad units and request bids" dance.

In the example below, our callback builds the video URL the player needs using the `buildVideoUrl` method from the Google Ad Manager ad server module that we built into our copy of Prebid.js in the **Prerequisites** section.

For more information, see the API documentation for [pbjs.adServers.dfp.buildVideoUrl](/dev-docs/publisher-api-reference/adServers.dfp.buildVideoUrl.html).  Understanding the arguments to this method is *especially* important if you plan to pass any custom parameters to Google Ad Manager.  The `params` key in the argument to `buildVideoUrl` supports all parameters from the [Google Ad Manager API](https://support.google.com/admanager/answer/1068325).

```javascript
pbjs.que.push(function() {
    pbjs.addAdUnits(videoAdUnit);

    pbjs.setConfig({
        /* Or whatever your preferred video cache URL is */
        cache: {
            url: 'https://prebid.adnxs.com/pbc/v1/cache'
        }
    });

    pbjs.requestBids({
        bidsBackHandler: function(bids) {
            var videoUrl = pbjs.adServers.dfp.buildVideoUrl({
                adUnit: videoAdUnit,
                params: {
                    iu: '/19968336/prebid_cache_video_adunit'
                }
            });
            invokeVideoPlayer(videoUrl);
        }
    });
});
```

#### Notes on Prebid Cache

The VAST XML has to be cached somewhere because most video players can only work with a URL that returns VAST XML, not VAST directly. Some bidders cache the VAST XML on the server side, while others depend on Prebid.js to perform the caching.

* In general, video-enabled bidders must supply `bid.videoCacheKey`, `bid.vastXml`, or `bid.vastUrl` on their responses, and can provide any combination of the three.
* If `pbjs.setConfig({cache: {URL}})` isn't set and the bidder supplies only `bid.vastXml` in its bid response, [`pbjs.adServers.dfp.buildVideoUrl`](/dev-docs/publisher-api-reference/adServers.dfp.buildVideoUrl.html) will not be able to generate a videoCacheKey, and it will be dropped from the auction.
* If `pbjs.setConfig({cache: {URL}})` is defined and the bidder responds with `bid.videoCacheKey`, Prebid.js will not re-cache the VAST XML.
* If `options.url` is passed as an argument to [`pbjs.adServers.dfp.buildVideoUrl`](/dev-docs/publisher-api-reference/adServers.dfp.buildVideoUrl.html):
  * If Prebid Cache is disabled, Prebid sets `description_url` field to the bid response's `bid.vastUrl`.
  * If Prebid Cache is enabled, Prebid sets `description_url` field to the cache URL.

#### Notes on multiple video advertisements on one page

Display banners are rendered with the help of the renderAd function. This function automatically marks a bid as used. In the case of video we use a VAST-chain to display the advertisement, this has the downside that there is no way to automatically mark the video as shown. If you run multiple video-advertisements on the same page you’ll need to proactively mark the ad as shown or risk serving the same advertisements multiple times.

```javascript
pbjs.requestBids({
    bidsBackHandler: function(bids) {
        var videoUrl = pbjs.adServers.dfp.buildVideoUrl({
            adUnit: videoAdUnit,
            params: {
                iu: '/19968336/prebid_cache_video_adunit'
            }
        });

        // Mark the bid, used in buildVideoUrl, as used
        pbjs.markWinningBidAsUsed({
            adUnitCode: videoAdUnit.code // optional if you know the adId
            adId: bid.adId // optional
        });

        invokeVideoPlayer(videoUrl);
    }
});
```

### 4. Invoke video player on Prebid video URL

In the body of the page, the following HTML and JS will show the ad:

```html
<div class="example-video-container">
  <video id="vid1" class="video-js vjs-default-skin vjs-big-play-centered" controls
    data-setup='{}'
    width='640'
    height='480'>
    <source src="https://vjs.zencdn.net/v/oceans.mp4" type='video/mp4'/>
    <source src="https://vjs.zencdn.net/v/oceans.webm" type='video/webm'/>
    <source src="https://vjs.zencdn.net/v/oceans.ogv" type='video/ogg'/>
  </video>
</div>

<script>
  function invokeVideoPlayer(url) {
    videojs("vid1").ready(function() {
      this.vastClient({
        adTagUrl: url,
        playAdAlways: true,
        verbosity: 0,
        vpaidFlashLoaderPath: "https://github.com/MailOnline/videojs-vast-vpaid/blob/RELEASE/bin/VPAIDFlash.swf?raw=true",
        autoplay: true
      });
      this.muted(true);
      this.play();
    });
  }
</script>
```

If you have [set up your ad server line items and creatives correctly]({{site.baseurl}}/adops/setting-up-prebid-video-in-dfp.html), you should see an instream pre-roll video ad followed by the oceans video from the [video.js homepage](https://videojs.com/).

## Working Examples

**Note:** Prebid video is designed to work across devices and browsers. This demo has been developed and tested only for Chrome desktop, Firefox desktop, and Chrome Android; additional device/browser support is planned to be added at a later date.

Below, find links to end-to-end "working examples" integrating Prebid.js demand with various video players:

### Using client-side adapters

* [JWPlayer - Platform]({{site.github.url}}/examples/video/instream/jwplayer/pb-ve-jwplayer-platform.html)
* [JWPlayer - Hosted]({{site.github.url}}/examples/video/instream/jwplayer/pb-ve-jwplayer-hosted.html)
* [VideoJS]({{site.github.url}}/examples/video/instream/videojs/pb-ve-videojs.html)
* [Instream and Banner Mixed](/dev-docs/examples/instream-banner-mix.html)

## Related Topics

* [Setting up Prebid Video in Google Ad Manager]({{site.baseurl}}/adops/setting-up-prebid-video-in-dfp.html)

</div>
