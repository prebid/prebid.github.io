---
layout: page_v2
title: Prebid.js 11.0 Release Notes & Publisher API Changes
description: Description of the breaking changes included for Prebid.js 11.0
sidebarType: 1
---

# Prebid.js 11.0 Adapter Interface and Publisher API Changes

{:.no_toc}

This document describes the changes included for Prebid.js version 11.0.

* TOC
  {:toc}

## Publisher Summary

1. A number of obsolete modules have been removed (see list below).
2. Adpod is no longer supported.
3. PAAPI is no longer supported.
4. The `addAdUnits`, `bidAccepted`, and `seatNonBid` events have been removed.
5. Bids whose `mediaType` does not match their request's `mediaTypes` are now rejected as invalid.
6. The `storageControl` module now defaults to strict enforcement.
7. [setTargetingForGPTAsync](/dev-docs/publisher-api-reference/setTargetingForGPTAsync.html) no longer takes a `customSlotMatching` argument; the configuration options `bidViewability.customMatchFunction` and `gptPreAuction.customGptSlotMatching` have been removed. The replacement is a single new configuration option `customGptSlotMatching`. 
8. The way viewability is calculated and signaled has been overhauled.

## Adapter summary

1. A new utility function, `getAdUnitElement`, should be used to link an ad unit / bid request / bid response to its DOM element.
2. DNT (`navigator.doNotTrack`) is no longer supported. The `getDNT()` utility function now always returns `false`.
3. Typescript is now preferred over Javascript. New modules should provide types for their public interface. 

<a id="removed-modules"></a>

## Removed Modules

The following modules have been removed from Prebid.js as part of the 11.0 release:

{: .table .table-bordered .table-striped }

| Module                          | Notes                          |
|:--------------------------------|:-------------------------------|
| `adpod`                         |                                |
| `categoryTranslation`           | Adpod submodule                |
| `dfpAdServerVideo`              | Use `gamAdServerVideo` instead |
| `dfpAdpod`                      | Adpod submodule                |
| `dmdIdSystem`                   |                                |
| `express`                       |                                |
| `freeWheelAdserverVideo`        | Adpod submodule                |
| `gamAdpod`                      | Adpod submodule                |
| `intersectionRtdProvider`       |                                |
| `optableBidAdapter`             | No longer useful without PAAPI |
| `paapi`                         |                                |
| `paapiForGpt`                   |                                | 
| `topLevelPaapi`                 |                                |
| `quantcastBidAdapter`           |                                | 
| `quantcastIdSystem`             |                                |
| `ringieraxelspringerBidAdapter` |                                | 

## Removed events

The following events have been removed and will no longer trigger callbacks registered with [pbjs.onEvent](/dev-docs/publisher-api-reference/onEvent.html):

* `addAdUnits`: this event carried no information besides the fact that `pbjs.addAdUnits` was called. `auctionInit` and `beforeRequestBids` contain the ad units involved in each auction.           
* `bidAccepted`: use `bidResponse` instead.
* `seatNonBid`: use `pbsAnalytics` instead.

## Stricter mediaType enforcement

Bids that declare a `mediaType` not present in their ad unit's `mediaTypes` are now rejected as invalid. This validation can be turned off by setting `auctionOptions.rejectInvalidMediaTypes` to `false`.

Bids that do not declare any `mediaType` are assumed to be `'banner'`; you may require an explicit mediaType with `auctionOptions.rejectUnknownMediaTypes`. If enabled, bids that do not set `mediaType` will also be rejected as invalid. For example:

```javascript
pbjs.setConfig({
  auctionOptions: {
    rejectInvalidMediaTypes: false, // allow bids on the wrong format
    rejectUnknownMediaTypes: true   // disallow bids that do not declare their format
  }
})
```

## Strict storageControl enforcement

The [storageControl](/dev-docs/modules/storageControl.html) module now defaults to strict enforcement; including it will cause undisclosed storage use to fail instead of just logging a warning. You may revert to warning only with

```javascript
pbjs.setConfig({
  storageControl: {
    enforcement: 'off'
  }
})
```

## `customGptSlotMatching`

A new configuration option `customGptSlotMatching` is replacing the following:

* the second argument of [setTargetingForGPTAsync](/dev-docs/publisher-api-reference/setTargetingForGPTAsync.html);
* the `customGptSlotMatching` configuration option of [gptPreAuction](/dev-docs/modules/gpt-pre-auction.html);
* the `customMatchFunction` configuration option of [bidViewability](/dev-docs/modules/bidViewable.html).

<a id="viewability-overhaul"><a>

## Viewability overhaul

A number of changes were aimed at standardizing two related problems: viewability of an ad unit at the time an auction starts; and viewability of an ad that was rendered on the page.

### `adUnit.element` and `getAdUnitElement`

Many adapters attempt to calculate the position of an ad unit on the page so that they can include that information in their bid request. To facilitate this, 11.0 adds a new `element` configuration option for ad units that can be used to specify the page element it corresponds to. For example:

```javascript
pbjs.requestBids({
  adUnits: [{
    code: 'myAdUnit',
    element: document.querySelector('#ad-container')
    // ...
  }]
})
```

Adapters can retrieve the element using the `getAdUnitElement` utility function. If `element` is not specified for an ad unit it defaults to `document.getElementById(adUnit.code)`.

### Viewability after rendering

To determine viewability of an ad rendered on the page, publishers can choose one of two optional modules:

* [`bidViewability`](/dev-docs/modules/bidViewable.html) only works with GPT ad units, and relies on its `impressionViewable` events;
* [`bidViewabilityIO`](/dev-docs/modules/bidViewableIO.html) approximates the same viewability criteria (IAB's MRC 50%) using [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).
 
When a bid is deemed viewable, both modules now:

* fire a `bidViewable` event
* run the relevant adapter's `onBidViewable` method
* trigger "viewable-mrc50" (`event: 2`) event trackers in the bid's `eventtracker` array.
