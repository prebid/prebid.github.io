---

layout: page_v2
title: About Prebid.js
description: An overview of Prebid.js
sidebarType: 1

---
 
# What is Prebid.js?

Prebid.js is a feature-rich header bidding platform for the web, including more than 300 demand sources and 50 analytics adapters. It supports currency conversion, GDPR, common ID systems, and multiple ad servers.

## How Does Prebid.js Work?

At a high level, header bidding with Prebid.js involves just a few steps:

1. The ad server's tag on page is paused, bound by a timer, while the Prebid.js library fetches bids and creatives from various SSPs & exchanges you want to work with.
1. Prebid.js passes information about those bids (including price) to the ad server's tag on page, which passes it to the ad server as query string parameters.
1. The ad server has line items targeting those bid parameters.
2. If the ad server decides Prebid wins, the ad server returns a signal to Prebid.js telling the library to write the winning creative to the page.

![Ad Ops Diagram](/assets/images/adops-intro.png){: .pb-lg-img}

The Prebid.js library is composed of these pieces:

- The Core wrapper code
- The Adapters a publisher wants to work with
- Optional modules the publisher wants to utilize

## Prebid.js Core

The Prebid.js Core is intended to be lightweight, while achieving all the foundation a good header bidding wrapper needs to provide, including:

- Sending bid requests to the partners you want
- Handling the bids they return
- Sending said bids into the ad server
- Logging events for reporting
- ... and so on

We want Prebid.js Core to be fast, fair, and open because it represents the header bidding wrapper itself.

## Prebid.js Adapters

The Prebid.js Adapters plug into Prebid.js Core and are meant to be interchangeable depending on who the publisher wants to work with. There are two types of adapters: bidder and analytics.

Bidder Adapters represent the SSPs & Exchanges you want to work with. There are currently over 300 bidder adapters. This set of working header bidding integrations is part of what makes Prebid.js so special. Each company maintains their own Prebid.js adapter to provide the freshest code for publishers, rather than a proprietary wrapper solution trying to reverse engineer another company's adapter. It's a win-win for everyone.

Analytics adapters offer the ability to learn more about latency, revenues, bid rates, etc. Please see our [analytics page](/dev-docs/integrate-with-the-prebid-analytics-api.html) for more information.

## Prebid.js Modules

Prebid.js Modules also plug into the Prebid.js Core. They add functionality not present
in the Core that not every publisher needs. Example modules:

- GDPR support (the [consentManagement]({{site.baseurl}}/dev-docs/modules/consentManagement.html) module)
- Currency conversion (the [currency]({{site.baseurl}}/dev-docs/modules/currency.html) module)
- Server-to-server testing (the [s2sTest]({{site.baseurl}}/dev-docs/modules/s2sTesting.html) module)
- and [many others](/dev-docs/modules/index.html)

## Cookies and Local Storage

On behalf of publishers or third parties, Prebid.js may set cookies or local storage in your browser. These are the first-party cookies it can set on behalf of publishers:
- prebid.cookieTest - used to verify whether other cookies should be set.
- _pbjs_userid_consent_data - used to make consent data conveniently available through various modules.

All other cookies and local storage (including those set by Prebid.org-owned modules like [SharedId](/identity/sharedid.html) are subject to privacy regulations such as GDPR.

## Further Reading

- [Developer Getting Started With Prebid.js](/dev-docs/getting-started.html)
- [How to Add a Bidder Adapter](/dev-docs/bidder-adaptor.html)
- [How to Add an Analytics Adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html)
- [Ad Ops and Prebid Overview](/adops/before-you-start.html)
