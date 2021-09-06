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
    * AdUnit.ortb2imp.ext.data.adserver.name="gam"
    * AdUnit.ortb2imp.ext.data.adserver.adslot="/1111/home"
    * AdUnit.ortb2imp.ext.data.pbadslot="/1111/home-left"
* **Prebid Server Adapters** - will see the OpenRTB as:
    * imp[].ext.data.adserver.name
    * imp[].ext.data.adserver.adslot
    * imp[].ext.data.pbadslot

## Configuration

{: .alert.alert-info :}
Unlike many other modules, the GPT Pre-Auction Module is on by default if it's compiled
into the Prebid.js package.

Optional initialization parameters:

{: .table .table-bordered .table-striped }
| Param | Required? | Type | Description | Example |
| enabled | no | boolean | allows turning off of module. Default value is true | true |
| customGptSlotMatching | no | function | GPT slot matching function should match the customSlotMatching function sent to [setTargetingForGptAsync](/publisher-api-reference/setTargetingForGPTAsync.html) | |
| customPbAdSlot | no | function | Custom PB AdSlot function | |
| mcmEnabled | no | boolean | Removes extra network IDs when Multiple Customer Management is active. Default is false. | true |

For example:
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
	},
	mcmEnabled: true
    }
});
```

## How It Works

When this module is on, it uses the BEFORE_REQUEST_BIDS event to insert functionality that:

- loops through each adunit in the auction
- maps the adunit to the GPT slot using the same algorithm as setTargetingForGPTAsync including customGptSlotMatching

If GPT slot matching succeeds:

- it sets the Adunit ortb2imp.ext.data.adserver.name to 'gam'
- it copies the resulting GPT slot name to ortb2imp.ext.data.adserver.adslot

The customPbAdSlot function is called if it was specified, writing the results to ortb2imp.ext.data.pbadslot.
If there's no customPbAdSlot, a default algorithm is used to determine ortb2imp.ext.data.pbadslot:

- first use the AdUnit's ortb2imp.ext.data.pbadslot if defined
- else, see if the AdUnit.code corresponds to a div and if so, try to retrieve a data element from the div called data-adslotid.
- else if the GPT slot matching succeeded, use the GPT slot name
- else, just use the AdUnit.code, assuming that that's the ad unit slot

# Further Reading
- [Prebid Ad Slot](/features/pbAdSlot.html)
