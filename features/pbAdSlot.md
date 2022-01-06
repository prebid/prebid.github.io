---
layout: page_v2
title: Prebid Ad Slot and GPID
description: Prebid Ad Slot and GPID
sidebarType: 1
---

# The Prebid Ad Slot and the GPID
{:.no_toc}

* TOC
{:toc}

Prebid Ad Slot and the Global Placement ID (GPID) are overlapping conventions that allow publishers to identify ad inventory on their pages so bidders and reporting systems can better deal with their sites.

## Background 

It all starts with how publishers decide to label their ad slots: the places on their pages
where ads can be served. In some ad servers like GAM, these things are called "ad units".
Most publishers use unique ad slot names, but some publishers utilize the same name for every ad slot on their page. e.g. "/homepage" might be the name for 5 different slots.

It's the case of 'same ad slot names' that Prebid Ad Slot and GPID are
meant to address.

### The Prebid.js AdUnit

When Prebid.js was developed in 2015, they needed a data structure that would link each ad slot to the bidders and parameters involved in the auction for that slot. Thus was born the Prebid.js [AdUnit](/dev-docs/adunit-reference.html). The AdUnit 'code' is what links this object to the adserver's ad slot. Because some pubs use the same ad slot name everywhere, AdUnit.code is a mixed attribute that can be either the ad slot name **or** the HTML div ID. The undecided nature of AdUnit.code makes it hard to utilize for reporting and auction targeting.

### The Prebid Ad Slot

The 'Prebid Ad Slot' was developed in Prebid.js v3 as an optional inventory management convention allowing publishers to supply a descriptive and stable label for each ad on the page. This makes it possible to have more granular reporting and better deal targeting.
However, the PB ad slot is not an industry standard convention, so didn't gain
much traction.

### The GPID

The Global Placement ID (GPID) was an initiative in the Fall of 2021 led
by the TradeDesk to solve the problem of inventory identification in an industry-wide way. i.e. Buyers want to be able to identify ad slots in a unique way even
when the publisher uses the same ad slot name multiple times.

The original suggestion for GPID was to simply append the HTML div element id (aka the 'div-id') to the ad slot name. But some publishers generate div-ids randomly, so the definition of GPID has become:

```
imp[].ext.gpid: ADSLOTNAME#UNIQUIFIER
```
Where ADSLOTNAME is the ad server's slot name (e.g. /1111/homepage) and UNIQUIFIER is something that makes the ADSLOTNAME different from others. Normally it's a
div-id, but if div-ids are random, it can be something else. The "#UNIQUIFIER" is only required if the ADSLOTNAME isn't unique enough on its own.

{: .alert.alert-info :}
The Prebid Ad Slot didn't ever get broad adoption, so it's likely that
someday we'll deprecate it in favor of the more standard GPID.

## Defining Prebid Ad Slot and GPID

There are two ways a publisher can inject these values into the header bidding auctions:

1. Supply them manually on the PBJS AdUnits
2. Install the [GPT Pre-Auction module](/dev-docs/modules/gpt-pre-auction.html)

### Defining them on the PBJS Ad Unit

#### Example 1 - unique ad slot names

In this example, there's no need for the "UNIQUIFIER" string because every ad slot
on the publisher page is already unique.

```
pbjs.addAdUnits({
    code: '/1111/homepage-leftnav',
    ortb2Imp: {
        ext: {
            gpid: "/1111/homepage-leftnav",
	    data: {
                pbadslot: "/1111/homepage-leftnav"
            }
        }
    },
    mediaTypes: ...
    bids: ...
});
```

#### Example 2 - duplicate ad slots

In this example, the publisher's ad slots all have the same name, but at least
 the div-ids are unique.

```
pbjs.addAdUnits({
    code: 'div-leftnav',
    ortb2Imp: {
        ext: {
            gpid: "/1111/homepage#div-leftnav",
	    data: {
                pbadslot: "/1111/homepage#div-leftnav"
            }
        }
    },
    mediaTypes: ...
    bids: ...
});
```

#### Example 3 - duplicate ad slots, random div IDs

In this example, the publisher utilizes the same 'slotname' in the page for multiple holes-in-the-page, differentiating in the ad server by size. They also use random div-ids. e.g.
- defineSlot('/1111/homepage', [[300,250]], 'div-293rj893p9wje9we9fj');
- defineSlot('/1111/homepage', [[728,90]], 'div-j98s9u9usj987665da');

```
pbjs.addAdUnits({
    code: 'div-293rj893p9wje9we9fj',
    ortb2Imp: {
        ext: {
            gpid: "/1111/homepage#300x250",
	    data: {
                pbadslot: "/1111/homepage#300x250"
            }
        }
    },
    mediaTypes: ...
    bids: ...
},{
    code: 'div-j98s9u9usj987665da',
    ortb2Imp: {
        ext: {
            gpid: "/1111/homepage#728x90",
	    data: {
                pbadslot: "/1111/homepage#728x90"
            }
        }
    },
    mediaTypes: ...
    bids: ...
});
```

## Prebid Server

The Prebid Server Bid Adapter just sends the values to the conventional OpenRTB locations:
- Prebid Ad Slot is `imp[].ext.data.pbadslot`
- GPID is `imp[].ext.gpid`

Mobile and AMP Stored Requests should place the values there as desired.

Server-side bid and anlytics adapters may be modified to read the value.

## Further Reading

- [GPT Pre-Auction Module](/dev-docs/modules/gpt-pre-auction.html)
- [Ad Unit Reference](/dev-docs/adunit-reference.html)
