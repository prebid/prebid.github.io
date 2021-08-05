---
layout: page_v2
title: Getting Started with Prebid Mobile
description: Getting Started with Prebid Mobile
sidebarType: 2
---



# Getting Started with Prebid Mobile
{:.no_toc}

This page gives an overview of steps you need to take, either as an ad ops user or as a developer, to start using Prebid Mobile.

{% capture alertNote %}
If this is your first time working with header bidding, we recommend that you read [What is Prebid?](/overview/intro.html) before diving into Prebid Mobile.
{% endcapture %}

{% include alerts/alert_note.html content=alertNote %}


* TOC
{:toc}

## Set Up Prebid Server

Before you begin using Prebid Mobile in your apps, you need to prepare your end-to-end system. The first step is to set up your Prebid Server host. Prebid Mobile works in conjunction with Prebid Server to request and receive bids. Here are the options:

-   Register with a [Prebid.org member that hosts Prebid Server](https://prebid.org/product-suite/managed-services/). While you're waiting for your account, you can continue with the steps below.
-   Set up your own Prebid Server host

### Implement Your Own Prebid Server Host

Prebid Server is an open source project. This allows you to host your own implementation of Prebid Server, though it's not as easy as downloading Prebid.js, because it needs to be hosted. The source code is available under the [Prebid organization on GitHub](https://github.com/prebid/prebid-server). There's also a [Java version of Prebid Server](https://github.com/prebid/prebid-server-java).

See the [Prebid Server docs on GitHub](https://github.com/prebid/prebid-server/tree/master/docs/developers) for more information on setting up your own server host.

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

The preceding is an example structure using AppNexus as the bidder. The parameters you need to set differ for each bidder. See [Bidder Parameters]({{site.github.url}}/prebid-server/developers/add-new-bidder-go.html) for a full list of parameters for available Prebid Server bidders.

## Developers - Using the SDK

To begin using Prebid Mobile, download the Prebid Mobile SDK:
-   [SDK for iOS](https://github.com/prebid/prebid-mobile-ios)
-   [SDK for Android](https://github.com/prebid/prebid-mobile-android)

After you have the SDK installed, register ad units with the Prebid Mobile framework.
-   [iOS Code Integration]({{site.github.url}}/prebid-mobile/pbm-api/ios/code-integration-ios.html)
-   [Android Code Integration]({{site.github.url}}/prebid-mobile/pbm-api/android/code-integration-android.html)

## Ad Ops - Setting Up the Ad Server

Ad ops users configure the primary ad server with Prebid Mobile line items targeted to key/values.
-   [Set Up Line Items for Google Ad Manager]({{site.github.url}}/prebid-mobile/adops-line-item-setup-dfp.html)
-   [Set Up Line Items for MoPub]({{site.github.url}}/prebid-mobile/adops-line-item-setup-mopub.html)

## Additional Information

The following resources are available for further information on working with Prebid Mobile:

### Ad Ops

-   [Price Granularity](/prebid-mobile/adops-price-granularity.html)
    Additional details to help you ensure your line items are set up to target bid prices at an appropriate level of granularity.

### Mobile Developers

**iOS**

-   [Targeting Parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
    Learn about the parameters available in the iOS Prebid Mobile SDK.


**Android**

-   [Targeting Parameters](/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
    Learn about the parameters available in the Android Prebid Mobile SDK.

### GDPR

Prebid Mobile provides APIs for app publishers in support of the [IAB Europe Transparency & Consent Framework](https://www.iab.com/topics/consumer-privacy/gdpr/).

For general information on these APIs see [Prebid Mobile Guide to European Ad Inventory and Providing Notice, Transparency and Choice]({{site.baseurl}}/prebid-mobile/privacy-regulation.html).

For specific implementation details, see the "GDPR Consent" section here:
-   [iOS - Targeting Parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
-   [Android - Targeting Parameters](/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
