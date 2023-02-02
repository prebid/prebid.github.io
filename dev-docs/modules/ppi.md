---
layout: page_v2
page_type: module
title: Module - Prebid Page Integration
description: Advanced page integration approaches
module_code: ppi
display_name: Prebid Page Integration
enable_download: true
sidebarType: 1
---

# Prebid Page Integration (PPI)
{: .no_toc }

* TOC
{: toc }

## Overview

Prebid Page Integration (PPI) provides a framework for advanced integrations of Prebid.js into a publisher website. PPI is an alternate approach for placing Prebid technology on the publisher’s web page. Here are some use cases:

- **Simplified page integration** - PPI can manage GPT slot definition or it can scan existing GPT slots and figure out which Prebid AdUnits to create.
- **Manage use of the bid cache** - Pages can be designed to run the Prebid auction up front and then quickly load bids from cache when ad slots are ready.
- **Serving ads without an adserver** - PPI comes with a built-in ability to display the highest bid.

Of course, pages can still be built with the original Prebid.js javascript functions. This module just provides additional functions built to support these additional scenarios. 

Notes:
- using PPI means you should not use the PBJS 'Express' module, as PPI covers this functionality. See the [AUPAutoSlots option](/dev-docs/modules/ppi.html#aupautoslots-sub-module).
- All other modules and analytics adapters may be used in conjunction with PPI, as page integration is independent of other functionality.
- Yes, PPI can be used to support all formats: banner, video, outstream-video, and native.
- No, there aren't any changes to the line items used by Prebid when you integrate via PPI.

## Definitions

{: .table .table-bordered .table-striped }
| Term    | Definition             |
|---------+------------------------|
|Ad Server Ad Slot (aka Ad Slot)| An ad-server-specific implementation concept that relates a physical location in the HTML page (e.g. div) to ad serving parameters (e.g. ad unit inventory path and sizeConfig)|
|Ad Server Ad Unit (aka Ad Unit)| Configuration of the ad inventory within the ad server. In GAM, the ad unit is sometimes referred to as an "inventory unit." The same Ad Unit may serve across many Ad Slots|
|Ad Server Key Values | Key Values are signals sent to an ad server to help in the selection of relevant line items for a particular ad slot / ad unit. See [Prebid.js and Ad Server Key Values](/features/adServerKvps.html) |
|Prebid Ad Unit (PBAU)| In Prebid.JS the “ad unit” is similar to the Ad Server Ad Unit. It can be applied across many Ad Slots in a page. The difference is that a Prebid Ad Unit contains header bidding parameters such as a list of specific demand sources (bidders). |
| Prebid Ad Unit Pattern (AUP)| A Prebid-specific macro used to dynamically create Prebid Ad Units. It uses a logical combination of Slot Patterns, Div Patterns, and other attributes to dynamically create a PBAU for each Ad Slot in the auction.|
| Slot Pattern | A regular expression search path used to associate an Ad Slot with an Ad Unit Pattern |
| Div Pattern | A regular expression search path used to associate an Ad Slot parent DIV identifier with an Ad Unit Pattern|
| Auction| In the context of this document, Auction refers to the process of collecting bids for one or more Prebid Ad Units.|
| Lazy Loading| A header bidding library has determined there is an existing Ad Slot on the page which has been mapped to a PBAU but we do not wish to hold an auction for that AdUnit at this time.|
| Eager Loading | The concept of holding an auction for a Prebid Ad Unit prior to it being assigned to a specific Ad Slot.|
| PPI Transaction Object | Instructions for how PPI should handle the auction for each ad slot.|

### AdUnits and Ad Slots

For Display ads, the following diagram represents the relationship between Div, Ad Slot, Ad Server Ad Unit, and Prebid Ad Unit.

![PPI AdUnits](/assets/images/ppi/ppi-adunits.png){:class="pb-lg-img"}

The Ad Server AdUnit (e.g. "/1111/homepage") is displayed within an HTML div
in which the Ad Server Ad Slot implemention runs. (e.g. googletag.defineSlot).
The Prebid AdUnit may be related to either the div or the slot, and, when using
PPI, is generated from an AdUnit Pattern.

## High Level View of PPI

PPI is basically a more configurable version of [pbjs.requestBids()](/dev-docs/publisher-api-reference/requestBids.html). This version of the function allows for flexible definition of the header bidding auction. It models the auction flow in 3 steps:

1. inventory: create Prebid.js AdUnits from a menu of possible choices
1. source: define whether the bids should come from an auction or the bid cache
1. destination: determine where the resulting bids should be sent

Modeling the auction this way allows for different formulations of how a page should integrate with header bidding. Here's a diagram showing the basic flow.

![PPI Basic Flow](/assets/images/ppi/ppi-highlevel.png){:class="pb-lg-img"}

There are a couple of important new data structures introduced in PPI:

- **Transaction Object** - a set of instructions for how PPI should handle the auction for each ad slot.
- **AdUnit Pattern** - think of this like a proto-AdUnit that defines how the final Prebid.js AdUnit should look

We'll go into more detail about various scenarios, but let's start with a simple example.

## Quick Start

Here's how a basic scenario looks, with annotation about what it does.

{% highlight js %}
transactionObjects = [                          // instructions for PPI
    {
	hbInventory: {
	    type: 'AUPDivID',                   // use divId to match an AdUnitPattern
	    values: { name: 'test-1' }
	},
	hbSource: {
	    type: 'auction',                    // run a new auction
	},
	hbDestination: {
	    type: 'page',                       // directly render the winning results
	    values: { div: 'test-1' }
	}
    }
];
pbjs.ppi.addAdUnitPatterns([{                   // basically just a PBJS AdUnit in this example
    divPattern: "test-1",                       // used to link to a Transaction Object 
    mediaTypes: {
	banner: {
	    sizes: [[300, 250]]
	}
    },
    bids: [
	{
	    bidder: 'bidderA',
	    params: {
		placement: 12345
	    }
	}
    ],
}]);

// the PPI requestBids function parses TransactionObjects, which are kind of
// like a macro language for defining auction behavior. It will use the
// defined AdUnit Patterns to create PBJS AdUnits.
pbjs.ppi.requestBids(transactionObjects);
{% endhighlight %}

For those who prefer to see examples rather than reading a crazy-long document, here are some to get you started:
- [PPI Multi-Unit Example](/examples/ppi/ppi-multi.html)
- [PPI Infinite Scroll Example](/examples/ppi/ppi-infinitescroll.html)
- [PPI Callback Example](/examples/ppi/ppi-callback.html)
- [PPI Custom Mapping Example](/examples/ppi/ppi-custommapping.html)
- [PPI No Adserver Example](/examples/ppi/ppi-noadserver.html)

### Quick Start Outline

The high-level process of integrating Prebid.js into your pages is really the same as for the original way. PPI just provides a more powerful toolset for handling advanced scenarios.

1. Create your test site with the PPI calls outlined here, or with a mix of PPI and the [original Prebid.js integration method.](/dev-docs/getting-started.html
2. PPI is intended to use the same line items as the normal setup, but if you haven't done so already, create your line items as described in the [AdOps guide](/adops/before-you-start.html)
3. Test
4. Release
5. Keep up with Prebid.js by updating quarterly!

## PPI Transactions

Here's a diagram that goes into more detail about the 3 stages of the PPI Transaction workflow.

![PPI Transaction Stages](/assets/images/ppi/ppi-transaction-stages.png){:class="pb-lg-img"}

1. The job of the **hbInventory** stage is to create the Prebid.js AdUnits.
1. The **hbSource** stage retrieves the bids, whether from a new auction or from the limited bid cache.
1. Finally, the **hbDestination** stage forwards bids to the next step, which might be an ad server, a custom function, direct rendering, or the bid cache.

### The PPI Transaction Object Array

A 'transaction object' is a JSON structure which defines how each stage of PPI processing behaves.  

Here's a summary of the values that can be part of a transaction object. See the sub-module sections below for clarity about which options are available in each stage.

{: .table .table-bordered .table-striped }
| Parameter  | Scope     | Description | Type |
|---------+----+-------+---------|
| hbInventory.type | required | Defines the inventory sub-module to use. Values: AUPSlotPath, AUPDivID, AUPSlotObject, AUPAutoSlots | string |
| hbInventory.values.name | required when type=AUPSlotPath or AUPDivID | Defines the string to be matched against the AUP list | string |
| hbInventory.values.slot | required when type=AUPSlotObject | defines the GPT slot object to be matched against the AUP list | slot object |
| hbInventory.sizes | optional | Constrains the sizes used in the final PBJS AdUnit. e.g. [[300,250],[300,600]] | array of integer arrays |
| hbSource.type | required | Defines the source sub-module to use. Values auction, cache | string |
| hbDestination.type | required | Defines the destination sub-module to use. Values: gpt, page, cache and callback | string |
| hbDestination.values.div | required when type=gpt or page | Defines where the results should be rendered. | string |
| hbDestination.values.callback | required when type = callback | Defines a function where the results should be sent. | function |

Transactions in the array can be of mixed types. For example, these three objects all have different combinations of inventory, source, and destination sub-modules:


{% highlight js %}
[{
  hbInventory: { type: "AUPSlotPath", ... },
  hbSource: { type: "auction", ... },
  hbDestination: {type: "cache", ...}
},{
  hbInventory: { type: "AUPSlotObject", ... },
  hbSource: { type: "cache", ... },
  hbDestination: {type: "callback", ...}
},{
  hbInventory: { type: "AUPDivID", ... },
  hbSource: { type: "auction", ... },
  hbDestination: {type: "page", ...}
}]
{% endhighlight %}

PPI first sorts transaction objects into groups based on the types,
then runs each group in the order defined in the transaction object.

The 'type' instructs PPI which sub-module to load and what parameters to send to the sub-modules. 
As an example, most publishers send Prebid auction results into Google Ad Manager. Instead of having to manually implement the transaction flow between Prebid.js and Google Ad Manager using javascript, publishers could choose to leverage the PPI ‘gpt’ hbDestination module in their workflow.  

The system is built with modularity in mind. It's expected that the Prebid community will expand the system with additional inventory and destination modules in the future. 

### hbInventory Processing Stage

The hbInventory stage is responsible for linking ad slots in the page to the set of AUPs supplied. 

In the classic Prebid.js workflow, the page needs to define an AdUnit as described in the [AdUnit Reference](/dev-docs/adunit-reference.html). The
AdUnit.code is the key that links the page ad slot to the PBJS AdUnit.
In PPI, however, there are several ways for the page to define which bidders and parameters should be used for a given ad slot.

Currently all hbInventory sub-modules use the concept of AdUnit Pattern (AUP) to generalize how PBJS AdUnits are created.

#### AdUnit Pattern Overview

PPI introduces a new structure called the AdUnit Pattern (AUP), which generalizes the PBJS AdUnit model in these ways:

1. An AdUnit Pattern can be defined with a regular expression syntax that matches multiple ad slot names or div IDs.
1. AdUnit Patterns can optionally abstract the 'mediaTypes' block out of the AdUnit. This can save space when there are many PBJS AdUnits on the page that share the same mediaTypes block.

You can think of AUPs as 'proto-AdUnits' - PPI uses them as templates to create classic PBJS AdUnits. It's possible to ignore the optional features and set up AUPs with the same information as you would use to create a regular PBJS AdUnit. 

Here's an AdUnitPattern that maps almost directly to the equivalent PBJS AdUnit. See below for more advanced features.

{% highlight js %}
pbjs.ppi.addAdUnitPatterns([{
    divPattern: "test-1",              // use divPattern or slotPattern instead of 'code'
                                       // the pattern will be linked to a transaction object
    mediaTypes: {
	banner: {
	    sizes: [[300, 250]]
	}
    },
    bids: [
	{
	    bidder: 'bidderA',
	    params: {
		placementId: 12345
	    }
	}
    ],
}]);
{% endhighlight %}

Regarding the 'pattern' part of AdUnit Pattern:

{: .alert.alert-success :}
The main use case for wildcards in the AUP divPattern and slotPattern fields is for when a single Prebid.js file is used across more than one publisher web page. This is a common scenario for managed Prebid.js services. For example, if Page1 has an ad slot named "/homepage/medrect" and Page2 has an ad slot named "/page2/medrect", but they have the same bidders and parameters, you could set up a single AUP targeting slotPattern ".*/medrect" which would match in both page environments.

#### hbInventory Sub-Module Overview

At a high level, here's how each of the hbInventory sub-modules works to choose an AdUnit Pattern:

- **AUPSlotPath** - this module scans down the AdUnit Patterns looking for a match between hbInventory.values.name and the AUP.**slot**Pattern. 
- **AUPDivID** - similarly, this module scans the AdUnit Patterns looking for a match between hbInventory.values.name and the AUP.**div**Pattern. 
- **AUPSlotObject** - gets the div and slot name from the GPT slot object, then scans the AdUnit Patterns looking for a match between the div and divPattern and/or the slotname and the slotPattern. If the AUP specifies both divPattern and slotPattern, both must match.
- **AUPAutoSlots** - scans all the GPT slots on the page to get the div and slot name, then scans all AUPs looking for a match.

In all cases, these rules are applied:
1. If multiple AUPs match, PPI will choose the first one in the list.
1. If a custom mapping function is provided, it will be called to veto matches.
1. The resulting PBJS AdUnit "code" is a hashed value from the AUP.
1. The sizes in the PBJS AdUnit are constrained by any sizes defined in the transaction object.
1. If the AUP refers to a Media Type Object, it will be resolved.
1. All fields in the AUP are copied through to the resulting PBJS AdUnit except divPattern and slotPattern.

The following sections detail each of the hbInventory types.

#### hbInventory AUPSlotPath Sub-Module

This inventory option scans down the AdUnit Patterns looking for a match between hbInventory.values.name and the AUP.slotPattern.

![PPI AUPSlotPath](/assets/images/ppi/ppi-aupslotpath.png){:class="pb-lg-img"}

When processing AUPSlotPath transactions, PPI does the following:
1. Loop through available AUPs
1. Compare values.name to the AUP slotPattern, which may be a regular expression. The intention is that values.name corresponds to an actual Ad Server AdUnit name, but this is not necessary.
1. Call the custom matching function if defined.
1. If there are multiple matches, choose the first in the list.
1. Resolve any MediaType Objects as appropriate and determine sizes.
1. Create the PBJS AdUnit

See the [AUP Matching Algorithm](/dev-docs/modules/ppi.html#matching-algorithm) section below for more details.

##### Transaction parameters for hbInventory=AUPSlotPath

{: .table .table-bordered .table-striped }
| Parameter  | Scope     | Description | Type |
|---------+----+-------+---------|
| hbInventory. values.name | required | value or regex matching the AUP slotPattern | string | 
| hbinventory. sizes | optional | constraints which banner sizes end up in the PBJS AdUnit | array of string arrays |

#### hbInventory AUPDivID Sub-Module

This option is very similar to AUPSlotPath as described above, except it scans down the AdUnit Patterns looking for a match between hbInventory.values.name and the AUP.**div**Pattern instead of slotPattern.

##### Transaction parameters for hbInventory=AUPDivID

{: .table .table-bordered .table-striped }
| Parameter  | Scope     | Description | Type |
|---------+----+-------+---------|
| hbInventory. values.name | required | value or regex matching the AUP divPattern | string |
| hbInventory. sizes | optional | constrains which banner sizes end up in the PBJS AdUnit | array of string arrays |

#### hbInventory AUPSlotObject Sub-Module

This option assumes the use of the GAM ad server, and specifically, the existence of GPT (Google Publisher Toolkit) in the page.

The approach used is similar to the ones described above, except it scans down the AdUnit Patterns looking for a match between the GPT slot name and div against the AUP slotPatterns and divPatterns.

##### Transaction parameters for hbInventory=AUPSlotObject

{: .table .table-bordered .table-striped }
| Parameter  | Scope     | Description | Type |
|---------+----+-------+---------|
| hbInventory. values.slot | required | defines the slotName and div ID used to match the AUP slotPattern and divPattern | GPT slot object |

#### hbInventory AUPAutoSlots Sub-Module

This option assumes the use of the GAM ad server, and specifically, the existence of GPT (Google Publisher Toolkit) in the page.

This method is different from the others. It scans all the GPT slots in the page looking for AUP matches. It then expands the original transaction object into additional transaction objects of type AUPSlotObject, which are then processed as described below.

![PPI AUPAutoSlots](/assets/images/ppi/ppi-aupautoslots.png){:class="pb-lg-img"}

1. Loop through GPT slots
1. For each one, loop through available AUPs
1. Compare GPT slot name to the AUP slotPattern, which may be a regular expression.
1. Compare GPT div to the AUP divPattern, which may be a regular expression.
1. Call the custom matching function if defined.
1. If there are multiple matches, choose the first one in the list.
1. Resolve any Media Type Objects as appropriate and filter sizes.
1. Create PBJS AdUnit

See the AUP Matching Algorithm below for more information.

##### Transaction parameters for hbInventory=AUPAutoSlots

None.

#### Ad Unit Pattern Details

##### Regex Format

The divPattern and slotPattern fields can be formatted as JavaScript Regular Expressions. Some examples:

- ^/test$ - the compared value must be exactly "/test"
- ^.*/test$ - the compared value must end in "/test"
- /test - the compared value can have "/test" in any position

The main use case for regular expressions in the AUP divPattern and slotPattern fields is for when a single Prebid.js file applies to more than one publisher web page. For example, if Page1 has an ad slot named "/homepage/medrect" and Page2 has an ad slot named "/page2/medrect", but they have the same bidders and parameters, you could set up a single AUP targeting slotPattern ".*/medrect" which would match in both page environments.

##### Matching Algorithm

PPI processes each Transaction Object and tries to match it to a single AdUnit Pattern. Basically, it compares the slotPattern and/or divPattern and takes the first specific match.

Here's how it works in detail:
```
  loop through transaction objects
    if hbInv.type=AUPAutoSlots
       loop through GPT slots, add an transaction object for eachinv=slot, copy hbSource/hbDest
    match transactionObject and AdUnit Pattern
      if hbInv.type=AUPSlotName, compare aup.slotPattern to hbInv.values.name
      if hbInv.type=AUPDivID, compare aup.divPattern to hbInv.values.name
      if hbInv.type=AUPSlotObject, compare aup.slotPattern to hbInv.values.slot.getAdUnitPath
      if AUP.mediaTypes not specified but mtoId is present
        set AUP.mediaTypes from mtoConfigMap
      if AUP declares mediaTypes.banner.sizeConfig, process viewport size to determine mediaTypes.banner.sizes
      filter mediaTypes.banner.sizes down to the intersection of TO.sizes
      remove AUP as a possible match if no sizes match
      if pbjs.ppi.setCustomMappingFunction is defined, call it
        filter any matches where this returns false
    if more than one match, pick first
    create AU from the chosen match
```

##### Custom Matching

A list of AdUnit Patterns may apply across multiple pages and device types. There may be a need to choose an AUP in a way that the default logic won't do. This is where a custom mapping function comes in handy.

Here's an example where there's GPT-level targeting that can help choose the right AUP.

1) The GPT slot has additional targeting
```
googletag.defineSlot('/112115922/HB_QA_Tests', [[728, 90]], 'test_div_1')
  .setTargeting('deviceType', 'desktop');
```

2) An AUP defines a customMappingParam
 ```
{
    divPattern:"test_div.*",
    mediaTypes: {
	banner: { sizes: [[728,90]] }
    },
    customMappingParams: {
	deviceType: ‘desktop’
    },
    bids:[ ... ]
}
```

3) The Transaction Object 
```
{
    hbInventory: {
        type: "AUPSlotObject",
        values: {
            slot: slotObj
        }
    },
    ...
}
```

