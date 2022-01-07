---
layout: page_v2
title: Prebid.js for Video Overview
description: Prebid Video Overview
pid: 0
top_nav_section: pbjs-video
nav_section: pbjs-video-get-started
sidebarType: 4
---



# Prebid.js for Video Overview

Prebid.js provides tools that allow header bidding video demand to compete with your ad server video demand. Prebid video demand can be incorporated for both instream, outstream, and long-form video slots.

-	Instream - Instream video ads serve in-line with existing video content on your page. The ads can serve before, during, or after a piece of video content. As the publisher, you must provide your own video player that can be used to render the ads.

-	Outstream – Outstream video ads serve separately from any existing video content.  Often, outstream video ad units are used to create video inventory on pages that do not include any video content. The outstream video ad is displayed through an associated outstream video renderer, which usually ingests configuration options that control the user experience. (For example, the outstream video player can be configured to expand within a text body on-page when in view, and collapse when the video is finished).

- Long-form - Long-form video content always has a content arc with a beginning, middle and end. Ads display in an ad pod, a grouping of individual ads that appear either in the beginning, end or during the video content. As the publisher you must provide your own video player that can be used to render the ads.

## Implementation

Here’s a high-level overview of the steps required to start using Prebid.js for video demand.


![Video Overview]({{site.baseurl}}/assets/images/prebid-video/video-overview.png){:class="pb-lg-img"}

For implementation details, see [Getting Started with Video for Prebid.js]({{site.github.url}}/prebid-video/video-getting-started.html).

## How It Works

### Instream Video

Here’s a high-level diagram showing how video header bidding works for instream video (with more details outlined in the steps below):


![Instream Video Diagram]({{site.baseurl}}/assets/images/prebid-video/instream-video.png){: .pb-img.pb-lg-img :}


1.	**Prebid sends bid requests.**  
Prebid.js code loads within the page header and sends a bid request to each video demand partner included on a given Prebid video ad unit.

2.	**Demand partners respond.**  
Each response includes the bid price and the video creative in the form of a VAST tag URL which returns a VAST XML wrapper.  This video creative will be rendered by the video player if the bid is selected in the ad server.

