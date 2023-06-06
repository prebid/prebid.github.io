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

Prebid Server is an open source project. This allows you to host your own implementation of Prebid Server, though it's not as easy as downloading Prebid.js, because it needs to be hosted. The source code is available for [Prebid Server Go](https://github.com/prebid/prebid-server) and [Prebid Server Java](https://github.com/prebid/prebid-server-java).

See the [Prebid Server documentation](/prebid-server/overview/prebid-server-overview.html) for more information on [setting up your own server host](/prebid-server/hosting/pbs-hosting.html).

### A note on Accounts  

Several pages and examples in the mobile documentation refer to entering your "Prebid Server Account ID".

In actuality, an `account ID` is just the name of the “top-level” stored request as described on the [Prebid Server Stored Request page](/prebid-server/features/pbs-storedreqs.html).

By convention, most Prebid Server host companies define the top level stored request ID as the account ID they assign to the publisher.
This is a convenient convention since publishers generally set the same timeout and price granularity across all apps.
But it may not be the case for your Prebid Server host company, so please check with them.
If you’re hosting your own Prebid Server, this value can be whatever value you wish, not necessarily an account ID.

## Configure Prebid Server

After you've registered with your chosen Prebid Server host, you need to create at least one Prebid Server bidder configuration in a [stored request](/prebid-server/features/pbs-storedreqs.html). Each stored request configuration contains a list of bidders and their parameters. The configuration will be in the form of a JSON structure, similar to this:

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

The preceding is an example "impression-level stored request" using AppNexus as the bidder. The parameters you need to set differ for each bidder. See [Bidder Parameters](/prebid-server/developers/add-new-bidder-go.html) for a full list of parameters for available Prebid Server bidders.

Each block of JSON like this is called a "stored request" and gets an ID called a "stored request ID". This ID is then programmed into an adslot using the iOS or Android SDKs. Doing it this way allows the publisher to change bidders and parameters without
having to change the app.

### Testing with stored configurations

If you want to verify the SDK integration with test placements, you can add some [Stored Responses](https://docs.prebid.org/troubleshooting/pbs-troubleshooting.html#stored-responses) to your Prebid Server:

1. Work with your Prebid Server provider to install the [Mobile Test Stored Requests](https://github.com/prebid/prebid-mobile-ios/tree/master/Example/PrebidDemo/stored-configs/stored-impressions) and [Mobile Test Stored Responses](https://github.com/prebid/prebid-mobile-ios/tree/master/Example/PrebidDemo/stored-configs/stored-responses). (Note: stored "impressions" are a special case of stored "requests" - your Prebid Server provider will know what to do.)
    1. Confirm that the bid prices in the stored responses reflects what you want to test. If you're using an ad server, you'll need line items set up that reflect the test bid CPMs and your price granularity setup.
    2. The Prebid Server **stored request IDs** could be the same as the filename in the repo, or could be different. If the IDs are different, your Prebid Server provider will let you know what IDs are available for testing.
2. Code the test mobile app setting the CONFIG_ID to the stored request ID of the relevant test, e.g. 'prebid-demo-banner-320-50'.
3. At runtime, here's what happens within Prebid Server:
    1. The stored request will pull in the stored response
    2. There will not be an actual auction
    3. The creative in the stored response will be sent to the SDK as the bid

## Ad Ops - Setting Up the Ad Server

Ad ops users configure the primary ad server with Prebid Mobile line items targeted to key/values.

-   [Set Up Line Items for Google Ad Manager](/adops/step-by-step.html)

## Developers - Using the SDK

To begin using Prebid Mobile follow the instructions for the respective platforms and integration approach:

-   [iOS Code Integration]({{site.github.url}}/prebid-mobile/pbm-api/ios/code-integration-ios.html)
-   [Android Code Integration]({{site.github.url}}/prebid-mobile/pbm-api/android/code-integration-android.html)


## Additional Information

The following resources are available for further information on working with Prebid Mobile:

### Ad Ops

-   [Price Granularity](/adops/price-granularity.html) Additional details to help you ensure your line items are set up to target bid prices at an appropriate level of granularity.


### Mobile Developers

#### Targeting Parameters

Learn about the parameters available in the Prebid SDK
- [iOS Targeting Parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html) Learn about the parameters available in the iOS Prebid Mobile SDK.
- [Android  Targeting Parameters](/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html) Learn about the parameters available in the Android Prebid Mobile SDK.

#### GDPR

Prebid Mobile provides APIs for app publishers in support of the [IAB Europe Transparency & Consent Framework](https://www.iab.com/topics/consumer-privacy/gdpr/).

For general information on these APIs see [Prebid Mobile Guide to Privacy Regulation]({{site.baseurl}}/prebid-mobile/prebid-mobile-privacy-regulation.html).


