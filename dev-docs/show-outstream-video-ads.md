---
layout: page
title: Show Outstream Video Ads
description: Show Outstream Video Ads with Prebid.js
pid: 10
top_nav_section: dev_docs
nav_section: prebid-video
---

<div class="bs-docs-section" markdown="1">

# Show Outstream Video Ads
{: .no_toc}

<span style="color: rgb(255,0,0);">FIXME</span>: <strong>OVERVIEW OF OUTSTREAM VIDEO</strong>

Unlike instream video ads, which require you to have your own video inventory, Outstream video ads can be shown on any web page, even pages that only have text content.

This page has information you'll need to set up Prebid for Outstream Video from the engineering side.

Other than using a slightly different ad unit in your Prebid code on the page, you won't have to make any major engineering changes from a standard Prebid setup.  And there should be no changes required on the ad ops side.

<span style="color: rgb(255,0,0);">FIXME</span>: <strong>verify that ad ops comment yo</strong>

* TOC
{:toc }

## Prerequisites

+ Demand from a bidder adapter that supports the `"video-outstream"` media type

+ <span style="color: rgb(255,0,0);">FIXME</span>: <strong>Something something custom renderer setup?</strong>

## Set up your Ad Unit with the Outstream Video Media Type

As mentioned above, there are no code changes required to your standard Prebid setup except in the ad unit.

Below is an example of a Prebid ad unit that supports outstream video.

<span style="color: rgb(255,0,0);">FIXME</span>: <strong>verify this is the case with the "renderer" talk you've heard</strong>

As far as what fields are supported in the `video` object, that will depend on how much of the [OpenRTB spec](https://www.iab.com/guidelines/real-time-bidding-rtb-project/) your bidder adaptor of choice supports.

{% highlight js %}
var videoAdUnit = {
    code: 'video1',
    sizes: [ 640, 480 ],
    mediaType: 'video-outstream',
    bids: [
        {
            bidder: 'appnexusAst',
            params: {
                placementId: '5768085',
                video: {
                    skippable: true,
                    playback_method: [ 'auto_play_sound_off' ]
                }
            }
        }
    ]
};
{% endhighlight %}

## Related Topics

+ [Show Outstream Video Ads - Example Code]({{site.github.url}}/dev-docs/examples/outstream-video-example.html)

</div>
