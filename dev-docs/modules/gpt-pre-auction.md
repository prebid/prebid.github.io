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
| useDefaultPreAuction | no | boolean | (PBJS 6.5+) If true, use default behavior for determining GPID and PbAdSlot. Defaults to false. | true |
| customPreAuction | no | function | (PBJS 6.5+) Custom function for defining the GPID and PbAdSlot. | |
| customPbAdSlot | no | function | Custom PB AdSlot function. (Note, this function will be deprecated in the future.) | |
| mcmEnabled | no | boolean | Removes extra network IDs when Multiple Customer Management is active. Default is false. | true |

For example:

```javascript
pbjs.setConfig({
    gptPreAuction: {
    enabled: true, // enabled by default
    useDefaultPreAuction: false,
    customPreAuction: function(adUnit, adServerAdSlot) {
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

* loops through each adunit in the auction
* maps the PBJS adunit to the GPT slot using the same algorithm as setTargetingForGPTAsync including customGptSlotMatching

### Defining the AdServer name and adslot

If GPT slot matching succeeds:

* it sets the Adunit ortb2Imp.ext.data.adserver.name to 'gam'
* it copies the resulting GPT slot name to ortb2Imp.ext.data.adserver.adslot

### Defining PbAdSlot and GPID

Here's what the module does to define these values:

1. If AdUnit.ortb2Imp.ext.gpid already exists, use that for GPID.
1. If AdUnit.ortb2Imp.ext.data.pbadslot already exists, use that for PbAdSlot.
1. Otherwise, if a customPreAuction function is specified, run that. If the result isn't empty, place it in pbAdSlot and GPID.
1. Otherwise, if useDefaultPreAuction is true, run the default logic and place the return value in both pbAdSlot and GPID
    1. If ortb2Imp.ext.data.pbadslot is specified, use that.
    1. If ortb2Imp.ext.gpid is specified, use that.
    1. If GPT isn't in the page, give up.
    1. Query GPT slots with the adunit.code
    1. If there aren't any, give up.
    1. If there's just one, use that slot name as the GPID
    1. If there's more than on slot with the same name, append the div-id
1. Otherwise, if a customPbAdSlot function is specified and the result is not empty, place it in pbAdSlot and GPID.
1. Otherwise, if the AdUnit.code matched one or more GAM AdSlots, use that for both PbAdSlot and GPID
1. Otherwise use the AdUnit.code for PbAdSlot.

## Example customPbAdSlot function

{: .alert.alert-info :}
In PBJS 6.5 and later, we recommend using the useDefaultPreAuction flag or the customPreAuction function.

The following customPbAdSlot function will work for many publishers. Assumptions:

* AdUnits have been registered with [pbjs.addAdUnits](/dev-docs/publisher-api-reference/addAdUnits.html).
* AdUnit.code is either the GPT slot name or the div-id.
* The site has unique (non-random) div-ids.

If either of these isn't the case, you'll need to supply your own function.

```javascript
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
    }
});
```

# Further Reading

* [Prebid Ad Slot and GPID](/features/pbAdSlot.html)
