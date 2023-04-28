---
layout: page_v2
title: Video Intro to Header Bidding
description: A video overview of Header Bidding
sidebarType: 0
---

# A Video Introduction to Header Bidding

A high-level explanation of what header bidding is, what its benefits are, and how it works.

<div style="padding:75% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/820684821?h=d55a008b4b&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="1.2_Intro-to-HB_v6"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

Further Content:
- [Intro to Header Bidding](/overview/intro-to-header-bidding.html)
- [Header Bidding with Prebid](/overview/intro.html#header-bidding-with-prebid)
- [All videos](/overview/all-videos.html)

Related Videos:
- [Introduction to Prebid](/overview/intro-video.html)
- [Introduction to Prebid.js](/prebid/prebidjs-video.html)

## Transcript

Header bidding is a technology used by website publishers and app developers to sell advertising opportunities through programmatic advertising marketplaces. It uses real-time auctions to maximize the value of ads online.

### Yield Management Problem
To understand why header bidding is important, let's explore the problem it aims to solve. Publishers and app developers earn money through advertising, and they want to maximize the revenue they earn from a finite amount of traffic. This challenge is similar to a farmer working to maximize the amount of vegetables their land yields, or an airline maximizing the airfare they earn for seats on flights. This problem is called yield management or yield optimization.

To maximize yield, a seller will need to form relationships with a  selection of buyers that are able to buy advertising impressions at good prices. They’ll also set up an advertising technology stack that gives their buyers the opportunity to compete for each and every ad impression. The ad stack is also responsible for rendering the ads and offers the seller controls that influence pricing, ad quality, and user experience. Analytics, A/B testing, and other optimization tools help the seller grow their yield over time.

In digital media, there are two prominent techniques for managing yield: the waterfall and header bidding. 

### Before Header Bidding: The Waterfall 
The waterfall predates header bidding, and header bidding was developed to overcome shortcomings in the waterfall’s ability to maximize yield. 

Let’s break this down:

In a waterfall, the seller creates a prioritized ranking of their buyer partners. Each time an impression is available for sale, the top partner in the ranking is shown the opportunity and has the option to buy it or refuse it. If they choose to buy, they deliver their ad. If they refuse, the waterfall shows the impression to the next partner in the ranking, and the cycle repeats until a willing buyer is found.

The waterfall’s design limits publishers’ ability to maximize yield, because it doesn’t expose impression opportunities to all of the potential buyers and can’t find the best price for each impression. Its sequential nature also makes it a slow process, which causes some impressions to go unsold.

### Header Bidding: A Better Solution to the Yield Management Problem
Header bidding overcomes many of the waterfall’s limitations using a simple, time-tested mechanism: auctions. 

Auctions allow all potential buyers to see the impression simultaneously and compete for it by bidding. This ensures that the impression is sold for a fair price and delivers the ad quickly and efficiently.

Publishers and app developers find that header bidding allows them to work with more buyers than the waterfall does. Header bidding also allows buyers to find their target audiences more easily and deliver more effective advertising campaigns

### How Header Bidding Works
Let’s get into how header bidding works: 

For most sellers, header bidding is one component of an advertising technology stack. The header bidding component is known as the “header bidding wrapper”, and it works in close coordination with the seller’s primary ad server. 

When a web page or app loads, the header bidding wrapper also loads. The wrapper initiates an auction for the available ad spaces on the page, and sends bid requests to potential buyers, notifying them that an impression is available for sale.

In a fraction of a second, the buyers respond with bids containing the ad they want to serve, the price they're willing to pay, and other relevant information. The header bidding wrapper then collects and passes these bids to the primary ad server. 

The ad server considers the header bidding bids alongside other potential buyers and decides which buyer wins. Within the ad server, header bidding bids compete based on price and do not interfere with the delivery of reserved, guaranteed and sponsorship campaigns. When the ad server chooses a header bidding buyer, it works with the wrapper to render the ad to the page.

### Header Bidding and Prebid
Header bidding began to appear in 2015, and has since replaced the waterfall on most websites. In mobile app environments, header bidding is quickly gaining popularity. Prebid.org formed to help publishers and advertising technology companies coordinate their efforts around header bidding, and Prebid is now the industry standard. Prebid is a non-profit member-based organization that offers open-source solutions for header bidding for all major ad formats, device types, and environments.

### Learn More
If you want to learn more about header bidding and Prebid, visit docs.prebid.org.


## Related Reading
- [Intro to Header Bidding](/overview/intro-to-header-bidding.html)
- [All video overviews](/overview/all-videos.html)
