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
- `attr` - Banned attributes
- `mediaTypes` - Banned bids of mediaTypes not present on adUnit

### Field configuration object 

{: .table .table-bordered .table-striped }
| Field          | Scope    | Type    | Description                                                                                             | Default |
| -------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------- | ------- |
| `enforce`      | optional | boolean | Specifies whether to enforce validation for the field                                                   | `true`  |
| `blockUnknown` | optional | boolean | Specifies whether it should reject the bid if the corresponding value in the bid metadata is undefined  | `true`  |

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

### Media types configuration

The new `mediaTypes` parameter allows you to block bids whose mediaType does not match any of the media types declared at the ad unit level.

### Disabling In-Banner video

To block bids containing In-Banner Video creatives [IAB Creative Attributes 6 and 7, as defined in the AdCOM 1.0 specification](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/main/AdCOM%20v1.0%20FINAL.md#list_creativeattributes), configure the Bid Response Filter module to reject these responses.

1. Restrict the ad unit to banner only and declare disallowed creative attributes (battr) directly in the ad unit definition:

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

2. Enable both the attr and mediaTypes filters in the bidResponseFilter configuration:

```javascript
pbjs.setConfig({
  bidResponseFilter: {
    attr: { enforce: true },
    mediaTypes: {
      banner: { enforce: true }
    }
  }
});
```