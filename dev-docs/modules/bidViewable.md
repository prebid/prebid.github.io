---
layout: page_v2
page_type: module
title: Module - Bid Viewable Event
description: Triggers BID_VIEWABLE event when a rendered PBJS-Bid is viewable according to [Active View criteria](https://support.google.com/admanager/answer/4524488)
module_code : bidViewable
display_name : Bid Viewable Event
enable_download : true
sidebarType : 1
---

# Bid Viewable Event
{:.no_toc}

* TOC
{:toc}

## Overview
- This module, when included, will trigger a BID_VIEWABLE event which can be consumed by Bidders and Analytics adapters
- GPT API is used to find when a bid is viewable, https://developers.google.com/publisher-tag/reference#googletag.events.impressionviewableevent . This event is fired when an impression becomes viewable, according to the Active View criteria.
Refer: https://support.google.com/admanager/answer/4524488
- The module does not work with adserver other than GAM with GPT integration
- Logic used to find a matching pbjs-bid for a GPT slot is ` (slot.getAdUnitPath() === bid.adUnitCode || slot.getSlotElementId() === bid.adUnitCode) ` this logic can be changed by using param ` customMatchFunction `
- When a rendered PBJS bid is viewable the module will trigger BID_VIEWABLE event, which can be consumed by bidders and analytics adapters
- For the viewable bid if ` bid.vurls [type array] ` param is and module config ` firePixels: true ` is set then the URLs mentioned in bid.vurls will be executed. Please note that GDPR and USP related parameters will be added to the given URLs, here we have assumed that URLs will always have `?` symbol included.
{: .alert.alert-warning :}
- The module works with Banner, Outsteam and Native creatives
- Doesn't seems to work with Instream Video, https://docs.prebid.org/dev-docs/examples/instream-banner-mix.html as GPT's impressionViewable event is not triggered for instream-video-creative

## Configuration

{: .table .table-bordered .table-striped }
| Field    | Scope   | Type   | Description                                                                           |
|----------+---------+--------+---------------------------------------------------------------------------------------|
| `bidViewability` | Optional | Object | Configuration object for instream tracking |
| `bidViewability.firePixels` | Optional | Boolean | when set to true, will fire the urls mentioned in `bid.vurls` which should be array of URLs. We have assumed that URLs will always have `?` symbol included. Default: `false` |
| `bidViewability.customMatchFunction` | Optional | function(bid, slot) | when passed this function will be used to `find` the matching winning bid for the GPT slot. Default value is ` (bid, slot) => (slot.getAdUnitPath() === bid.adUnitCode || slot.getSlotElementId() === bid.adUnitCode) ` |
As both params are optional, you do not need to set config if you do not want to set value for any param

## Example of setting module config
{% highlight js %}
	pbjs.setConfig({
        bidViewability: {
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