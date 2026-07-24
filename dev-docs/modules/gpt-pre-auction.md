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

This module is enabled by default if it's compiled into your PBJS package. It will add the [GPID](/features/pbAdSlot.html#the-gpid) along with the matching GAM ad unit name to each ad unit's first-party data before bid requests are sent to the adapters.

* **Prebid.js Adapters** - will be able to utilize these values as:
  * AdUnit.ortb2Imp.ext.gpid="/1111/home-left"
  * AdUnit.ortb2Imp.ext.data.adserver.name="gam"
  * AdUnit.ortb2Imp.ext.data.adserver.adslot="/1111/home"
* **Prebid Server Adapters** - will see the OpenRTB as:
  * imp[].ext.gpid
  * imp[].ext.data.adserver.name
  * imp[].ext.data.adserver.adslot

## Configuration

{: .alert.alert-info :}
Unlike many other modules, the GPT Pre-Auction Module is on by default if it's compiled
into the Prebid.js package.

Optional initialization parameters:

{: .table .table-bordered .table-striped }
| Param | Required? | Type | Description | Example |
| enabled | no | boolean | allows turning off of module. Default value is true | true |
| useDefaultPreAuction | no | boolean | If true, use default behavior for determining GPID. Defaults to true. | true |
| customPreAuction | no | function | Custom function for defining the GPID. | |
| mcmEnabled | no | boolean | Removes extra network IDs when Multiple Customer Management is active. Default is false. | true |

For example:

```javascript
pbjs.setConfig({
    gptPreAuction: {
    enabled: true, // enabled by default
    useDefaultPreAuction: true,
    customPreAuction: function(adUnit, adServerAdSlot, gptAdUnitPath) {
        ...
        return "customGpid";
    },
    mcmEnabled: true
    }
});
```

## How It Works

When this module is turned on, it uses the BEFORE_REQUEST_BIDS event to insert functionality that:

* loops through each adunit in the auction
* maps the PBJS adunit to the GPT slot using the same algorithm as setTargetingForGPTAsync including the customGptSlotMatching configuration

### Defining the AdServer name and adslot

If GPT slot matching succeeds:

* it sets the Adunit ortb2Imp.ext.data.adserver.name to 'gam'
* it copies the resulting GPT slot name to ortb2Imp.ext.data.adserver.adslot

### Defining GPID

Here's what the module does to define GPID:

1. If AdUnit.ortb2Imp.ext.gpid already exists, use that for GPID.
1. Otherwise, if a customPreAuction function is specified, run that. If the result isn't empty, place it in GPID.
1. Otherwise, if useDefaultPreAuction is true, run the default logic and place the return value in GPID:
    1. If GPT isn't on the page, give up.
    1. Query GPT slots that match the ad unit's GPT ad unit path.
    1. If there aren't any, give up.
    1. If there's just one, use that slot name as the GPID.
    1. If there's more than one slot with the same name, append the div-id.

## Example customPreAuction function

The following customPreAuction function will work for many publishers. Assumptions:

* AdUnits have been registered with [pbjs.addAdUnits](/dev-docs/publisher-api-reference/addAdUnits.html).
* AdUnit.code is either the GPT slot name or the div-id.
* The site has unique (non-random) div-ids.

If either of these isn't the case, you'll need to supply your own function.

```javascript
pbjs.setConfig({
    gptPreAuction: {
        enabled: true, // enabled by default
        customPreAuction: function(adUnit, adServerAdSlot, gptAdUnitPath) {
            // confirm that GPT is set up
            if (!(googletag && googletag.apiReady)) {
                return;
            }

            // find all GPT slots with this name
            var gptSlots = googletag.pubads().getSlots().filter(function(gpt) {
                return gpt.getAdUnitPath() == gptAdUnitPath;
            });

            if (gptSlots.length==0) {
                return;  // should never happen
            }

            if (gptSlots.length==1) {
                return adServerAdSlot;
            }

            // else the adunit code must be div id. append it.
            return adServerAdSlot+"#"+adUnit.code;
        }
    }
});
```

# Further Reading

* [GPID](/features/pbAdSlot.html#the-gpid)
