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

- TOC
{:toc}

## Set Up Prebid Server

Before you begin using Prebid Mobile in your apps, you need to prepare your end-to-end system. The first step is to set up your Prebid Server host. Prebid Mobile works in conjunction with Prebid Server to request and receive bids. Here are the options:

- Register with a [Prebid.org member that hosts Prebid Server](https://prebid.org/product-suite/managed-services/). While you're waiting for your account, you can continue with the steps below.
- Set up your own Prebid Server host

### Implement Your Own Prebid Server Host

Prebid Server is an open source project. This allows you to host your own implementation of Prebid Server, though it's not as easy as downloading Prebid.js, because it needs to be hosted. The source code is available for [Prebid Server Go](https://github.com/prebid/prebid-server) and [Prebid Server Java](https://github.com/prebid/prebid-server-java).

See the [Prebid Server documentation](/prebid-server/overview/prebid-server-overview.html) for more information on [setting up your own server host](/prebid-server/hosting/pbs-hosting.html).

### Accounts and Account Settings

Several pages and examples in the mobile documentation refer to entering a "Prebid Server Account ID".

There are actually two important concepts:

- The Prebid Server "account id" is given by your Prebid Server provider. If you're an app developer running your own Prebid Server, you may not have an account ID at all.
- Each mobile app may have its own "account settings ID". This is used to look up data in Prebid Server like timeout, targeting, and price granularity. It's possible for the "account id" and the "auction settings id" to be the same thing, but this is not always the case.

Work with your Prebid Server team to determine which scenario to implement:

- keep "account ID" and "account settings ID" the same.
- establish separate "account ID" and "account settings ID"

See the "integration" pages for each platform for details on how to set up both scenarios.

## Configure Prebid Server

### Auction Setting IDs / Top-Level Stored Requests

Working with your Prebid Server host, you will need to create at least one "account settings" block. Prebid Server calls this a [top-level stored request](/prebid-server/features/pbs-storedreqs.html). Each top-level stored request contains parameters that are global to the entire auction, not just
one adunit. The configuration will be in the form of a JSON structure that will be merged into the OpenRTB. Something like this:

```json
{
	"cur": [ "EUR" ],
	"ext": {
		"prebid": {
			"cache": {
				"bids": {}
			},
			"targeting": {
				"pricegranularity": "dense",
				"includewinners": true,
				"includebidderkeys": true,
				"includeformat": true
			}
		}
	}
}
```

Your Prebid Server team should be able to help you decide which parameters are needed and how to get them into Prebid Server.

### Config IDs / Impression-Level Stored Requests

Again, working with your Prebid Server host, there are likely to be many adunit configurations. Prebid Mobile calls this thing a "Config ID", while Prebid Server calls it an [impression-level stored request](/prebid-server/features/pbs-storedreqs.html). Each stored request configuration contains a list of bidders and their parameters. The configuration will be in the form of a JSON structure that will be merged into the OpenRTB `imp` element. Something like this:

```json
{
  "ext": {
    "prebid": {
        "bidder": "bidderA",
        "params": {
            "placementId": 1111111111
        }
    }
  }
}
```

Each block of JSON like this is called a "stored request" and gets an ID called a "stored request ID". This ID is then linked to an adslot using the iOS or Android SDKs, which refer to it as a "Config ID". Doing it this way allows the publisher to change bidders and parameters without
having to change the app.

In general, the recommendation is to create different imp-level stored request for each adunit in your app so that you can manage the bidders and their inventory parameters separately.

### Testing with stored responses

If you want to verify the SDK integration with test placements, you can add some [Stored Responses](/troubleshooting/pbs-troubleshooting.html#stored-responses) to your Prebid Server:

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

- [Set Up Line Items for Google Ad Manager](/adops/step-by-step.html)
- [Price Granularity](/adops/price-granularity.html) Additional details to help you ensure your line items are set up to target bid prices at an appropriate level of granularity.

## Developers - Using the SDK

To begin using Prebid Mobile follow the instructions for the respective platforms and integration approach:

- [iOS Code Integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
- [Android Code Integration](/prebid-mobile/pbm-api/android/code-integration-android.html)

## Additional Information

The following resources are available for further information on working with Prebid Mobile:

## Futher Reading

- [How Prebid Server works with Prebid SDK](/prebid-server/use-cases/pbs-sdk.html)
- [Prebid Mobile FAQ](https://docs.prebid.org/faq/prebid-mobile-faq.html)
