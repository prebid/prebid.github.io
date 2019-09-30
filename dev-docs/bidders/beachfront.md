---
layout: bidder
title: Beachfront
description: Prebid Beachfront Bidder Adaptor
hide: true
biddercode: beachfront
media_types: video
gdpr_supported: true
userIds: unifiedId/tradedesk
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                                 | Example                                  | Type     |
|------------|----------|---------------------------------------------------------------------------------------------|------------------------------------------|----------|
| `appId`    | required | Beachfront Exchange ID                                                                      | `'11bc5dd5-7421-4dd8-c926-40fa653bec76'` | `string` |
| `bidfloor` | required | Bid floor                                                                                   | `0.01`                                   | `float`  |
| `video`    | optional | Object with video parameters. See the [video section below](#beachfront-video) for details. |                                          | `object` |
| `banner`   | optional | Object with banner parameters. See the [banner section below](#beachfront-banner) for details. |                                       | `object` |
| `player`   | optional | Object with outstream player parameters. See the [player section below](#beachfront-player) for details. |                             | `object` |

<a name="beachfront-video"></a>

### video params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description                                    | Example                                   | Type            |
|------------------|----------|------------------------------------------------|-------------------------------------------|-----------------|
| `appId`          | optional | Beachfront Exchange ID for video bids. | `'11bc5dd5-7421-4dd8-c926-40fa653bec76'` | `string` |
| `bidfloor`       | optional | Bid floor for video bids. | `0.01` | `float` |
| `mimes`          | optional | Array of strings listing supported MIME types. | `["video/mp4", "application/javascript"]` | `Array<string>` |
| `playbackmethod` | optional | Playback method supported by the publisher.<br/>`1`: Auto-play sound on<br/>`2`: Auto-play sound off<br/>`3`: Click-to-play<br/>`4`: Mouse-over | `1` | `integer` |
| `maxduration`    | optional | Maximum video ad duration in seconds. | `30` | `integer` |
| `placement`      | optional | Placement type for the impression.<br/>`1`: In-Stream<br/>`2`: In-Banner<br/>`3`: In-Article<br/>`4`: In-Feed<br/>`5`: Interstitial/Slider/Floating | `1` | `integer` |

<a name="beachfront-banner"></a>

### banner params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                             | Example                                  | Type     |
|------------|----------|-----------------------------------------|------------------------------------------|----------|
| `appId`    | optional | Beachfront Exchange ID for banner bids. | `'3b16770b-17af-4d22-daff-9606bdf2c9c3'` | `string` |
| `bidfloor` | optional | Bid floor for banner bids. | `0.01` | `float` |

<a name="beachfront-player"></a>

### player params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                             | Example                                  | Type     |
|------------|----------|-----------------------------------------|------------------------------------------|----------|
| `progressColor` | optional | The color of the progress bar formatted as a CSS value. | `#50A8FA` | `string` |
| `expandInView` | optional | Defines whether to expand the player when the ad slot is in view. Defaults to `false`. | `false` | `boolean` |
| `collapseOnComplete` | optional | Defines whether to collapse the player when ad playback has completed. Defaults to `true`. | `true` | `boolean` |
