---
layout: bidder
title: smartx
description: Prebid smartx Bidder Adapter
biddercode: smartx
media_types: no-display, video
gvl_id: 115
tcfeu_supported: true
userIds: none
prebid_member: true
schain_supported: true
usp_supported: true
safeframes_ok: false
pbjs: true
pbs: true
floors_supported: false
sidebarType: 1
---

### Registration

This adapter requires setup and approval from the smartclip team. Please contact us at --- <bidding@smartclip.tv>

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name                 | Scope    | Description                                                                                             | Example                 | Type        |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------- | ----------------------- | ----------- |
| `tagId`              | required | A unique ID.                                                                                            | `'Nu68JuOWAvrbzoyrOR9a7A'` | `string` |
| `publisherId`        | required | A unique PublisherID. Is provided by smartclip                                                          | `'publisher_Id'`        | `string`    |
| `siteId`             | required | A unique SiteID or AppID. Is provided by smartclip                                                      | `'site_id'`             | `string`    |
| `secure`             | optional | Boolean identifying whether the requests should be https or not (used to override the protocol if the page isn't secure). | `true`| `boolean`   |
| `mimes`              | optional | List of MIME types to allow in ad.                                                                      | `['application/javascript', 'video/mp4', 'video/webm']` | `array` |
| `price_floor`        | optional | Set the current channel price floor in real time.                                                       | `10`                    | `integer`   |
| `min_duration`       | optional | Minimum video ad duration in seconds                                                                    | `15`                    | `integer`   |
| `max_duration`       | optional | Maximum video ad duration in seconds                                                                    | `60`                    | `integer`   |


### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name                 | Scope    | Description                                                                                             | Example                 | Type        |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------- | ----------------------- | ----------- |
| `tagId`              | required | A unique ID.                                                                                            | `'Nu68JuOWAvrbzoyrOR9a7A'` | `string` |
| `publisherId`        | required | A unique PublisherID. Is provided by smartclip                                                          | `'publisher_Id'`        | `string`    |
| `siteId`             | required | A unique SiteID or AppID. Is provided by smartclip                                                      | `'site_id'`             | `string`    |
| `bidfloor`           | required | Value of Bidfloor.                                                                                      | `0.3`                   | `float`     |
| `bidfloorcur`        | required | Used Currency. (e.g. EUR, USD etc.)                                                                     | `'EUR'`                 | `string`    |
| `context`            | optional | Token that describes which context to play: 'instream' or 'outstream'                                   | `'outstream'`           | `string`    |
| `secure`             | optional | Boolean identifying whether the requests should be https or not (used to override the protocol if the page isn't secure). | `true`| `boolean`   |
| `mimes`              | optional | List of MIME types to allow in ad.                                                                      | `['application/javascript', 'video/mp4', 'video/webm']` | `array` |
| `price_floor`        | optional | Set the current channel price floor in real time.                                                       | `10`                    | `integer`   |
| `min_duration`       | optional | Minimum video ad duration in seconds                                                                    | `15`                    | `integer`   |
| `max_duration`       | optional | Maximum video ad duration in seconds                                                                    | `60`                    | `integer`   |
| `sitekey`            | optional | Sitekey provided by smartclip.                                                                          | `'foo.bar.baz'`           | `string`    |
| `outstream_options`  | required | Object to set options on the smartx renderer, see below. Only required when setting mediaType.video.context = 'outstream'. | `{}`           | `object`    |


#### outstream_options

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                                                                                  | Example          | Type        |
| --------------- | -------- | -------------------------------------------------------------------------------------------- | ---------------- | ----------- |
| `slot`          | required | ID of element that video ad should be rendered into.                                         | `'adSlot1'`      | `string`    |
| `minAdWidth`    | optional | If the visible area is narrower than this size, no ad will be requested. The value is given in pixels. Default is `280`.       | `290`            | `integer`   |
| `maxAdWidth`    | optional | The player will fill the whole width of the element it gets, to have it narrower a different maximum width can be defined in pixels. Default is `800`.                                | `900`            | `integer`   |
| `title`         | optional | The player can show a freely definable text, a macro `[remainingTime]` in this string will be replaced with the remaining play time of the ad in seconds. | `'Advertisement [remainingTime]s'` | `string`    |
| `skipOffset`    | optional | In order to enable skipping from the start set the delay to `0`, to show the skip button after 5 seconds set it to `5`. Setting a general skipOffset is discouraged. Note that linear creatives carrying a skipsoffet attribute will override the general player setting. By default the player does not set a general skipoffset, so a skip button will only be shown, if an ad has a specific skipoffset attached. |  `0`  | `integer`   |
| `startOpen`     | optional | Per default the player will start fully expanded, if a valid ad can be played. Setting this option to `false` will trigger an expand animation instead once the player comes into view. Default is `true`.              | `'false'`        | `string`    |
| `endingScreen`  | optional | By default the player will not close, but show the ending screen when an advertisement is complete (last frame of the ad and a replay button, if an advertisment comes with an endcard that will be shown). If set to `false` the player will collapse. Some VPAID creatives can cause issues with ending screen or replay behaviour. Default is `true`.              | `'true'`         | `string`    |
| `desiredBitrate`| optional | You can specify a target bitrate for the creative, higher values will increase video quality but will cost bandwidth. Value is given in kpbs. Default is `700`.                       | `800`            | `integer`   |
| `visibilityThreshold`| optional | Defines the percentage of the player which has to be in the visible area to play and pause the advertisment. The default is `50`.                           | `50`             | `integer`   |