3.	**Prebid.js caches video bids.**  
Each video bid is cached server-side and mapped to a unique cache ID which will be passed to the ad server via key-value targeting.  The [Prebid.js video creative]({{site.github.url}}/adops/setting-up-prebid-video-in-dfp.html#creative-setup) configured in the ad server contains a macro that references this cache ID. (Note: Some bidders will cache before responding to Prebid.js. In those cases, the bidder will provide a `bidResponse.videoCacheKey` and this step will be skipped. See [Notes on Prebid Cache]({{site.github.url}}/dev-docs/show-video-with-a-dfp-video-tag.html#notes-on-prebid-cache) for details.)

4.	**Prebid creates new master video ad server tag URL.**  
Prebid combines an existing video ad server tag with Prebid key-value targeting pairs to create a new master video ad server tag URL.  This URL will be passed into the video player.

5.	**Video player calls ad server.**  
The video player loads the master video ad server tag URL, which makes a call to the ad server.

6.	**Ad server matches Prebid.js key-value pairs to a pre-configured line item.**

7.	**Video player renders the video from the winning bidder.**  
  a.	The master video ad server tag URL returns a VAST XML wrapper containing the Prebid.js video creative.  
  b.	The Prebid.js video creative returns a VAST XML document containing the cached video bid, which was returned by the Prebid demand partner in its bid response.  
  c.	The demand partner’s VAST tag URL is rendered in the video player.

### Outstream Video

Outstream video is displayed in banner ad slots using video renderers that are provided either by the demand partner with the bid response or by a renderer that the publisher has associated with the ad unit. This is a high-level diagram showing how header bidding works with outstream video:


![Outstream Video Diagram]({{site.baseurl}}/assets/images/prebid-video/outstream-video.png){: .pb-img.pb-lg-img :}

1.	**Prebid sends request to demand partners.**  
Prebid.js code loads within the page header and sends a bid request to each video demand partner included on a given Prebid video ad unit.

2.	**Demand partners respond.**  
Demand partners respond with their respective bids, which may contain a video renderer. (Publishers are encouraged to associate their own video renderer with each outstream video ad unit to include video demand that was not returned with its own renderer.)

3.	**Prebid passes key-value targeting to ad server.**  
Prebid assigns a unique hb_adid to each video bid/renderer combination, and passes this ID to the ad server via key-value targeting (along with other standard Prebid key-value pairs). This ad ID serves the same role for outstream video ad units as it does for banner ad units.

4.	**Ad server chooses winning line item.**  
The ad server chooses the winning line item. If a Prebid line item is selected, the Prebid creative is returned. The creative can be the standard call to `renderAd` or the Universal Creative.

5.	**Prebid renders the outstream video.**  
Prebid retrieves the winning outstream video bid and renderer from the ad ID (hb_adid).  Prebid renders the outstream video into the banner slot.

### Long-form Video 

Here’s a high-level diagram showing how long-form video header bidding works for adpod video (with more details outlined in the steps below):

![Instream Video Diagram]({{site.baseurl}}/assets/images/prebid-video/instream-video.png){: .pb-img.pb-lg-img :}

1.	**Prebid sends request to demand partners.**  
Prebid.js code loads within the page header and sends a bid request to each video demand partner included on a given Prebid video ad unit.

2.	**Demand partners respond.**  
As with instream videos, each response includes the bid price and the video creative in the form of a VAST tag URL which returns a VAST XML wrapper.  This video creative will be rendered by the video player if the bid is selected in the ad server.  
 
      Additionally each response is required to return an IAB subcategory. A module is provided that converts adserver categories to IAB sub categories. If a publisher prefers to use their own mapping file they will need to set the URL location of that file.  

3.	**Prebid.js caches video bids.**  
Each video bid is cached server-side and mapped to a unique cache ID which will be passed to the FreeWheel ad server via key-value targeting.  The [Prebid.js video creative]({{site.github.url}}/adops/setting-up-prebid-video-in-dfp.html#creative-setup) configured in the ad server contains a macro that references this cache ID. (Note: Some bidders will cache before responding to Prebid.js. In those cases, the bidder will provide a `bidResponse.videoCacheKey` and this step will be skipped. See [Notes on Prebid Cache]({{site.github.url}}/dev-docs/show-video-with-a-dfp-video-tag.html#notes-on-prebid-cache) for details.) 

4.	**Prebid creates new master video ad server tag URL.**  
Prebid combines an existing video ad server tag with Prebid key-value targeting pairs to create a new master video ad server tag URL.  This URL will be passed into the video player.

5.	**Video player calls ad server.**  
The video player loads the master video ad server tag URL, which makes a call to the ad server.

6.	**Ad server matches Prebid.js key-value pairs to a pre-configured line item.**

7.	**Video player renders the video from the winning bidder.**  
  a.	The master video ad server tag URL returns a VAST XML wrapper containing the Prebid.js video creative.  
  b.	The Prebid.js video creative returns a VAST XML document containing the cached video bid, which was returned by the Prebid demand partner in its bid response.  
  c.	The demand partner’s VAST tag URL is rendered in the video player.

## Further Reading

-   [Getting Started with Video for Prebid.js]({{site.github.url}}/prebid-video/video-getting-started.html)
-   [Getting Started with Long-Form Video for Prebid.js]({{site.github.url}}/prebid-video/video-long-form.html)
-   [What is Prebid?]({{site.github.url}}/overview/intro.html)
-   [AdOps - Before You Start]({{site.github.url}}/overview/getting-started.html)
-   [Getting Started for Developers]({{site.github.url}}/dev-docs/getting-started.html)
