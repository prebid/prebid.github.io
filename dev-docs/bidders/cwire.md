
---
layout: bidder
title: C-WIRE
description: C-WIRE Prebid Bidder Adapter
pbjs: true
biddercode: cwire
gdpr_supported: false
usp_supported: false
schain_supported: false
userIds: flocId, uid2Id
media_types: banner, video
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `pageId`      | required | C-WIRE page id        | `2453`    | `integer` |
| `placementId` | required | C-WIRE placement id   | `113244`  | `integer` |
| `adUnitElementId` | optional | Target div to write to  | `'other_div_id'`  | `string` |



### Global configuration
```javascript
pbjs.setConfig({
  cwcreative: 42,                                     // optional - id of creative to force
  refgroups: 'test-user',                             // optional - name of group or coma separated list of groups to force
  cwapikey: 'b08d7fd1-d088-4e17-af29-24decff7582c',   // optional - api key for integration testing      
});
````