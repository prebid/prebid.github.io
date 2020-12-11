---
layout: bidder
title: smartx
description: Prebid smartx Bidder Adapter
biddercode: smartx
media_types: no-display, video
gdpr_supported: true
tcf2_supported: true
userIds: none
prebid_member: true
schain_supported: false
usp_supported: true
safeframes_ok: false
pbjs: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name                 | Scope    | Description                                                                                                                                                   | Example                                                                                                                                                                                              | Type        |
|----------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| `tagId`              | required | A unique ID.                                                                                                                                                      | `'Nu68JuOWAvrbzoyrOR9a7A'`                                                                                                                                                                            | `string`    |
| `publisherId`        | required | A unique PublisherID.                                                                                                                                             | `'publisher_Id'`                                                                                                                                                                                      | `string`    |
| `siteId`             | required | A unique SiteID.                                                                                                                                                  | `'site_id'`                                                                                                                                                                                           | `string`    |
| `bidfloor`           | required | Value of Bidfloor.                                                                                                                                                |                              `0.3`                                                                                                                                                                                                 | `float`     |
| `bidfloorcur`        | required | Used Currency. (e.g. EUR, USD etc.)                                                                                                                               | `'EUR'`                                                                                                                                                                                               | `string`    |
| `context`            | optional | Token that describes which context to play: 'instream' or 'outstream'                                                                                             | `'outstream'`                                                                                                                                                                                         | `string`    |
| `outstream_function` | optional | Custom function to be used as a renderer.                                                                                                                         |                         `function(bid){console.log(bid);}`                                                                                                                                                                    | `function`  |
| `outstream_options`  | required | Object to set options on the smartx renderer. (Only required when setting mediaType.video.context = 'outstream')                                                  |                                `{}`                                                                                                                                                                                                  | `object`    |
| `secure`             | optional | Boolean identifying whether the requests should be https or not (used to override the protocol if the page isn't secure).                                         | `true`                                                                                                                                                                                                | `boolean`   |
| `mimes`              | optional | List of MIME types to allow in ad.                                                                                                                                |                                `['application/javascript', 'video/mp4', 'video/webm']`                                                                                                                                               | `array`     |
| `price_floor`        | optional | Set the current channel price floor in real time.                                                                                                                 | `10`                                                                                                                                                                                                  | `integer`   |
| `min_duration`       | optional | Minimum video ad duration in seconds                                                                                    |                                                                                                                                                                                                     | `integer`   |
| `max_duration`       | optional | Maximum video ad duration in seconds                                                                                                                            |                                                                                                                                                                                                     | `integer`   |

<a name="smartx-outstream-options-object" />

#### outstream_options Object

{: .table .table-bordered .table-striped }
| Name                 | Scope    | Description                                                                                                                                                   | Example                                                                                                                                                                                              | Type        |
|----------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| `slot`                  | required | ID of element that video ad should be rendered into.        | `'adSlot1'` | `string`  |
