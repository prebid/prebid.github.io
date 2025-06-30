---
layout: page_v2
title: Prebid.js 10.0 Release Notes & Publisher API Changes
description: Description of the breaking changes included for Prebid.js 10.0
sidebarType: 1
---

# Prebid.js 10.0 Bidder Interface and Publisher API Changes

{:.no_toc}

This document describes the changes included for Prebid.js version 10.0.

* TOC
{:toc}

## Publisher Summary

1. A large number of obsolete modules have been removed. Many modules have changed name. See below for the list.
2. The legacy method of native targeting keys has been removed.
3. `pbadslot` has been removed from the . Use `ortb2Imp.ext.gpid` instead.
4. The API methods `getBidResponses` and `getNoBidsForAdUnitCode` now return arrays of bids.
5. TypeScript support has landed and Node.js 20+ is required to build.
6. `targetingControls.allBidsCustomTargeting` now defaults to `false`.
7. Many modules were renamed and minor APIs updated. Details follow.
8. Storage use disclosures can now be enforced and catalogued 

## Removed Modules

The following modules have been removed from Prebid.js as part of the 10.0 release. Publishers building with one of them will need to point to its replacement or remove the module from their build.

{: .table .table-bordered .table-striped }

| Module | Replacement |
|:-----------------------------|:-------------------------|
| telariaBidAdapter | |
| cleanmedianetBidAdapter | |
| kueezBidAdapter | |
| saambaaBidAdapter | |
| adoceanBidAdapter | |
| radsBidAdapter | sonaradsBidAdapter |
| freewheelsspBidAdapter | |
| akamaiDapRtdProvider | |
| bidwatchAnalyticsAdapter | oxxionAnalyticsAdapter |
| conversantAnalyticsAdapter | |
| konduitAnalyticsAdapter | |
| konduitWrapper | |
| globalsunBidAdapter | |
| verizonMediaIdSystem | |
| loglyliftBidAdapter | |
| yieldmoSyntheticInventoryModule | |
| adsinteractiveBidAdapter | ads_interactiveBidAdapter |
| admanBidAdapter | |
| bridgeuppBidAdapter | |
| BTBidAdapter | |
| brightMountainMediaBidAdapter | |
| epomDspBidAdapter | epom_dspBidAdapter |
| cadentApertureMXBidAdapter | cadent_aperture_mxBidAdapter |
| eclickadsBidAdapter | eclickBidAdapter |
| gothamadsBidAdapter | |
| growadvertisingBidAdapter | advertisingBidAdapter |
| imdsBidAdapter | |
| incrxBidaAdapter | incrementxBidAdapter |
| kueezBidAdapter | |
| pubwiseBidAdapter | |
| viantOrtbBidAdapter | viantBidAdapter |
| zetaBidAdapter | zeta_globalBidAdapter |
 
## Consent and Data Handling

* Default behavior for publisher purpose permissions in the TCF control module now enables purposes P4, P7 and special feature 1.
* Global vendor list IDs have been filled in for a number of bidder and analytics modules.
* The user ID module introduces an `enforceStorageType` flag alongside `autoRefresh` and `retainConfig` options.
* A new activity control, and purpose 1 enforcement, prevent bidder endpoint access to third party storage via set-cookie headers.
* The storage disclosures module enables publishers to identify all keys used in the first party and deny access to undisclosed keys. A build artifact is produced to help provide clear and concise information on device storage use for e-peivacy directive adherence.

## TypeScript and Build Updates

* TypeScript files are now accepted in the code base. Tooling and linting were updated accordingly.
* Build targets include `not dead` browsers and the gulp tasks were modernized.
* The `pbYield` helper was added and greedy rendering is disabled by default.

## API Changes

* The deprecated `createBid` helper and bid `statusMessage` fields were removed.
* `bid.userId` is no longer populated; modules should rely on `userIdAsEids`.
* Bid response helper methods (`getBidResponses*` and `getNoBids*`) now return an array which also exposes the array under `.bids` for backward compatibility.
* Schain data now lives under `ortb2.source.ext.schain` and is normalized when provided in first party data. The module is now superfluous for publishers transitioned to seeing this object directly and will be removed in the future.
* Native adapters no longer send legacy targeting keys.

## Ad Server Updates

* The DFP modules have been renamed to GAM modules (`gamAdServerVideo`, `gamAdpod`, etc.).
* Support for the legacy `pbadslot` field has been removed from all utilities and adapters.

## Miscellaneous Changes

* Several adapters were renamed (e.g. EClickAds to eClick, IMDS to advertising, gothamads to intenze, fanAdapter to fanBidAdapter).
* The build includes additional validation for banner parameters and request credentials.
* Bidder aliases may not include the word `BidAdapter`.
* Many lint fixes and test updates were made across modules.

## Further Reading

* [Publisher API Reference](/dev-docs/publisher-api-reference.html)
* [First Party Data](/features/firstPartyData.html)
