---
layout: page_v2
title: What is Prebid?
description: An overview of Prebid org and products
pid: 0
is_top_nav: yeah
top_nav_section: overview
nav_section: intro
sidebarType: 0
---



# What is Prebid?
{:.no_toc}

Prebid is:

+ A set of free and open source software products that help publishers implement Header Bidding on their websites & apps. Check out or [GitHub repositories](https://github.com/prebid).
+ The community of developers that maintains and improves them.
+ An organization that hosts events and encourages the development of the platform. See more about the [Prebid.org organization]({{site.baseurl}}/overview/what-is-prebid-org.html).

Sometimes when folks talk about our flagship "Prebid.js", they abbreviate it to "Prebid" for short, and this is fine, but we'd prefer that people remember we have other products too.


## What is Header Bidding?

Header Bidding is a technique that involves running SSP & Ad Exchange code directly on page so publishers can receive bids on their inventory that may be unavailable through their primary ad server and exchange.

The returned bids are then passed into the ad server so they can compete with direct demand and the primary ad server's exchange on a level playing field.

## A Brief History of Header Bidding

The early days of Header Bidding were dominated by bad practices, closed proprietary tech, poor standards, and little to no cooperation between competing companies. The result for publishers was headache - having to manually patch together various solutions from different companies and hope their developer didn't spend 3 weeks coding the wrong thing.

Launched in 2015, Prebid.js changed the game and made header bidding easy for publishers. By creating a simple, open tech layer upon which companies could add their code to a standard but optimized foundation, Prebid.js made it easier to implement header bidding the right way, and offered the largest repository of working adapters.

Today, Prebid.js is the most widely used Header Bidding "container" or "wrapper" on the web. The ecosystem supports 150+ demand partners, 15+ analytics providers, and numerous publishers.

## Benefits of Prebid Products

The Prebid product suite offers publishers multiple benefits designed to foster a better header bidding experience. The highlights include:

1. Free & open source, so anyone can contribute or review the code
2. Largest repository of working Header Bidding Adapters
3. Asynchronous and single time-out to provide a better user experience
4. Prebid Server to run faster auctions with more partners
5. Tools & analytics to optimize your setup
6. Multiple options on formats (display, video, native) & channels (mobile, desktop)
7. Helpful community with lots of free setup advice, as well as professional setup & services

## How Does Prebid Work?

At a high level, header bidding involves just a few steps:

1. The ad server's tag on page is paused, bound by a timer, while the Prebid.js (or SDK) library fetches bids and creatives from various SSPs & exchanges you want to work with.
1. Prebid.js (or SDK) passes information about those bids (including price) to the ad server's tag on page, which passes it to the ad server as query string parameters.
1. The ad server has line items targeting those bid parameters.
1. If the ad server decides Prebid wins, the ad server returns a signal to Prebid.js (or SDK) telling the library to write the winning creative to the page. All finished!

![Ad Ops Diagram]({{ site.github.url }}/assets/images/adops-intro.png){: .pb-lg-img :}

## Further Reading

+ [Prebid.js]({{site.baseurl}}/prebid/prebidjs.html)
+ [Prebid SDK]({{site.baseurl}}/prebid-mobile/prebid-mobile.html)
+ [Prebid Server]({{site.baseurl}}/dev-docs/get-started-with-prebid-server.html)
+ [Managed Prebid Solutions](/prebid/managed.html)
