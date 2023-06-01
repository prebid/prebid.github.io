---
layout: api_prebidjs
title: pbjs.setTargetingForGPTAsync([codeArr], customSlotMatching)
description: setTargetingForGPTAsync API
sidebarType: 1
---


Set query string targeting on GPT ad units after the auction.

**Kind**: static method of pbjs API

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | -- |
| [codeArr] | Optional | `array` | an array of adUnitCodes to set targeting for. |
| customSlotMatching | Optional | `function` | gets a GoogleTag slot and returns a filter function for adUnitCode. |

This function matches AdUnits that have returned from the auction to a GPT ad slot and adds the `hb_`
targeting attributes to the slot so they get sent to GAM.

Here's how it works:
1. For each AdUnit code that's returned from auction or is specified in the `codeArr` parameter:
2. For each GPT ad slot on the page:
3. If the `customSlotMatching` function is defined, call it. Else, try to match the AdUnit `code` with the GPT slot name. Else try to match the AdUnit `code` with the ID of the HTML div containing the slot.
4. On the first slot that matches, add targeting from the bids on the AdUnit. Exactly which targets are added depends on the status of [enableSendAllBids](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-Bids-Control) and [auctionKeyMaxChars](/dev-docs/publisher-api-reference/setConfig.html#setConfig-targetingControls).

{% capture tipAlert %} To see which targeting key/value pairs are being added to each slot, you can use the GPT Console. From the javascript console, run `googletag.openConsole();` :::

{% include alerts/alert_tip.html content=tipAlert %}

The `customSlotMatching` parameter allows flexibility in deciding which div id
the ad results should render into. This could be useful on long-scrolling pages... instead of setting the timeout of auctions
short to make sure they get good viewability, the logic can find an appropriate placement for the auction
result depending on where the user is once the auction completes.

```
// returns a filter function that matches either with the slot or the adUnitCode
// this filter function is being invoked after the auction has completed
// this means that it can be used in order to place this within viewport instead of a static div naming
// which regular classic setup allows (by default the its looking for a div id named same as the adUnitCode)

// slot is in view according to the divInView() function
function pickInViewDiv(slot) {
   return function(adUnitCode) {
        return adUnitCode === slot.getAdUnitPath() &&
                    divInView(slot.getSlotElementId()); }
};

// make sure we render the results from the auction in a div that is visible in the viewport (example infinite scrolling, instead of rendering a ad in the top of the list that will never be visible (made up example))

setTargetingForGPTAsync(adUnit, pickInViewDiv);
```
