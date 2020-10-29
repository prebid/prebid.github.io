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
If you're looking for a more high-level overview of Prebid.org, including product features, membership, events, and so on, visit [Prebid.org](https://prebid.org/).

Prebid is more than a product; it's a product suite, a community, and an organization.

- **Product Suite:** A free and open source suite of software products designed to enable publishers to implement header bidding on their websites and from within their apps. Our product line includes:  
   - <span style="color:#EA9622">**Prebid.js:**</span> The core of our codebase. Prebid.js provides a simple and easy-to-implement code set to improve header bidding for display and video ads on a publisher's website and within OTT applications.  
   - <span style="color:#EA9622">**Prebid Server:**</span> Provides a hosted or custom server-side solution for header bidding. Utilizing Prebid Server can reduce latency between bid request and ad selection, and speed the presentation of your site and ads.  
   - <span style="color:#EA9622">**Prebid Mobile:**</span> Our native iOS and Android solutions to enable header bidding within a mobile app.
- **Community:** The developers that maintain and improve our products.  
- **Organization:**  A collection of leaders within the ad tech industry that promotes our products, works with the ad tech community to expand the solutions our products can provide, and encourages the development of the platform. For more about the organization, see the [Prebid.org](https://prebid.org/) website.  

{% include alerts/alert_note.html content="Our flagship product, Prebid.js, is sometimes referred to as simply *Prebid*, but please be aware that the Prebid product line supports header bidding for web, AMP, and mobile apps, using both client- and server-side project components." %}

## Header Bidding

### What is header bidding?

Header bidding is a response to a fragmented and highly inefficient process for digital ad display. It is an alternative to the "waterfall" method, the process of offering impressions in one sales channel and if that does not succeed moving to less valuable channels. Header bidding is sometimes referred to as advance bidding or pre-bidding.
When the page loads, header bidding enables publishers to have simultaneous auctions with all SSPs and ad exchanges. Publishers can receive bids on their inventory that may be unavailable through their primary ad server and exchange.
The returned bids are then passed into the ad server so they can compete with direct demand and the primary ad server's exchange on a level playing field.

### A brief history of header bidding

The early days of header bidding were dominated by bad practices, closed proprietary tech, poor standards, and little to no cooperation between competing companies. Publishers were presented with the confusing and time-consuming process of having to manually patch together various solutions from different companies and processes.
Prebid.js launched in 2015 to make header bidding easy for publishers by bringing conformity and simplicity to the header bidding process. By creating a simple, open tech layer upon which companies could add their code to a standard but optimized foundation, Prebid.js made it easier to implement header bidding, and offered the largest repository of working adapters.
Today, Prebid.js is the most widely used header bidding "container" or "wrapper" on the web. The ecosystem supports more than 150 demand partners, over fifteen analytics providers, and numerous publishers.

## Benefits of Prebid Products

The Prebid product suite offers publishers multiple benefits designed to foster a better header bidding experience, including:  

- A free and open source solution, enabling anyone to contribute or review code.  
- The largest repository of working header bidding adapters.  
- Asynchronous and single time-out to provide a better user experience.  
- Prebid Server, to run faster auctions with more partners.  
- Tools and analytics to optimize your setup.  
- Multiple options on formats (display, video, native) and channels (mobile, web).  
- A well established and helpful community that can advise on best practices and, if needed, provide professional setup and services.  

## Prebid Products

### Prebid.js

Prebid.js is the core product of the Prebid suite. Implemented on multiple formats to include display, video, and native, it provides a simple process for header bidding that can be ramped up to fit the complexity of your needs.

**Reducing Latency**

One of the main problems publishers have experienced with other header bidding solutions is the delay between the bid requests being sent and the responses being returned. Many solutions use synchronous calls, meaning each SSP or ad exchange has to receive the request and return a response before the next SSP is called. This can lead to a long delay between when the web page is called and when it is actually loaded.
Prebid resolves this issue by concurrently calling the selected SSPs and ad exchanges within the set timeout. That setting is respected by Prebid.js, and any bidder not returning a result within the timeout duration is excluded from the auction. This dramatically decreases the page load time, providing a better user experience.

**Prebid.js process**

A simple Prebid.js process follows these steps:  
1. The ad server's tag is paused by a timer while Prebid.js sends out bid requests to selected SSPs and ad exchanges.
2. Creatives and bids are returned from the SSPs and ad exchanges.
3. From the bid responses, Prebid.js finds a winner (if applicable) and caches the creatives.
4. Prebid passes the winning bid parameters to the ad server as key-values.
5. The ad server takes those key-values and finds a matching line item and compares to other line items that bid on this impression.
6. If the ad server determines Prebid wins the auction it returns a signal to Prebid.js, which then writes the creative to the page.   

![Prebid.js Simple Flowchart](/assets/images/flowcharts/pb-js-simple.png)

### Prebid Server

Prebid Server provides a server-side solution to header bidding. Built on the same core principles as Prebid.js, our server solution can reduce latency and improve page load time.
Several Prebid.org members provide hosted solutions, enabling publishers to receive the benefits of server-side header bidding without the need to implement and manage the process themselves.

If a publisher would prefer to implement their own solution, [source code](https://github.com/prebid/prebid-server) is available from our Github page and detailed instructions for configuring, deploying and testing your implementation can be found in the [Prebid Server section](/prebid-server/overview/prebid-server-overview.html) of this site.  

**Prebid Server process**

Prebid Server (PBS) provides multiple endpoints for auctions as well as data retrieval and supports the AMP (accelerated mobile pages) format. The primary endpoint is `/openrtb2/auction` and the process follows these steps:

1. An OpenRTB request is sent to Prebid Server.
2. Prebid Server conducts the auction with selected SSPs and ad exchanges.
3. PBS collects the bids and creatives and stores them in Prebid cache.
4. PBS passes the winning bid parameters to the ad server.
5. The ad server takes the passed in key-values and finds a matching line item and then compares to  other line items that bid on this impression.
6. If the ad server determines Prebid wins the auction it returns a reference to the winning creative to Prebid.
7. Prebid retrieves the winning creative and displays it in the correct ad slot.

![Prebid Server Flowchart](/assets/images/flowcharts/pb-server-display.png)

### Prebid Mobile

For mobile apps, Prebid provides Prebid Mobile (PBM), an end-to-end header bidding solution for both iOS and Android. Working in conjunction with Prebid Server, PBM reduces latency and enables access to more mobile buyers, provides options for banner and interstitial ad formats, and enables user to set global targeting values for the bid request.

**Prebid Mobile process**

The PBM header bidding process follows these steps:

1. Prebid Mobile sends a request to Prebid Server. This request consists of the Prebid Server account ID and config ID for each tag included in the request.
2. Prebid Server constructs an OpenRTB bid request and passes it to the demand partners.
3. Each demand partner returns a bid response to Prebid Server. The bid response includes the bid price and the creative content.
4. Prebid Server sends the bid responses to Prebid Mobile.
5. Prebid Mobile sets key-value targeting for each ad slot through the primary ad server mobile SDK. This targeting will activate one or more of Prebid line items that were previously configured in the primary ad server.
6. If the line item associated with the Prebid Mobile bid wins, the primary ad server returns the Prebid Mobile creative JavaScript to the ad server’s SDK.
7. The Prebid Mobile creative JavaScript will fetch and render the corresponding creative content from the winning Prebid Server demand partner.

![Prebid Mobile Flowchart](/assets/images/flowcharts/pb-mobile.png)

## Further Reading
+ [Prebid.js](/prebid/prebidjs.html)
+ [Prebid Server](/prebid-server/overview/prebid-server-overview.html)
+ [Prebid Mobile](/prebid-mobile/prebid-mobile.html)
+ [Managed Prebid Solutions](https://prebid.org/product-suite/managed-services/)
