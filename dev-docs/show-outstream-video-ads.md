---
layout: page_v2
title: Show Outstream Video Ads
description: Show Outstream Video Ads with Prebid.js
pid: 10
top_nav_section: dev_docs
nav_section: prebid-video
sidebarType: 4
---

<div class="bs-docs-section" markdown="1">

# Show Outstream Video Ads
{: .no_toc}

Unlike instream video ads, which require you to have your own video inventory, Outstream video ads can be shown on any web page, even pages that only have text content.

This page has information you'll need to set up Prebid.js to show outstream video.

Other than using a slightly different ad unit in your Prebid code on the page, you shouldn't have to make any major engineering changes from a standard Prebid setup.

There should be no changes required on the ad ops side, since the outstream units use the standard Prebid creative, line item targeting setup, etc.

* TOC
{:toc }

## Prerequisites

+ Inclusion of at least one demand adapter that supports the `"video"` media type

## Step 1: Set up ad units with the video media type and outstream context

Use the `adUnit.mediaTypes` object to set up your ad units with the `video` media type and assign the appropriate context

The fields supported in a given `bid.params.video` object will vary based on the rendering options supported by each bidder.  For more information, see [Bidders' Params]({{site.github.url}}/dev-docs/bidders.html).

{% highlight js %}

var videoAdUnits = [{
    code: 'video1',
    mediaTypes: {
        video: {
            context: 'outstream',
            playerSize: [640, 480]
        }
    },
    bids: [{
        bidder: 'appnexus',
        params: {
            placementId: 13232385,
            video: {
                skippable: true,
                playback_method: ['auto_play_sound_off']
            }
        }
    }]
}];

{% endhighlight %}

### Renderers

To display an outstream video, two things are needed:

1. A VAST URL or VAST XML document, provided by the Prebid video demand partner.
2. A Client-side player environment capable of playing a VAST creative.  We will refer to this as the `renderer`.

Prebid.js will select the `renderer` used to display the outstream video in the following way:

1. If a `renderer` is associated with the Prebid adUnit, it will be used to display any outstream demand associated with that adUnit.  Below, we will provide an example of an adUnit with an associated `renderer`. If that renderer is specified as backup only, it will only be used when no other renderer is found. 
2. If no `renderer` is specified on the Prebid adUnit, Prebid will invoke the renderer associated with the winning (or selected) demand partner video bid.

{: .alert.alert-warning :}
At this time, since not all demand partners return a renderer with their video bid responses, we recommend that publishers associate a `renderer` with their Prebid video adUnits, if possible.  By doing so, any Prebid adapter that supports video will be able to provide demand for a given outstream slot. Choosing a backup only renderer allows publishers to access demand with or without an attached renderer. 

Renderers are associated with adUnits through the `adUnit.renderer` object.  This object contains three fields:

1. `url` -- Points to a file containing the renderer script.
2. `render` -- A function that tells Prebid.js how to invoke the renderer script.
3. `backupOnly` -- Optional field, if set to 'true', buyer or adapter renderer will be preferred

{% highlight js %}

pbjs.addAdUnit({
    code: 'video1',
    mediaTypes: {
        video: {
            context: 'outstream',
            playerSize: [640, 480]
        }
    },
    renderer: {
        url: 'https://acdn.adnxs.com/video/outstream/ANOutstreamVideo.js',
        backupOnly: 'true', // prefer demand renderer
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
});

{% endhighlight %}

Some demand partners that return a renderer with their video bid responses may support renderer configuration with the `adUnit.renderer.options` object. These configurations are bidder specific and may include options for skippability, player size, and ad text, for example. An example renderer configuration follows:

{% highlight js %}

pbjs.addAdUnit({
    code: 'video1',
    mediaTypes: {
        video: {
            context: 'outstream',
            playerSize: [640, 480]
        }
    },
    renderer: {
        options: {
            adText: 'This text was configured in the ad unit',
        }
    },
    ...
});

{% endhighlight %}

For more technical information about renderers, see [the pull request adding the 'Renderer' type](https://github.com/prebid/Prebid.js/pull/1082)

## Step 2: Show ads in the page body

### Option 1: Serving through a primary ad server

Invoke your ad server for the outstream adUnit from the body of the page in the same way that you would for a display adUnit

For a live example, see [Outstream with Google Ad Manager]({{site.github.url}}/examples/video/outstream/pb-ve-outstream-dfp.html).

{% highlight html %}

<div id='video1'>
    <p>Prebid Outstream Video Ad</p>
    <script type='text/javascript'>
        googletag.cmd.push(function() {
            googletag.display('video1');
        });

    </script>
</div>

{% endhighlight %}

### Option 2: Serving without an ad server

Prebid can serve outstream demand directly without going through a primary ad server.

For a live example, see [Outstream without an Ad Server](/examples/video/outstream/pb-ve-outstream-no-server.html).

In the Prebid.js event queue, you'll need to add a function that:

1. Adds your video ad units
2. Requests bids, adding a callback that:
    1. Selects the bid that will serve for the appropriate adUnit
    2. Renders the ad

{% highlight js %}

pbjs.que.push(function () {
    pbjs.addAdUnits(videoAdUnits);
    pbjs.requestBids({
        timeout: 3000,
        bidsBackHandler: function (bids) {
            var highestCpmBids = pbjs.getHighestCpmBids('video1');
            pbjs.renderAd(document, highestCpmBids[0].adId);
        }
    });
});

{% endhighlight %}

For more information, see the API documentation for:

+ [requestBids]({{site.github.url}}/dev-docs/publisher-api-reference.html#module_pbjs.requestBids)
+ [getHighestCpmBids]({{site.github.url}}/dev-docs/publisher-api-reference.html#module_pbjs.getHighestCpmBids)
+ [renderAd]({{site.github.url}}/dev-docs/publisher-api-reference.html#module_pbjs.renderAd)

## Working Examples

Below, find links to end-to-end "working examples" demonstrating Prebid Outstream:

+ [Outstream with Google Ad Manager]({{site.github.url}}/examples/video/outstream/pb-ve-outstream-dfp.html)
+ [Outstream without an Ad Server]({{site.github.url}}/examples/video/outstream/pb-ve-outstream-no-server.html)

</div>
