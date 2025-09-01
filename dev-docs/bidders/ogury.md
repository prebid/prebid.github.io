---
layout: bidder
title: ogury
description: Ogury Bidder Adapter
biddercode: ogury
tcfeu_supported: true
gvl_id: 31
usp_supported: false
coppa_supported: false
schain_supported: false
floors_supported: true
dchain_supported: false
media_types: banner
safeframes_ok: false
deals_supported: false
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: false
sidebarType: 1
gpp_sids: tcfeu, usnat, usstate_all
---
### Registration

Before Ogury's adapter integration, you have to register an account in the Ogury Platform. Please contact <supply-development@ogury.co> if you're interested in a partnership.
If you already have an account you'll need to register your websites (= assets) and the placements (= ad units) within the Platform. Alternatively reach out to your POC within Ogury to assist you with the placement creation.
A detailed overview about the integration process can be found in [this documentation](https://ogury-ltd.gitbook.io/mobile-web/header-bidding/ogury-prebid.js-adapter-integration).

 After this registration, you will receive the Asset IDs and Ad Unit IDs to start the integration.

### Bid Params

This is the minimal list of params for integrating with Ogury:

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `assetKey`    | required | The asset key provided by Ogury   | `'OGY-CA41D116484F'` | `string`  |
| `adUnitId`    | required | Your ad unit id configured with Ogury | `'2c4d61d0-90aa-0139-0cda-0242ac120004'` | `string`  |

NOTE: You don't need these params to integrate with Ogury, see [inventory mapping](#inventory-mapping)

#### First Party Data

Publishers can use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html).
The following fields are supported:

* ortb2.site.publisher.id

this will be used with the inventory mapping method of integrating with Ogury.

### Bidder config
There are two ways to integrate with Ogury ad server, via the "bid params" i.e. `assetKey/adUnitId` or via inventory mapping.

#### With bid params
Use this example configuration for enabling Ogury ad server integration on a specific ad unit:

```javascript
 pbjs.que.push(function () {
    pbjs.addAdUnits([
        {
            code: 'example-ad-unit-code',
            mediaTypes: {banner: {sizes: [[1, 1]]} // example sizes
            },
            bids: [
                {
                    bidder: 'ogury',
                    params: {
                        assetKey: '$OGURY_ASSET_KEY',
                        adUnitId: '$OGURY_AD_UNIT_ID',
                    },
                }
            ]
            // rest of bidders
        }
        // rest of ad units
    ])
})

```

#### Inventory mapping

_"Inventory mapping" is only available for request coming from **web**. For **in-app** request use the "bid param" integration method._

_Note: If you choose inventory mapping, you can skip specifying assetKey and adUnitId per ad unit._

With inventory mapping you don't need to setup `assetKey/adUnitId` for every ad unit that you want to integrate. You use a single `id` and provide Ogury with list of sites and `ad_unit_code`s that you want to integrate and the mapping will be done on our side.
The example configuration for this type of integration looks like this:

```javascript
pbjs.que.push(function () {
            // setup publisherId for ogury
            pbjs.setBidderConfig({
                bidders: ['ogury'],
                config: {
                    ortb2: {
                        site: {
                            publisher: {
                                id: '$OGURY_PUBLISHER_ID',
                            },
                        }
                    }
                }
            })
})
````

`$OGURY_PUBLISHER_ID` is a Ogury provided id. 

### Optional bid Params

Depending on your advertising format needs, other optional parameters can be used. Supported parameters are detailed [here](https://ogury-ltd.gitbook.io/mobile-web/header-bidding/ogury-prebid.js-adapter-integration#optional-configuration).

### Contact information

* For platform registration and partnership questions: <supply-development@ogury.co>
* For technical or integration issues with the adapter: <web.inventory@ogury.co>
* For technical issues with Prebid Server:  <deliveryservices@ogury.co>
