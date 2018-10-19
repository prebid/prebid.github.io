---
layout: page
title: Getting Started with Prebid Mobile
description: Getting Started with Prebid Mobile
pid: 1
is_top_nav: yeah
top_nav_section: prebid-mobile
nav_section: prebid-mobile
---

<div class="bs-docs-section" markdown="1">

# Getting Started with Prebid Mobile
{:.no_toc}

This page gives an overview of steps you need to take, either as an ad ops user or as a developer, to start using Prebid Mobile.

{: .alert.alert-info :}
If this is your first time working with header bidding, we recommend that you read [What is Prebid?]({{site.github.url}}/overview/intro.html) before diving into Prebid Mobile.

* TOC
{:toc}

## Set Up Prebid Server

Before you begin using Prebid Mobile in your apps, you need to prepare your end-to-end system. The first step is to set up your Prebid Server host. Prebid Mobile works in conjunction with Prebid Server to request and receive bids. At this time you have three options when selecting your Prebid Server host:

-   Register with AppNexus
-   Register with Rubicon Project
-   Set up your own Prebid Server host

### Register with AppNexus

-   Go to the [Prebid Server application page](https://prebid.adnxs.com) and click **Apply**.
-   You'll receive an email notifying you as to whether you've been granted access to the AppNexus-hosted Prebid Server implementation. If you receive access you'll be provided with an account ID and will be able to set up server-side bidder configurations.

### Register with Rubicon Project

Send an email to prebidserver@rubiconproject.com. While you wait for a verification email, you can continue with the steps below.

### Implement Your Own Prebid Server Host

Prebid Server is an open source project. This allows you to host your own implementation of Prebid Server. The source code is available under the [Prebid organization on Github](https://github.com/prebid/prebid-server).

See the [Prebid Server docs on Github](https://github.com/prebid/prebid-server/tree/master/docs) for more information on setting up your own server host.

## Configure Prebid Server

After you've registered with your chosen Prebid Server host, you need to create at least one Prebid Server bidder configuration. Each configuration contains a list of bidders and their parameters. The configuration will be in the form of a JSON structure, similar to this:

```
[
    {
    	"bidder": "appnexus",
    	"params": {
    	    "placementId": 13144370
        }
    }
]
```

The preceding is an example structure using AppNexus as the bidder. The parameters you need to set differ for each bidder. See [Bidder Parameters]({{site.github.url}}/dev-docs/bidders.html) for a full list of parameters for available bidders.

## Developers - Using the SDK

To begin using Prebid Mobile, download the Prebid Mobile SDK:
-   [SDK for iOS](https://github.com/prebid/prebid-mobile-ios)
-   [SDK for Android](https://github.com/prebid/prebid-mobile-android)

After you have the SDK installed, register ad units with the Prebid Mobile framework.
-   [iOS Code Integration]({{site.github.url}}/prebid-mobile/code-integration-ios.html)
-   [Android Code Integration]({{site.github.url}}/prebid-mobile/code-integration-android.html)

## Ad Ops - Setting Up the Ad Server

Ad ops users configure the primary ad server with Prebid Mobile line items targeted to key/values.
-   [Set Up Line Items for DFP]({{site.github.url}}/prebid-mobile/adops-line-item-setup-dfp.html)
-   [Set Up Line Items for MoPub]({{site.github.url}}/prebid-mobile/adops-line-item-setup-mopub.html)

## Additional Information

The following resources are available for further information on working with Prebid Mobile:

### Ad Ops

-   [Price Granularity]({{site.github.url}}/prebid-mobile/adops-price-granularity)  
    Additional details to help you ensure your line items are set up to target bid prices at an appropriate level of granularity.

### Mobile Developers

**iOS**

-   [Targeting Parameters]({{site.github.url}}/prebid-mobile/targeting-params-ios)  
    Learn about the parameters available in the iOS Prebid Mobile SDK.

-   [Logging and Troubleshooting]({{site.github.url}}/prebid-mobile/logging-and-troubleshooting-ios)  
    Instructions on troubleshooting issues you might encounter.

**Android**

-   [Targeting Parameters]({{site.github.url}}/prebid-mobile/targeting-params-android)  
    Learn about the parameters available in the Android Prebid Mobile SDK.

-   [Logging and Troubleshooting]({{site.github.url}}/prebid-mobile/logging-and-troubleshooting-android)  
    Instructions on troubleshooting issues you might encounter.

### GDPR

Prebid Mobile provides APIs for app publishers in support of the [IAB Europe Transparency & Consent Framework](http://advertisingconsent.eu/).

For general information on these APIs see [Prebid Mobile Guide to European Ad Inventory and Providing Notice, Transparency and Choice]({{site.baseurl}}/prebid-mobile/gdpr.html).

For specific implementation details, see the "GDPR Consent" section here:
-   [iOS - Targeting Parameters]({{site.github.url}}/prebid-mobile/targeting-params-ios)
-   [Android - Targeting Parameters]({{site.github.url}}/prebid-mobile/targeting-params-android)

</div>