4) A function is defined that compares the extra GPT targeting with the AUP customMappingParams.

pbjs.ppi.setCustomMappingFunction(myMappingFunction);
```
var myMappingFunction = function(transactionObject, aup) {
  var slotDevice = aup.customMappingParams.deviceType;
  if (slotDevice === ‘all’) return true
  else {
      var gptDevice = transactionObject.hbInventory.values.slot.getTargeting('deviceType')[0];
      return gptDevice === slotDevice
   }
}
```
Note that the function signature for the mapping function includes only the Transaction Object and the proposed AUP match. It does not always map to GPT slot so easily as in the above example which uses the AUPSlotObject sub-module. If necessary, you may need to determine GPT slot within the function.

##### MediaType Objects

AdUnit Patterns can optionally abstract "mediaTypes" out into a separate object. This could save space when there are many PBJS AdUnits on the page that share the same mediaTypes block or if the mediaTypes block has a lot of data (e.g. native or video).
As a simple example, here's a block defining some sizes that many AUPs will share.
```
pbjs.ppi.mtoConfigMap={
            "banner-1": {
                mediaTypes: {
                    banner: {
                        sizes: [[300, 250], [300,600]]
                    }
                }
            }
          };
```
Here's how the AUPs refer to the MTO object:
```
window.pbjs.ppi.addAdUnitPatterns(
[{
    divPattern: "test-1",
    mtoId: "banner-1",
    bids: [
	{
	    bidder: 'appnexus',
	    params: {
		placementId: 13144370
	    }
	}
    ]
}]
```

