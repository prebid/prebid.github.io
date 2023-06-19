---
layout: page_v2
page_type: module
title: Module - Bid Viewability - GAM
description: Triggers a BID_VIEWABLE event when a rendered bid is viewable according to Active View criteria
module_code : bidViewability
display_name : Bid Viewability - GAM
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Bid Viewability - GAM
{:.no_toc}

* TOC
{:toc}

## Overview

This optional module will trigger a BID_VIEWABLE event which can be consumed by Analytics adapters. In addition, the winning bidder can implement an `onBidViewable` method to capture this event.

Notes:
- The module does not work with adservers other than GAM and only with GPT integration. See the [other Bid Viewable Event](/dev-docs/modules/bidViewableIO.html) module for an ad server independent version.
- The GPT API is used to find when a bid is viewable. See [GPT documentation](https://developers.google.com/publisher-tag/reference#googletag.events.impressionviewableevent) for more details.
- This event is fired when an impression becomes viewable, according to [Active View criteria](https://support.google.com/admanager/answer/4524488).
- When a rendered PBJS bid is viewable the module will trigger BID_VIEWABLE event, which can be consumed by the winning bidder and analytics adapters
- The module works with Banner, Outsteam and Native creatives

Instead of listening for events, bidders may supply a `bid.vurls` array and this module may fire those pixels when the viewability signal is received. Publishers can control this with module config ` firePixels: true `. Please note that GDPR and USP related parameters will be added to the given URLs.

{: .alert.alert-warning :}
This feature doesn't work with [Instream Video](/dev-docs/examples/instream-banner-mix.html), as GPT's impressionViewable event is not triggered for instream-video-creative

The default logic used to find a matching Prebid.js bid for a GPT slot is
```
(bid, slot) => (slot.getAdUnitPath() === bid.adUnitCode ||
		slot.getSlotElementId() === bid.adUnitCode)
```

## Configuration

{: .table .table-bordered .table-striped }
| Field    | Scope   | Type   | Description                            |
|----------+---------+--------+-----------------------------------------|
| `bidViewability` | Required | Object | Configuration object |
| `bidViewability.enabled` | Required | Boolean | when set to true, the module will emit BID_VIEWABLE when applicable. Default: `false` |
| `bidViewability.firePixels` | Optional | Boolean | when set to true, will fire the urls mentioned in `bid.vurls` which should be array of URLs. Default: `false` |
| `bidViewability.customMatchFunction` | Optional | function(bid, slot) | this function will be used to find the matching winning bid for the GPT slot. See above for the default. |

## Example of setting module config
```javascript
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
```

## Example of consuming BID_VIEWABLE event
```javascript
	pbjs.onEvent('bidViewable', function(bid){
		console.log('got bid details in bidViewable event', bid);
	});
```

## Related Reading

- [Building a PBJS analytics adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html)
- [Building a PBJS bidder adapter](/dev-docs/bidder-adaptor.html)
