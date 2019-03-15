---
layout: bidder
title: Improve Digital
description: Prebid Improve Digital Bidder Adaptor
biddercode: improvedigital
biddercode_longer_than_12: true
hide: true
gdpr_supported: true
media_types: native
---

### Send All Bids Ad Server Keys:
(truncated to 20 chars due to [DFP limit](https://support.google.com/dfp_premium/answer/1628457?hl=en#Key-values))

`hb_bidder_improvedig`
`hb_pb_improvedigital`
`hb_adid_improvedigit`
`hb_size_improvedigit`

### Bid params

Depending on your setup in our system, your placements will either have a globally-unique placement ID or a publisher-unique placement key as an identifier.  Therefore, to identify your placement you either need a placementId only, or a combination of publisherId and placementKey.

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                                                                | Example                                                                | Type      |
|----------------|----------|----------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|-----------|
| `placementId`  | optional | The placement ID from Improve Digital.                                                                                     | `1234567`                                                              | `integer` |
| `publisherId`  | optional | Your publisher ID.  This is only required when using a placementKey                                                        | `950`                                                                  | `integer` |
| `placementKey` | optional | The placement key for your placement.  Must be used with `publisherId`.                                                    | `'myMainBannerPlacement300x200'`                                       | `string`  |
| `keyValues`    | optional | Contains one or more key-value pairings for key-value targeting                                                            | `{ testKey1: ['testValueA'], testKey2: ['testValueB', 'testValueC'] }` | `object`  |
| `size`         | optional | Single size filter.  Where a placement supports multiple sizes, this forces the response to feature only one of the multiple sizes. This parameter is ignored when `usePrebidSizes` is enabled (see `Sizes` section below) | `{ w:300, h:250 }`                                                     | `object`  |

### Configuration

#### Single-Request

By default, the adapter sends one request for each ad unit to Improve Digital's ad server. For example, if there are 4 Prebid ad units defined on the page, you'll see 4 calls out to ad.360yield.com/hb.

The Improve Digital adapter supports `Single Request` mode, where all ad unit requests are made in a single call to ad.360yield.com/hb. To turn this feature on, call `setConfig`:
```
pbjs.setConfig({
   improvedigital: {singleRequest: true}
});
```

#### Sizes

By default, the adapter doesn't send Prebid ad unit sizes to Improve Digital's ad server and the sizes defined for each placement in the Polaris platform will be used. If the ad server should only respond with creative sizes as defined in Prebid ad unit configuration, turn on `usePrebidSizes` adapter parameter like this:
```
pbjs.setConfig({
   improvedigital: {usePrebidSizes: true}
});
```

<a name="improvedigital-examples" />

### Examples

#### Configuration With placementId

    var adUnits = [{
        code: 'div-gpt-ad-1499748733608-0',
        sizes: [[600, 290]],
        bids: [
            {
                bidder: 'improvedigital',
                params: {
                    placementId:1053688
                }
            }
        ]
    }];

#### Configuration With publisherId/placementKey

    var adUnits = [{
        code: 'div-gpt-ad-1499748733608-0',
        sizes: [[600, 290]],
        bids: [
            {
                bidder: 'improvedigital',
                params: {
                    placementKey:'',
                    publisherId:
                }
            }
        ]
    }];

#### Configuration With PlacementId and Key-Values

    var adUnits = [{
        code: 'div-gpt-ad-1499748733608-0',
        sizes: [[600, 290]],
        bids: [
            {
                bidder: 'improvedigital',
                params: {
                   placementId:1053689,
                    keyValues: {
                        testKey1: ["testValueA"],
                        testKey2: ["testValueB", "testValueC"]
                    }
                }
            }
        ]
    }];

#### Configuration With PlacementId and Size Filter

    var adUnits = [{
        code: 'div-gpt-ad-1499748733608-0',
        sizes: [[600, 290]],
        bids: [
            {
                bidder: 'improvedigital',
                params: {
                    placementId:1053687,
                    size: {
                        w:300,
                        h:300
                    }
                }
            }
        ]
    }];
