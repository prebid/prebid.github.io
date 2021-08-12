---
layout: page_v2
page_type: module
title: Module - Bid Viewable Event
description: Triggers BID_VIEWABLE event when a rendered PBJS-Bid is viewable according to [Active View criteria](https://support.google.com/admanager/answer/4524488)
module_code : bidViewability
display_name : Bid Viewable Event - GAM
enable_download : true
sidebarType : 1
---

# Bid Viewable Event
{:.no_toc}

* TOC
{:toc}

## Overview

This optional module will trigger a BID_VIEWABLE event which can be consumed by Analytics adapters. In addition, the winning bidder can implement an `onBidViewable` method to capture this event.


Notes:
- The module does not work with adservers other than GAM and only with GPT integration.
- The GPT API is used to find when a bid is viewable, See https://developers.google.com/publisher-tag/reference#googletag.events.impressionviewableevent .
- This event is fired when an impression becomes viewable, according to [Active View criteria](https://support.google.com/admanager/answer/4524488).
- Logic used to find a matching Prebid.js bid for a GPT slot is ` (slot.getAdUnitPath() === bid.adUnitCode || slot.getSlotElementId() === bid.adUnitCode) ` this logic can be changed by using param ` customMatchFunction `
- When a rendered PBJS bid is viewable the module will trigger BID_VIEWABLE event, which can be consumed by the winning bidder and analytics adapters
- The module works with Banner, Outsteam and Native creatives

Instead of listening for events, bidders may supply a ` bid.vurls ` array and this module may fire those pixels when the viewability signal is received. Publishers can control this with module config ` firePixels: true `. Please note that GDPR and USP related parameters will be added to the given URLs.

{: .alert.alert-warning :}
This feature doesn't seem to work with [Instream Video](/dev-docs/examples/instream-banner-mix.html), as GPT's impressionViewable event is not triggered for instream-video-creative

## Configuration

{: .table .table-bordered .table-striped }
| Field    | Scope   | Type   | Description                                                                           |
|----------+---------+--------+---------------------------------------------------------------------------------------|
| `bidViewability` | Required | Object | Configuration object for instream tracking |
| `bidViewability.enabled` | Required | Boolean | when set to true, the module will emit BID_VIEWABLE when applicable. Default: `false` |
| `bidViewability.firePixels` | Optional | Boolean | when set to true, will fire the urls mentioned in `bid.vurls` which should be array of URLs. Default: `false` |
| `bidViewability.customMatchFunction` | Optional | function(bid, slot) | when passed this function will be used to `find` the matching winning bid for the GPT slot. Default value is ` (bid, slot) => (slot.getAdUnitPath() === bid.adUnitCode || slot.getSlotElementId() === bid.adUnitCode) ` |

## Example of setting module config
{% highlight js %}
	pbjs.setConfig({
        bidViewability: {
            enabled: true,
            firePixels: true,
            customMatchFunction: function(bid, slot){
                console.log('using custom match function....');
                return bid.adUnitCode === slot.getAdUnitPath();
            }
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