##### Creating PBJS AdUnits

PPI creates the PBJS AdUnit from the matched AUP:
1. Copies the entire AUP
1. Deletes the following fields from the new AU: slotPattern, divPattern
1. Add the 'code' field as a hash of the adunit
1. Add the 'aupname' field as a concatentation of slotPattern, divPattern, and each attribute of customMappingParams.

### hbSource Processing Stage

The hbSource stage defines where the bids for a given auction should come from. There are two sources: Auction and Cache.

- **Auction**: hold a new Prebid auction to gather new bids for the defined AdUnits.
- **Cache**: for high performance, consult the Prebid cache and use values there. If the cache is empty for a given adunit, hold a new Prebid auction.  

#### hbSource Auction Sub-Module

This module initiates the auction, returning to the destination after the auction is done or timed out.

If the limited bid cache is enabled, both new and cached bids will be sent to the next step.

##### Transaction Object Parameters for hbSource=Auction

none

#### hbSource Cache Sub-Module

This module is designed for the use case where the page does an early auction with hbDestination=cache. Then later on, when the page div is ready for display, the results are read with this sub-module.

Here's how it works:
- if the PBJS ad unit has auction results, immediately invokes the callback with all cached bids.
- Otherwise, for PBJS ad units that don't have any cached bids from previous auctions, initiate an auction and invoke the callback once those are done or timed out.

