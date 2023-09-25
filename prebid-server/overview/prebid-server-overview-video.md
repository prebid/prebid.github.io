---
layout: page_v2
title: Video Intro to Prebid Server
description: A video overview of Prebid Server
sidebarType: 5
---

# A Video Overview of Server

A high-level overview of Prebid Server, Prebid’s solution for header bidding in the cloud.

<div style="padding:56.25% 0 0 0;margin: 1rem 0;position:relative;"><iframe src="https://player.vimeo.com/video/822889941?h=71957861b5&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="1.5_Intro-to-PBS_v6"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

Further Content:

- [Intro to Prebid](/overview/intro.html)
- [Prebid Server Overview](/prebid-server/overview/prebid-server-overview.html)
- [Prebid Membership](https://prebid.org/membership)
- [Prebid on Github](https://github.com/prebid)
- [All Videos](/overview/all-videos.html)

Related Videos:

- [Introduction to Header Bidding](/overview/intro-to-header-bidding-video.html)
- [Introduction to Prebid Mobile](/prebid-mobile/prebid-mobile-video.html)

## Transcript

### About Prebid Server

Prebid Server is a solution for running real-time advertising auctions in the cloud.

It works in conjunction with Prebid.js, Prebid SDK, and other technologies to make header bidding possible for any ad format in any type of digital media. 

Prebid Server has everything necessary to sell advertising opportunities through server-side header bidding, including bidder integrations, privacy controls, creative caching, currency conversion, price floors, and analytics.

It supports more than 150 demand sources, including many of the world’s largest exchanges, DSPs, ad networks, and agencies.

### Why Prebid Server?

Prebid Server brings the revenue-maximizing power of header bidding to environments that don’t support standard JavaScript.

Header bidding originated as a JavaScript technology for websites, and the leading solution for header bidding in standard browser-based environments is Prebid.js. Prebid.js is very popular, but it only works on normal websites. Mobile apps, AMP websites, long-form video, and digital out-of-home need their own solution for header bidding, and that’s what Prebid Server provides.

Prebid Server can also be used to augment Prebid.js on websites. Prebid Server can be a powerful tool in yield management strategies that aim to maximize both advertising revenue and user experience.

### How Prebid Server Works
Prebid Server is open-source code that is free to use. To use it, you’ll need to set up a server to host the solution. You can set up your own servers, or use one of the managed services offered by companies in the Prebid community.

Let’s walk through an example of Prebid Server in use.

A digital advertising seller sets Prebid Server up on a server.

Prebid Server receives ad requests from a personal computer, a mobile device, or another server.

Prebid Server is able to enrich ad requests it receives, which means that it adds additional contextual information like IP-based location. It’s also able to interpret user consent and take actions such as restricting auction functions or limiting the sharing of personal data.

Next, Prebid Server runs the auction. It sends bid requests to bidders, who respond with bids. Prebid Server validates each of the bids, checking for things like privacy compliance and adherence to price floors. It then finalizes the auction and transmits the results to the system that sent it the initial ad request.

The seller who uses and hosts Prebid Server configures it to work how they want it to. Settings like privacy and consent controls, price floors, auction controls, the selection of bidders, and ad request enrichment functions are all determined by configurations that the seller sets.

### Getting Started
To learn more about Prebid Server, including information about setting up your own hosting server, visit docs.prebid.org.

To learn more about Prebid community companies that offer hosting services, visit prebid.org.

If you are a developer who would like to see the source code or contribute to Prebid Server, visit Prebid on Github at github.com/prebid/.
