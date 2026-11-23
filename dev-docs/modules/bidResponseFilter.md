---
layout: page_v2
page_type: module
title: Module - Bid response filter
description: Validates bid's ortb2 data against its meta data
module_code : bidResponseFilter
display_name : Bid Response Filter
enable_download : true
sidebarType : 1

---

# Bid Response Filter

## Overview

This optional module will trigger validation of each bid on the bid response. Validation of a particular bid is based on its `ortb2` values compared to the values in the `bid.meta`. The module configuration allows you to specify whether to enforce validation of particular fields or not. It also lets to specify if the bid should be rejected if selected field metadata value is not present. 

## Configuration

Fields that can be configured:

- `cat` - Banned categories ids
- `adv` - Banned advertiser domains
- `attr` - Banned creative attributes
- `mediaTypes` - Banned bids of mediaTypes not present on adUnit
- `unauthorizedVideo` - Detect video in banner bids that is not allowed or not declared. See [Detecting unauthorized video](#detecting-unauthorized-video)

### Field configuration object

{: .table .table-bordered .table-striped }
| Field | Scope | Type | Description | Default |
| --- | --- | --- | --- | --- |
| `enforce` | optional | boolean | Specifies whether to enforce validation for the field | `true` |
| `blockUnknown` | optional | boolean | Specifies whether it should reject the bid if the corresponding value in the bid metadata is undefined | `true` for `cat`, `adv` and `mediaTypes`; `false` for `attr` |

{: .alert.alert-info :}
Since Prebid.js 11.21, `attr.blockUnknown` defaults to `false`. In earlier versions it defaulted to `true`.

Some fields accept additional options:

{: .table .table-bordered .table-striped }
| Field | Scope | Type | Description | Default |
| --- | --- | --- | --- | --- |
| `cat.bcat` | optional | array of strings | Blocked category IDs, checked in addition to `ortb2.bcat`. See [Module-level blocklists](#module-level-blocklists) | none |
| `cat.cattax` | optional | number | Category taxonomy of `cat.bcat` | `1` |
| `adv.badv` | optional | array of strings | Blocked advertiser domains, checked in addition to `ortb2.badv` | none |
| `attr.battr` | optional | array of numbers | Blocked creative attribute IDs, checked in addition to the ad unit's `battr` | none |
| `mediaTypes.rejectIbvBannerOnMultiFormat` | optional | boolean | Reject banner bids on multi-format in-banner video ad units. See [Blocking in-banner video](#blocking-in-banner-video) | `false` |

### How bids are validated

- **`cat`**: with `enforce: true`, the bid is rejected when `bid.meta.primaryCatId` or any of `bid.meta.secondaryCatIds` is in `ortb2.bcat` and `bid.meta.cattax` matches `ortb2.cattax` (both default to `1`). With `blockUnknown: true`, the bid is rejected when `bid.meta.primaryCatId` is missing or `bid.meta.cattax` does not match.
- **`adv`**: with `enforce: true`, the bid is rejected when any of `bid.meta.advertiserDomains` is in `ortb2.badv`. With `blockUnknown: true`, the bid is rejected when `bid.meta.advertiserDomains` is missing or empty.
- **`attr`**: `bid.meta.attr` is an array of creative attribute IDs. The check only runs when `attr.enforce` is `true`. The bid is rejected when any of `bid.meta.attr` is in the `battr` list for the bid's media type, taken from the bid request's `ortb2Imp[mediaType].battr`, falling back to the ad unit's `ortb2Imp[mediaType].battr` (`mediaTypes[mediaType].battr` on the ad unit is copied there). With `blockUnknown: true`, the bid is also rejected when `bid.meta.attr` is missing or empty.
- **`mediaTypes`**: see [Media types configuration](#media-types-configuration).

### Example module configuration

```javascript
    pbjs.setConfig({
        bidResponseFilter: {
            cat: {
               blockUnknown: false // setting only one of parameters will keep the other one as default
            },
            adv: {
               enforce: false
            },
            attr: {
               enforce: false,
               blockUnknown: false
            },
            mediaTypes: {
                enforce: true,
                blockUnknown: true
            }
        }
    });
```

### Module-level blocklists

Since Prebid.js 11.22, blocklists can also be declared directly in the module configuration with `cat.bcat` (and optionally `cat.cattax`), `adv.badv` and `attr.battr`. This is useful for long lists that you don't want to send in every bid request.

When a module-level list is set, each bid is validated twice: once against the module-level list and once against the list from the request (`ortb2.bcat` / `ortb2.badv`, or the ad unit's `battr`). The bid is rejected if either check rejects it, so in effect the two lists are combined. The `enforce` and `blockUnknown` settings of the field apply to both checks.

`cat.cattax` applies only to `cat.bcat`; `ortb2.bcat` is still matched using `ortb2.cattax`. If `cat.blockUnknown` is `true` and `cat.cattax` differs from `ortb2.cattax`, every bid will fail one of the two checks, so keep them consistent.

```javascript
pbjs.setConfig({
  bidResponseFilter: {
    cat: { bcat: ['IAB25', 'IAB26'] },
    adv: { badv: ['domain1.com', 'domain2.com'] },
    attr: { enforce: true, battr: [6, 7] }
  }
});
```

### Media types configuration

The new `mediaTypes` parameter allows you to block bids whose mediaType does not match any of the media types declared at the ad unit level.

With `enforce: true`, the bid is rejected when `bid.meta.mediaType` is not one of the ad unit's media types. With `blockUnknown: true`, the bid is rejected when `bid.meta.mediaType` is missing.

### Blocking in-banner video

In-banner video (IBV) is a video creative that plays inside a display slot. In [AdCOM 1.0 creative attributes](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/main/AdCOM%20v1.0%20FINAL.md#list_creativeattributes) it is attribute `6` (In-Banner Video Ad, auto-play) or `7` (In-Banner Video Ad, user-initiated).

Blocking it takes two steps:

1. Declare `battr: [6, 7]` on the ad unit, so bidders are asked not to return IBV.
2. Enable the `attr` check in this module, so a bid that returns IBV anyway is rejected.

`battr` on the ad unit is only a request. Bidders that read `imp.banner.battr` (including adapters built on the ORTB converter, and Prebid Server) pass it on, but nothing makes a demand partner honor it. The module is what enforces it, and it can only act on what the bid declares in `bid.meta.attr`.

#### Turn off the checks you don't need

Enabling the module turns on all of its checks. `cat` and `adv` default to `enforce: true` and `blockUnknown: true`, so a bid with no `bid.meta.primaryCatId`, or no `bid.meta.advertiserDomains`, is rejected. Many bids carry neither. If you only want to block IBV, set both `enforce` and `blockUnknown` to `false` for `cat` and `adv`: `blockUnknown` rejects bids on its own, even when `enforce` is `false`.

`mediaTypes` also defaults to `blockUnknown: true`, which rejects every bid without `bid.meta.mediaType`. Adapters aren't required to set it and Prebid.js doesn't fill it in, so the examples below set `mediaTypes.blockUnknown: false`. Keep `true` only if all your bidders set `bid.meta.mediaType`.

#### Step 1: declare battr on the ad unit

Set `battr` on each media type that can carry the creative. For a banner-only ad unit:

```javascript
const adUnit = {
  code: 'banner-adunit',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]],
      battr: [6, 7] // In-Banner Video, auto-play and user-initiated
    }
  },
  bids: [ /* bidder configs */ ]
};
```

`mediaTypes.banner.battr` is copied to `ortb2Imp.banner.battr`, which is where bidders and this module read it.

#### Step 2: reject IBV that a bid declares

With the ad unit above, this configuration rejects any banner bid whose `bid.meta.attr` contains `6` or `7`. Category and advertiser-domain checks are off, so they don't reject other bids:

```javascript
pbjs.setConfig({
  bidResponseFilter: {
    cat: { enforce: false, blockUnknown: false },
    adv: { enforce: false, blockUnknown: false },
    attr: { enforce: true },
    mediaTypes: { enforce: true, blockUnknown: false }
  }
});
```

To block IBV on every ad unit without adding `battr` to each one, list the attributes in the module configuration with `attr.battr`. The module checks it in addition to the ad unit's `battr` (see [Module-level blocklists](#module-level-blocklists)). Bidders are only asked not to send IBV where the ad unit itself declares `battr`.

```javascript
pbjs.setConfig({
  bidResponseFilter: {
    cat: { enforce: false, blockUnknown: false },
    adv: { enforce: false, blockUnknown: false },
    attr: { enforce: true, battr: [6, 7] },
    mediaTypes: { enforce: true, blockUnknown: false }
  }
});
```

#### Banner ad units: IBV that is not declared

A bid that returns IBV without setting `bid.meta.attr` passes the check above, because `attr.blockUnknown` defaults to `false`. Many adapters don't populate `bid.meta.attr`.

Setting `attr.blockUnknown: true` closes that gap by rejecting every bid that doesn't declare its creative attributes:

```javascript
pbjs.setConfig({
  bidResponseFilter: {
    cat: { enforce: false, blockUnknown: false },
    adv: { enforce: false, blockUnknown: false },
    attr: { enforce: true, blockUnknown: true },
    mediaTypes: { enforce: true, blockUnknown: false }
  }
});
```

This also rejects ordinary display bids from any bidder that doesn't send `attr`, so check which of your bidders populate it before you turn it on. The module does not inspect the creative markup, so an IBV creative that a bid doesn't declare can only be caught this way.

#### Multi-format ad units

On an ad unit with both `banner` and `video`, video bids are checked against `mediaTypes.video.battr` and banner bids against `mediaTypes.banner.battr`. To accept video only as a video bid, and refuse IBV that comes back as a banner bid, declare `battr` on the banner media type:

```javascript
const adUnit = {
  code: 'multiformat-adunit',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]],
      battr: [6, 7]
    },
    video: {
      context: 'outstream',
      playerSize: [300, 250],
      mimes: ['video/mp4'],
      protocols: [2, 3, 5, 6]
    }
  },
  bids: [ /* bidder configs */ ]
};
```

With the step 2 configuration, a banner bid on this ad unit that declares attribute `6` or `7` is rejected, and video bids are unaffected.

If the ad unit declares the video slot as in-banner (`mediaTypes.video.context: 'inbanner'`), `mediaTypes.rejectIbvBannerOnMultiFormat` goes further. It rejects every bid whose `bid.meta.mediaType` is `'banner'` on that ad unit, declared IBV or not, so the slot accepts only video bids:

```javascript
pbjs.setConfig({
  bidResponseFilter: {
    cat: { enforce: false, blockUnknown: false },
    adv: { enforce: false, blockUnknown: false },
    attr: { enforce: true },
    mediaTypes: {
      enforce: true,
      blockUnknown: false,
      rejectIbvBannerOnMultiFormat: true
    }
  }
});
```

`rejectIbvBannerOnMultiFormat` is available since Prebid.js 11.8. It only applies when `mediaTypes.enforce` is `true`, the ad unit declares more than one media type, and `mediaTypes.video.context` is `'inbanner'`. It identifies banner bids by `bid.meta.mediaType`, so a bid that doesn't set it isn't rejected by this check.

### Detecting unauthorized video

Since Prebid.js 11.54, the module can look for video in banner bids and report it, which catches in-banner video (IBV) that the checks above miss because the bid doesn't declare it in `bid.meta.attr`. Detection is off by default.

A banner bid that shows video is unauthorized when either:

- **`blocked`**: the `battr` that applies to the bid (the ad unit's `ortb2Imp.banner.battr`, or the module's `attr.battr`) contains `6` or `7`, or
- **`undeclared`**: `bid.meta.attr` does not contain `6` or `7`.

Banner bids that declare `6` or `7` and are not blocked are not checked.

```javascript
pbjs.setConfig({
  bidResponseFilter: {
    cat: { enforce: false, blockUnknown: false },
    adv: { enforce: false, blockUnknown: false },
    mediaTypes: { enforce: true, blockUnknown: false },
    unauthorizedVideo: {
      enabled: true,
      reject: false,
      sampleRate: 1,
      patterns: ['player.example.com/loader.js'],
      observe: {
        sampleRate: 0.1,
        duration: 3000
      }
    }
  }
});

pbjs.onEvent('unauthorizedVideo', ({ bid, adUnitCode, stage, reason, signals }) => {
  // report to your own endpoint
});
```

`unauthorizedVideo` takes these options:

{: .table .table-bordered .table-striped }
| Field | Scope | Type | Description | Default |
| --- | --- | --- | --- | --- |
| `enabled` | optional | boolean | Turn on detection | `false` |
| `reject` | optional | boolean | Reject bids whose markup shows video, instead of only reporting them. Only applies to the markup scan | `false` |
| `sampleRate` | optional | number | Fraction (0 to 1) of banner bids whose markup is scanned | `1` |
| `patterns` | optional | array of strings or RegExps | Extra markup patterns that indicate video, such as a video player's script URL. Strings match case-insensitively anywhere in the markup | none |
| `observe.sampleRate` | optional | number | Fraction (0 to 1) of rendered banner bids that are watched for video after rendering | `0` (off) |
| `observe.duration` | optional | number | How long, in milliseconds, to watch a rendered ad. Capped at `10000` | `3000` |

Enabling the module turns on its other checks too. The example turns off the `cat` and `adv` checks, which otherwise reject bids that don't declare categories or advertiser domains, and keeps `mediaTypes` from rejecting bids without `bid.meta.mediaType`; see [Turn off the checks you don't need](#turn-off-the-checks-you-dont-need).

#### Markup scan

When a banner bid with markup (`bid.ad`) arrives, the module searches the markup for:

- a `<video>` element,
- VAST XML (a `<VAST>` element),
- the Google IMA SDK loader (`imasdk.googleapis.com/js/sdkloader/`),
- any of the configured `patterns`.

This is a text search, so it is a heuristic: it misses video that a script loads from elsewhere, and it can match these strings in comments or script text. Bids that only have `adUrl` are not scanned. If `reject` is `true`, a bid that matches is rejected with the reason `Unauthorized video`, and `bidRejected` fires as usual.

#### Post-render check

With `observe.sampleRate` above `0`, the module also watches a sample of rendered banner bids. After `adRenderSucceeded`, it checks the document the ad was rendered into, and the same-origin frames inside it, for a `<video>` element, and keeps watching for one to be added for `observe.duration` milliseconds. It never delays rendering, and it can only report, not reject.

It only works when Prebid.js can reach the document. Ads rendered in cross-origin frames, SafeFrames, or by Prebid Universal Creative through `postMessage` (where `adRenderSucceeded` has no `doc`) are skipped, as are frames on another origin inside the ad.

#### unauthorizedVideo event

Each detection fires an `unauthorizedVideo` event, at most once per bid for each stage:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
| --- | --- | --- |
| `bid` | object | The bid |
| `adUnitCode` | string | Ad unit code |
| `stage` | string | `'bidResponse'` for the markup scan, `'render'` for the post-render check |
| `reason` | string | `'blocked'` or `'undeclared'` |
| `signals` | array of strings | What was found: `videoElement`, `vast`, `imaSdk`, or `pattern:<pattern>` for a configured pattern |

#### Reporting unauthorized video

The `undeclared` reason usually means the bidder's adapter isn't passing the creative attributes through: the bid response carries `attr` (or the bidder could send it), but the adapter doesn't set `bid.meta.attr`. That gap is what lets in-banner video past the `attr` check in [Banner ad units: IBV that is not declared](#banner-ad-units-ibv-that-is-not-declared).

When you see `unauthorizedVideo` events for a bidder, [open an issue on the Prebid.js repository](https://github.com/prebid/Prebid.js/issues) naming the bidder, the `reason` and `signals` from the event, and a sample creative or bid response if you can share one. The adapter can then be fixed to read the bidder's creative attribute declarations into `bid.meta.attr`, so the `attr` check can block those bids without `attr.blockUnknown: true`. Raise it with the bidder too, since the declaration has to come from their side.