##### Transaction Object Parameters for hbSource=Cache

none

### hbDestination Processing Stage

The hbDestination module defines what PPI does with fetched bids when the auction process is complete.  There are currently 4 destination modules within PPI :
- **gpt** - Automatically serve GAM ads using the Google Publisher Toolkit (aka googletag).
- **page** - Using the transaction results, automatically serve ads onto the page without calling an ad server.
- **callback** - Pass the transaction results to a custom callback function.
- **cache** - Cache the results of the auction in the Prebid on-page cache for future use in a subsequent PPI call.

#### hbDestination gpt Sub-Module

The 'gpt' sub-module coordinates the timing of header bidding auctions with the delivery of ads via the Google Publisher Toolkit.  It handles the necessary GPT API code, firing the calls to invoke Google Ad Manager, and even creating GPT slots if necessary. This means the publisher just needs to include the GPT library on the page with no need to manually add GPT functions to the page, though it's ok if the GPT slots are already there.

The gpt module coordinates the following:

1. Determine if GPT slots need to be created/destroyed on the page
    1. If a matching slot exists, re-use it
    1. If no matching slot exists, create the slot if possible. See below for more details.
1. Set GPT slot targeting based on the auction results 
1. Set size information based on the values passed in or resolved via hbInventory
1. Refresh the GPT slot to call GAM and display an ad

