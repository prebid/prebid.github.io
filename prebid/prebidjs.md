---

layout: page_v2
title: About Prebid.js
description: An overview of Prebid.js
sidebarType: 1

---
 
# What is Prebid.js?

Prebid.js is a feature-rich header bidding platform for the web, including more than 300 demand sources and 50 analytics adapters. It supports currency conversion, GDPR, common ID systems, and multiple ad servers.

## Video Overview of Prebid.js

A high-level overview of Prebid.js, Prebid’s header bidding product for websites.

{% include vimeo-iframe.html id="822153705" title="1.3_IntroToPBJS_v5" %}

Further Reading:

- [Transcript of this video overview](/prebid/prebidjs-video.html)
- [Intro to Header Bidding](/overview/intro-to-header-bidding.html)
- [Header Bidding with Prebid](/overview/intro.html#header-bidding-with-prebid)
- [Prebid.js Developer Quick Start](/dev-docs/getting-started.html)

## How Does Prebid.js Work?

At a high level, header bidding with Prebid.js involves just a few steps:

1. The ad server's tag on the page is paused, bound by a timer, while the Prebid.js library fetches bids and creatives from various SSPs & exchanges you want to work with.
1. Prebid.js passes information about those bids (including price) to the ad server's tag on the page, which passes it to the ad server as query string parameters.
1. The ad server has line items targeting those bid parameters.
1. If the ad server decides Prebid wins, the ad server returns a signal to Prebid.js telling the library to write the winning creative to the page.

![Ad Ops Diagram](/assets/images/adops-intro.png){: .pb-lg-img}

The Prebid.js library is composed of these pieces:

- The Core wrapper code
- The Adapters a publisher wants to work with
- Optional modules the publisher wants to utilize

## Prebid.js Core

The Prebid.js Core is intended to be lightweight, while achieving all the foundation a good header bidding wrapper needs to provide, including:

- Sending bid requests to the partners you want
- Handling the bids they return
- Sending said bids to the ad server
- Logging events for reporting
- ... and so on

We want Prebid.js Core to be fast, fair, and open because it represents the header bidding wrapper itself.

## Prebid.js Adapters

The Prebid.js Adapters plug into Prebid.js Core and are meant to be interchangeable depending on who the publisher wants to work with. There are two types of adapters: bidder and analytics.

Bidder Adapters represent the SSPs & Exchanges you want to work with. There are currently over 300 bidder adapters. This set of working header bidding integrations is part of what makes Prebid.js so special. Each company maintains its own Prebid.js adapter to provide the freshest code for publishers, rather than a proprietary wrapper solution trying to reverse engineer another company's adapter. It's a win-win for everyone.

Analytics adapters offer the ability to learn more about latency, revenues, bid rates, etc. Please see our [analytics page](/dev-docs/integrate-with-the-prebid-analytics-api.html) for more information.

## Prebid.js Modules

Prebid.js Modules also plug into the Prebid.js Core. They add functionality not present
in the Core that not every publisher needs. Example modules:

- GDPR support (the [consentManagement]({{site.baseurl}}/dev-docs/modules/consentManagement.html) module)
- Currency conversion (the [currency]({{site.baseurl}}/dev-docs/modules/currency.html) module)
- Server-to-server testing (the [s2sTest]({{site.baseurl}}/dev-docs/modules/s2sTesting.html) module)
- and [many others](/dev-docs/modules/index.html)

## Cookies and Local Storage

In both a publisher or third-party context, Prebid.js may set cookies or local storage in users' browsers. These are the first-party cookies it may set in the publisher context:

- prebid.cookieTest - used to verify whether other cookies are possible to be set. Immediately deleted upon being set. This behavior may be restricted when GDPR applies by using the `strictStorageEnforcement` setting.
- _pbjs_userid_consent_data - used to make consent data conveniently available through the userId module. Real-time consent is obtained from the CMP using an event listener as required by TCF 2.2, if the consent has changed (eg the vendor list has changed), user id endpoints are eligible to be called again so that their encryption may be refreshed.

These values are not declared in Prebid.org's [device storage disclosure file](https://docs.prebid.org/prebid/deviceStorageDisclosure.json) in its GVL representation. This is because these values are set by the publisher themselves using an open-source script that is subject to modification by the publisher in any way. Prebid.org has no control over its final implementation, including expiration dates or use for other purposes by the publisher we cannot foresee. Prebid.org's only reason to be on the GVL is for long deprecated functionality (shared id third-party cookies) and publishers using modern versions should have no reason to include the Prebid.org GVL ID in their CMP. These two values are also not subject to CMP device storage checks without additional configuration.

There are also certain identity sub-modules, such as the Prebid.org-maintained module [SharedId](/identity/sharedid.html) or the Publisher-provided identity module that may set cookies or other values on the device in the publisher context. The device storage used by these modules are also considered publisher-set values, and publishers should control the opt-outs and disclosures accordingly. Also, the topics module may set topics it observes in the publisher context. The Prebid.org GVL vendor id is not checked when these modules or sub-modules seek to use storage when GDPR applies according to a TCF2.2 CMP; consent to the publisher itself is checked.

Storage values set by vendor modules are subject to user consent and privacy regulations, such as GDPR, and should be declared in the respective vendors' device storage disclosure files.

## Further Reading

- [Developer Getting Started With Prebid.js](/dev-docs/getting-started.html)
- [How to Add a Bidder Adapter](/dev-docs/bidder-adaptor.html)
- [How to Add an Analytics Adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html)
- [Ad Ops and Prebid Overview](/adops/before-you-start.html)
