---
layout: bidder
title: Improve Digital
description: Prebid Improve Digital Bidder Adaptor
biddercode: improvedigital
pbjs: true
pbs: true
gdpr_supported: true
userIds: criteo, id5Id
usp_supported: true
media_types: banner, native, video
schain_supported: true
gvl_id: 253
pbs_app_supported: true
---

### Bid params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                                                                | Example                                                                | Type      |
|----------------|----------|----------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|-----------|
| `placementId`  | required | The placement ID from Improve Digital.                                                                                     | `1234567`                                                              | `integer` |
| `keyValues`    | optional | Contains one or more key-value pairings for key-value targeting                                                            | `{ testKey1: ['testValueA'], testKey2: ['testValueB', 'testValueC'] }` | `object`  |
| `size`         | optional | Single size filter.  Where a placement supports multiple sizes, this forces the response to feature only one of the multiple sizes. This parameter is ignored when `usePrebidSizes` is enabled (see the [Sizes](#improvedigital-sizes) section below). | `{ w:300, h:250 }`                                                     | `object`  |
| `bidFloor`  | optional | Bid floor price | `0.01` | `float` |
| `bidFloorCur`  | optional | Bid floor price currency. Supported values: USD (default), EUR, GBP, AUD, DKK, SEK, CZK, CHF, NOK | `'USD'` | `string` |
| `video`    | optional | Object with video parameters. See the [Video params](#improvedigital-video) section below for details. | | `object` |

<a name="improvedigital-video"></a>

### Video params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description                                    | Example                                   | Type            |
|------------------|----------|------------------------------------------------|-------------------------------------------|-----------------|
| `skip`           | optional | Indicates if the player will allow the video to be skipped. | `1` | `integer` |
| `skipmin`        | optional | Videos of total duration greater than this number of seconds can be skippable. | `15` | `integer` |
| `skipafter`      | optional | Number of seconds a video must play before skipping is enabled. | `5` | `integer` |

### Configuration

#### Single-Request

By default, the adapter sends one request for each ad unit to Improve Digital's ad server. For example, if there are 4 Prebid ad units defined on the page, you'll see 4 calls out to ad.360yield.com/hb.

The Improve Digital adapter supports `Single Request` mode, where all ad unit requests are made in a single call to ad.360yield.com/hb. To turn this feature on, call `setConfig`:
```
pbjs.setConfig({
   improvedigital: {singleRequest: true}
});
```

<a name="improvedigital-sizes"></a>

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
