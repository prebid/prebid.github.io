---
layout: page_v2
title: What is Prebid?
description: An overview of Prebid org and products
sidebarType: 0
---
# What is Prebid?
{:.no_toc}

* TOC
{:toc}

## Overview

{: .alert.alert-info :}
If you're looking for a marketing-level overview of the Prebid software and organization, including product features, membership, events, and so on, visit [Prebid.org](https://prebid.org/).

Prebid is more than a product; it's a product suite, a community, and an organization.

- **Product Suite:** A free and open source suite of software products that enables publishers to implement header bidding on websites and mobile apps. Our product line includes:  
   - <span style="color:#EA9622">**Prebid.js:**</span> Prebid.js provides a powerful and easy-to-implement code set to improve header bidding for display and video ads on a publisher's website and within OTT applications.  
   - <span style="color:#EA9622">**Prebid Server:**</span> Provides a hosted or custom server-side solution for header bidding. Utilizing Prebid Server can reduce latency between bid request and ad selection, and speed the presentation of your site and ads.  
   - <span style="color:#EA9622">**Prebid Mobile:**</span> Our native iOS and Android solutions to enable header bidding within a mobile app.
- **Community:** The developers that maintain and improve our products.  
- **Organization:**  An active membership of leaders within the ad tech industry promotes Prebid products and works with the ad tech community to define and implement enhanced solutions. For more about the organization, see the [Prebid.org](https://prebid.org/) website.  

{: .alert.alert-info :}
Our flagship product, Prebid.js, is sometimes referred to as simply *Prebid*, but please be aware that the Prebid product line supports header bidding for web, AMP, and mobile apps, using both client- and server-side components.

## Header Bidding

### What is Header Bidding?

Header bidding is a response to a fragmented and inefficient process for digital ad display. It is an alternative to the "waterfall" method, in which impressions impressions are offered to one sales channel at a time, moving down an inflexible stack of sources.
With header bidding, the publisher creates a short delay in their ad serving to obtain bids from many SSPs and ad exchanges. In this way, publishers can receive high value bids on their inventory that may be unavailable through their primary ad server and exchange.
The returned bids are then passed into the ad server so they can compete with direct demand and the primary ad server's exchange on a level playing field.

### A Brief History of Header Bidding

The early days of header bidding were dominated by bad practices, proprietary tech, poor standards, and little to no cooperation between competing companies. Publishers were presented with the confusing and time-consuming process of having to manually patch together various solutions from different companies and processes.
Prebid.js launched in 2015 to make header bidding easy for publishers by bringing conformity and simplicity to the header bidding process. By creating a simple, open tech layer upon which companies could add their code to a standard but optimized foundation, Prebid.js made it easier to implement header bidding, and offered the largest repository of working adapters.
Today, Prebid.js is the most widely used header bidding "container" or "wrapper" on the web. The ecosystem supports more than 300 demand partners, about 50 analytics providers, and thousands of websites.

## Benefits of Prebid Products

The Prebid product suite offers publishers multiple benefits designed to foster a better header bidding experience, including:  

- A free and open source set of solutions, enabling anyone to contribute or review code.  
- The largest repository of working header bidding adapters.  
- Asynchronous and single time-out to provide a better user experience.  
- Prebid Server, to run faster auctions with more partners.  
- Modules, tools, and analytics support to optimize publisher setup.  
- Multiple options on formats (display, video, native) and channels (mobile, web).  
- A well established and helpful community that can advise on best practices and, if needed, provide professional setup and services.  

## Prebid Products

### Prebid.js

Prebid.js is the core product of the Prebid suite. It supports multiple formats include display, video, and native, and provides a simple process for header bidding that can be ramped up to fit the complexity of your needs.

**Reducing Latency**

One of the main problems publishers have experienced with other header bidding solutions is the delay between the bid requests being sent and the responses being returned. Some solutions use synchronous calls, meaning each bidder has to receive the request and return a response before the next bidder is called. This can lead to a long delay between when the web page is called and when it is actually loaded.
Prebid resolves this issue by concurrently calling the selected bidders within the set timeout. That setting is respected by Prebid.js, and any bidder not returning a result within the timeout duration is excluded from the auction. This dramatically decreases the page load time, providing a better user experience.

**Prebid.js process**

A simple Prebid.js process follows these steps:  
1. The ad server's tag is paused by a timer while Prebid.js sends out bid requests to selected bidders.
2. Creatives and bids are returned from the bidders.
3. From the bid responses, Prebid.js finds a winner (if applicable) and caches the creatives.
4. Prebid passes the winning bid parameters to the ad server as key-values.
5. The ad server takes those key-values and finds a matching line item and compares to other line items that bid on this impression.
6. If the ad server determines Prebid wins the auction it returns a signal to Prebid.js, which then writes the creative to the page.   

![Prebid.js Simple Flowchart](/assets/images/flowcharts/pb-js-simple.png)

### Prebid Server

Prebid Server provides a server-side solution to header bidding. Built on the same core principles as Prebid.js, our server solution can reduce latency and improve page load time.

When a pub chooses to push auctions to the server-side, they're doing it to
lighten the load that header bidding has on the browser. For instance, if 5
bidders are moved from the client-side to the server-side, the browser just makes
one request to PBS, which fans out the actual 5 auctions across server-to-server
connections.

Several Prebid.org members provide [hosted solutions](https://prebid.org/product-suite/managed-services/), enabling publishers to receive the benefits of server-side header bidding without the need to implement and manage the process themselves.

If a publisher would prefer to implement their own solution, source code in [Go](https://github.com/prebid/prebid-server) or [Java](https://github.com/prebid/prebid-server-java) is available from our Github page and detailed instructions for configuring, deploying and testing your implementation can be found in the [Prebid Server section](/prebid-server/overview/prebid-server-overview.html) of this site.  

**Prebid Server process**

Prebid Server (PBS) provides multiple endpoints for auctions as well as data retrieval and supports the AMP (accelerated mobile pages) format. The primary endpoint is `/openrtb2/auction` and the process follows these steps:

1. An OpenRTB request is sent to Prebid Server.
2. Prebid Server conducts the auction with selected SSPs and ad exchanges.
3. PBS collects the bids and creatives.
4. PBS passes the winning bid parameters to Prebid.js the ad server.
5. The ad server takes the passed in key-values and finds a matching line item and then compares to other line items that bid on this impression.
6. If the ad server determines Prebid wins the auction it returns the Prebid Universal Creative
7. The Prebid Universal Creative displays the winning ad.

![Prebid Server Flowchart](/assets/images/flowcharts/pb-server-display.png)

See the [Prebid Server documentation](/prebid-server/overview/prebid-server-overview.html) for more use cases including [AMP](/prebid-server/use-cases/pbs-amp.html) and [Mobile App](/prebid-server/use-cases/pbs-sdk.html).

### Prebid Mobile

For mobile apps, Prebid provides Prebid Mobile (PBM) SDK: an end-to-end header bidding solution for both iOS and Android. Working in conjunction with Prebid Server, PBM reduces latency and enables access to more mobile buyers, provides options for banner and interstitial ad formats, and enables user to set global targeting values for the bid request.

**Prebid Mobile process**

The PBM header bidding process follows these steps:

1. Prebid Mobile sends a request to Prebid Server. This request consists of the Prebid Server account ID and config ID for each tag included in the request.
2. Prebid Server constructs an OpenRTB bid request and passes it to the demand partners.
3. Each demand partner returns a bid response to Prebid Server. The bid response includes the bid price and the creative content.
4. Prebid Server sends the bid responses to Prebid Mobile.
5. Prebid Mobile sets key-value targeting for each ad slot through the primary ad server mobile SDK. This targeting will activate one or more of Prebid line items that were previously configured in the primary ad server.
6. If the line item associated with the Prebid Mobile bid wins, the primary ad server returns the Prebid Universal Creative JavaScript to the ad server’s SDK.
7. The Prebid Universal Creative JavaScript will fetch and render the corresponding creative content from the winning Prebid Server demand partner.

![Prebid Mobile Flowchart](/assets/images/flowcharts/pb-mobile.png)

## Further Reading
+ [Prebid.js](/prebid/prebidjs.html)
+ [Prebid Server](/prebid-server/overview/prebid-server-overview.html)
+ [Prebid Mobile](/prebid-mobile/prebid-mobile.html)
+ [Managed Prebid Solutions](https://prebid.org/product-suite/managed-services/)
