---
layout: bidder
title: Talkads
description: Talkads Prebid Bidder Adapter
biddercode: talkads
gdpr_supported: true
gvl_id: 1074
usp_supported: false
coppa_supported: false
media_types: banner, native
safeframes_ok: false
pbjs: true
pbs: false
prebid_member: false
sidebarType: 1
---

### Registration

The Talkads Adapter requires setup before beginning. Please contact us at www.natexo.com and register to the publisher side.

### Configuration

#### Prebid.js

The TalkAds adapter does not work without setting the correct tag ID and bidder URL.
These parameters are totally specific to each Publisher, you will receive them when contacting us.

### Bid Params

{: .table .table-bordered .table-striped }

| Name         | Scope    | Description                                                    | Example                                                 | Type           |
|--------------|----------|----------------------------------------------------------------|---------------------------------------------------------|----------------|
| `tag_id`     | required | The publisher tag id given by the Natexo team                  | `99`                                                    | `number`       |
| `bidder_url` | required | The publisher bidder url given by the Natexo team              | `'https://test.natexo-programmatic.com/tad/tag/prebid'` | `string`       |

#### Native example

```
var adUnits = [
    code: '/19968336/prebid_native_example_1',
    mediaTypes: {
        native: {
        }
    },
    bids: [{
        bidder: 'talkads',
        params: {
            tag_id: 0,
            bidder_url: 'https://d.natexo-programmatic.com/tad/tag/testbid',
        },
    }]
];
```

#### Banner example
```
var adUnits = [
    code: '/19968336/prebid_display_example_1',
    mediaTypes: {
      banner: {
        sizes: [[300, 250]]
      } 
    },
    bids: [{
        bidder: 'talkads',
        params: {
            tag_id: 0,
            bidder_url: 'https://d.natexo-programmatic.com/tad/tag/testbid',
        },
    }]
];
```
