---
layout: bidder
title: smartclip
description: Prebid smartclip Bidder Adaptor
biddercode: smartx
media_types: no-display, video
gdpr_supported: true
tcf2_supported: true
userIds: id5Id, pubCommonId, unifiedId
prebid_member: true
schain_supported: true
usp_supported: true
safeframes_ok: false
pbjs: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name                 | Scope    | Description                                                                                                                                                   | Example                                                                                                                                                                                              | Type        |
|----------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| `tagId`              | required | A unique ID ??                                                                                                | `'Nu68JuOWAvrbzoyrOR9a7A'`                                                                                                                                                                            | `string`    |
| `publisherId`              | required | A unique ID ??                                                                                                | `'publisher_name'`                                                                                                                                                                            | `string`    |
| `siteId`              | required | A unique ID ??                                                                                                | `'site_id'`                                                                                                                                                                            | `string`    |
| `bidfloor`              | required | A unique ID ??                                                                                                                     | `0.3`                                                                                                                                                                            | `string`    |
| `bidfloorcur`              | required | A unique ID ??                                                                                                | `'EUR'`                                                                                                                                                                            | `string`    |
| `context`            | required | Token that describes which ad unit to play: instream or outstream                                                                                             | `'outstream'`                                                                                                                                                                                        | `string`    |
| `outstream_function` | optional | Custom function to be used as a renderer.                                                                                                                     | `function(bid){console.log(bid);}`                                                                                                                                                                   | `function`  |
| `outstream_options`  | optional | Object to set options on the smartx renderer.                                                              | `{}`                                                                                                                                                                                                 | `object`    |
| `secure`             | optional | Boolean identifying whether the requests should be https or not (used to override the protocol if the page isn't secure).                                      | `true`                                                                                                                                                                                               | `boolean`   |
| `mimes`              | optional | List of MIME types to allow in ad.                                                                                                                             | `['application/javascript', 'video/mp4', 'video/webm']`                                                                                                                                               | `array`     |
| `price_floor`        | optional | Set the current channel price floor in real time.                                                                                                             | `10`                                                                                                                                                                                                   | `integer`   |
| `min_duration`       | optional | Minimum video ad duration in seconds                                                                                                                            |                                                                                                                                                                                                      | `integer`   |
| `max_duration`       | optional | Maximum video ad duration in seconds                                                                                                                            |                                                                                                                                                                                                      | `integer`   |

<a name="smartx-outstream-options-object" />

#### outstream_options Object

{: .table .table-bordered .table-striped }
| Name                 | Scope    | Description                                                                                                                                                   | Example                                                                                                                                                                                              | Type        |
|----------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| `slot`                  | required | ID of element that video ad should be rendered into.        | `'adSlot1'` | `string`  |
