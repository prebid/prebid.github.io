---
layout: bidder
title: Improve Digital
description: Prebid Improve Digital Bidder Adaptor
biddercode: improvedigital
pbjs: true
pbs: true
coppa_supported: true
gpp_supported: true
gdpr_supported: true
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
| `rendererConfig`  | optional | Configuration object for JS renderer of the RAZR creatives. Provided by Improve Digital.  | `{ key1: value1 }` | `object` |

### Configuration

<a name="improvedigital-sizes"></a>

#### Sizes

By default, the adapter doesn't send Prebid ad unit sizes to Improve Digital's ad server and the sizes defined for each placement in the Polaris platform will be used. If the ad server should only respond with creative sizes as defined in Prebid ad unit configuration, turn on `usePrebidSizes` adapter parameter like this:

```javascript
pbjs.setConfig({
    improvedigital: { usePrebidSizes: true }
});
```

<a name="improvedigital-renderer"></a>

#### Renderer Config

Global configuration for the special creative format renderer. Please use [rendererConfig bid param](#improvedigital-params) for ad slot specific configuration.

```javascript
pbjs.setConfig({
    improvedigital: {
        rendererConfig: {
            // Global config object provided by Improve Digital
        }
    }
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
