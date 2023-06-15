---
layout: bidder
title: Preciso
description: Prebid Preciso Bidder Adapter
gdpr_supported: true
gvl_id: 874
media_types: display, video, native 
gdpr_supported: true
usp_supported: true
pbjs: false
pbs: true
biddercode: preciso
prebid_member: true
floors_supported: true
safeframes_ok: true
schain_supported: true
userIds: id5Id, identityLink, pubProvidedId
pbs_app_supported: true
coppa_supported: true
multiformat_supported: will-bid-on-any
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


### ORTB Blocking
Preciso supports blocking advertisers in `badv` and categories in `bcat` parameters.
The blocked advertisers/categories list has no length limitation, but response timeout is more likely to occur as the number of entries grow.
Blocked advertisers list (`badv`) is an array of domains as strings.
Blocked categories list (`bcat`) is an array of IAB categories as strings.

For example:
#### Globally defined ORTB Blocking:
```javascript
pbjs.setConfig({
  ortb2: {
    badv: ["domain1.com", "domain2.com"],
    bcat: ["IAB23-1", "IAB23-5", "IAB25-3", "IAB25-2"]
  }
)};
```
#### ORTB Blocking specific only to rtbhouse bidder:
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