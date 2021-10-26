---
layout: bidder
title: TargetVideo
description: Prebid TargetVideo Bidder Adaptor
biddercode: targetVideo
media_types: video
gdpr_supported: true
prebid_member: true
userIds: criteo, unifiedId, netId, identityLink, flocId, uid2
schain_supported: true
coppa_supported: true
usp_supported: true
floors_supported: true
pbjs: true
pbs: true
gvl_id: 32
---

### Table of Contents

- [Bid Params](#targetvideo-bid-params)
- [Video Object](#targetvideo-video-object)

<a name="targetvideo-bid-params" />

#### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `placementId`       | required | The placement ID from TargetVideo.  You may identify a placement using the `invCode` and `member` instead of a placement ID. The `placementID` parameter can be either a `string` or `integer` for Prebid.js, however `integer` is preferred. Legacy code can retain the `string` value. **Prebid Server requires an integer value.**                                                    | `234234`                                            | `integer`         |

<a name="targetvideo-video-object" />

#### Video Object

{: .table .table-bordered .table-striped }
| Name              | Description                                                                                                                                                                                                                                  | Type             |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| `minduration` | Integer that defines the minimum video ad duration in seconds. | `integer` |
| `maxduration` | Integer that defines the maximum video ad duration in seconds. | `integer` |
|`context` | A string that indicates the type of video ad requested.  Allowed values: `"pre_roll"`; `"mid_roll"`; `"post_roll"`; `"outstream"`. | `string` |
| `skippable` | Boolean which, if `true`, means the user can click a button to skip the video ad.  Defaults to `false`. | `boolean` |
|`skipoffset`| Integer that defines the number of seconds until an ad can be skipped.  Assumes `skippable` setting was set to `true`. | `integer` |
| `playback_method` | A string that sets the playback method supported by the publisher.  Allowed values: `"auto_play_sound_on"`; `"auto_play_sound_off"`; `"click_to_play"`; `"mouse_over"`; `"auto_play_sound_unknown"`. | `string` |
| `frameworks` | Array of integers listing API frameworks supported by the publisher.  Allowed values: None: `0`; VPAID 1.0: `1`; VPAID 2.0: `2`; MRAID 1.0: `3`; MRAID 2.0: `4`; ORMMA: `5`; OMID 1.0 `6`. | `Array<integer>` |
