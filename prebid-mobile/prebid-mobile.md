---
layout: page
title: Prebid Mobile Overview
description: Prebid Mobile Overview
pid: 0
is_top_nav: yeah
top_nav_section: prebid-mobile
nav_section: prebid-mobile
---

<div class="bs-docs-section" markdown="1">

# Prebid Mobile Overview

* TOC
{:toc }

Prebid Mobile helps app publishers by making the advantages of “traditional” web header bidding available to mobile app environments. This is accomplished by providing libraries that enable mobile app publishers to implement end-to-end, open source header bidding solutions.

## Benefits and Features

Some of the benefits to using the Prebid Mobile header bidding solution include:

-   Provides a single integration point with Prebid Server, providing direct access to more mobile buyers.
-   Server-side configuration management; no need for developers to update the app to make configuration changes.
-   Prebid Mobile is a transparent, open source solution.
-   Created for integration with other prebid products and open source servers.
-   Flattens mediation layers, reducing ad ops burden for managing mediation partners.
-   Latency is reduced compared to mediation.

## How It Works

Prebid Mobile works in conjunction with Prebid Server, demand partners, and your primary ad server to deliver programmable demand to your mobile app.

### What You Need to Get Started

Before you begin to use Prebid Mobile in your apps, you need to prepare your end-to-end system.

**Mobile Developers**

The following is a one-time setup process for *mobile developers*:

-   [Set up a Prebid Server account]({{site.github.url}}/prebid-mobile/prebid-mobile-pbs.html).

-   Download the Prebid Mobile SDK:
    -   [SDK for iOS](https://github.com/prebid/prebid-mobile-ios)
    -   [SDK for Android](https://github.com/prebid/prebid-mobile-android)

After the initial setup, ad slots and line items will need to be set up and maintained:

-   *Mobile developers* register ad units with the Prebid Mobile framework.
    -   [iOS Code Integration]({{site.github.url}}/prebid-mobile/code-integration-ios.html)
    -   [Android Code Integration]({{site.github.url}}/prebid-mobile/code-integration-android.html)

**Ad Ops**

-   *Ad ops team members* configure their primary ad server with Prebid Mobile line items targeted to key/values.
    -   [Set Up Line Items for DFP]({{site.github.url}}/prebid-mobile/adops-line-item-setup-dfp.html)
    -   [Set Up Line Items for MoPub]({{site.github.url}}/prebid-mobile/adops-line-item-setup-mopub.html)

### Lifecycle of a Mobile Ad Call

After you've set up Prebid Mobile and created your line items on your ad server, your ad calls go through the following workflow:

{: .pb-img.pb-lg-img :}
![How Prebid Mobile Works - Diagram]({{site.baseurl}}/assets/images/prebid-mobile/pbm-overview-flow.png)

1.  Prebid Mobile calls Prebid Server, sending along ad unit information.
2.  Prebid Server passes ad unit information on to the demand partners.
3.  Each demand partner conducts an internal auction and sends the top bids to Prebid Server.
4.  Prebid Server returns key/value data, including bid price, to the Prebid Mobile app.
5.  Prebid Mobile sends this key/value data to the primary ad server. (This data will match the key/value targeting previously configured on Prebid line items by the ad ops team.)
6.  Primary ad server sends winning line item information, including creative ad ID (or creative), to Prebid Mobile.
7.  Prebid Mobile app displays the ad and sends tracking data to the primary ad server.

## Additional Information

The following resources are available for further information on working with Prebid Mobile:

### Mobile Developers

**iOS**

-   [Targetting Parameters]({{site.github.url}}/prebid-mobile/targeting-params-ios)  
    Learn about the parameters available in the iOS Prebid Mobile SDK.

-   [Logging and Troubleshooting]({{site.github.url}}/prebid-mobile/logging-and-troubleshooting-ios)  
    Instructions on troubleshooting issues you might encounter.

**Android**

-   [Targetting Parameters]({{site.github.url}}/prebid-mobile/targeting-params-android)  
    Learn about the parameters available in the Android Prebid Mobile SDK.

-   [Logging and Troubleshooting]({{site.github.url}}/prebid-mobile/logging-and-troubleshooting-android)  
    Instructions on troubleshooting issues you might encounter.

### Ad Ops

-   [Price Granularity]({{site.github.url}}/prebid-mobile/adops-price-granularity)  
    Additional details to help you ensure your line items are set up to target bid prices at an appropriate level of granularity.

</div>
