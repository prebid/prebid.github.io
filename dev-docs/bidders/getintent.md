---
layout: bidder
title: GetIntent
description: Prebid GetIntent Bidder Adaptor
pbjs: true
biddercode: getintent
media_types: video, banner
floors_supported: true
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name    | Scope    | Description                                                                      | Example | Type      |
|---------|----------|----------------------------------------------------------------------------------|---------|-----------|
| `pid`   | required | Publisher ID registered in GetIntent system                                      | `123`   | `integer` |
| `tid`   | optional | Unique Tag ID. Required if multiple tags are used on the same page.              | `'abc'` | `string`  |
| `cur`   | optional | Currency of the ad request. Default is the one configured at publisher settings. | `'USD'` | `string`  |
| `floor` | optional | Floor price for the request.                                                     | `0.123` | `float`   |
| `video` | optional | Object with video parameters. See the [video section below](#getintent-video).   |         | `object`  |

<a name="getintent-video"></a>

#### video

Adapter supports the following mediaTypes.video parameters:

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                                                                                                                                                                                                                          | Example                      | Type             |
|--------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|------------------|
| `protocols`  | optional | The list of the restricted VAST protocol versions. Possible values: `1` – VAST 1.0, `2` – VAST 2.0, `3` – VAST 3.0, `4` – VAST 1.0 Wrapper, `5` – VAST 2.0 Wrapper, `6` – VAST 3.0 Wrapper.                                                                          | `[4,5,6]`                    | `Array<integer>` |
| `mimes`      | optional | Array of Mime Type strings.                                                                                                                                                                                                                                          | `['application/javascript']` | `Array<string>`  |
| `minduration`| optional | Minimal video duration.                                                                                                                                                                                                                                              | `30`                         | `integer`        |
| `maxduration`| optional | Maximal video duration.                                                                                                                                                                                                                                              | `30`                         | `integer`        |
| `minbitrate` | optional | Minimal Video bitrate.                                                                                                                                                                                                                                               | `256`                        | `integer`        |
| `maxbitrate` | optional | Maximal Video bitrate.                                                                                                                                                                                                                                               | `512`                        | `integer`        |
| `api`        | optional | API of the inventory. Possible values: `1` - VPAID 1.0, `2` - VPAID 2.0, `3` - MRAID-1, `4` - ORMMA, `5` - MRAID-2.                                                                                                                                                  | `[3,4]`                      | `Array<integer>` |
| `skip`       | optional | Skippability of the inventory. Possible values (case insensitive): `1` - skippable inventory is allowed, `0` - skippable inventory is not allowed.                                                                                                                   | `0`                          | `integer`        |

List of custom parameters available at bidder params level

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                                                                                                                          | Example                      | Type             |
|-------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|------------------|
| `protocols` | optional | The list of the restricted VAST protocol versions. Possible values: `1` – VAST 1.0, `2` – VAST 2.0, `3` – VAST 3.0, `4` – VAST 1.0 Wrapper, `5` – VAST 2.0 Wrapper, `6` – VAST 3.0 Wrapper.                                                                          | `[4,5,6]`                    | `Array<integer>` |
| `mimes`     | optional | Array of Mime Type strings.                                                                                                                                                                                                                                          | `['application/javascript']` | `Array<string>`  |
| `min_dur`   | optional | Minimal video duration.                                                                                                                                                                                                                                              | `30`                         | `integer`        |
| `max_dur`   | optional | Maximal video duration.                                                                                                                                                                                                                                              | `30`                         | `integer`        |
| `min_btr`   | optional | Minimal Video bitrate.                                                                                                                                                                                                                                               | `256`                        | `integer`        |
| `max_btr`   | optional | Maximal Video bitrate.                                                                                                                                                                                                                                               | `512`                        | `integer`        |
| `vi_format` | optional | Video inventory format. Possible values: `1` - In-Stream video, `2` - Out-Stream video.                                                                                                                                                                              | `1`                          | `integer`        |
| `api`       | optional | API of the inventory. Possible values: `1` - VPAID 1.0, `2` - VPAID 2.0, `3` - MRAID-1, `4` - ORMMA, `5` - MRAID-2.                                                                                                                                                  | `[3,4]`                      | `Array<integer>` |
| `skippable` | optional | Skippability of the inventory. Possible values (case insensitive): `ALLOW` - skippable inventory is allowed, `NOT_ALLOW` - skippable inventory is not allowed, `REQUIRE` - only skippable inventory is allowed, `UNKNOWN` - skippability is unknown (default value). | `'NOT_ALLOW'`                | `string`         |
