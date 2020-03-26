---

layout: page_v2
title: About Prebid.js
description: An overview of Prebid.js
sidebarType: 1

---

# What is Prebid.js?

Prebid.js is a feature-rich header bidding platform for the web, including more than 200 demand sources and 15 analytics adapters. It supports currency conversion, GDPR, common ID systems, and multiple ad servers.

## How Does Prebid.js Work?

At a high level, header bidding with Prebid.js involves just a few steps:

1. The ad server's tag on page is paused, bound by a timer, while the Prebid.js library fetches bids and creatives from various SSPs & exchanges you want to work with.
1. Prebid.js passes information about those bids (including price) to the ad server's tag on page, which passes it to the ad server as query string parameters.
1. The ad server has line items targeting those bid parameters.
1. If the ad server decides Prebid wins, the ad server returns a signal to Prebid.js telling the library to write the winning creative to the page. All finished!

![Ad Ops Diagram](/assets/images/adops-intro.png){: .pb-lg-img}

The Prebid.js library is composed of these pieces:

+ the Core wrapper code
+ the Adapters a publisher wants to work with
+ optional modules the publisher wants to utilize

## Prebid.js Core

The Prebid.js Core is intended to be lightweight, while achieving all the foundation a good header bidding wrapper needs to provide, including:

+ Sending bid requests to the partners you want
+ Handling the bids they return
+ Sending said bids into the ad server
+ Logging events for reporting
+ ... and so on

We want Prebid.js Core to be fast, fair, and open because it represents the header bidding wrapper itself.

## Prebid.js Adapters

The Prebid.js Adapters plug into Prebid.js Core and are meant to be interchangeable depending on who the publisher wants to work with. There are two types of adapters: bidder and analytics.

Bidder Adapters are supposed to represent the SSPs & Exchanges you want to work with. There are currently over 200 bidder adapters. This set of working header bidding integrations is part of what makes Prebid.js so special. Each company maintains their own Prebid.js adapter to provide the freshest code for publishers, rather than a proprietary wrapper solution trying to reverse engineer another company's adapter. It's a win-win for everyone.

Analytics adapters offer the ability to learn more about latency, revenues, bid rates, etc. Please see our [analytics page]({{site.github.url}}/dev-docs/integrate-with-the-prebid-analytics-api.html) for more information.

## Prebid.js Modules

Prebid.js Modules also plug into the Prebid.js Core. They add functionality not present
in the Core that not every publisher needs. Example modules:

+ GDPR support (the [consentManagement]({{site.baseurl}}/dev-docs/modules/consentManagement.html) module)
+ currency conversion (the [currency]({{site.baseurl}}/dev-docs/modules/currency.html) module)
+ Server-to-server testing (the [s2sTest]({{site.baseurl}}/dev-docs/modules/s2sTesting.html) module)
+ ... others

## Further Reading

+ [Getting Started With Prebid.js](/overview/getting-started.html)
+ [How to Add a Bidder Adapter](/dev-docs/bidder-adaptor.html)
+ [How to Add an Analytics Adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html)
