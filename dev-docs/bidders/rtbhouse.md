---
layout: bidder
title: RTBHouse
description: Prebid RTB House Bidder Adapter
gdpr_supported: true
pbjs: true
pbs: true
biddercode: rtbhouse
prebid_member: true
floors_supported: true
safeframes_ok: true
media_types: banner, native
schain_supported: true
userIds: id5Id, identityLink, pubProvidedId
pbs_app_supported: true
ortb_blocking_supported: partial
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

#### ORTB Blocking
RTB House supports blocking advertisers in `badv` and categories in `bcat` parameters.
The blocked advertisers/categories list has no length limitation, but response timeout is more likely to occur as the number of entries grow.
Blocked advertisers list (`badv`) is an array of domains as strings.
Blocked categories list (`bcat`) is an array of IAB categories as strings.

For example:
##### Globally defined ORTB Blocking:
```javascript
pbjs.config({
  ortb2: {
    badv: ["domain1.com", "domain2.com"],
    bcat: ["IAB23-1", "IAB23-5", "IAB25-3", "IAB25-2"]
  }
)};
```

##### ORTB Blocking specific only to rtbhouse bidder:
```javascript
pbjs.setBidderConfig({
  bidders: ['rtbhouse'],
  config:{
    ortb2: {
      badv: ["domain1.com", "domain2.com"],
      bcat: ["IAB23-1", "IAB23-5", "IAB25-3", "IAB25-2"]
    }
  }
)};
```


### Please note:

* Since 4.43 the bidfloor param will be ignored if a value is specified via floor module.

* The channel param is available starting from Prebid 6.6.0. Please reach your RTBHouse representative for details on how to enable and use the channel param.
