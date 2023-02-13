---
layout: page_v2
title: Integrating Prebid.js with video on your own 
description: How to support video in Prebid with your own code
pid: 1
sidebarType: 4
---

# Integrating Prebid.js with video on your own

## Define Prebid Ad Units

Setting up Prebid ad units is almost the same whether you’re working with instream video ads or outstream. The primary difference is specifying the type of video ad (instream or outstream), which you do in the mediaTypes.video.context field:

```
    var adUnit1 = {
        code: 'videoAdUnit',
        mediaTypes: {
            video: {
                context: 'instream', //or 'outstream'
                playerSize: [640, 480],
                mimes: ['video/mp4'],    // required for Prebid Server
                protocols: [1, 2, 3, 4, 5, 6, 7, 8],
                playbackmethod: [2],
                skip: 1
            }
```

The mediaTypes.video.playerSize field is where you define the player size that will be passed to demand partners.

<div class="alert alert-info">
  <strong>Prebid Server</strong>
  <p>If you’re using Prebid Server, you must also include the mediaTypes.video.mimes field, as this is required by OpenRTB.</p>
</div>

For full details on video ad unit parameters, see [Ad Unit Reference for Video]({{site.baseurl}}/dev-docs/adunit-reference.html#adunitmediatypesvideo)

In your ad unit you also need to define your list of bidders. For example, including AppNexus as a bidder would look something like this:

```
    var adUnit1 = {
        ...
        bids: [{
            bidder: 'appnexus',
            params: {
                placementId: '123456789',
            }
        }]
```

The parameters differ depending on which bidder you’re including. For a list of parameters for each bidder, see [Bidders’ Params]({{site.github.url}}/dev-docs/bidders.html).

For full details on creating instream video ad units, see [Show Video Ads with Google Ad Manager – Create Ad Unit]({{site.github.url}}/dev-docs/show-video-with-a-dfp-video-tag.html#create-a-video-ad-unit).

For full details on creating outstream video ad units, see [Show Outstream Video Ads – Create Ad Unit]({{site.github.url}}/dev-docs/show-outstream-video-ads.html#step-1-set-up-ad-units-with-the-video-media-type-and-outstream-context).

## Configuration

After you’ve defined your ad units, you can continue with the rest of your configuration. In
most cases for video, the first step will be to define where the VAST XML coming back in the bids
will be stored. Some bidders have you covered here -- the VAST is stored on their servers. But
many bidders don't have their own server-side cache.

{: .alert.alert-success :}
Video players expect that the response from the ad server will be a URL that points to somewhere
on the internet that stores the video ad creative. This URL can't point to the browser,
so Prebid.js will send bid VAST XML out to a cache so it can be displayed if it wins in the ad server.

Configuring the video cache is done with [`setConfig`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-vast-cache):

```
    pbjs.setConfig({
        cache: {
            url: 'https://prebid.adnxs.com/pbc/v1/cache'
            /* Or whatever your preferred video cache URL is */
        }
    });
```


And this is where setups for instream and outstream diverge. Please follow one of these links:

- Instream: [Show Video Ads with Google Ad Manager]({{site.github.url}}/dev-docs/show-video-with-a-dfp-video-tag.html)
- Outstream: [Show Outstream Video Ads]({{site.github.url}}/dev-docs/show-outstream-video-ads.html)

Be sure to note the setting for price granularity.  You might need to set up a custom price granularity. (See “Custom CPM Bucket Sizing” under [Price Granularity](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Price-Granularity). Or, if you’re monetizing both banner and video inventory with Prebid, you might need to define format-specific price granularity settings through  [mediaTypePriceGranularity](/dev-docs/publisher-api-reference/setConfig.html#setConfig-MediaType-Price-Granularity).

{: .alert.alert-info :}
**Prebid Server**  If you’re using Prebid Server, you also need to configure your server-to-server bidder adapters. See [Getting Started with Prebid Server](/prebid-server/overview/prebid-server-overview.html).

## Examples

This section contains working examples of instream and outstream video ads for various players.

## Using client-side adapters

### Instream
+ [Brid]({{site.github.url}}/examples/video/instream/brid/pb-ve-brid.html)
+ [Brightcove]({{site.github.url}}/examples/video/instream/brightcove/pb-ve-brightcove.html)
+ [Flowplayer]({{site.github.url}}/examples/video/instream/flowplayer/pb-ve-flowplayer.html)
+ [JWPlayer - Platform]({{site.github.url}}/examples/video/instream/jwplayer/pb-ve-jwplayer-platform.html)
+ [JWPlayer - Hosted]({{site.github.url}}/examples/video/instream/jwplayer/pb-ve-jwplayer-hosted.html)
+ [Kaltura]({{site.github.url}}/examples/video/instream/kaltura/pb-ve-kaltura.html)
+ [Ooyala]({{site.github.url}}/examples/video/instream/ooyala/pb-ve-ooyala.html)
+ [VideoJS]({{site.github.url}}/examples/video/instream/videojs/pb-ve-videojs.html)

### Outstream

+ [Outstream with Google Ad Manager]({{site.github.url}}/examples/video/outstream/pb-ve-outstream-dfp.html)
+ [Outstream without an Ad Server]({{site.github.url}}/examples/video/outstream/pb-ve-outstream-no-server.html)

## Using Prebid Server

+ [Brid]({{site.baseurl}}/examples/video/server/brid/pbs-ve-brid.html)
+ [JW Player - Platform]({{site.baseurl}}/examples/video/server/jwplayer/pbs-ve-jwplayer-platform.html)
+ [JW Player - Hosted]({{site.baseurl}}/examples/video/server/jwplayer/pbs-ve-jwplayer-hosted.html)
+ [Kaltura]({{site.baseurl}}/examples/video/server/kaltura/pbs-ve-kaltura.html)
+ [Ooyala]({{site.baseurl}}/examples/video/server/ooyala/pbs-ve-ooyala.html)
+ [VideoJS]({{site.baseurl}}/examples/video/server/videojs/pbs-ve-videojs.html)


# Further Reading

-   [Prebid.js for Video Overview]({{site.github.url}}/prebid-video/video-overview.html)
-   [What is Prebid?]({{site.github.url}}/overview/intro.html)
