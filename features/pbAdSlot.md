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
decides to add another identifier... the Prebid Ad Slot.
5. The publisher adds a function to the page that annotates each Prebid AdUnit in the auction with the `pbadslot`.
6. Participating bid adapters read the `pbadslot` and can target deals to them.
7. Participating analytics adapters read the `pbadslot` for more granular reporting.

Example page function:
{% highlight js %}

// Use adunit.ortb2Imp.ext.data.pbadslot if it exists. Otherwise, if the
// the adunit.code is a div ID, then look for a data-adslotid attribute, then look a matching slot in GPT
// Otherwise, just use the AdUnit.code
var setPbAdSlot = function setPbAdSlot(adUnits) {
  // set pbadslot for all ad units
  adUnits.forEach(function (adUnit) {
    if (!adUnit.ortb2Imp) {
      adUnit.ortb2Imp = {}
    }
    if (!adUnit.ortb2Imp.ext) {
      adUnit.ortb2Imp.ext = {};
    }
    if (!adUnit.ortb2Imp.ext.data) {
      adUnit.ortb2Imp.ext.data = {};
    }

    // use existing pbadslot if it is already set
    if (adUnit.ortb2Imp.ext.data.pbadslot) {
      return;
    }

    // check if AdUnit.code has a div with a matching id value
    const adUnitCodeDiv = document.getElementById(adUnit.code);
    if (adUnitCodeDiv) {
      // try to retrieve a data element from the div called data-adslotid.
      if (adUnitCodeDiv.dataset.adslotid) {
        adUnit.ortb2Imp.ext.data.pbadslot = adUnitCodeDiv.dataset.adslotid;
        return;
      }
      // Else if AdUnit.code matched a div and it's a banner mediaType and googletag is present
      if (adUnit.mediaTypes && typeof adUnit.mediaTypes === 'object' && adUnit.mediaTypes.banner && adUnit.mediaTypes.banner.sizes && window.googletag && googletag.apiReady) {
        var gptSlots = googletag.pubads().getSlots();
        // look up the GPT slot name from the div.
        var linkedSlot = gptSlots.find(function (gptSlot) {
          return (gptSlot.getSlotElementId() === adUnitCodeDiv.id);
        });
        if (linkedSlot) {
          adUnit.ortbImp.ext.data.pbadaslot = linkedSlot.getAdUnitPath();
          return;
        }
      }
    }
    // Else, just use the AdUnit.code, assuming that it's an ad unit slot
    adUnit.ortb2Imp.ext.data.pbadslot = adUnit.code;
  });
};

pbjs.onEvent('beforeRequestBids', setPbAdSlot);

{% endhighlight %}

## How It Works

The Prebid Ad Slot is just a convention -- it's a form of adunit-specific first party data
stored under `adunit.ortb2Imp.ext.data.pbadslot`.
It can be utilized by any code ready to look for it.

It's intended to be specified via Prebid.js in one of two ways:

1. Either directly on the AdUnit itself
2. Or defined during the run of a function before the auction

The function could determine the pbadslot in any way that produces a stable value useful for targeting and reporting.
Some scenarios that could be supported:

- parse a substring of the ad server's slot name
- use a custom div data element ID, else the AdUnit.code
- use the AdUnit.ortb2Imp.ext.data.pbadslot as a default rather than primary
- support a different ad server

## Prebid Server

The OpenRTB location for the Prebid Ad Slot is `imp[].ext.data.pbadslot`:

- The Prebid SDK will place the value there.
- AMP Stored Requests should place the value there if desired.
- Server-side bid and anlytics adapters may be modified to read the value.

## Further Reading

- The [onEvent()](/dev-docs/publisher-api-reference/onEvent.html) function
