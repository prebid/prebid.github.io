---
layout: page_v2
page_type: module
title: Module - GPT Pre-Auction
description: Adds PB Ad Slot and matching GAM ad unit name to each ad unit's first-party data before bid requests are sent to the adapters
module_code : gptAPreAuction
display_name : GPT Pre-Auction
enable_download : false
sidebarType : 1
---

# GPT Pre-Auction Module
{:.no_toc}

* TOC
{:toc}

## Overview

When enabled, this module will add PB Ad Slot and matching GAM ad unit name to each ad unit's first-party data before bid requests are sent to the adapters.

* **Prebid Server Adapter** - pass `fpd.context.adserver.name` in the OpenRTB as `imp[].ext.context.data.adserver.name`, and pass `fpd.context.adserver.adSlot` in the OpenRTB as `imp[].ext.context.data.adserver.adslot`

## How It Works

Accepts optional initialization parameters:

- ability to turn off module (on by default)
- customGptSlotMatching function
- customPbAdSlot function

If the module is on, use the BEFORE_REQUEST_BIDS hook to define a function that:

- loops through each adunit in the auction
- maps the adunit to the GPT slot using the same algorithm as setTargetingForGPTAsync including customGptSlotMatching

If GPT slot matching succeeded:

- set fpd.context.adserver.name to 'gam'
- copy the resulting GPT slot name to fpd.context.adserver.adSlot

If customPbAdSlot function was specified, invoke it, writing the results to fpd.context.pbAdSlot. If not, use a default algorithm to determine fpd.context.pbAdSlot:

- first use the AdUnit's context.pbAdSlot if defined
- else, see if the AdUnit.code corresponds to a div and if so, try to retrieve a data element from the div called data-adslotid.
- else if the GPT slot matching succeeded, use the GPT slot name
- else, just use the AdUnit.code, assuming that that's the ad unit slot

customGptSlotMatchingFunction should be function(adUnitCode). For targeting, each slot is being matched to an ad unit. Since the input from the hook is the list of ad units, this module will work the other way: loop over the ad units and try to match each to a slot. The function should return a filter function for slot.
