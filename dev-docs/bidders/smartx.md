---
layout: bidder
title: smartx
description: Prebid smartx Bidder Adapter
biddercode: smartx
media_types: no-display, video
gvl_id: 115
tcfeu_supported: true
userIds: all
prebid_member: true
schain_supported: true
usp_supported: true
dsa_supported: true
fpd_supported: true
safeframes_ok: false
pbjs: true
pbs: true
floors_supported: true
sidebarType: 1
---

## Registration

This adapter requires setup and approval from the smartclip team. Please contact us at --- <bidding@smartclip.tv>

## Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------- | ----------------------- | ----------- |
| `tagId` | required | A unique ID. | `'Nu68JuOWAvrbzoyrOR9a7A'` | `string` |
| `publisherId` | required | A unique PublisherID. Is provided by smartclip | `'publisher_Id'` | `string` |
| `siteId` | required | A unique SiteID or AppID. Is provided by smartclip | `'site_id'` | `string` |
| `secure` | optional | Boolean identifying whether the requests should be https or not (used to override the protocol if the page isn't secure). | `true` | `boolean` |
| `mimes` | optional | List of MIME types to allow in ad. | `['application/javascript', 'video/mp4', 'video/webm']` | `array` |
| `price_floor` | optional | Set the current channel price floor in real time. | `10` | `integer` |
| `min_duration` | optional | Minimum video ad duration in seconds | `15` | `integer` |
| `max_duration` | optional | Maximum video ad duration in seconds | `60` | `integer` |

## Prebid.js Bid Params

The video fields (`mimes` to `playbackmethod` below) are read from `mediaTypes.video` of the ad unit. Set them there; the params only override the ad unit.

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------- | ----------------------- | ----------- |
| `tagId` | required | A unique ID. | `'Nu68JuOWAvrbzoyrOR9a7A'` | `string` |
| `publisherId` | required | A unique PublisherID. Is provided by smartclip | `'publisher_Id'` | `string` |
| `siteId` | required | A unique SiteID or AppID. Is provided by smartclip | `'site_id'` | `string` |
| `bidfloor` | optional | Bid floor. If not set, the floor from the Price Floors module is used, otherwise 0. | `0.3` | `float` |
| `bidfloorcur` | optional | Currency of the bid floor. Default is `'EUR'`. | `'EUR'` | `string` |
| `secure` | optional | Boolean identifying whether the requests should be https or not (used to override the protocol if the page isn't secure). | `true` | `boolean` |
| `mimes` | optional | List of MIME types to allow in ad. | `['application/javascript', 'video/mp4', 'video/webm']` | `array` |
| `minduration` | optional | Minimum video ad duration in seconds. Default is `0`. | `15` | `integer` |
| `maxduration` | optional | Maximum video ad duration in seconds. Default is `500`. | `60` | `integer` |
| `linearity` | optional | ORTB `video.linearity`. Default is `1`. | `1` | `integer` |
| `startdelay` | optional | ORTB `video.startdelay`. Default is `0`. | `0` | `integer` |
| `minbitrate` | optional | ORTB `video.minbitrate`. Default is `0`. | `300` | `integer` |
| `maxbitrate` | optional | ORTB `video.maxbitrate`. Default is `3500`. | `3500` | `integer` |
| `delivery` | optional | ORTB `video.delivery`. Default is `[2]`. | `[2]` | `array<integer>` |
| `pos` | optional | ORTB `video.pos`. Default is `1`. | `1` | `integer` |
| `api` | optional | ORTB `video.api`. Default is `[2]`. | `[2]` | `array<integer>` |
| `protocols` | optional | ORTB `video.protocols`. Default is `[2, 3, 5, 6]`. | `[2, 3, 5, 6]` | `array<integer>` |
| `plcmt` | optional | ORTB 2.6 `video.plcmt`. Prebid sets `4` for outstream ad units (or a legacy `placement` of 2, 3 or 4) and `2` for a muted `playbackmethod` (2 or 6), otherwise not set. | `1` | `integer` |
| `skip` | optional | ORTB `video.skip`. Not set by default. | `1` | `integer` |
| `skipmin` | optional | ORTB `video.skipmin`. Not set by default. | `15` | `integer` |
| `skipafter` | optional | ORTB `video.skipafter`. Not set by default. | `5` | `integer` |
| `battr` | optional | ORTB `video.battr`. Not set by default. | `[13, 14]` | `array<integer>` |
| `playbackend` | optional | ORTB `video.playbackend`. Not set by default. | `1` | `integer` |
| `playbackmethod` | optional | ORTB `video.playbackmethod`. Not set by default. | `[2]` | `array<integer>` |
| `at` | optional | Auction type. Default is `2` (second price). | `2` | `integer` |
| `cur` | optional | Accepted currencies. Default is `['EUR']`. | `['EUR']` | `array<string>` |
| `domain` | optional | Sent as `site.domain`. Not used in app requests. | `'example.com'` | `string` |
| `cat` | optional | IAB categories, sent as `site.cat`. Not used in app requests. | `['IAB1']` | `array<string>` |
| `sitekey` | optional | Sitekey provided by smartclip. | `'foo.bar.baz'` | `string` |
| `outstream_options` | required | Object to set options on the smartx renderer, see below. Only required when setting mediaType.video.context = 'outstream'. | `{}` | `object` |

### outstream_options

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --------------- | -------- | -------------------------------------------------------------------------------------------- | ---------------- | ----------- |
| `slot` | required | ID of element that video ad should be rendered into. | `'adSlot1'` | `string` |
| `minAdWidth` | optional | If the visible area is narrower than this size, no ad will be requested. The value is given in pixels. Default is `280`. | `290` | `integer` |
| `maxAdWidth` | optional | The player will fill the whole width of the element it gets, to have it narrower a different maximum width can be defined in pixels. Default is `800`. | `900` | `integer` |
| `title` | optional | The player can show a freely definable text, a macro `[remainingTime]` in this string will be replaced with the remaining play time of the ad in seconds. | `'Advertisement [remainingTime]s'` | `string` |
| `skipOffset` | optional | In order to enable skipping from the start set the delay to `0`, to show the skip button after 5 seconds set it to `5`. Setting a general skipOffset is discouraged. Note that linear creatives carrying a skipsoffet attribute will override the general player setting. By default the player does not set a general skipoffset, so a skip button will only be shown, if an ad has a specific skipoffset attached. | `0` | `integer` |
| `startOpen` | optional | Per default the player will start fully expanded, if a valid ad can be played. Setting this option to `false` will trigger an expand animation instead once the player comes into view. Default is `true`. | `'false'` | `string` |
| `endingScreen` | optional | By default the player will not close, but show the ending screen when an advertisement is complete (last frame of the ad and a replay button, if an advertisement comes with an endcard that will be shown). If set to `false` the player will collapse. Some VPAID creatives can cause issues with ending screen or replay behaviour. Default is `true`. | `'true'` | `string` |
| `desiredBitrate` | optional | You can specify a target bitrate for the creative, higher values will increase video quality but will cost bandwidth. Value is given in kpbs. Default is `700`. | `800` | `integer` |
| `visibilityThreshold` | optional | Defines the percentage of the player which has to be in the visible area to play and pause the advertisement. The default is `50`. | `50` | `integer` |

## ORTB version

The Prebid.js adapter sends an OpenRTB 2.5 request with the header `x-openrtb-version: 2.5`. Where a value can be set at its ORTB 2.5 and its ORTB 2.6 location, the ORTB 2.6 value wins and is sent at the ORTB 2.5 location. User IDs are the exception: Prebid merges `user.eids` and `user.ext.eids` into one list before the adapter runs, so both are sent. ORTB 2.6 fields the publisher sets in `ortb2.app` or in `content` are passed through unchanged.

## First party data

For site requests, `ortb2.site.content` is sent as `site.content`, including `content.data`. Apart from the inventory partner domain, other `ortb2.site` fields are not sent. When `ortb2.app` is set, the request carries the publisher's `ortb2.app`, including its `content`, instead of `site`, with `id` set to `siteId` and `publisher.id` set to `publisherId`. The `sitekey` param is sent as `content.ext.sitekey`.

## Inventory partner domain

The inventory partner domain (ads.txt 1.1 / app-ads.txt) is read from `ortb2.site.inventorypartnerdomain` or `ortb2.site.ext.inventorypartnerdomain` (the same under `app`) and sent unchanged as `site.ext.inventorypartnerdomain` or `app.ext.inventorypartnerdomain`.

## User IDs

The IDs from the User ID modules are sent as `user.ext.eids`.

## DSA

Digital Services Act (DSA) data is passed unchanged from `ortb2.regs.ext.dsa` to `regs.ext.dsa`, next to the GDPR flag. The DSA transparency data of a bid (`ext.dsa`) is returned as `bid.meta.dsa`, where Prebid's `dsaControl` module checks it.