The gpt sub-module will refresh the GPT slots for all Transaction Objects in the auction even if they did not match an AUP. This means that if a slot did not have Prebid auction, it will simply serve via GAM without having to wait for the Prebid Auction to complete.

##### Transaction parameters for hbDestination=gpt 

{: .table .table-bordered .table-striped }
| Parameter  | Scope     | Description | Type |
|---------+----+-------+---------|
| hbDestination. values.divId | recommended | defines the destination where the ad is to appear and is used to create GPT slots if none exist. | string |
| hbDestination. values.targeting | optional | this additional targeting will be added to the GPT slot. See below for example usage. | object |

Here's an example of how to pass additional targeting via the Transaction Object:
```
hbDestination: {
  values: {
    divId: "test-div",
    targeting: { color: 'blue', interests: ['sports', 'music', 'movies'] }
  }
}
```

##### Creating GPT slots

If PPI determines that a GPT slot needs to be created in a div, here's how it works:

1. Get the slotName from hbInventory
    1. If type=AUPSlotName, then use values.name 
    1. If type=AUPDivID, then use the AUP's slotPattern if it's not a regular expression
    1. If type=AUPSlotObject, then query the object
1. Get the divId
    1. from hbDestination.values.div.
    1. If that's not present and hbInventory.type=AUPSlotObject, then query the object
    1. else try use the AUP's divPattern if it is not a wild card. 
