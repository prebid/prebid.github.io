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
| `mediaTypes.rejectIbvBannerOnMultiFormat` | optional | boolean | Reject banner bids on multi-format in-banner video ad units. See [Disabling In-Banner video](#disabling-in-banner-video) | `false` |

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

### Disabling In-Banner video

To block bids containing In-Banner Video creatives [IAB Creative Attributes 6 and 7, as defined in the AdCOM 1.0 specification](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/main/AdCOM%20v1.0%20FINAL.md#list_creativeattributes), configure the Bid Response Filter module to reject these responses.

Restrict the ad unit to banner only and declare disallowed creative attributes (battr) directly in the ad unit definition:

```javascript
const adUnit = {
  code: 'banner-adunit',
  mediaTypes: {
    banner: {
      battr: [6, 7] // Block In-Banner Video creative attributes
    }
  },
  bids: [ /* bidder configs */ ]
};
```

Enable both the attr and mediaTypes filters in the bidResponseFilter configuration:

```javascript
pbjs.setConfig({
  bidResponseFilter: {
    attr: { enforce: true },
    mediaTypes: { enforce: true }
  }
});
```

#### Multi-format ad units with in-banner video

Since Prebid.js 11.8, setting `mediaTypes.rejectIbvBannerOnMultiFormat` to `true` rejects bids whose `bid.meta.mediaType` is `'banner'` on ad units that declare more than one media type and have `mediaTypes.video.context` set to `'inbanner'`. This only applies when `mediaTypes.enforce` is `true`.

```javascript
pbjs.setConfig({
  bidResponseFilter: {
    mediaTypes: {
      enforce: true,
      rejectIbvBannerOnMultiFormat: true
    }
  }
});
```
