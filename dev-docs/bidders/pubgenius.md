---
layout: bidder
title: pubGENIUS
description: Prebid pubGENIUS Bidder Adaptor
pbjs: true
biddercode: pubgenius
media_types: banner
floors_supported: true
gdpr_supported: false
usp_supported: true
schain_supported: true
coppa_supported: true
userIds: unifiedId
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                                                     | Example  | Type      |
|------------|----------|-----------------------------------------------------------------------------------------------------------------|----------|-----------|
| `adUnitId` | required | pubGENIUS ad unit ID.                                                                                           | `'1234'` | `string`  |
| `position` | optional | Ad position on the page. Supported values: `0` - unknown (default), `1` - above the fold, `3` - below the fold. | `1`      | `integer` |
| `test`     | optional | Indicates bidding for testing purposes                                                                          | `true`   | `boolean` |
| `video`    | optional | Contains properties of the video ad. Any fields of `Video` object in OpenRTB v2.5 are accepted.            | `{ skip: 1 }` | `object`  |

#### Video

Video parameters are read from the ad unit as in `mediaTypes.video`, and can be overridden in bid params.
The following properties are required in `mediaTypes.video` of the ad unit:

{: .table .table-bordered .table-striped }
| Name         | Description                                          |
|--------------|------------------------------------------------------|
| `context`    | Supported values are `instream` and `outstream`.     |
| `playerSize` | Video player size.                                   |
| `mimes`      | At least one supported MIME type must be specified.  |
| `protocols`  | At least one supported protocol must be specified.   |