1. If either slot or div cannot be defined, PPI will throw an error as it lacks the necessary information to define a GPT slot

#### hbDestination Page Sub-Module

The page module receives the results of a header bidding auction and renders an ad to the page directly without an ad server. For each transaction object, it picks the highest bid and renders the creative directly to the divId specified. If no div is specified, it will try to use the divPattern from the AUP.

If an appropriate div is found, the sub-module creates an invisible iframe and calls the classic pbjs.renderAd() function.

There are no controls over how this module chooses the auction winner - it uses the output of the pbjs.getHighestCpmBids() function. If you need more control over what is chosen, please use hbDestination=callback to write your own render function.

##### Transaction parameters for hbDestination=page

{: .table .table-bordered .table-striped }
| Parameter  | Scope     | Description | Type |
|---------+----+-------+---------|
| hbDestination. values.divId | recommended | defines the destination where the ad is to appear | string |

#### hbDestination Callback Sub-Module

The purpose of the callback sub-module is to pass the bid results along to a user-defined function. This is intended for publishers using ad servers other than GAM and those who have special rendering requirements.

The page needs to define a function that will be invoked once for each Transaction Object in the auction.

```
        let callbackfn = (matchObj) => {
             ... custom logic ...
        }
```

Where matchObj has this structure:

```
{
   transactionObject: { hbInventory: {...}, hbSource: {...}, hbDestination: {...} },
   adUnit: PBJS_ADUNIT,
   values: {
            bids: ARRAY_OF_PBJS_BIDS_OBJECTS
            timedOut: true/false,
            auctionId: AUCTIONID   // not available for cached bids
    }
}
```

##### Transaction parameters for hbDestination=callback

{: .table .table-bordered .table-striped }
| Parameter  | Scope     | Description | Type |
|---------+----+-------+---------|
| hbDestination. values.callback | required | defines the function to call | function |

#### hbDestination Cache Sub-Module

Defining 'cache' as the destination instructs PPI to hold an auction and then store the bids in the Prebid Cache on the page for future consumption. This module is the default PPI destination, called when:

1. hbDestination.type is “cache”
1. the hbDestination key is undefined
1. hbDestination does not contain a type and the hbSource is “auction”, it is assumed that the auction bid results are meant to simply feed the cache.

Note that you should not define a Transaction Object where both hbSource and hbDestination are 'cache'. This would not have any effect.

##### Transaction parameters for hbDestination=cache 

none

## PPI Function and Object Reference

These are the functions and objects exported by PPI.

### pbjs.ppi.requestBids()

