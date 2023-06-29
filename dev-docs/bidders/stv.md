---
layout: bidder
title: SMARTSTREAM.TV
description: Prebid STV Bidder Adapter
pbjs: true
biddercode: stv
media_types: banner,video
gdpr_supported: true
---


### Banner Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                | Example                | Type            |
|---------------|----------|----------------------------------------------------------------------------|------------------------|-----------------|
| `placement`   | required | Placement ID from STV.                                                    | `'101'`                  | `string`        |
| `bcat`     | optional | List of  Blocked Categories (IAB) - comma separated.                            | `'IAB2,IAB4'` | `string` |

### Video Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                | Example                | Type            |
|---------------|----------|----------------------------------------------------------------------------|------------------------|-----------------|
| `placement`   | required | Placement ID from STV.                                                    | `'106'`                  | `string`        |
| `bcat`     | optional | List of  Blocked Categories (IAB) - comma separated.                            | `'IAB2,IAB4'` | `string` |
| `floorprice`      | optional | input min_cpm_micros, CPM in EUR * 1000000 | `1000000`  | `integer` |
| `max_duration`      | optional | in seconds | `60`  | `integer` |
| `min_duration`      | optional | in seconds | `5`  | `integer` |
| `max_bitrate`      | optional |  | `600`  | `integer` |
| `api`      | optional | <https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/master/AdCOM%20v1.0%20FINAL.md#list--api-frameworks-> | `[1,2]`  | `array` |
