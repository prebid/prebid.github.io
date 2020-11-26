---
layout: bidder
title: pubGENIUS
description: Prebid pubGENIUS Bidder Adaptor
pbjs: true
biddercode: pubgenius
media_types: banner
gdpr_supported: true
usp_supported: true
schain_supported: true
coppa_supported: true
userIds: unifiedId
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                                                     | Example  | Type      |
|------------|----------|-----------------------------------------------------------------------------------------------------------------|----------|-----------|
| `adUnitId` | required | pubGENIUS ad unit ID.                                                                                           | `'1234'` | `string`  |
| `bidFloor` | optional | Bid floor                                                                                                       | `0.01`   | `number`  |
| `position` | optional | Ad position on the page. Supported values: `0` - unknown (default), `1` - above the fold, `3` - below the fold. | `1`      | `integer` |
| `test`     | optional | Indicates bidding for testing purposes                                                                          | `true`   | `boolean` |
| `video`    | optional | Contains properties of the video ad. Any fields of `Video` object in OpenRTB v2.5 are accepted.            | `{ skip: 1 }` | `object`  |

#### Video

Video object of bid params takes precedence over the same properties in `mediaTypes.video` of the ad unit. The following video properties are required:

{: .table .table-bordered .table-striped }
| Name        | Description                                                                                                                                  |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| `placement` | Placement type for the impression. It may also be specified as `instream` or `outstream` value of `mediaTypes.video.context` of the ad unit. |
| `w` and `h` | Video player size. They may also be specified as `mediaTypes.video.playerSize` of the ad unit.                                               |
| `mimes`     | At least one supported MIME types must be specified. It may also be specified as `mediaTypes.video.mimes` of the ad unit.                    |
| `protocols` | At least one supported protocol must be specified. It may also be specified as `mediaTypes.video.protocols` of the ad unit.                  |