Initiates PPI transactions defined in the parameters.

#### Usage
```
pbjs.ppi.requestBids(transactionObjects, requestObj);
```
#### Parameters

{: .table .table-bordered .table-striped }
| Parameter    | Scope    | Description | Type |
|---------+------------------------|
| transactionObjects | required | array of PPI transaction objects as defined [above](/dev-docs/modules/ppi.html#the-ppi-transaction-object-array) | array of objects |
| requestObj | optional | attributes that may refine the PPI auction or be passed to PBJS | object |
| requestObj. ppi.adUnitPatterns | optional | instead of using the AUPs defined globally, use this set instead | array of objects |
| requestObj. timeout | optional | passed through to [pbjs.requestBids](/dev-docs/publisher-api-reference/requestBids.html) | integer |
| requestObj. labels | optional | passed through to [pbjs.requestBids](/dev-docs/publisher-api-reference/requestBids.html) | array of strings |
| requestObj. auctionId | optional | passed through to [pbjs.requestBids](/dev-docs/publisher-api-reference/requestBids.html) | string |

#### Return

Returns an array of objects:
```
[{
          transactionObject: PPI_TRANSACTION_OBJECT,
          adUnit: PBJS_ADUNIT
},{
          ...
}]
```

### pbjs.ppi.addAdUnitPatterns()

Define the global list of AUPs

#### Usage
```
pbjs.ppi.addAdUnitPatterns(aups)
```
#### Parameters

{: .table .table-bordered .table-striped }
| Parameter    | Scope    | Description | Type |
|---------+------------------------|
| aups | required | array of PPI AdUnit Patterns as described [above](/dev-docs/modules/ppi.html#adunit-pattern-overview) | array of objects |

#### Return
none

### pbjs.ppi.setCustomMappingFunction()

Allows fine-grained control over which AUPs match each transaction object.
See the [PPI Custom Mapping Example](/examples/ppi/ppi-custommapping.html).

#### Usage
```
pbjs.ppi.setCustomMappingFunction(fn)
```

#### Parameters

{: .table .table-bordered .table-striped }
| Parameter    | Scope    | Description | Type |
|---------+------------------------|
| fn | required | a function that takes a transactionObject and an AUP, accepting or rejecting the potential match | function |

#### Example

```
var myMappingFunction = function(transactionObject, aup) {
   // custom logic
   // return true if the transactionObject matches the AUP
   // return false to veto the match
}
```

#### Return

none

### pbjs.ppi.mtoConfigMap

This is the global location where pages supporting PPI can define the MediaTypeObjects as described above. For example:
```
pbjs.ppi.mtoConfigMap={
    "banner-1": {
	mediaTypes: {
	    banner: {
		sizes: [[300, 250], [300,600]]
	    }
	}
    }
};
```

## Sample Transactions

This section provides a cookbook of scenarios to base your specific scenarios from.

### Eager loading Prebid ad units

In these scenarios, the auction is held before the ad slots are ready
for display. The results all go to cache.

#### GPT AdSlots

Auctions for all or specific Google Ad Slot Objects on the page without rendering an ad.

```
pbjs.ppi.requestBids([
{
  hbInventory: {
    type: “AUPAutoSlots”,
  },
  hbSource: {
    type: ”auction”
  },
  hbDestination: {
    type: "cache"
  }
}]);
```

#### Divs

Auctions for all or specific divs on the page without rendering an ad.

```
pbjs.ppi.requestBids([
{
  hbInventory: {
    values: { name: “my-div-id” },
    type: “AUPDivID”,
  },
  hbSource: {
    type: ”auction”
  },
  hbDestination: {
    type: "cache"
  }
}]);
```

#### Slot Patterns

Auctions for specific Slot Patterns without the existence of GPT Ad Slot Objects on the page and without rendering an ad.

```
pbjs.ppi.requestBids([
{
  hbInventory: {
    values: { name: “/1111/header-bid-tag-0” },
    type: “AUPSlotPath”,
  },
  hbSource: {
    type: ”auction”
  },
  hbDestination: {
    type: "cache"
  }
}]);
```

#### Div Patterns

Auctions for specific divPatterns without the existence of GPT Ad Slot Object on the page and without rendering an ad.

```
pbjs.ppi.requestBids([
{
  hbInventory: {
    values: { name: “my-div-id” },
    type: “AUPDivID”,
  },
  hbSource: {
    type: ”auction”
  },
  hbDestination: {
    type: "cache"
  }
}]);
```

### Serving from Cache

#### GPT AutoSlots

Render an ad from cache for all existing Google Ad Slots on the page.

```
pbjs.ppi.requestBids([
{
  hbInventory: {
    type: “AUPAutoSlots”,
  },
  hbSource: {
    type: ”cache”
  },
  hbDestination: {
    type: "gpt"
  }
}]);
```

#### GPT Ad Slots

Render an ad from cache for the specified Google Ad Slots.

```
pbjs.ppi.requestBids([
{
	hbInventory: {
	    type: 'AUPSlotObject',
	    values: {
		slot: googletag.pubads().getSlots()[0],
	    },
	},
	hbSource: {
	    type: 'auction',
	},
	hbDestination: {
	    type: 'gpt',
	    values: { div: 'test-1' }
	}
}]);
```

#### DivId

Render an ad from cache using the DivID to select the AUP.

```
pbjs.ppi.requestBids([
{
	hbInventory: {
	    type: 'AUPDivID',
	    values: {
		name: 'test-2',
	    },
	},
	hbSource: {
	    type: 'auction',
	},
	hbDestination: {
	    type: 'gpt',
	    values: { div: 'test-2' }
	}
}]);
```

## Support

If you're a [Prebid.org member](https://prebid.org/membership/), you can post a message into the #prebid-js slack channel of the Prebid workspace. Otherwise, see the [support page](/support/index.html).

## Appendix - Pseudocode

It may be useful to publisher development staff to know exactly
what PPI does. Here's an outline.

Abbreviations:
- TO: Transaction Object
- AUP: AdUnit Pattern

```
group TransactionObjets(TO) by permutations of source/dest
loop through groups
  loop though TO
    if hbInv==auto
       loop through GPT slots, add TO for each: inv=slot, copy source/dest
    match TO and AUP
      if hbInv=SLOTNAME, compare aup.slotPattern to hbInv.values.name
      if hbInv=DIV, compare aup.divPattern to hbInv.values.name
      if hbInv=SLOTOBJ, compare aup.slotPattern to hbInv.values.slot.getAdUnitPath
      if AUP.mediaTypes not specified but mtoRevId is
        set AUP.mediaTypes from mtoConfigMap
      find AUP sizes
        if mediaTypes.bannersizeConfig, process viewport size
        otherwise use mediaTypes.banner.sizes
      filter AUP mediaTypes.banner.sizes to the intersection of TO.sizes
          if no TO.sizes and if hbInv=SLOTOBJ intersect with GPT getSizes()
        remove AUP as possible match if no sizes are left
      if pbjs.ppi.setCustomMappingFunction is defined, call it
        filter any matches when this returns false
    if more than one match, pick first
    create AU from the chosen match
      copy the entire AUP
      delete the following fields from the new AU: slotPattern, divPattern
      add the 'code' field as a hash of the adunit
      add the 'aupname' field as a concatentation of slotPattern, divPattern, and each attribute of customMappingParams.
    apply imp-level FPD to AU from hbInv.ortb2Imp
    set TO.div
      if hbInv=SLOTOBJ, div=hbInv.values.slot.getSlotElementId()
      if hbInv=DIV, div=hbInventory.values.name
      if AUP.divPattern is not a regex, use it
      otherwise no div
      div is set in AU.ortb2Imp.ext.data.elementid
      // this can be used to create a customSlotMatching function
    set TO.slotname
      if hbInv=SLOTNAME, slot=hbInv.values.name
      if hbInv=DIV and AUP.slotPattern is not a regex, use it
      if hbInv=SLOTOBJ, slot=hbInv.values.slot.getAdUnitPath()

We now have a map of of TO/AUP
call the source sub-module for bids
if source is 'cache'
  - call pbjs.getBidResponsesForAdUnitCode
  - filter out used and expired bids
  - filter out zero CPM bids (*)
  - initiate auction for any AdUnits which had no cached values
if source is 'auction'
  - call pbjs.requestBids
  - In callback, fetch bids from cache if enabled
    - filter used and expired bids
    - note: inconsistent with cache source in no zero-cpm filter

call the dest with the bids
if dest is 'cache'
  - do nothing - PBJS will have cached the bids if useBidCache is set
if dest is 'gpt'
   - find appropriate gpt slots, set targeting on them and refresh them
   - if np appropriate gpt slot can be found on the page then create it
   - loop through match obj
     - if no div found, skip
     - if GPT slot object found, validate
     - If GPT slot object not found
       - if no adUnitPath specified, skip. Otherwise create GPT object
   - setTargeting on slots, call GPT refresh
if dest is 'page'
  - loop over match objects
    - pick winner with pbjs.getHighestCpmBids
    - find div
    - createInvisibleIframe
    - call pbjs.renderAd
if dest is 'callback'
  - loop over match objects, call specified function
```

## Related Reading
- Compare PPI to the [OG way of integrating Prebid.js](/dev-docs/getting-started.html)
- Prebid.js [Publisher API](/dev-docs/publisher-api-reference.html)
