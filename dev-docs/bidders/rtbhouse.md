---
layout: bidder
title: RTBHouse
description: Prebid RTB House Bidder Adapter
gvl_id: 16
tcfeu_supported: true
usp_supported: false
coppa_supported: false
gpp_sids: none
dsa_supported: true
pbjs: true
pbs: true
biddercode: rtbhouse
prebid_member: true
floors_supported: true
fpd_supported: true
safeframes_ok: true
media_types: banner, native
schain_supported: true
userIds: id5Id, identityLink, pubProvidedId
pbs_app_supported: true
ortb_blocking_supported: partial
multiformat_supported: will-bid-on-any
privacy_sandbox: paapi, topics
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description         | Example       | Type     |
|---------------|----------|---------------------|---------------|----------|
| `publisherId` | required | Unique publisher ID | `'ABCDEF'`    | `string` |
| `region`      | required | Assigned region     | `'prebid-eu'` | `string` |
| `bidfloor`    | optional | Minimal CPM value   | `0.01`        | `float`  |
| `channel`     | optional | Inventory channel identifier, limited to 50 characters  | `Partner 1 - News`        | `string`  |

#### Please note

* Since 4.43 the bidfloor param will be ignored if a value is specified via floor module.

* The channel param is available starting from Prebid 6.6.0. Please reach your RTBHouse representative for details on how to enable and use the channel param.

### ORTB Blocking

RTB House supports blocking advertisers in `badv` and categories in `bcat` parameters.
The blocked advertisers/categories list has no length limitation, but response timeout is more likely to occur as the number of entries grow.
Blocked advertisers list (`badv`) is an array of domains as strings.
Blocked categories list (`bcat`) is an array of IAB categories as strings.

For example:

#### Globally defined ORTB Blocking

```javascript
pbjs.setConfig({
  ortb2: {
    badv: ["domain1.com", "domain2.com"],
    bcat: ["IAB23-1", "IAB23-5", "IAB25-3", "IAB25-2"]
  }
)};
```

#### ORTB Blocking specific only to rtbhouse bidder

```javascript
pbjs.setBidderConfig({
  bidders: ['rtbhouse'],
  config:{
    ortb2: {
      badv: ["domain1.com", "domain2.com"],
      bcat: ["IAB23-1", "IAB23-5", "IAB25-3", "IAB25-2"]
    }
  }
});
```

### Setting up the Prebid Server Adapter

If you’re a Prebid Server host company looking to enable the RTB House server-side adapter, you'll need to contact <prebid@rtbhouse.com>. They will guide you through the process. Do not use the default bidder config file as it will require custom partner code to be entered. It will be provided by RTB House.

### Protected Audience API (PAAPI) support

There’s an option to receive demand for Protected Audience API (FLEDGE/PAAPI)
ads using RTB House bid adapter.
Prebid’s [paapiForGpt](https://docs.prebid.org/dev-docs/modules/paapiForGpt.html)
module and Google Ad Manager is currently required.

The following steps should be taken to setup Protected Audience for RTB House:

1. Reach out to your RTB House representative for setup coordination.

2. Build and enable PAAPI module as described in
[paapiForGpt](https://docs.prebid.org/dev-docs/modules/paapiForGpt.html)
module documentation.

    a. Make sure to enable RTB House bidder to participate in PAAPI. If there are any other bidders to be allowed for that, add them to the **bidders** array:

    ```javascript
    pbjs.setConfig({
        paapi: {
           enabled: true,
           bidders: ["rtbhouse"]           
        }    
    })
    ```

    b. If you as a publisher have your own [decisionLogicUrl](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#21-initiating-an-on-device-auction)
    you may utilize it by setting up a dedicated `fledgeConfig` object:

    ```javascript
    pbjs.setBidderConfig({
        bidders: ["rtbhouse"],
        config: {
            fledgeConfig: {
                seller: 'https://seller.domain',
                decisionLogicUrl: 'https://seller.domain/decisionLogicFile.js',
                sellerTimeout: 100
            }
        }
    });
    ```

    The `decisionLogicUrl` must be in the same domain as `seller` and has to respond with `X-Allow-FLEDGE: true` http header.

    `sellerTimeout` is optional, defaults to 50 as per spec, will be clamped to 500 if greater.
