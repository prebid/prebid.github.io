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

-	[What Is Prebid?]({{site.github.url}}/overview/intro.html)
-	[Getting Started with Prebid]({{site.github.url}}/overview/getting-started.html)

See [Prebid.js Video Overview]({{site.github.url}}/prebid-video/video-overview.html) for a general description and high-level overview of working with video demand in Prebid.js.

* TOC
{:toc}

## Ad Server Setup

Prebid uses FreeWheel for the distrubtion of `Creatives`. Refer to [Setting Up Prebid video in FreeWheel]({{site.github.url}}/adops/setting-up-prebid-video-in-freewheel.html) for an Ad Ops getting started guide. 

## Developers

### Download Prebid.js

To implement header bidding for long-form video start by [downloading Prebid.js]({{site.github.url}}/download.html).

Before downloading, select the adapters you want to include. (You can add more adapters later.)

- Include at least one video adapter. Find a list of available video adapters [here]({{site.github.url}}/dev-docs/bidders.html#bidder-video-native).
- Include the [FreeWheel](/dev-docs/modules/freewheel.html) Ad Server module. 
- Include the [Category Translation](/dev-docs/modules/categoryTranslation.html) module.  
- If you’ll be integrating with Prebid Server, be sure to include “Prebid Server” in the list of adapters.

### Ensuring Competitve Separation
 You will need to configure Prebid to ensure competitive separation, the process of preventing two ads from the same industry appearing within an ad pod. After you have instantiated a Prebid instance call the setConfig method and add the following key-values.  

```
pbjs.setConfig({
  'adpod': {
    'brandCategoryExclusion': true
  }
});
```

### Define Prebid Ad Units

As with instream and outstream videos, you must set the video context for long-form ad units. The context setting for long-form video is `adpod` . There are also some addtional required and optional parameters (see list below).  

 As with all ad unit types you must include a list of bidders. The parameters differ depending on which bidder you’re including. For a list of parameters for each bidder, see [Bidders’ Params](/dev-docs/bidders.html).  

```
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
  </pre>

  <p>For more on Prebid Server ad unit requirements, see <a href="{{site.github.url}}/dev-docs/get-started-with-prebid-server.html#using-prebid-server-to-show-video-ads">Getting Started with Prebid Server – Video</a>.</p>

</div>

### Configuration

After you’ve defined your ad units, you can continue with the rest of your configuration.

### Examples

See [Prebid Video Examples](/examples/video/long-form/long-form-video-with-freewheel.html) for examples of long-form video ads. 



