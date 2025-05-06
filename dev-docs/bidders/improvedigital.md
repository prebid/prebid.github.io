---
layout: bidder
title: Improve Digital
description: Prebid Improve Digital Bidder Adaptor
biddercode: improvedigital
pbjs: true
pbs: true
coppa_supported: true
gpp_supported: true
tcfeu_supported: true
usp_supported: true
userIds: all
media_types: banner, native, video
schain_supported: true
gvl_id: 253
pbs_app_supported: true
floors_supported: true
sidebarType: 1
---

<a name="improvedigital-params"></a>

### Bid params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                                                                | Example                                                                | Type      |
|----------------|----------|----------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|-----------|
| `placementId`  | required | The placement ID from Improve Digital.                                                                                     | `1234567`                                                              | `integer` |
| `publisherId`  | required | The publisher ID from Improve Digital.                                                                                     | `4567`                                                              | `integer` |
| `keyValues`    | optional | Contains one or more key-value pairings for key-value targeting                                                            | `{ testKey1: ['testValueA'], testKey2: ['testValueB', 'testValueC'] }` | `object`  |
| `bidFloor`  | optional | Bid floor price | `0.01` | `float` |
| `bidFloorCur`  | optional | Bid floor price currency. Supported values: USD (default), EUR, GBP, AUD, DKK, SEK, CZK, CHF, NOK | `'USD'` | `string` |
| `extend`  | optional | See the [Extend mode section](#improvedigital-extend)  | `true` | `boolean` |

### Configuration

<a name="improvedigital-sizes"></a>

#### Sizes

By default, the adapter sends Prebid ad unit sizes to Improve Digital's ad server. If the ad server should only respond with creative sizes as defined for each placement in the Origin platform, turn off `usePrebidSizes` adapter parameter like this:

```javascript
pbjs.setConfig({
    improvedigital: { usePrebidSizes: false }
});
```

<a name="improvedigital-extend"></a>

#### Extend Mode

Improve Digital Extend mode provides publishers with access to additional demand from other SSPs. Before enabling please contact our team for more information.
The Extend mode can be enabled:

* per ad unit via the `extend` [bid param](#improvedigital-params)
* for all ad units via `setConfig()`:

```javascript
pbjs.setConfig({
    improvedigital: {
        extend: true
    }
});
```

<a name="improvedigital-multibid"></a>

#### MultiBid

Improve Digital supports Prebid's MultiBid feature. More on enabling MultiBid can be found here: [MultiBid](https://docs.prebid.org/dev-docs/modules/multibid.html). An example of how to enable MultiBid for Improve Digital:

```javascript
pbjs.setConfig({
    multibid: [{
        bidder: "improvedigital",
        maxBids: 3,
    }]
});
```

<a name="improvedigital-examples"></a>

### Examples

Examples of different ad unit formats can be found in [Prebid.js ad unit reference](https://docs.prebid.org/dev-docs/adunit-reference.html#adUnit-banner-example). Improve Digital bidder must be added in the ad unit's `bids` array. Example:  

```javascript
pbjs.addAdUnits({
    code: 'banner1',
    sizes: [[728, 90], [970, 250]],
    bids: [
        {
            bidder: 'improvedigital',
            params: {
                placementId: 1111111,
                publisherId: 1234
            }
        }
    ]
});
```

#### Example for Key-Values

```javascript
pbjs.addAdUnits({
    code: 'banner1',
    sizes: [[600, 290]],
    bids: [
        {
            bidder: 'improvedigital',
            params: {
                placementId: 1111111,
                publisherId: 1234,
                keyValues: {
                    testKey1: ["testValueA"],
                    testKey2: ["testValueB", "testValueC"]
                }
            }
        }
    ]
});
```
