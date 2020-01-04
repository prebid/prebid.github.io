---
layout: page_v2
title: Prebid Ad Slot
description: The Prebid Ad Slot
sidebarType: 1
---

# Prebid Ad Slot

The Prebid AdUnit 'code' is a mixed attribute that's generally either the GPT slot name or the HTML div ID. The undecided nature of the 'code' makes it harder to utilize for reporting and auction targeting.

The `Prebid Ad Slot` is an optional inventory management convention allowing publishers to supply a descriptive and stable label for each ad on the page. This makes it possible to have more granular reporting and better deal targeting.

{: .alert.alert-info :}
The Prebid Ad Slot was introduced with Prebid.js 3.x.

## A Scenario

1. The publisher utilizes the same 'slotname' in the page for multiple holes-in-the-page, differentiating in the ad server by size. e.g.
- defineSlot('/1111/homepage', [[300,250]], 'div-293rj893p9wje9we9fj');
- defineSlot('/1111/homepage', [[728,90]], 'div-j98s9u9usj987665da');
- defineSlot('/1111/homepage', [[160,600]], 'div-B2q3s4gseshekhsei9sh');
2. In order to be able to display the right ad in the right hole, the Prebid AdUnit therefore sets the 'code' to the div ID instead of the slotname.
3. The div ID in this case is a random number, not very useful for reporting.
4. Therefore, to get a stable ID that's useful from a business perspective to identify a hole-in-the-page, the publisher
decides to add another identifier... the Prebid Ad Slot, or pbAdSlot.
5. The publisher adds a function to the page that annotates each Prebid AdUnit in the auction with the `pbAdSlot`.
6. Participating bid adapters read the `pbAdSlot` and can target deals to them.
7. Participating analytics adapters read the `pbAdSlot` for more granular reporting.

Example page function:
{% highlight js %}

// Use adunit.fpd.context.pbAdSlot if it exists, otherwise, assume the 
// the adunit.code is the div ID and find the matching slot in GPT, using that slot name
// as the pbAdSlot
var setPbAdSlot = function setPbAdSlot(adunits) {
    forEach(adUnits, function(adUnit) {
	if (adunit.fpd && adunit.fpd.context && adunit.fpd.context.pbAdSlot) {
	    console.log('setPbAdSlot: using existing pbAdSlot '+adunit.fpd.context.pbAdSlot);
	} else {
	    // lookup the GPT slotname from the div ID
	    window.googletag.pubads().getSlots().forEach(slot => {
		... TBD ...
	    });
	}
    });
};

pbjs.onEvent('beforeRequestBids', setPbAdSlot);

{% endhighlight %}

## How It Works

The Prebid Ad Slot is just a convention -- it's a form of adunit-specific first party data
stored under `adunit.fpd.context.pbAdSlot`. 
It can be utilized by any code ready to look for it.

It's intended to be specified in one of two ways:

1. Either directly on the AdUnit itself
2. Or defined during the run of a function before the auction

The function could determine the pbAdSlot in any way that produces a stable value useful for targeting and reporting.
Some scenarios that could be supported:

- parse a substring of the ad server's slot name
- use a custom div data element ID, else the AdUnit.code
- use the AdUnit.fpd.context.pbAdSlot as a default rather than primary
- support a different ad server

## Further Reading

- The [onEvent()](/dev-docs/publisher-api-reference.html#module_pbjs.onEvent) function

