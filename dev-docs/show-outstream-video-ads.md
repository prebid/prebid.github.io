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

Unlike instream video ads, which require you to have your own video inventory, Outstream video ads can be shown on any web page, even pages that only have text content.

This page has information you'll need to set up Prebid.js to show outstream video.

Other than using a slightly different ad unit in your Prebid code on the page, you won't have to make any major engineering changes from a standard Prebid setup.

There should be no changes required on the ad ops side, since the outstream units use the standard Prebid creative, line item targeting setup, etc.

* TOC
{:toc }

## Prerequisites

+ Demand from a bidder adapter that supports the `"video-outstream"` media type
+ The bidder adapter will have to implement an outstream video renderer that is returned on the bid response.  For more technical information about custom renderers, see [the pull request adding the 'Renderer' type](https://github.com/prebid/Prebid.js/pull/1082).

## 1. Set up outstream video slot sizes

In your standard Prebid preamble in the header, configure slot sizes to suit your page layout and/or the available demand for those sizes.

{% highlight js %}

var pbjs = pbjs || {};

// ...

var rightSlotSizes = [[ 300, 250 ], [ 300, 600 ], [ 300, 250 ], [ 100, 100 ]];

// ...

{% endhighlight %}

## 2. Set up your ad units with the outstream video media type

Still in the header, set up your ad units with the `video-outstream` media type.  Note that you must be integrated with bidder adaptors that can respond with outstream video ads.

As far as what fields are supported in the `video` object, that will depend on the rendering options supported by your preferred bidder adaptor(s).

{% highlight js %}

var videoAdUnits = [
  {
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
  },
  {
    code: 'video2',
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
  }
];

{% endhighlight %}

## 3. Show ads on the page as normal

In the body of the page, insert your ads as usual:

{% highlight html %}

<div id='video1'>
  <p>Prebid Outstream Video Ad</p>
  <script type='text/javascript'>
    googletag.cmd.push(function () {
      googletag.display('video2');
    });
  </script>
</div>

{% endhighlight %}

## Related Topics

+ [Show Outstream Video Ads - Example Code]({{site.github.url}}/dev-docs/examples/outstream-video-example.html)

</div>
