---
layout: page_v2
page_type: module
title: Module - GPT Pre-Auction
description: Adds PB Ad Slot and matching GAM ad unit name to each ad unit's first-party data before bid requests are sent to the adapters
module_code : gptPreAuction
display_name : GPT Pre-Auction
enable_download : true
sidebarType : 1
---

# GPT Pre-Auction Module
{:.no_toc}

* TOC
{:toc}

## Overview

This module enables targeting and tracking at the ad server adunit level.

Enabled by default if compiled into your package, this module will add the [Prebid Ad Slot](/features/pbAdSlot.html) and matching GAM ad unit name to each ad unit's first-party data before bid requests are sent to the adapters.

* **Prebid.js Adapters** - will be able to utilize these values as:
    * AdUnit.fpd.context.adServer.name="gam"
    * AdUnit.fpd.context.adServer.adSlot="/1111/home"
    * AdUnit.fpd.context.pbAdSlot="/1111/home-left"
* **Prebid Server Adapters** - will see the OpenRTB as:
    * imp[].ext.context.data.adserver.name
    * imp[].ext.context.data.adserver.adslot
    * imp[].ext.context.data.pbadslot

## Configuration

{: .alert.alert-info :}
Unlike many other modules, the GPT Pre-Auction Module is on by default if it's compiled
into the Prebid.js package.

Optional initialization parameters:

- enabled (on by default)
- customGptSlotMatching function
- customPbAdSlot function

```
pbjs.setConfig({
    gptPreAuction: {
	enabled: true, // enabled by default
	customPbAdSlot: function(adUnitCode, adServerAdSlot) {
		...
		return "customPbAdSlot";
	},
	customGptSlotMatching: function(gptSlotObj) {
		...
		return true; // or false
	}
    }
});
```

## How It Works

When this module is on, it uses the BEFORE_REQUEST_BIDS event to insert functionality that:

- loops through each adunit in the auction
- maps the adunit to the GPT slot using the same algorithm as setTargetingForGPTAsync including customGptSlotMatching

If GPT slot matching succeeds:

- it sets fpd.context.adserver.name to 'gam'
- it copies the resulting GPT slot name to fpd.context.adserver.adSlot

The customPbAdSlot function is called if it was specified, writing the results to fpd.context.pbAdSlot.
If there's no customPbAdSlot, a default algorithm is used to determine fpd.context.pbAdSlot:

- first use the AdUnit's context.pbAdSlot if defined
- else, see if the AdUnit.code corresponds to a div and if so, try to retrieve a data element from the div called data-adslotid.
- else if the GPT slot matching succeeded, use the GPT slot name
- else, just use the AdUnit.code, assuming that that's the ad unit slot

# Further Reading
- [Prebid Ad Slot](/features/pbAdSlot.html)
