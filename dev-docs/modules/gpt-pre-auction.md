---
layout: page_v2
page_type: module
title: Module - GPT Pre-Auction
description: If you run GAM, this module generates the 'global placement id' that's becoming required for successful auctions. It also offers a test mode for GPT's new request hook.
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
| requestHook.mode | no | string | Set to `'test'` to evaluate the [GPT Request Hook Integration](#gpt-request-hook-integration). Default is `'disabled'`. | `'test'` |

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
1. Otherwise, if a customPreAuction function is specified, run that. If the result isn't empty, place it in GPID. If the result is empty, no value is placed in GPID and the logic below is not executed.
1. If a customPreAuction is not specified, if useDefaultPreAuction is true, run the default logic and place the return value in GPID:
    1. If GPT isn't on the page, give up.
    1. Query GPT slots that match the ad unit's GPT ad unit path.
    1. If there aren't any, give up.
    1. If there's just one, use that slot name as the GPID.
    1. If there's more than one slot with the same name, append the div-id.

See the [Prebid.js implementation](https://github.com/prebid/Prebid.js/blob/87e112b1d12b51485a69027422ee18de2b834bfc/modules/gptPreAuction.ts#L142-L152), where `customPreAuction` and `useDefaultPreAuction` are handled as mutually exclusive branches.

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

## GPT Request Hook Integration

The module's test mode lets a page that already uses `disableInitialLoad()` and `bidsBackHandler` evaluate GPT's new [`registerRequestHook()`](https://developers.google.com/publisher-tag/reference#googletag.PubAdsService.registerRequestHook) API (currently experimental) without retagging. Enable it by setting `requestHook.mode` to `'test'`:

```javascript
pbjs.setConfig({
    gptPreAuction: {
        requestHook: {
            mode: 'test'
        }
    }
});
```

### How Test Mode Works

In test mode, the module:

* Registers a GPT request hook named `gpt-pre-auction-v<version>`, which GPT calls before each ad request.
* Intercepts `pbjs.requestBids()` calls from the page for ad units that match GPT slots. An intercepted call starts no auction. It resolves with empty bids and runs `bidsBackHandler` asynchronously with `({}, false, undefined)`, so existing page code proceeds to `googletag.pubads().refresh()`.
* Runs the auction inside the hook for the slots in the pending ad request, then calls `pbjs.setTargetingForGPTAsync()`. The hook maps slots to ad units with the standard GPT slot matching, including `customGptSlotMatching`. Lazy loading and GPT's automatic refreshes after bfcache restores or heavy ad intervention also get a fresh auction this way.
* Forwards request-scoped `adUnits`, `labels`, `ortb2`, `timeout`, and `ttlBuffer` from the most recent intercepted call for each ad unit to the hook auction.
* Unregisters the hook and stops intercepting `pbjs.requestBids()` when `requestHook.mode` is set back to `'disabled'` or `gptPreAuction.enabled` is set to `false`.

### Latency Trade-Off with Other Header Bidding Wrappers

{: .alert.alert-warning :}
If another header bidding wrapper on the page finishes its own auction before it calls `googletag.pubads().refresh()`, test mode runs the two auctions in sequence instead of in parallel.

In test mode, the Prebid auction starts only when GPT calls the request hook, which happens after the page calls `refresh()`. The other wrapper's auction has finished by then, so the ad request waits for both auctions in turn. To keep the auctions parallel, register the other wrapper as a GPT request hook as well. Otherwise, evaluate test mode on pages where Prebid.js is the only header bidding wrapper.

### Test Mode Caveats

* **Non-GPT ad units:** The module never intercepts instream-only calls, where every ad unit is instream video with no `banner` or `native` media type. Once GPT slots are defined, it also does not intercept calls whose ad units match no GPT slot, such as outstream or native ad units that Prebid.js renders. A call that mixes GPT and non-GPT ad units is intercepted as a whole, and the hook auctions only the ad units that match GPT slots. Request non-GPT ad units in a separate `pbjs.requestBids()` call.
* **Calls before GPT slots exist:** Until the page defines a GPT slot, the module cannot tell which ad units belong to GPT. It intercepts every call that is not instream-only and only auctions ad units that later match a GPT slot, so any non-GPT ad unit requested that early is never auctioned.
* **Callbacks that read bids:** Intercepted calls return empty bids. A `bidsBackHandler` that inspects bids before it calls `googletag.pubads().refresh()` therefore sees none.
* **Hook timeout:** GPT stops waiting for the hook after `requestHookTimeoutMs`. Keep that GPT setting at `"auto"` or slightly above the Prebid auction timeout so that bids arrive before the ad request.
* **Moving to production:** Test mode is for evaluation. For a permanent integration, replace the page's `disableInitialLoad()` and `bidsBackHandler` code with a hook that the page registers itself, as in the [GPT Request Hook Example](/dev-docs/examples/gpt-request-hook-example.html).

# Further Reading

* [GPID](/features/pbAdSlot.html#the-gpid)
* [GPT Request Hook Example](/dev-docs/examples/gpt-request-hook-example.html)
