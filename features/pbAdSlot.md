---
layout: page_v2
title: Global Placement ID (GPID)
description: How to identify ad slots for bidders and reporting with the Global Placement ID (GPID), which replaced the Prebid Ad Slot
sidebarType: 1
---

# The Global Placement ID (GPID)

{:.no_toc}

- TOC
{:toc}

The Global Placement ID (GPID) lets publishers identify each ad slot on their pages, so bidders and reporting systems can tell slots apart.

{: .alert.alert-info :}
GPID replaced the Prebid Ad Slot (`ortb2Imp.ext.data.pbadslot`). Prebid.js 9.0 deprecated `pbadslot`, and Prebid.js 10.0 removed it. Use `ortb2Imp.ext.gpid` instead; see [Migrating from the Prebid Ad Slot](#migrating-from-the-prebid-ad-slot).

## Background

It starts with how publishers label their ad slots, the places on their pages
where ads can be served. Ad servers such as GAM call these "ad units".
Most publishers use unique ad slot names, but some use the same name for every ad slot on a page. For example, "/homepage" might be the name of 5 different slots.

GPID addresses that case of repeated ad slot names.

### The Prebid.js AdUnit

Prebid.js links each ad slot to the bidders and parameters of its auction with an [AdUnit](/dev-docs/adunit-reference.html). The AdUnit `code` links it to the ad server's slot. Because some publishers use the same ad slot name everywhere, `AdUnit.code` can be either the ad slot name **or** the HTML div ID, which makes it hard to use for reporting and auction targeting.

### The GPID

The Global Placement ID was an initiative in the fall of 2021, led
by The Trade Desk, to identify inventory in an industry-wide way: buyers want to identify each ad slot uniquely,
even when the publisher uses the same ad slot name several times.

The original proposal was to append the HTML div element ID (the "div-id") to the ad slot name. Some publishers generate div-ids randomly, so GPID is defined as:

```javascript
imp[].ext.gpid: ADSLOTNAME#UNIQUIFIER
```

ADSLOTNAME is the ad server's slot name (e.g. /1111/homepage), and UNIQUIFIER makes it different from other slots with the same name. It's normally the
div-id, but if div-ids are random, it can be something else. The "#UNIQUIFIER" is only needed when ADSLOTNAME isn't unique on its own.

## Defining the GPID

There are two ways to add the GPID to header bidding auctions:

1. If you use GPT, install the [GPT Pre-Auction module](/dev-docs/modules/gpt-pre-auction.html), which sets `ortb2Imp.ext.gpid` for you.
2. Set it on each Prebid.js AdUnit. This is required for in-stream video and for publishers not using GAM.

### Defining it on the Prebid.js AdUnit

#### Example 1 - unique ad slot names

There's no need for the "UNIQUIFIER" string here, because every ad slot
on the page is already unique.

```javascript
pbjs.addAdUnits({
    code: '/1111/homepage-leftnav',
    ortb2Imp: {
        ext: {
            gpid: "/1111/homepage-leftnav"
        }
    },
    mediaTypes: ...
    bids: ...
});
```

#### Example 2 - duplicate ad slots

The publisher's ad slots all have the same name, but the div-ids are unique.

```javascript
pbjs.addAdUnits({
    code: 'div-leftnav',
    ortb2Imp: {
        ext: {
            gpid: "/1111/homepage#div-leftnav"
        }
    },
    mediaTypes: ...
    bids: ...
});
```

#### Example 3 - duplicate ad slots, random div IDs

The publisher uses the same slot name for several slots on the page and differentiates them in the ad server by size. The div-ids are random, e.g.

- defineSlot('/1111/homepage', [[300,250]], 'div-293rj893p9wje9we9fj');
- defineSlot('/1111/homepage', [[728,90]], 'div-j98s9u9usj987665da');

```javascript
pbjs.addAdUnits([
    {
        code: 'div-293rj893p9wje9we9fj',
        ortb2Imp: {
            ext: {
                gpid: "/1111/homepage#300x250"
            }
        },
        mediaTypes: ...
        bids: ...
    },
    {
        code: 'div-j98s9u9usj987665da',
        ortb2Imp: {
            ext: {
                gpid: "/1111/homepage#728x90"
            }
        },
        mediaTypes: ...
        bids: ...
    }
]);
```

## Prebid Server

The Prebid Server Bid Adapter sends the GPID in its OpenRTB location, `imp[].ext.gpid`.
Mobile and AMP stored requests should put it there too.

## Migrating from the Prebid Ad Slot

The Prebid Ad Slot was an optional Prebid.js convention, introduced in Prebid.js 3, for a stable label on each ad slot in `ortb2Imp.ext.data.pbadslot`. It never became an industry standard, and GPID covers the same need.

- **Prebid.js 9.0** deprecated it: setting `pbadslot` logs a warning.
- **Prebid.js 10.0** removed it: the GPT Pre-Auction module no longer sets `pbadslot` or supports the `customPbAdSlot` option, and Prebid.js no longer reads the field.

To migrate, move the value from `ortb2Imp.ext.data.pbadslot` to `ortb2Imp.ext.gpid`, or let the GPT Pre-Auction module set the GPID. See the [Prebid.js 10 release notes](/dev-docs/pb10-notes.html).

## Further Reading

- [GPT Pre-Auction Module](/dev-docs/modules/gpt-pre-auction.html)
- [Ad Unit Reference](/dev-docs/adunit-reference.html)
