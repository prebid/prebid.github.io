---
layout: page_v2
page_type: module
title: Module - GPT Pre-Auction
description: If you run GAM, this module generates the 'global placement id' that's becoming required for successful auctions.
module_code : gptPreAuction
display_name : GPT Pre-Auction
enable_download : true
recommended: true
vendor_specific: true
sidebarType : 1
---

# GPT Pre-Auction Module
{:.no_toc}

* TOC
{:toc}

## Overview

This module enables bidder targeting and tracking at the ad server ad slot level.

This module is enabled by default if it's compiled into your PBJS package. It will add the [Prebid Ad Slot and GPID](/features/pbAdSlot.html) along with the matching GAM ad unit name to each ad unit's first-party data before bid requests are sent to the adapters.

* **Prebid.js Adapters** - will be able to utilize these values as:
    * AdUnit.ortb2Imp.ext.gpid="/1111/home-left"
    * AdUnit.ortb2Imp.ext.data.adserver.name="gam"
    * AdUnit.ortb2Imp.ext.data.adserver.adslot="/1111/home"
    * AdUnit.ortb2Imp.ext.data.pbadslot="/1111/home-left"
* **Prebid Server Adapters** - will see the OpenRTB as:
    * imp[].ext.gpid
    * imp[].ext.data.adserver.name
    * imp[].ext.data.adserver.adslot
    * imp[].ext.data.pbadslot

{: .alert.alert-info :}
The Prebid Ad Slot didn't get broad adoption, so it's likely that
someday we'll deprecate it in favor of the more standard GPID.

## Configuration

{: .alert.alert-info :}
Unlike many other modules, the GPT Pre-Auction Module is on by default if it's compiled
into the Prebid.js package.

Optional initialization parameters:

{: .table .table-bordered .table-striped }
| Param | Required? | Type | Description | Example |
| enabled | no | boolean | allows turning off of module. Default value is true | true |
| customGptSlotMatching | no | function | GPT slot matching function should match the customSlotMatching function sent to [setTargetingForGptAsync](/dev-docs/publisher-api-reference/setTargetingForGPTAsync.html) | |
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

When this module is turned on, it uses the BEFORE_REQUEST_BIDS event to insert functionality that:

- loops through each adunit in the auction
- maps the PBJS adunit to the GPT slot using the same algorithm as setTargetingForGPTAsync including customGptSlotMatching

### Defining the AdServer name and adslot

If GPT slot matching succeeds:

- it sets the Adunit ortb2Imp.ext.data.adserver.name to 'gam'
- it copies the resulting GPT slot name to ortb2Imp.ext.data.adserver.adslot

### Defining Prebid Ad Slot

The customPbAdSlot function is called if it was specified, writing the results to ortb2Imp.ext.data.pbadslot.

If there's no customPbAdSlot function, a default algorithm is used to determine ortb2Imp.ext.data.pbadslot:

- first use the AdUnit's ortb2Imp.ext.data.pbadslot if defined
- else, see if the AdUnit.code corresponds to a div-id and if so, try to retrieve a data element from the div called data-adslotid.
- else if the GPT slot matching succeeded, use the GPT slot name
- else, just use the AdUnit.code

### Defining GPID

Here's what the module does to define GPID:

1. If AdUnit.ortb2Imp.ext.gpid already exists, don't do anything. Assume the publisher or another module has provided the value.
2. Otherwise, if a customPbAdSlot function was defined by the publisher and the result is not empty, then copy that value to AdUnit.ortb2Imp.ext.gpid.
3. Otherwise, if a value was found for GAM AdSlot, copy that to AdUnit.ortb2Imp.ext.gpid

## Example customPbAdSlot function

The following customPbAdSlot function will work for many publishers. Assumptions:
- AdUnits have been registered with [pbjs.addAdUnits](/dev-docs/publisher-api-reference/addAdUnits.html).
- AdUnit.code is either the GPT slot name or the div-id.
- The site has unique (non-random) div-ids.

If either of these isn't the case, you'll need to supply your own function.

```
// Use adunit.ortb2Imp.ext.data.pbadslot if it exists.
// compare adunit.code to find a single matching slot in GPT
// if there is a single slot match, just use that slot name
// finally, there must be multiple slots that match. Define pbadslot as slot#div

pbjs.setConfig({
    gptPreAuction: {
	enabled: true, // enabled by default
	customPbAdSlot: function(adUnitCode, adServerAdSlot) {
		// get adunit object
		au=pbjs.adUnits.filter(au => au.code==adUnitCode);
		if (au.length==0) {
		    return;
		}

		// use pbadslot if supplied
		if (au[0].ort2bImp && au[0].ort2bImp.ext && au[0].ort2bImp.ext.data && au[0].ort2bImp.ext.data.pbadslot) {
		    return au[0].ort2bImp.ext.data.pbadslot;
		}

		// confirm that GPT is set up
		if (!(googletag && googletag.apiReady)) {
		    return;
		}
		// find all GPT slots with this name
		var gptSlots = googletag.pubads().getSlots().filter(function(gpt) {
		    return gpt.getAdUnitPath() == adServerAdSlot;
		});
		if (gptSlots.length==0) {
		    return;  // should never happen
		}
		if (gptSlots.length==1) {
		    return adServerAdSlot;
		}
		// else the adunit code must be div id. append it.
		return adServerAdSlot+"#"+adUnitCode;
	}
  });
};
```

# Further Reading
- [Prebid Ad Slot and GPID](/features/pbAdSlot.html)
