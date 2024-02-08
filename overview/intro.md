---
layout: page_v2
title: Introduction to Prebid
description: An overview of Prebid org and products
sidebarType: 0
---

# Introduction to Prebid

{:.no_toc}

- TOC
{:toc}

Prebid is the leading header bidding solution. It is free and fully open source, available to any publisher who wants to implement header bidding. This introduction describes Prebid and its benefits. For a general overview of header bidding, see [Introduction to Header Bidding](/overview/intro-to-header-bidding.html).

{: .alert.alert-info :}
If you’re looking for a marketing-level overview of the Prebid software and organization, including product features, membership, events, and so on, visit [Prebid.org](https://prebid.org/).

## Overview

A video overview of Prebid.

<div style="padding:56.25% 0 0 0;margin: 1rem 0;position:relative;"><iframe src="https://player.vimeo.com/video/819942988?h=1a3701d51a&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Intro to Prebid"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

Further Reading:

- [Transcript of this video overview](/overview/intro-video.html)
- [Introduction for Developers](/developers.html)
- [Prebid Membership](https://prebid.org/membership)
- [Prebid on Github](https://github.com/prebid)

## Header Bidding with Prebid

The Prebid.org suite of products leads the industry in providing header bidding to publishers.

<iframe
    src="https://sincera.metabaseapp.com/public/question/fc2fec3f-f702-45f3-8e5d-672515817168"
    frameborder="0"
    width="800"
    height="600"
    allowtransparency>
</iframe>

<div style="width:800px;">
<p align=right>
<a href="https://app.sincera.io/">Data by <img border="0" alt="Sincera" src="/assets/images/intros/Sincera_Logo_Black_Green-small.png"></a>
</p>
</div>

Prebid is more than a product; it’s a product suite, a community, and an independent organization.

- **Product Suite:** A free and open source suite of software products that enables publishers to implement header bidding on websites and mobile apps.
- **Community:** Our community is comprised of developers from companies across the ad tech industry who maintain and improve our products.
- **Organization:** Prebid.org is an active membership of leaders within the ad tech industry that promotes Prebid products and works with the ad tech community to define and implement enhanced solutions. For more about the organization, see Prebid.org.

![Prebid organization](/assets/images/intros/prebid-intro.png){: .center-image }

{: .alert.alert-info :}
Our flagship product, Prebid.js, is sometimes referred to as simply Prebid, but the Prebid product line supports header bidding for web, AMP, and mobile apps, using both client- and server-side components.

## A Brief History of Prebid

The early days of header bidding were dominated by bad practices, proprietary tech, poor standards, and little to no cooperation between competing companies. Publishers were presented with the confusing and time-consuming process of having to manually patch together various solutions from different companies and processes.

Launched in 2015 as a collaboration of several leading ad tech companies, Prebid.js was developed to make header bidding easy for publishers by bringing conformity and simplicity to the header bidding process. Prebid.js provided a simple, open tech layer upon which companies could add their code to a standard but optimized foundation, and connected publishers and advertisers to demand side partners. Over time, more ad tech companies and individual contributors joined the collaboration, making Prebid the most widely used header bidding “container” or “wrapper” available. Today the ecosystem supports more than 300 demand partners, about 50 analytics providers, and thousands of websites.

## Prebid Products

Since the launch of Prebid.js, the Prebid line or products has continued to grow. Our product line includes:

- **Prebid.js:** Provides a powerful and easy-to-implement code set to improve header bidding for display and video ads on a publisher’s website and within OTT applications.
- **Prebid Server:** Provides a server-side solution for header bidding. Utilizing Prebid Server can support additional use cases such as mobile apps, reduce latency between bid request and ad selection, and speed the presentation of your site and ads. Can be used as an option for managing the number of bidders, with some calls to bidders through the client and some server-side.
- **Prebid Mobile:** Our native iOS and Android solutions to enable header bidding within a mobile app.
- **SharedID:** Native hosted ID offering that is simple, free, robust, and privacy-minded.

### Prebid.js

Prebid.js is a JavaScript library that runs in the browser, and is the core product of the Prebid suite. It supports multiple formats including display, video, and native, and provides a simple process for header bidding that can be ramped up to fit the complexity of your needs.

One of the many benefits to using Prebid.js as your header bidding solution is its ability to reduce latency. Latency - the delay between the bid requests being sent and the responses being returned - is one of the main concerns publishers have with header bidding. Prebid addresses this issue by concurrently calling the selected bidders within the set timeout. That setting is respected by Prebid.js, and any bidder not returning a result within the timeout duration is excluded from the auction. This dramatically decreases the page load time, providing a better user experience. (See [“Prebid and Latency”](#latency) below for more information on latency.)

See [What is Prebid.js?](/prebid/prebidjs.html) for more information.

### Prebid Server

Prebid Server (PBS) provides a powerful framework for a server-side solution to header bidding. Built on the same core principles as Prebid.js, our server solution can reduce latency and improve page load time. A server-side solution to header bidding is required in environments that don’t have HTML header sections in which to put JavaScript, such as mobiles apps and Accelerated Mobile Pages (AMP) sites.

When a publisher chooses to push auctions to the server side, they’re doing it to lighten the load that header bidding has on the browser. For instance, if five bidders are moved from the client side to the server side, the browser just makes one request to PBS, which delegates the actual auctions to the server, lightening the load on the user's device.

Several Prebid.org members provide [managed solutions](https://prebid.org/product-suite/managed-services/), enabling publishers to receive the benefits of server-side header bidding without the need to implement and manage the process themselves.

If a publisher would prefer to implement their own solution, source code in Go and Java is available from our Github page and instructions for configuring, deploying and testing your implementation can be found in the Prebid Server section of this site.

See [Prebid Server Overview](/prebid-server/overview/prebid-server-overview.html) for more information.

### Prebid Mobile

For mobile apps, Prebid provides Prebid Mobile (PBM) SDK, an end-to-end header bidding solution for both iOS and Android. Working in conjunction with Prebid Server, PBM enables access to more mobile buyers and provides options for banner, interstitial, and native ad formats as well as video ads.

See [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html) for more information.

### SharedID

SharedId is a first party identifier. For more information, see [Prebid SharedID](/identity/sharedid.html).

### Modules

Along with our suite of products, Prebid comes with modules that enable you to implement the header bidding solution that’s right for you. A module is add-on code that is outside the core Prebid.js functionality, all of which have been provided by a thriving ecosystem of contributors. There are many different types of modules, including bid adapters, analytics adapters, real-time data modules, user ID modules, and others.

Bid adapter modules are used to communicate with the bidders (SSPs, DSPs, and exchanges) that will be participating in the header bidding auction. Bidders create these adapters and submit them to Prebid, where they’re reviewed and tested before being made publicly available. You choose your adapters when you build or download Prebid.js. (You can also add them in later.) To help you determine the adapters that are available and decide which are right for you, Prebid provides a spreadsheet that lists all Prebid bid adapters and information about them, including media formats, regulatory compliance, etc. <a href="/dev-docs/bidder-data.csv" download>Download the CSV spreadsheet.</a>

Analytics adapter modules allow you to gather analytics from Prebid.js and send them to your analytics provider (such as Google Analytics). See [Prebid.js Analytics Adapters](/overview/analytics.html) for more information.

Additional modules are available that support identity, price floors, testing, currency, and much more. See [Prebid.js Module Overview](/dev-docs/modules/) for more information.

<iframe
    src="https://sincera.metabaseapp.com/public/question/bf512a54-9ae6-4311-bb99-1fab9c6cd93a"
    frameborder="0"
    width="800"
    height="600"
    allowtransparency>
</iframe>

<div style="width:800px;">
<p align=right>
<a href="https://app.sincera.io/">Data by <img border="0" alt="Sincera" src="/assets/images/intros/Sincera_Logo_Black_Green-small.png"></a>
</p>
</div>

## Benefits of Using Prebid Products

The Prebid product suite offers publishers multiple benefits designed to foster a better header bidding experience, including:

- A free and open source set of solutions, enabling anyone to contribute or review code.
- Ongoing innovations across all products and channels, led by strategic working groups of Prebid.org members.
- The largest repository of working header bidding adapters.
- Asynchronous and single time-out to provide a better user experience.
- Prebid Server, to support non-JavaScript scenarios and to run faster auctions with more partners.
- Modules, tools, and analytics support to optimize publisher setup.
- Multiple options on formats (display, video, native) and channels (mobile, web).
- A well established and helpful community that can advise on best practices and, if needed, provide professional setup and services.
- Troubleshooting and support, where members answer questions through issues raised in Github.

![Prebid Benefits](/assets/images/intros/prebid-benefits.png){: .center-image }

## Prebid Integration and Maintenance

Publishers who don’t have engineering and/or ad ops resources available can still implement header bidding with Prebid by working with a managed service company that can integrate and maintain Prebid for you. See the [list of Prebid.org members who provide managed services](https://prebid.org/product-suite/managed-services/) if this is the right option for your organization.

If you decide to use in-house resources to implement Prebid, keep in mind that regular software upgrades are critical. Prebid is continually releasing bug fixes, performance improvements, new features, better regulation support, etc. We suggest you upgrade at least every six months.

<iframe
  src="https://sincera.metabaseapp.com/public/question/5242802a-75be-4dff-a49c-095769016410"
  frameborder="0"
  width="800"
  height="600"
  allowtransparency>
</iframe>

<div style="width:800px;">
<p align=right>
<a href="https://app.sincera.io/">Data by <img border="0" alt="Sincera" style="vertical-align:center" src="/assets/images/intros/Sincera_Logo_Black_Green-small.png"></a>
</p>
</div>

<a name="latency"></a>

## Prebid and Latency

With header bidding, the publisher creates a short delay in their ad serving to obtain bids that might be used in the ad decisioning. Often a major concern with this process is the latency caused by this delay. By delaying the ad serving, you may lose impressions from users who bounce very quickly. Prebid provides several options for minimizing this issue.

- Minimize the number of bidders that will be allowed to participate in the header bidding auction. The fewer demand partners that have the opportunity to bid, the fewer the bids, and therefore the faster the processing. But fewer demand partners also means fewer chances for an optimal bid. It might require some time and experimentation to determine the optimal number. Client-side implementations typically use 5 – 15 demand partners. Because of the faster processing speeds, server-side will often have more.
- Use Prebid Server to do the processing rather than the client browser. Passing the load of running auctions to the server can be faster than running them client-side from the browser. You can also use a combination of client and server processing to optimize your yield while still reducing latency.
- Set a time limit for receiving bids. Prebid provides the option for you to set a time limit. Any demand partner who hasn’t responded with a bid within the time allotted will not be included in the auction. See [Timeouts](/features/timeouts.html) for more information.
- Asynchronous Processing. Requests are sent to all bidders at once, rather than one at a time.

We recommend that publishers do A/B testing on the number of bidders, timeout values, and client-vs-server for their specific pages. If your org doesn't do a lot of A/B testing, several of the managed services can help in this area.

## Community Support

If you ever need support, simply raise an issue on [one of our Github repositories](https://github.com/prebid). We also provide extensive documentation not only on our products but on how to integrate them with various ad servers.

Prebid also has an active member community that ensures Prebid will continue to grow and evolve in a way that is beneficial to the header bidding ecosystem. Through a variety of committees, Prebid.org members continually decide on and prioritizes new features, updates, and fixes.

## Prebid Membership

The ad server you’re working with makes their money by taking a cut of the winning bid price, so you might be wondering if Prebid also takes a cut. The answer is NO. Prebid is free to anyone who wants to use it. So how does Prebid continue to evolve as a quality set of products (not to mention provide events and great documentation) without taking in fees? Through dedicated volunteers from member companies, alongside a small handful of employees and an occasional contractor paid through Prebid.org membership dues. All dues go into serving the Prebid community and providing a voice for our members in the world of header bidding.

You don’t have to be a Prebid.org member to use Prebid. However, we do highly encourage you to explore the benefits of membership and consider joining. No matter the size of your company, Prebid has membership options available that will provide value to anyone interested in header bidding today and in the future. For more information on Prebid.org membership, see [Prebid.org Membership Overview](https://prebid.org/membership/).

## Related Reading

- [Introduction to Header Bidding](/overview/intro-to-header-bidding-video.html)
- [Prebid Product Suite](https://prebid.org/product-suite/)
- [What is Prebid.js](/prebid/prebidjs.html)
