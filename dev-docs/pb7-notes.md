---
layout: page_v2
title: Prebid 7.0 Release Notes & Publisher API Changes
description: Description of the breaking changes included for Prebid 7.0
top_nav_section: dev_docs
nav_section: reference

sidebarType: 1
---



# Prebid 7.0 Bidder Interface and Publisher API Changes
{:.no_toc}

This document describes the changes included for Prebid.js version 7.0.

* TOC
{:toc}

## Removed Modules

The following modules have been removed from Prebid.js as part of the 7.0 release. Publishers building with one of them will need to point to its replacement or remove the module from their build. 



{: .table .table-bordered .table-striped }

| Module      | Replacement |
|:-----------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AdLive Bid Adapter
| Akamai ID Submodule | rearchitected to use RTD module
| AppNexus Analytics Adapter
| DistrictM DMX Bid Adapter | replaced by Sharethrough
| FLOC ID submodule
| Halo ID & RTD submodules | replaced by Hadron
| NextRoll ID submodule
| OneVideo Bid Adapter | replaced by YahooSSP
| Sortable Adapters | replaced by Freestar
| TrustX Bid Adapter | now an alias of Grid
| UserId Targeting Module

## Adapter Interface

Following the precedent on Prebid 5, bidders should read additional values from the ad unit, global config, or the ortb2 object. Bidders may still take these values as parameters, but should also consider or support the more standard interface. Publishers do not want to set these values multiple times, one for each bid parter. Publishers can now rely on certain parameters no longer needing to be set in bidder configuration, including the instl flag on an ad unit, the position parameter, and the banned categories (bcats). Bidders should consider that if they are accepting any openrtb field in their configuration, they should also check the ortb2 object for that parameter. 

In the Prebid 5 release notes, it was noted that publishers should no longer use publisherDomain as a setConfig parameter, and instead prefer PageURL. Adapters no longer read from this location. Also, the object presented to bidders with the page url and that page's referring page url is essentially redone, and our goal is that adapters can rely on ortb2.site.page and ortb2.site.ref, with flags for when top is not reached, the canoncical link is used, setConfig('pageUrl') is used, or when window.location.href is used for ortb2.site.page. Many bidders had disparate logic for this and the refererInfo.referer seemed to have different meanings in different contexts.

Also, Bid Adapters (not all adapters) no longer have access to storage manager unless explicitly whitelisted by the publisher. We believe bidding functionality should rarely if ever need this access and that this extra functionality included in bid adapters must be consented to by the installer in their configuration. The following bid adapters' unit tests were affected by this change: Adagio, Adnuntius, AP Stream, Concert, Conversant, Craft, Criteo, E-Planning, Invibes, Kargo, Quantcast, Trion, Unicorn, and Vidazoo. Adapters simply setting a random identifier in the first party local storage or cookie should consider if the popular shared id user id submodule can fully achieve this functionality for them. See storageAllowed in the [Publisher API Reference]({{site.baseurl}}/dev-docs/publisher-api-reference.html) 

Adapters are also now not allowed to return alternate bidder codes unless whitelisted by the publisher. See allowAlternateBidderCodes in the [Publisher API Reference]({{site.baseurl}}/dev-docs/publisher-api-reference.html).

Finally, adapters known to use http1 bidding endpoints may now have notices appended to their documentation. 

## Regulatory and consent strings

TCF1 is no longer supported by the Consent Management (GDPR) module. The Consent Management USP module now defaults to framework 'iab' and will work without configuration if installed and a functioning __uspapi() exists on the page. It will also set ortb2.regs.ext.gpc to 1 if GPC headers indicate the user has opted out, and the third character of the [US Privacy string](https://github.com/InteractiveAdvertisingBureau/USPrivacy/blob/master/CCPA/US%20Privacy%20String.md) will not be changed, but publishers may choose to have the string Prebid.js sees affected by GPC headers.

## First Party Data

Support has been removed for `setConfig('fpd')`, `config.getLegacyFpd`, `config.convertAdUnitFpd` and related relics of legacy first party data. Publishers should use the methods described in [First Party Data]({{site.baseurl}}/features/firstPartyData.html).

First party data can also now be set on a specific auction. This is useful for example on infinite scroll pages when contextual segments change, or when the publisher wishes to express the context of an instream video ad but not the display advertising. As part of this change the ortb2 object is now made a part of bid requests, instead of necesitating a getConfig call by an adapter. This has led to slight changes in many dozens of bid adapters and substantial changes to all of the RTD adapters. 

## Misc changes

An undocumented feature "Stored Auction Response" has been deprecated. 

The Prebid Server committee moved the ortb2 location of bidder parameters from `imp[].ext.BIDDER` to `imp[].ext.prebid.bidder.BIDDER`. PBS versions before [insert version number here], released on [insert release date or year here], are not compatible with Prebid 7+.

If you load Prebid.js twice on a page using the same global, the second load is now prevented unless you take steps to override this behavior. 


## Further Reading

+ [Publisher API Reference]({{site.baseurl}}/dev-docs/publisher-api-reference.html)
+ [First Party Data]({{site.baseurl}}/features/firstPartyData.html)
