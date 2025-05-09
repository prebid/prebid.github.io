---
layout: page_v2
title: Getting Started with Long-Form Video for Prebid.js
description: Prebid Long-Form Video Getting Started
pid: 1
is_top_nav: yeah
top_nav_section: pbjs-video
nav_section: pbjs-video-get-started
sidebarType: 4
---

# Getting Started with Long-Form Video

{: .no_toc }

If you’re new to header bidding and Prebid review the following to get a general understanding of Prebid.js.

- [What Is Prebid?](/overview/intro.html)
- [Getting Started with Prebid](/adops/before-you-start.html)

See [Prebid.js Video Overview](/prebid-video/video-overview.html) for a general description and high-level overview of working with video demand in Prebid.js.

- TOC
{:toc}

## Ad Server Setup

Prebid uses FreeWheel for the distrubtion of `Creatives`. Refer to [Setting Up Prebid video in FreeWheel](/adops/setting-up-prebid-video-in-freewheel.html) for an Ad Ops getting started guide.

## Developers

### Download Prebid.js

To implement header bidding for long-form video start by [downloading Prebid.js](/download.html).

Before downloading, select the adapters you want to include. (You can add more adapters later.)

- Include at least one video adapter. Find a list of available video adapters [here](/dev-docs/bidders.html#bidder-video-native).
- Include the [FreeWheel](/dev-docs/modules/freewheel.html) Ad Server module.
- Include the [Category Translation](/dev-docs/modules/categoryTranslation.html) module.  
- If you’ll be integrating with Prebid Server, be sure to include “Prebid Server” in the list of adapters.

### Ensuring Competitve Separation

 You will need to configure Prebid to ensure competitive separation, the process of preventing two ads from the same industry appearing within an ad pod. After you have instantiated a Prebid instance call the setConfig method and add the following key-values.  

```javascript
pbjs.setConfig({
  'adpod': {
    'brandCategoryExclusion': true
  }
});
```

### Define Prebid Ad Units

As with instream and outstream videos, you must set the video context for long-form ad units. The context setting for long-form video is `adpod` . There are also some addtional required and optional parameters (see list below).  

 As with all ad unit types you must include a list of bidders. The parameters differ depending on which bidder you’re including. For a list of parameters for each bidder, see [Bidders’ Params](/dev-docs/bidders.html).  

```javascript
var longFormatAdUnit = {
    video: {
       // required params
       context: 'adpod',
       playerSize: [640, 480],
       adPodDurationSec: 300,
       durationRangeSec: [15, 30],

       // optional params
       requireExactDuration: true,
       tvSeriesName: 'TvName',
       tvEpisodeName: 'episodeName',
       tvSeasonNumber: 3,
       tvEpisodeNumber: 6,
       contentLength: 300, // time in seconds,
       contentMode: 'on-demand'
    }

    bids: [{
            bidder: 'appnexus',
            params: {
                placementId: 123456789,
            }
        }]
}
```

#### Required Parameters

`video.context`
A string indicating the ad unit type.

`video.playerSize`  
An array of numbers indicating the height and width of the video player size that will be passed to the demand partners.

`video.adPodDurationSec`  
A number indicating how long the ad pod should run.

`video.durationRangeSec`  
A number indicating how long the creatives of an ad pod should run.

#### Optional Parameters

`video.requireExactDuration`  
A boolean indicating if the returned creatives running time must match the value of `adPodDurationSec`

`video.tvSeriesName`  
A string representing the name of the television series the adpod will appear in.

`video.tvEpisodeName`  
A string representing the episode name of the television series the adpod will appear in.

`video.tvSeasonNumber`  
A number representing the season number of the television series the adpod will appear in.

`video.tvEpisodeNumber`  
A number representing the episode number of the television series the adpod will appear in.

`video.contentLengthSec`  
A number representing the length of the content the adpod will appear in.

`video.contentMode`
A string indicating the type of content being displayed in the video player. There are two options, `live` and `on-demand`.

<div class="alert alert-info">
  <strong>Prebid Server</strong>
  <p>If you’re using Prebid Server, you must also include the mediaTypes.video.mimes field, as this is required by OpenRTB.</p>

  <pre>
  mediaTypes: {
      video: {
          context: 'apod', // or 'instream', 'outstream'
          playerSize: [640, 480],
          mimes: ['video/mp4'],
      }
  }
  </pre>

  <p>For more on Prebid Server ad unit requirements, see <a href="/prebid-server/use-cases/pbs-pbjs.html">Getting Started with Prebid Server – Video</a>.</p>

</div>

### Configuration

After you’ve defined your ad units, you can continue with the rest of your configuration.

#### Deal Support

To prioritize certain video deals and ensure delivery and performance within the Freewheel stack Prebid has additional configurations that can be enabled.

`prioritizeDeals`  
A  boolean that indicates if deals should be given a higher preference. If true, Prebid will set the value of `hb_pb_cat_dur` with `bid.video.tier` replacing the cpm value. For example:

```text
hb_pb_cat_dur=dealId_395_15s
```

`dealTier`  
An object that enables publishers to set a prefix and minimum deal tier for each bidder. The `dealTier` object enables publishers to have different line item setups with varying priorities.

`dealTier.prefix`  
An optional string that enables bidders to target deal line items.

`dealTier.minDealTier`  
An integer that will give higher preference to deal bids which return tier greater than minDealTier.  Bids with `minDealTier` values less than five will not be ignored, however their cache key will contain `dealId` in place of `cpm`. These bids will be auctioned as non-deal bids.

```javascript
// This will replace the cpm with dealId in cache key as well as targeting kv pair when prioritizeDeals flag is set to true.
pbjs.setConfig({
  adpod: {
    prioritizeDeals: true,
    dealTier: {
      'appnexus': {
        prefix: 'tier',
        minDealTier: 5
      },
      'some-other-bidder': {
        prefix: 'deals',
        minDealTier: 20
      }
    }
  }
})
```

For adpods, the bidder will return multiple bids. Each bid can have a different priority/deal tier setting. To enable publishers to have control over the deal tier a `filterBids` setting has been added to `pbjs.adServers.freewheel.getTargeting` to select certain deal bids.

```javascript
pbjs.adServers.freewheel.getTargeting({
  codes: [adUnitCode1],
  callback: function(err, targeting) {
      //pass targeting to player api
  }
});
```

Below is an example of a bid response for deals.  

```javascript
// Sample return targeting key value pairs
{
  'adUnitCode-1': [
    {
      'hb_pb_cat_dur': 'tier9_400_15s', // Bid with deal id
    },
    {
      'hb_pb_cat_dur': 'tier7_401_15s', // Bid with deal id
    },
    {
      'hb_pb_cat_dur': '15.00_402_15s',
    },
    {
      'hb_cache_id': '123'
    }
  ]
}
```

### Examples

See [Prebid Video Examples](/examples/video/long-form/pb-ve-lf-freewheel.html) for examples of long-form video ads.

## Further Reading

- [Prebid.js for Video Overview](/prebid-video/video-overview.html)
- [Getting Started with Video for Prebid.js](/prebid-video/video-getting-started.html)
- [What is Prebid?](/overview/intro.html)
