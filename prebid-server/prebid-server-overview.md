---
layout: page_v2
title: Prebid Server Overview
description: Prebid Server Overview
pid: 0
top_nav_section: prebid-server
nav_section: prebid-server
sidebarType: 5
---

# Prebid Server Overview
{:.no_toc}

Prebid Server is an open-source solution for server-to-server header bidding with Prebid.js and Prebid Mobile. By running your header bidding auction server-side you can improve your page’s load time, thereby improving performance.

* TOC
{:toc}

## Hosted Solution

Your simplest route to working with Prebid Server is to sign up for a hosted solution. Several [Prebid.org members host](/prebid-server/hosted-servers.html) up-to-date server software with a global footprint, and provide tools to manage stored requests.

## On Your Own

If you decide to implement your own Prebid Server solution, you can [download the source code from GitHub](https://github.com/prebid/prebid-server). The GitHub site has [full instructions](https://github.com/prebid/prebid-server/tree/master/docs/developers) for configuring, deploying, and testing your implementation.

## Bidders

Prebid.org provides a full list of [Prebid Server bidders]({{site.baseurl}}/dev-docs/prebid-server-bidders.html), including various details about parameters and open issues.

You can also find [additional information]({{site.baseurl}}/prebid-server/developers/pbs-bidder-info.html) for some of the Prebid Server bidders that will help you with your implementation.

## Endpoints

Full documentation is available for all Prebid Server endpoints:

- [Bidder List](/prebid-server/endpoints/info/bidders.html)
- [Bidder Info - BidderName]({{site.baseurl}}/prebid-server/endpoints/info/bidders/bidderName.html)
- [Bidder Params]({{site.baseurl}}/prebid-server/endpoints/bidders/params.html)
- [Starting Cookie Sync]({{site.baseurl}}/prebid-server/endpoints/cookieSync.html)
- [Prebid Server AMP]({{site.baseurl}}/prebid-server/endpoints/openrtb2/amp.html)
- [Prebid Server Auction]({{site.baseurl}}/prebid-server/endpoints/openrtb2/auction.html)
- [Saving User Syncs]({{site.baseurl}}/prebid-server/endpoints/setuid.html)
- [Get Status]({{site.baseurl}}/prebid-server/endpoints/status.html)

## Additional Developer Information

- [Add a New Analytics Module]({{site.baseurl}}/prebid-server/developers/add-new-analytics-module.html)  
  Description, including and example, of how to add an analytics module to Prebid Server.

- [Add a New Bidder]({{site.baseurl}}/prebid-server/developers/add-new-bidder.html)  
  Learn how to define and test a new bidder, then add the bidder to theExchange.

- [Cookie Syncs]({{site.baseurl}}/prebid-server/developers/cookie-syncs.html)  
  Describes the mechanics of a Prebid Server cookie sync.

- [GDPR]({{site.baseurl}}/prebid-server/developers/gdpr.html)  
  Explore the way in which Prebid Server supports GDPR regulations.

- [Stored Request]({{site.baseurl}}/prebid-server/developers/stored-requests.html)  
  Learn about the Prebid Server Stored Requests feature.
