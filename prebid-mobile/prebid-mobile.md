---

layout: page_v2
title: Prebid Mobile
description: What is Prebid.js
sidebarType: 2

---

# Prebid Mobile Overview

Prebid Mobile is an open-source library that provides an end-to-end header bidding solution for mobile app publishers. Use this library with your ad server's Mobile SDK to communicate with Prebid Server to request and receive bids over RTB. These bids can then compete directly with bids from your primary ad server.

Prebid Mobile libraries are available for iOS and Android.

## Benefits and Features

Some of the benefits to using the Prebid Mobile header bidding solution include:

-   Provides a single integration point with Prebid Server, enabling direct access to more mobile buyers.
-   Allows for server-side configuration management; no need for developers to update the app to make configuration changes.
-   Provides a transparent, open source header bidding solution.
-   Flattens mediation layers, reducing ad ops burden for managing mediation partners.
-   Reduces latency compared to mediation.
-   Designed to integrate with any deployment of the open-source Prebid Server code. (Vendor must be registered in Prebid Mobile as a Prebid Server host.)

## Requirements

-   Prebid Server Configuration

    You must have a Prebid Server account in order to use Prebid Mobile. Prebid Server is a server-based host that communicates bid requests and responses between Prebid Mobile and demand partners.  

    To set up your Prebid Server account for Prebid Mobile, refer to [Getting Started with Prebid Mobile]({{site.github.url}}/prebid-mobile/prebid-mobile-pbs.html).

-   Primary Ad Server Setup

    Prebid Mobile enables you to retrieve bids simultaneously from multiple demand partners outside of a single ad server. This header bidding process does not determine a final winning bid. Ad ops users need to set up line items associated with each ad unit on a primary ad server. Prebid Mobile will send bids (via the primary ad server SDK) to the primary ad server. This ad server will include the bids from the header bidding process in determining a winning bid. (See "How It Works" below.)

-   Prebid Mobile SDK

    Mobile app developers implement header bidding through the Prebid Mobile SDK integration. SDKs are available for [iOS](https://github.com/prebid/prebid-mobile-ios) and [Android](https://github.com/prebid/prebid-mobile-android).

## How It Works

The following diagram shows how the Prebid Mobile header bidding solution works.

![How Prebid Mobile Works - Diagram]({{site.baseurl}}/assets/images/prebid-mobile/pbm-overview-flow.png){: .pb-lg-img :}

1.  Prebid Mobile sends a request to Prebid Server. This request consists of the Prebid Server account ID and config ID for each tag included in the request.

2.  Prebid Server constructs an OpenRTB bid request and passes it to the demand partners.  

3.  Each demand partner returns a bid response to Prebid Server. The bid response includes the bid price and the creative content.

4.  Prebid Server sends the bid responses to Prebid Mobile.

5.  Prebid Mobile sets key/value targeting for each ad slot through the primary ad server mobile SDK. This targeting will activate one or more of Prebid line items that were previously configured in the primary ad server.

6.  If the line item associated with the Prebid Mobile bid wins, the primary ad server returns the Prebid Mobile creative JavaScript to the ad server's SDK.

7.  The Prebid Mobile creative JavaScript will fetch and render the corresponding creative content from the winning Prebid Server demand partner.

## Mobile Analytics

Currently Prebid Mobile SDK doesn't offer direct analytics capabilities. While we build out analytics in Prebid Server to support the SDK, some options are:

- Generate analytics from the ad server, as key metrics are available there if the line items are broken out by bidder.
- Integrate an analytics package directly into the app. You may have one already that can accomodate header bidding metrics.
