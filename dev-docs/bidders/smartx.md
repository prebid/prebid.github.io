---
layout: bidder
title: smartx
description: Prebid smartx Bidder Adapter
biddercode: smartx
media_types: no-display, video
gdpr_supported: true
userIds: none
prebid_member: true
schain_supported: false
usp_supported: true
safeframes_ok: false
pbjs: true
pbjs_version_notes: avoid 4.31-4.39
---

### Registration
Please reach out to your smartclip business contact for any questions and assistance in configuration.

### Bid Params

{: .table .table-bordered .table-striped }
| Name                 | Scope    | Description                                                                                             | Example                 | Type        |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------- | ----------------------- | ----------- |
| `tagId`              | required | A unique ID.                                                                                            | `'Nu68JuOWAvrbzoyrOR9a7A'` | `string` |
| `publisherId`        | required | A unique PublisherID.                                                                                   | `'publisher_Id'`        | `string`    |
| `siteId`             | required | A unique SiteID.                                                                                        | `'site_id'`             | `string`    |
| `bidfloor`           | required | Value of Bidfloor.                                                                                      | `0.3`                   | `float`     |
| `bidfloorcur`        | required | Used Currency. (e.g. EUR, USD etc.)                                                                     | `'EUR'`                 | `string`    |
| `context`            | optional | Token that describes which context to play: 'instream' or 'outstream'                                   | `'outstream'`           | `string`    |
| `outstream_options`  | required | Object to set options on the smartx renderer. (Only required when setting mediaType.video.context = 'outstream') | `{}`           | `object`    |
| `secure`             | optional | Boolean identifying whether the requests should be https or not (used to override the protocol if the page isn't secure). | `true`| `boolean`   |
| `mimes`              | optional | List of MIME types to allow in ad.                                                                      | `['application/javascript', 'video/mp4', 'video/webm']` | `array` |
| `price_floor`        | optional | Set the current channel price floor in real time.                                                       | `10`                    | `integer`   |
| `min_duration`       | optional | Minimum video ad duration in seconds                                                                    | `15`                    | `integer`   |
| `max_duration`       | optional | Maximum video ad duration in seconds                                                                    | `60`                    | `integer`   |

<a name="smartx-outstream-options-object" />

#### outstream_options Object

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                                                                                  | Example          | Type        |
| --------------- | -------- | -------------------------------------------------------------------------------------------- | ---------------- | ----------- |
| `slot`          | required | ID of element that video ad should be rendered into.                                         | `'adSlot1'`      | `string`    |
| `minAdWidth`    | optional | Minimum amount of space the player needs to expand.                                          | `290`            | `integer`   |
| `maxAdWidth`    | optional | Maximum size of the player.                                                                  | `900`            | `integer`   |
| `title`         | optional | Makes a defined advertising text appear in the below right corner. `[remainingTime]` can be used to display the remaining time of the advertisement. | `'Advertisement [remainingTime]s'` | `string`    |
| `skipOffset`    | optional | Define whenever the advertisement can be skipped. 0 = never                                  | `0`              | `integer`   |
| `startOpen`     | optional | Define whether the player should be initialized open or open when it is within view.         | `'false'`        | `string`    |
| `endingScreen`  | optional | Define whether the player should stay open after advertising or not.                         | `'true'`         | `string`    |
| `desiredBitrate`| optional | Define the desired bitrate of the mediafile.                                                 | `800`            | `integer`   |
