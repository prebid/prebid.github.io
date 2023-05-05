---
layout: page_v2
title: Prebid.js Interstitial Ads
description: Interstitial Ads - Prebid.js
sidebarType: 1
---

# Interstitial Ads - Prebid.js
{: .no_toc}

* TOC
{:toc}

Interstitial ads are often placed at natural transition points of the user's experience, such as moving from one page to the next. These ads are generally center-aligned overlaying user content. 

This document covers how to setup interstitial ad units.

{: .alert.alert-warning :}
Please check with each of this AdUnit's bidders to ensure they're reading the interstitial flag from the standard Prebid location.
If the bidder doesn't specifically support interstitials, results may be unexpected.


## How It Works

The  flow for publishers is the following:
- Publisher traffics an interstitial line item with appropriate size(s) ([GAM example](https://support.google.com/admanager/answer/9840201?hl=en))
- Publisher defines ad server interstitial slot on the page ([GAM Example](https://developers.google.com/publisher-tag/samples/display-web-interstitial-ad))
- Publisher creates a PBJS AdUnit and defines the appropriate interstitial ad sizes, adUnit.mediaType, and a special interstitial flag
- Publisher adds bidders and parameters that support interstitials to the PBJS AdUnit(s)
- Prebid requests bids for interstitial adUnits and invokes the ad server call from the requestBids callback

## Ad Sizes
Publishers must set the desired size in the respective adUnit. 

The below sizes are specials sizes to indicate the ad will be full screen for mobile or tablet devices:
- 320x480: Fullscreen mobile phone portrait ad
- 480x320: Fullscreen mobile phone landscape ad 
- 768x1024: Fullscreen tablet portrait ad
- 1024x768: Fullscreen tablet landscape ad

## In-Page Example

The Prebid Interstitial flag reflects the OpenRTB standard, specifying it at the imp level.

### Supplying Interstitial Flag

If an attribute is specific to an AdUnit, it can be passed this way:

{% highlight js %}
pbjs.addAdUnits({
    code: "test-div",
    mediaTypes: {
        banner: {
            sizes: [[300,250]]
        }
    },
    ortb2Imp: {
        instl:1
    },
    bids: [
      ... bidders that support interstitials ...
    ]
});
{% endhighlight %}



## How Bid Adapters Should Read Interstitial Flag

To access global data, a Prebid.js bid adapter needs only to retrieve the interstitial flag from the adUnit like this:

{% highlight js %}
utils.deepAccess(bidRequest.ortb2Imp, 'instl')
{% endhighlight %}


The assumption is that bid adapters will copy the values to the appropriate protocol location for their endpoint.

## Billing Deferral

Optimizing when billing occurs for an interstitial ad can sometimes be tricky.  The following built-in Prebid.js functionality can help assist with this:
- Bid adapters can provide a method called `onBidBillable(bid)` which will be invoked by Prebid.js when it deems a bid to be billable (Note: A bid adapter must have the onBidBillable method configured for this to work).
- When a bid wins, it is by default also billable. That is, by default, Prebid.js will invoke the bid adapter methods onBidWon and onBidBillable one after the other.
- A publisher can flag individual adUnits as being separately billable with the following configuration: `pbjs.addAdUnits({deferBilling: true, ...})`
- Winning bids for adUnits with deferBilling set to true will trigger a bid adapters onBidWon method but not their onBidBillable method.
- Finally, when appropriate (e.g. an interstitial is displayed), the publisher may call `pbjs.triggerBilling({adId})` with the winning bid to be billed, which would trigger a bid adapters onBidBillable method.

## Related Topics

- The [AdUnit Reference](/dev-docs/adunit-reference.html)
