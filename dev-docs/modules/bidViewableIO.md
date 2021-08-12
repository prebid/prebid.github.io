---
layout: page_v2
page_type: module
title: Module - Bid Viewable with IntersectionObserver
description: Triggers BID_VIEWABLE event when a rendered PBJS-Bid is viewable according to an approximation of IAB viewability criteria
module_code : bidViewabilityIO
display_name : Bid Viewable Event - Ad Server Independent
enable_download : true
sidebarType : 1
---

# Bid Viewable Event with IntersectionObserver
{:.no_toc}

* TOC
{:toc}

## Overview

This optional module will trigger a BID_VIEWABLE event which can be consumed by Analytics adapters. In addition, the winning bidder can implement an `onBidViewable` method to capture this event.


Notes:
- The module works with any adserver, or with no ad server at all.
- The clients browsers IntersectionObserver API (v1) is used to find when a bid is viewable. This implementation assumes that the publisher and the bidder are acting in good faith, and does not attempt to detect any bad behavior from either party. We assume that the ad is rendered into the element it has been told to render into, and is not hidden or obfuscated at any time.
- This event is fired when an impression becomes viewable, according to IAB's viewability guidelines
- When a rendered PBJS bid is determined to be viewable this module will trigger a BID_VIEWABLE event, which can be consumed by the winning bidder and analytics adapters
- The module works with Banner creatives, with additional support to come.

## Known Issues

{: .alert.alert-warning :}
This feature is not intended to be a perfect measure of viewability. It is however inteneded to be a reasonable approximation of a bids viewability for creative types that are supported.

1. Only supports Banner creatives
2. Only works on browsers that support or on sites that have (polyfilled the IntersectionObserver API)[https://github.com/w3c/IntersectionObserver/tree/main/polyfill]
3. Results can only be trusted if both the publisher and winning bidder are assumed to be acting in good faith.

## Configuration

{: .table .table-bordered .table-striped }
| Field    | Scope   | Type   | Description                                                                           |
|----------+---------+--------+---------------------------------------------------------------------------------------|
| `bidViewabilityIO` | Required | Object | Configuration object for viewability tracking for supported media types |
| `bidViewabilityIO.enabled` | Required | Boolean | when set to true, the module will emit BID_VIEWABLE when applicable. Default: `false` |

## Example of setting module config
{% highlight js %}
	pbjs.setConfig({
        bidViewabilityIO: {
            enabled: true,
        }
    });
{% endhighlight %}

## Example of consuming BID_VIEWABLE event
{% highlight js %}
	pbjs.onEvent('bidViewable', function(bid){
		console.log('got bid details in bidViewable event', bid);
	});
{% endhighlight %}

## Related Reading

- [Building a PBJS analytics adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html)
- [Building a PBJS bidder adapter](/dev-docs/bidder-adaptor.html)
