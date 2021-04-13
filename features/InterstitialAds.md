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

Interstitails ads are often placed at natural transition points of the user's experince, such as moving from one page to the next. These ads are generally center aligned overlaying user content. 

This document covers how to setup interstitial ad units.

{: .alert.alert-warning :}
Please check with each of your bidders to ensure they're reading the interstitial flag from the standard Prebid location.


## How It Works

The intended flow for publishers is the following:
- Publisher traffics interstitial line item with appropriate size(s) ([GAM example](https://support.google.com/admanager/answer/9840201?hl=en))
- Publisher defines ad server interstitial slot on the page ([GAM Example](https://developers.google.com/publisher-tag/samples/display-web-interstitial-ad))
- Publisher defines the appropriate interstitial ad sizes within appriate adUnit.mediaType and supplies the adUnit Interstitial flag within the [AdUnit.ortb2Imp](/dev-docs/adunit-reference.html#adUnit-interstitial-example) config
- Prebid requests bids for interstitial adUnits and invokes the ad server call from the requestBids callback

## Ad Sizes
Publishers are intended to set the desired size in the respective adUnit. 

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
        intl:1
    },
    ...
});
{% endhighlight %}



## How Bid Adapters Should Read Interstitial Flag

To access global data, a Prebid.js bid adapter needs only to retrive the interstitial flag from the adUnit like this:

{% highlight js %}
utils.deepAccess(bidRequest.ortb2Imp, 'instl')
{% endhighlight %}


The assumption is that bid adapters will copy the values to the appropriate protocol location for their endpoint.

## Related Topics

- The [AdUnit Reference](/dev-docs/adunit-reference.html)
