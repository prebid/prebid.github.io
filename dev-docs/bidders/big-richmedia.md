---
layout: bidder
title: BigRichMedia
description: Prebid Big Richmedia Bidder Adapter
biddercode: big-richmedia
pbjs: true
media_types: banner, video
userIds: criteo, unifiedId, netId, identityLink, uid2
schain_supported: true
coppa_supported: true
usp_supported: true
floors_supported: true
fpd_supported: true
gdpr_supported: true
gvl_id: 32
sidebarType: 1
---

#### Global Settings

Set the publisherId for using bigRichemedia

```
pbjs.que.push(function() {
  // use the bid server in Taiwan (country code: tw)
  pbjs.setConfig({
    bigRichmedia: {
      'publisherId': 'A7FN99NZ98F5ZD4G'
    }
  });
});
```

#### Bid Params

{: .table .table-bordered .table-striped }
| Name      | Scope    | Description               | Example    | Type     |
|-----------|----------|---------------------------|------------|----------|
| `placementId`    | required | The placement ID.  You may identify a placement using the `invCode` and `member` instead of a placement ID.   | `234234` | `integer` |
| `member`                                        | optional | The member ID  from AppNexus. Must be used with `invCode`.                                                                                                                    | `'12345'`                                             | `string`         |
| `invCode`                                       | optional | The inventory code from AppNexus. Must be used with `member`.                                                                                                                 | `'abc123'`                                            | `string`         |
| `keywords`                                      | optional | A set of key-value pairs applied to all ad slots on the page. | `keywords: { genre: ['rock', 'pop'] }`                | `object`         |

#### Video Object

Those configuration parameters are read from mediaTypes.video

{: .table .table-bordered .table-striped }
| Name              | Description                                                                                                                                                                                                                                  | Type             |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| `minduration` | Integer that defines the minimum video ad duration in seconds. | `integer` |
| `maxduration` | Integer that defines the maximum video ad duration in seconds. | `integer` |
|`context` | A string that indicates the type of video ad requested.  Allowed values: `"pre_roll"`; `"mid_roll"`; `"post_roll"`; `"outstream"`. | `string` |
| `skippable` | Boolean which, if `true`, means the user can click a button to skip the video ad.  Defaults to `false`. | `boolean` |
|`skipoffset`| Integer that defines the number of seconds until an ad can be skipped.  Assumes `skippable` setting was set to `true`. | `integer` |
| `frameworks` | Array of integers listing API frameworks supported by the publisher.  Allowed values: None: `0`; VPAID 1.0: `1`; VPAID 2.0: `2`; MRAID 1.0: `3`; MRAID 2.0: `4`; ORMMA: `5`; OMID 1.0 `6`. | `Array<integer>` |
