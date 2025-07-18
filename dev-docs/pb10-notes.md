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
2. The legacy method of native targeting keys, `sendTargetingKeys`, has been removed.
3. `pbadslot` has been removed from the preAuction module. Use `ortb2Imp.ext.gpid` instead.
4. The API methods `getBidResponses` and `getNoBidsForAdUnitCode` now return arrays of bids.
5. TypeScript support has landed and Node.js 20+ is required to build.
6. Using Prebid as an NPM dependency no longer requires using Babel or Prebid's Babel settings.
7. `targetingControls.allBidsCustomTargeting` now defaults to `false`, this prevents custom targeting values from being set for non-winning bids.
8. Storage use disclosures can now be enforced and catalogued 

## Removed Modules

The following modules have been removed from Prebid.js as part of the 10.0 release. The `dfp` modules are still there but now import the `gam` modules. Publishers building with one of them will need to point to its replacement or remove the module from their build.

{: .table .table-bordered .table-striped }

| Module | Replacement |
|:-----------------------------|:-------------------------|
| dfpAdServerVideo | gamAdServerVideo |
| dfpAdPod | gamAdPod |
| telariaBidAdapter | |
| eclickads | eclick |
| imdsBidAdapter | advertisingBidAdapter |
| cleanmedianetBidAdapter | gamoshiBidAdapter |
| kueezBidAdapter | kueezRTBBidAdapter |
| saambaaBidAdapter | advangelistBidAdapter |
| adoceanBidAdapter | |
| radsBidAdapter | |
| freewheelsspBidAdapter | fwsspBidAdapter |
| akamaiDapRtdProvider | symetriRtdProvider |
| bidwatchAnalyticsAdapter | oxxionAnalyticsAdapter |
| conversantAnalyticsAdapter | |
| konduitAnalyticsAdapter | |
| konduitWrapper | |
| globalsunBidAdapter | global_sunBidAdapter |
| verizonMediaIdSystem | yahooConnectId |
| loglyliftBidAdapter | |
| apnPspParamsConverter | |
| yieldmoSyntheticInventoryModule | |
| adsinteractiveBidAdapter | ads_interactiveBidAdapter |
| admanBidAdapter | |
| bridgeuppBidAdapter | sonaradsBidAdapter |
| BTBidAdapter | blockthroughBidAdaper |
| brightMountainMediaBidAdapter | bmtmBidAdapter |
| vubleAnalyticsAdapter | |
| serverbidServerBidAdapter | |
| gothamAdsBidAdapter | intenzeBidAdapter |
| growadvertisingBidAdapter | growAdsBidAdapter |
| incrxBidAdapter | incrementxBidAdapter |
| viantOrtbBidAdapter | viantBidAdapter |
| zetaBidAdapter | zeta_globalBidAdapter |
| fanAdapter | fanBidAdapter |
| cadentaperturemxBidAdapter | cadent_aperture_mxBidAdapter |
| epomDspBidAdapter | epom_dspBidAdapter |
| pubwiseBidAdapter | pwbidBidAdapter |

## Consent and Data Handling

* **Default behavior for publisher purpose permissions in the TCF control module now enables purposes P4, P7 and special feature 1.**
* Global vendor list IDs have been filled in for a number of bidder and analytics modules.
* **A new activity control, and purpose 1 enforcement, prevent bidder endpoint access to third party storage via set-cookie headers.**
* **The storage disclosures module enables publishers to identify all keys used in the first party and deny access to undisclosed keys. A build artifact is produced to help provide clear and concise information on device storage use for e-privacy directive adherence.**

## User Id Module

* **The user ID module introduces an `enforceStorageType` flag, which why by default warn when a userId submodule accesses the incorrect storage type. Future versions will prevent access.**
* **`userId` accepts two new config flags, autoRefresh (default false) and retainConfig (default true).** With `autoRefresh: true`, `userId` automatically refreshes IDs for which the configuration changed (either a previously configured module now has different config, or a new module was configured). With `retainConfig: false`, `userId` "forgets" userIds that were previously configured, but are missing from `userSync.userIds[]` in a later setConfig.
* For bidders: `bid.userId` is no longer populated; bid modules should rely on `userIdAsEids` or `user.ext.eids`. Several bid adapters made this change in the 10.0 release; others in 9.x in anticipation.
* Eids in `user.eids` are appended to the array in `user.ext.eids` and de-duplicated.

## TypeScript and Build Updates

* **TypeScript files are now accepted in the code base. Tooling and linting were updated accordingly.**
* The build target browser use statistics are now updated as part of the build process.
* Tests now target Chrome 109 as the minimum version. `not dead` was added to the babel target.
* **The `pbYield` helper was added and greedy rendering is disabled by default.**

## API Changes

* The `ADPOD` mediatype has received a deprecation warning.
* Bid response helper methods (`getBidResponses*` and `getNoBids*`) now return an array which also exposes the array under `.bids` for backward compatibility.
* `getHighestUnusedBidResponseForAdUnitCode` returns null instead of an empty object when no suitable bid exists.
* **Schain data now lives under `ortb2.source.ext.schain` and is normalized when provided in first party data. The module is now superfluous for publishers transitioned to seeing this object directly and will be removed in the future.**
* **Native ad units no longer support `sendTargetingKeys`, and native key-value pairs can no longer be sent to the ad server. Please migrate to a newer setup.**
* The `createBid` API has been removed.
* The `statusMessage` and `getStatusCode()` properties were removed from bid objects.
* **The DFP modules have been renamed to GAM modules (`gamAdServerVideo`, `gamAdpod`, etc.). Please migrate to the new names.**
* **Default configuration of various PBS Host companies has been removed. The PBS adapter now requires an explicit endpoint in its configuration.**
* Support for the legacy `pbadslot` field has been removed from all utilities and adapters.
* All public API methods have a log message in debug mode.
* **`mediatypes.banner` params that match to imp[].banner are type checked**

## Further Reading

* [Publisher API Reference](https://docs.prebid.org/dev-docs/publisher-api-reference.html)
* [First Party Data](https://docs.prebid.org/features/firstPartyData.html)
